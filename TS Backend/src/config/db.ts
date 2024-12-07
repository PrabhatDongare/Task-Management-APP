import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in environment variables");
}

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
  