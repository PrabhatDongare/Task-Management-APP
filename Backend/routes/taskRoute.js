const express = require("express");
const router = express.Router();

const {
  showTask,
  addTask,
  updateTask,
  deleteTask,
  showDashboard,
} = require("../controller/taskController");
const fetchuser = require("../middleware/fetchuser");

router.get("/showDashboard", fetchuser, showDashboard);
router.get("/showTask", fetchuser, showTask);
router.post("/addTask", fetchuser, addTask);
router.put("/updateTask", fetchuser, updateTask);
router.delete("/deleteTask", fetchuser, deleteTask);

module.exports = router;
