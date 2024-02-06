const express = require("express");
const {
  registerUser,
  logInUser,
  forgotPassword,
  resetPassword,
  resetPasswordToken,
} = require("../controllers/userController");
const {
  getUserProfile,
  getUserProfilePicture,
  userProfile,
} = require("../controllers/userProfileController");
const router = express.Router();

router.post("/registration", registerUser);
router.post("/login", logInUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/profile", userProfile);
// router.post("/update-profile", updateUserProfile);
// router.post("/profile-picture", userProfilePicture);
// router.get("/profile", getUserProfile);

module.exports = router;
