import { Request, Response } from "express";
import Task from "../models/TaskModel";

// SHOW TASK
export const showTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const tasks = await Task.find({ user: id });
        if (tasks.length === 0) {
            res.status(404).json({ message: "No tasks found" });
            return;
        }
        res.status(200).json({ tasks });
    } catch (error) {
        console.log(error);
        res.status(500);
    }
};

// ADD TASK
export const addTask = async function (req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { title, priority, status, startTime, endTime } = req.body;
        if (startTime > endTime) {
            res.status(404).json({ message: "End Date should be after Start Date" });
            return;
        }
        const newTask = new Task({
            title,
            priority,
            status,
            startTime,
            endTime,
            user: id,
        });
        const savedTask = await newTask.save();
        res.status(200).json({ savedTask });
    } catch (error) {
        console.log(error);
        res.status(500);
    }
};

// UPDATE TASK
export const updateTask = async function (req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { taskId, title, priority, status, startTime, endTime } = req.body;
        if (startTime > endTime) {
            res.status(404).json({ message: "End Date should be after Start Date" });
            return;
        }
        const updatedTask = await Task.findByIdAndUpdate(
            { _id: taskId, user: id },
            {
                title,
                priority,
                status,
                startTime,
                endTime,
            },
            { new: true }
        );
        if (!updatedTask) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        res.status(200).json({ updatedTask });
    } catch (error) {
        console.log(error);
        res.status(500);
    }
};

// DELETE TASK
export const deleteTask = async function (req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { taskIdArray } = req.body;
        let taskNotFound = false;
        for (const taskId of taskIdArray) {
            const deletedTask = await Task.findByIdAndDelete({
                _id: taskId,
                user: id,
            });
            if (!deletedTask) {
                taskNotFound = true;
            }
        }
        if (taskNotFound) {
            res.status(404).json({ message: "Some tasks were not found" });
            return;
        }
        res.status(200).end()
        return
    } catch (error) {
        console.log(error);
        res.status(500);
    }
};

// SHOW DASHBOARD
export const showDashboard = async function (req: Request, res: Response) {
    try {
        const { id } = req.params;
        const tasks = await Task.find({ user: id });

        const totalTask = tasks.length;
        const completedTask = tasks.filter(
            (task) => task.status === "Finished"
        ).length;
        const pendingTasks = totalTask - completedTask;

        const completedTaskPercentage = Math.round(
            (completedTask / totalTask) * 100
        );
        const pendingTaskPercentage = Math.round(
            ((totalTask - completedTask) / totalTask) * 100
        );

        let totalCompletedTaskTime = 0;
        let totalTimeLapsed = 0;
        let totalTimeToFinish = 0;
        let dashboardTable = {};

        for (let i = 1; i <= 5; i++) {
            dashboardTable[i] = {
                priorityCount: 0,
                timeLapsed: 0,
                timeToFinish: 0,
            };
        }

        for (const task of tasks) {
            const startTime = new Date(task.startTime).getTime();
            const endTime = new Date(task.endTime).getTime();
            const currentTime = new Date().getTime();
            const msToHrs = 3600000;

            if (task.status === "Finished") {
                totalCompletedTaskTime += (endTime - startTime) / msToHrs;
            } else {
                dashboardTable[task.priority].priorityCount += 1;
                let timeLapsed =
                    currentTime > startTime
                        ? Math.round((currentTime - startTime) / msToHrs)
                        : 0;
                let timeToFinish =
                    endTime > currentTime
                        ? Math.round((endTime - currentTime) / msToHrs)
                        : 0;

                dashboardTable[task.priority].timeLapsed += timeLapsed;
                dashboardTable[task.priority].timeToFinish += timeToFinish;
                totalTimeLapsed += timeLapsed;
                totalTimeToFinish += timeToFinish;
            }
        }

        const avgTimePerCompletedTask =
            completedTask > 0
                ? Math.round(totalCompletedTaskTime / completedTask)
                : 0;

        const dashboardData = {
            totalTask,
            pendingTasks,
            completedTaskPercentage,
            pendingTaskPercentage,
            avgTimePerCompletedTask,
            totalTimeLapsed,
            totalTimeToFinish,
            dashboardTable,
        };
        res.status(200).json({ tasks, dashboardData });
    } catch (error) {
        console.log(error);
        res.status(500);
    }
};
