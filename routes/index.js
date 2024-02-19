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
  removeProfilePicture,
} = require("../controllers/userProfileController");
const { isAuthenticatedUser } = require("../middleware/auth");
const {
  addVehicle,
  addVehiclePicture,
  updateVehicleInfo,
  removeVehiclePicture,
  getUserVehicles,
} = require("../controllers/vehicleController");
const offerRide = require("../controllers/offerRideController");
const filteredRides = require("../controllers/availableRidesController");
const router = express.Router();

/**
 * User
 */
router.post("/registration", registerUser);
router.post("/login", logInUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/**
 * Profile
 */
router.post("/profile-form", isAuthenticatedUser, userProfileForm);
router.get("/profile", isAuthenticatedUser, userProfile);
router.post("/profile-picture", userProfilePicture);
router.delete("/profile-picture", removeProfilePicture);

/**
 * Vehicle
 */
router.post("/vehicle-informaton", isAuthenticatedUser, addVehicle);
router.put("/vehicle-information", isAuthenticatedUser, updateVehicleInfo);
router.post("/vehicle-picture", isAuthenticatedUser, addVehiclePicture);
router.delete("/vehicle-picture", isAuthenticatedUser, removeVehiclePicture);

/**
 * Rides
 */
router.post("/offer-trip", isAuthenticatedUser, offerRide);
router.get("/offer-trip", isAuthenticatedUser, getUserVehicles);
router.get("/find-trip", isAuthenticatedUser, filteredRides);

module.exports = router;
