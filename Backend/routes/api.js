const express = require("express");
const router = express.Router();

const userRoute = require("./userRoute");
const taskRoute = require("./taskRoute");

router.use("/api/user", userRoute);
router.use("/api/task", taskRoute);

module.exports = router;
