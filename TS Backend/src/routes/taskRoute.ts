import express, { Router } from "express";

const router: Router = express.Router();

import { showTask, addTask, updateTask, deleteTask, showDashboard } from "../controller/taskController";
import { authenticateUser } from "../middleware/authenticateUser";

router.get("/showTask", authenticateUser, showTask);
router.post("/addTask", authenticateUser, addTask);
router.put("/updateTask", authenticateUser, updateTask);
router.delete("/deleteTask", authenticateUser, deleteTask);
router.get("/showDashboard", authenticateUser, showDashboard);

export default router;