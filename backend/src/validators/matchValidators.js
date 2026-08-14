const { body, param } = require("express-validator");
const validateRequest = require("./validateRequest");

const sendRequestValidation = [
  body("receiverId")
    .notEmpty()
    .withMessage("receiverId is required")
    .isMongoId()
    .withMessage("receiverId must be a valid id"),

  validateRequest,
];

const respondToRequestValidation = [
  param("id").isMongoId().withMessage("Invalid request id"),

  body("status")
    .isIn(["accepted", "declined"])
    .withMessage("status must be 'accepted' or 'declined'"),

  validateRequest,
];

module.exports = {
  sendRequestValidation,
  respondToRequestValidation,
};
