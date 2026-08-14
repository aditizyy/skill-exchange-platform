const { body, validationResult } = require("express-validator");

const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters"),

    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Valid email is required"),

    body("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

];

const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("Valid email is required"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

];

module.exports = {
    registerValidation,
    loginValidation
};