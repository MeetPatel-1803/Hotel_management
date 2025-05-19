"use strict";

const { Router } = require("express");
const v1 = require("./v1.js");

const router = Router();

router.use("/v1", v1);

module.exports = router;
