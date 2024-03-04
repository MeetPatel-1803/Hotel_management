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
  getUserVehiclesList,
} = require("../../controllers/vehicleController");
const {
  addEditOfferRide,
  availableRidesList,
} = require("../../controllers/ridesController");
const {
  addEditRideRequest,
  updateStatusOfRideRequest,
} = require("../../controllers/bookingRequestController");

/**
 * User
 */
router.post("/signup", register);
router.post("/signin", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", isAuthenticatedUser, changePassword);

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

/**
 * Vehicle
 */
router.post("/add-edit-vehicle", isAuthenticatedUser, addEditVehicle);

/**
 * Rides
 */
router.post("/add-edit-offer-ride", isAuthenticatedUser, addEditOfferRide);
router.get("/user-vehicles-list", isAuthenticatedUser, getUserVehiclesList);
router.get("/available-rides", isAuthenticatedUser, availableRidesList);

/**
 * booking requested ride
 */
router.post("/add-edit-ride-request", isAuthenticatedUser, addEditRideRequest);
router.post(
  "/update-ride-status",
  isAuthenticatedUser,
  updateStatusOfRideRequest
);

module.exports = router;
