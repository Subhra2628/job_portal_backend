const express = require("express");

const router = express.Router();

// Import OTP controllers
const {
  sendOtp,
  verifyOtp
} = require("../Controller/auth_controller");

// Import refresh token controller
const refreshToken = require("../Controller/refresh_token");

// Import register controller
const register = require("../Controller/register");

// Import login controller
const login = require("../Controller/login");

//import logout
const logout=require("../Controller/log_out");
// Send OTP
router.post("/send-otp", sendOtp);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Refresh access token
router.post("/refresh-token", refreshToken);

//logout
router.post("/loggedout",logout);

module.exports = router;