const router = require("express").Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
} = require("../../controllers/authController.js");
const { bookRoom } = require("../../controllers/bookingController.js");
const {
  createRoom,
  getRooms,
  deleteRoom,
  updateRoom,
} = require("../../controllers/roomController.js");
const { isAuthenticatedUser } = require("../../middlewares/authUser.js");

router.post("/", isAuthenticatedUser);

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/room", createRoom);
router.put("/room", updateRoom);
router.delete("/room", deleteRoom);
router.get("/room", getRooms);

router.post("/book-room", bookRoom);

module.exports = router;
