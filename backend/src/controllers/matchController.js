const mongoose = require("mongoose");
const User = require("../models/User");
const Request = require("../models/Request");

/**
 * Shapes a user doc for the "public" match/inbox views.
 * Email/contact info is only included when includeContact is true
 * (i.e. the connection has been accepted).
 */
const toPublicProfile = (user, includeContact) => {
  const base = {
    id: user._id,
    name: user.name,
    skillsToTeach: user.skillsToTeach,
    skillsToLearn: user.skillsToLearn,
    avatarUrl: user.avatarUrl || null,
  };

  if (includeContact) {
    base.email = user.email;
  }

  return base;
};

/**
 * GET /api/matches/suggested
 * Finds other users whose skills intersect with the current user's:
 *   - candidate.skillsToTeach ∩ me.skillsToLearn  (they can teach me something)
 *   - candidate.skillsToLearn ∩ me.skillsToTeach  (I can teach them something)
 * A candidate qualifies if either intersection is non-empty.
 */
const getSuggestedMatches = async (req, res) => {
  try {
    const me = await User.findById(req.user.id);

    if (!me) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const myTeach = me.skillsToTeach || [];
    const myLearn = me.skillsToLearn || [];

    if (myTeach.length === 0 && myLearn.length === 0) {
      return res.json({
        success: true,
        matches: [],
        message: "Add skills to your profile to see suggested matches",
      });
    }

    const candidates = await User.find({
      _id: { $ne: me._id },
      $or: [
        { skillsToTeach: { $in: myLearn } },
        { skillsToLearn: { $in: myTeach } },
      ],
    }).select("-password");

    // Rank by overlap size so the strongest matches surface first
    const scored = candidates.map((candidate) => {
      const theyTeachMeWant = candidate.skillsToTeach.filter((s) =>
        myLearn.includes(s)
      );
      const iTeachTheyWant = candidate.skillsToLearn.filter((s) =>
        myTeach.includes(s)
      );

      return {
        user: candidate,
        matchScore: theyTeachMeWant.length + iTeachTheyWant.length,
        theyTeachMeWant,
        iTeachTheyWant,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);

    const matches = scored.map((entry) => ({
      ...toPublicProfile(entry.user, false),
      matchScore: entry.matchScore,
      theyTeachMeWant: entry.theyTeachMeWant,
      iTeachTheyWant: entry.iTeachTheyWant,
    }));

    res.json({
      success: true,
      matches,
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
 * POST /api/matches/request
 * body: { receiverId }
 */
const sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "receiverId is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid receiverId",
      });
    }

    if (receiverId === senderId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a request to yourself",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const existing = await Request.findOne({
      fromUser: senderId,
      toUser: receiverId,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Request already ${existing.status}`,
      });
    }

    const request = await Request.create({
      fromUser: senderId,
      toUser: receiverId,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Request sent",
      request,
    });
  } catch (error) {
    console.error(error);

    // Duplicate key from the unique index (race condition on double-click etc.)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Request already sent",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/**
 * GET /api/matches/inbox
 * Returns requests received by the current user.
 * Contact info (email) is only attached once status === "accepted".
 */
const getInbox = async (req, res) => {
  try {
    const requests = await Request.find({ toUser: req.user.id })
      .populate("fromUser", "-password")
      .sort({ createdAt: -1 });

    const shaped = requests.map((r) => ({
      id: r._id,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      from: toPublicProfile(r.fromUser, r.status === "accepted"),
    }));

    res.json({
      success: true,
      requests: shaped,
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
 * GET /api/matches/sent
 * Returns requests the current user sent (so they can see status +
 * contact info of the other side once accepted).
 */
const getSentRequests = async (req, res) => {
  try {
    const requests = await Request.find({ fromUser: req.user.id })
      .populate("toUser", "-password")
      .sort({ createdAt: -1 });

    const shaped = requests.map((r) => ({
      id: r._id,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      to: toPublicProfile(r.toUser, r.status === "accepted"),
    }));

    res.json({
      success: true,
      requests: shaped,
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
 * PATCH /api/matches/:id
 * body: { status: "accepted" | "declined" }
 * Only the recipient (toUser) of the request may respond to it.
 */
const respondToRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be 'accepted' or 'declined'",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request id",
      });
    }

    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.toUser.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to respond to this request",
      });
    }

    if (request.status !== "pending") {
      return res.status(409).json({
        success: false,
        message: `Request already ${request.status}`,
      });
    }

    request.status = status;
    await request.save();

    const populated = await request.populate("fromUser", "-password");

    res.json({
      success: true,
      message: `Request ${status}`,
      request: {
        id: populated._id,
        status: populated.status,
        from: toPublicProfile(populated.fromUser, populated.status === "accepted"),
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
 * GET /api/matches/connections
 * Returns everyone the current user has an *accepted* connection with,
 * regardless of who originally sent the request.
 */
const getConnections = async (req, res) => {
  try {
    const myId = req.user.id;

    const requests = await Request.find({
      status: "accepted",
      $or: [{ fromUser: myId }, { toUser: myId }],
    })
      .populate("fromUser", "-password")
      .populate("toUser", "-password")
      .sort({ updatedAt: -1 });

    const connections = requests.map((r) => {
      const isFromMe = r.fromUser._id.toString() === myId;
      const otherUser = isFromMe ? r.toUser : r.fromUser;

      return {
        requestId: r._id,
        connectedAt: r.updatedAt,
        user: toPublicProfile(otherUser, true),
      };
    });

    res.json({
      success: true,
      connections,
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
  getSuggestedMatches,
  sendRequest,
  getInbox,
  getSentRequests,
  getConnections,
  respondToRequest,
};