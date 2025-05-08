const { Router } = require("express");
const apiRoutes = require("./v1");

const router = Router();
console.log("fdfdf");
// Routes are defined below for API version v1.
router.use("/api", apiRoutes);

module.exports = router;
