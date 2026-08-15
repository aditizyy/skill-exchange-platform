const express = require("express");

const router = express.Router();

const { registerUser, loginUser} = require("../controllers/authController");

const { registerValidation,loginValidation} = require("../validators/authValidator");
// const {authMiddleware}=require("../middleware/authMiddleware");
const validateRequest = require("../validators/validateRequest");

router.post("/register", registerValidation, validateRequest, registerUser);
router.post("/login", loginValidation, validateRequest, loginUser);

module.exports = router;