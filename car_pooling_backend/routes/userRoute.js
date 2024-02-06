const express = require("express");
const {
  registerUser,
  logInUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const {
  userProfile,
} = require("../controllers/userProfileController");
const router = express.Router();

router.post("/registration", registerUser);
router.post("/login", logInUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/profile", userProfile);

module.exports = router;
