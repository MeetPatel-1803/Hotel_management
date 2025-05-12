const router = require("express").Router();

const { createRoom } = require("../../controllers/roomControllers.js");

router.post("/room", createRoom);
