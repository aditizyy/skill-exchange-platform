const express = require("express");

const router = express.Router();

const { authMiddleware } = require("../middleware/authMiddleware");

const {
  startConversationValidation,
  conversationIdValidation,
  sendMessageValidation,
} = require("../validators/messageValidators");

const {
  getOrCreateConversation,
  getConversations,
  getMessages,
  sendMessage,
} = require("../controllers/messageController");

// All message routes require a logged-in user
router.use(authMiddleware);

router.get("/conversations", getConversations);
router.post("/conversations", startConversationValidation, getOrCreateConversation);

router.get(
  "/conversations/:conversationId/messages",
  conversationIdValidation,
  getMessages
);
router.post(
  "/conversations/:conversationId/messages",
  sendMessageValidation,
  sendMessage
);

module.exports = router;