import express, { Router } from "express";
const router: Router = express.Router();

import { signUp, login } from "../controller/userController";
import { signupValidator, loginValidator } from "../utils/validation"

router.post("/signup", signupValidator, signUp);
router.post("/login", loginValidator, login);

export default router;
