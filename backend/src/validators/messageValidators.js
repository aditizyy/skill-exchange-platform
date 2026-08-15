const { body, param } = require("express-validator");
const validateRequest = require("./validateRequest");

const startConversationValidation = [
  body("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isMongoId()
    .withMessage("userId must be a valid id"),

  validateRequest,
];

const conversationIdValidation = [
  param("conversationId").isMongoId().withMessage("Invalid conversation id"),

  validateRequest,
];

const sendMessageValidation = [
  param("conversationId").isMongoId().withMessage("Invalid conversation id"),

  body("text")
    .trim()
    .notEmpty()
    .withMessage("Message text is required")
    .isLength({ max: 2000 })
    .withMessage("Message text must be 2000 characters or fewer"),

  validateRequest,
];

module.exports = {
  startConversationValidation,
  conversationIdValidation,
  sendMessageValidation,
};