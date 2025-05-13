const router = require("express").Router();

const { createRoom } = require("../../controllers/roomController.js");

router.post("/room", createRoom);

module.exports = router;
