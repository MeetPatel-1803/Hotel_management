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
  myRidesList,
} = require("../../controllers/ridesController");
const {
  addEditRideRequest,
  updateStatusOfRideRequest,
  cancelRideRequest,
  getBookingRequestList,
  getMyBookingRequestList,
} = require("../../controllers/bookingRequestController");
const {
  addEditRideRequest,
  cancelRideRequest,
} = require("../../controllers/rideRequestController");

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
router.get("/user-vehicles-list", isAuthenticatedUser, getUserVehiclesList);

/**
 * Rides
 */
router.post("/add-edit-ride", isAuthenticatedUser, addEditOfferRide);
router.get("/available-rides", isAuthenticatedUser, availableRidesList);

/**
 * booking requested ride
 */
router.post(
  "/add-edit-booking-request",
  isAuthenticatedUser,
  addEditRideRequest
);
router.post(
  "/update-request-status",
  isAuthenticatedUser,
  updateStatusOfRideRequest
);
router.delete(
  "/cancel-booking-request",
  isAuthenticatedUser,
  cancelRideRequest
);
router.get("/booking-request-list", isAuthenticatedUser, getBookingRequestList);
router.get(
  "/my-booking-request-list",
  isAuthenticatedUser,
  getMyBookingRequestList
);
router.get("/booked-and-offered-rides-list", isAuthenticatedUser, myRidesList);

/**
 *  ride request
 */
router.post("/add-edit-ride-request", isAuthenticatedUser, addEditRideRequest);
router.delete("/cancel-ride-request", isAuthenticatedUser, cancelRideRequest);
module.exports = router;
