const express = require("express");
const {
  registerUser,
  logInUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const {
  userProfile,
  userProfileForm,
} = require("../controllers/userProfileController");
const { isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

router.post("/registration", registerUser);
router.post("/login", logInUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/profile-form", isAuthenticatedUser, userProfileForm);
router.get("/profile", isAuthenticatedUser, userProfile);

module.exports = router;
