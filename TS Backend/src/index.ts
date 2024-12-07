import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { connectDB } from './config/db'
import routes from "./routes";

dotenv.config()
const port = process.env.PORT || 3000;
const app = express();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

connectDB();

app.get("/", (req: Request, res: Response) => {
    try {
        res.status(200).json("Backend is LIVE");
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Something went wrong" });
    }
})
app.use(routes);

app.listen(port, () => {
    console.log(`BACKEND listening on port ${port}`);
});
