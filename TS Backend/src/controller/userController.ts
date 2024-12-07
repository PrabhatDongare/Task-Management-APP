import { Request, Response } from "express";
import User from "../models/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
dotenv.config()

// SIGN UP USER
export const signUp = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ message: "Invalid input" });
        return
    }
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ message: "Email already exists" });
            return
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        user = await User.create({ name, email, password: passwordHash });

        const data = { user: { id: user.id } }
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        res.status(200).json({ message: "Sign Up completed", authToken })
    } catch (error) {
        console.log(error)
        res.status(500);
    }
}

// LOGIN USER
export const login = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ message: "Invalid input" });
        return
    }
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            res
                .status(400)
                .json({ message: "Email does not exists." });
            return
        }

        const checkPass = await bcrypt.compare(password, user.password);
        if (!checkPass) {
            res
                .status(400)
                .json({ message: "Incorrect Password." });
            return
        }

        const data = { user: { id: user.id } };
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        res.status(200).json({ authToken });
    } catch (error) {
        console.log(error);
        res.status(500);
    }
};
