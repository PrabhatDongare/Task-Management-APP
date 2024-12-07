import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    title: {
        type: String,
        required: true,
    },
    priority: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: {
        type: Date,
        required: true,
    },
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;
