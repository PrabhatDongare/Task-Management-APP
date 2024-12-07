import express, { Router } from "express";
import userRoute from "./userRoute";
import taskRoute from "./taskRoute";

const router: Router = express.Router();

router.use("/api/user", userRoute);
router.use("/api/task", taskRoute);

export default router;
