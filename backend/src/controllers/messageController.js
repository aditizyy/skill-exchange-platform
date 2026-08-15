const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const Request = require("../models/Request");
const User = require("../models/User");

/**
 * Two users are allowed to message each other only if there is an
 * *accepted* Request between them, in either direction. This is the same
 * rule the frontend uses to show the "Message" button, enforced again here
 * server-side so it can't be bypassed by calling the API directly.
 */
const findAcceptedRequestBetween = async (userIdA, userIdB) => {
  return Request.findOne({
    status: "accepted",
    $or: [
      { fromUser: userIdA, toUser: userIdB },
      { fromUser: userIdB, toUser: userIdA },
    ],
  });
};

const buildPairKey = (userIdA, userIdB) => {
  return [userIdA.toString(), userIdB.toString()].sort().join("_");
};

const toPublicProfile = (user) => ({
  id: user._id,
  name: user.name,
  skillsToTeach: user.skillsToTeach,
  skillsToLearn: user.skillsToLearn,
  avatarUrl: user.avatarUrl || null,
});

/**
 * POST /api/messages/conversations
 * body: { userId }
 * Finds the existing conversation between the current user and `userId`,
 * or creates one — but only if they have an accepted connection.
 */
const getOrCreateConversation = async (req, res) => {
  try {
    const { userId } = req.body;
    const myId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid userId",
      });
    }

    if (userId === myId) {
      return res.status(400).json({
        success: false,
        message: "You cannot start a conversation with yourself",
      });
    }

    const otherUser = await User.findById(userId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const acceptedRequest = await findAcceptedRequestBetween(myId, userId);
    if (!acceptedRequest) {
      return res.status(403).json({
        success: false,
        message: "You can only message connections you've accepted",
      });
    }

    const pairKey = buildPairKey(myId, userId);

    let conversation = await Conversation.findOne({ pairKey }).populate(
      "participants",
      "-password"
    );

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [myId, userId],
        request: acceptedRequest._id,
      });
      conversation = await conversation.populate("participants", "-password");
    }

    const otherParticipant = conversation.participants.find(
      (p) => p._id.toString() !== myId
    );

    res.status(200).json({
      success: true,
      conversation: {
        id: conversation._id,
        otherUser: toPublicProfile(otherParticipant),
        lastMessage: conversation.lastMessage,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * GET /api/messages/conversations
 * Lists all conversations the current user is part of, most recently
 * active first, shaped for a conversation-list UI.
 */
const getConversations = async (req, res) => {
  try {
    const myId = req.user.id;

    const conversations = await Conversation.find({ participants: myId })
      .sort({ updatedAt: -1 })
      .populate("participants", "-password");

    const shaped = conversations.map((conversation) => {
      const otherParticipant = conversation.participants.find(
        (p) => p._id.toString() !== myId
      );

      return {
        id: conversation._id,
        otherUser: toPublicProfile(otherParticipant),
        lastMessage: conversation.lastMessage,
        updatedAt: conversation.updatedAt,
      };
    });

    res.json({
      success: true,
      conversations: shaped,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * GET /api/messages/conversations/:conversationId/messages
 * Returns messages oldest -> newest. Also marks any messages sent by the
 * other participant as read by the current user.
 */
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const myId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation id",
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants
      .map((p) => p.toString())
      .includes(myId);

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this conversation",
      });
    }

    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: 1 })
      .limit(limit);

    // Mark messages from the other participant as read by me.
    await Message.updateMany(
      {
        conversation: conversationId,
        sender: { $ne: myId },
        readBy: { $ne: myId },
      },
      { $addToSet: { readBy: myId } }
    );

    res.json({
      success: true,
      messages: messages.map((m) => ({
        id: m._id,
        conversationId: m.conversation,
        senderId: m.sender,
        text: m.text,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * POST /api/messages/conversations/:conversationId/messages
 * body: { text }
 */
const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;
    const myId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation id",
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message text is required",
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isParticipant = conversation.participants
      .map((p) => p.toString())
      .includes(myId);

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this conversation",
      });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: myId,
      text: text.trim(),
      readBy: [myId],
    });

    conversation.lastMessage = {
      text: message.text,
      sender: myId,
      sentAt: message.createdAt,
    };
    await conversation.save();

    res.status(201).json({
      success: true,
      message: {
        id: message._id,
        conversationId: message.conversation,
        senderId: message.sender,
        text: message.text,
        createdAt: message.createdAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
  // exported for testing / reuse
  findAcceptedRequestBetween,
  buildPairKey,
};