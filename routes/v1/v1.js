"use strict";

const router = require("express").Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../../controllers/authController");
const {
  getProfile,
  addEditProfile,
  addEditProfilePicture,
  removeProfilePicture,
} = require("../../controllers/userProfileController");
const { isAuthenticatedUser } = require("../../middleware/auth");
const {
  addEditVehicle,
  addEditVehiclePicture,
  removeVehiclePicture,
  getUserVehiclesList,
} = require("../../controllers/vehicleController");
const {
  addEditOfferRide,
  availableRidesList,
} = require("../../controllers/ridesController");
const addEditRideRequest = require("../../controllers/bookingRequestController");

/**
 * User
 */
router.post("/signup", register);
router.post("/signin", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/**
 * Profile
 */
router.post("/profile", isAuthenticatedUser, addEditProfile);
router.get("/profile", isAuthenticatedUser, getProfile);
router.post(
  "/change-profile-picture",
  isAuthenticatedUser,
  addEditProfilePicture
);
router.delete(
  "/remove-profile-picture",
  isAuthenticatedUser,
  removeProfilePicture
);
router.post("/change-password", isAuthenticatedUser, changePassword);

/**
 * Vehicle
 */
router.post("/vehicle-informaton", isAuthenticatedUser, addEditVehicle);
router.post(
  "/change-vehicle-picture",
  isAuthenticatedUser,
  addEditVehiclePicture
);
router.delete(
  "/remove-vehicle-picture",
  isAuthenticatedUser,
  removeVehiclePicture
);

/**
 * Rides
 */
router.post("/offer-ride", isAuthenticatedUser, addEditOfferRide);
router.get("/user-vehicles-list", isAuthenticatedUser, getUserVehiclesList);
router.get("/find-ride", isAuthenticatedUser, availableRidesList);

/**
 * booking requested ride
 */
router.post("/ride-booking", isAuthenticatedUser, addEditRideRequest);

module.exports = router;
