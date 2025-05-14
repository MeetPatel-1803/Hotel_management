const router = require("express").Router();

const {
  createRoom,
  getRooms,
  deleteRoom,
  updateRoom,
} = require("../../controllers/roomController.js");

router.post("/room", createRoom);
router.put("/room", updateRoom);
router.delete("/room", deleteRoom);
router.get("/room", getRooms);

module.exports = router;
