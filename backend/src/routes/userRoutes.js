const express = require("express");

const router = express.Router();

const {authMiddleware} = require("../middleware/authMiddleware");

const {
    getProfile,
    updateProfile
} = require("../controllers/userController");

const { updateProfileValidation } = require("../validators/userValidators");
const validateRequest = require("../validators/validateRequest");

router.get(
    "/profile",
    authMiddleware,
    getProfile
);

router.put(
    "/profile",
    authMiddleware,
    updateProfileValidation,
    validateRequest,
    updateProfile
);

module.exports = router;