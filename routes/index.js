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
  userProfilePicture,
} = require("../controllers/userProfileController");
const { isAuthenticatedUser } = require("../middleware/auth");
const {addVehicle, userVehiclePicture} = require("../controllers/vehicleController");
const router = express.Router();

router.post("/registration", registerUser);
router.post("/login", logInUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/profile-form", isAuthenticatedUser, userProfileForm);
router.get("/profile", isAuthenticatedUser, userProfile);
router.post("/profile-picture", userProfilePicture);

router.post("/vehicle-informaton", isAuthenticatedUser, addVehicle);
router.post("/vehicle-picture", isAuthenticatedUser, userVehiclePicture);

module.exports = router;
