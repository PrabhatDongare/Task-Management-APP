const Task = require("../models/TaskModel");

// SHOW TASK
exports.showTask = async function (req, res) {
  let success = false;
  try {
    let { id } = req.params;
    const tasks = await Task.find({ user: id });

    if (tasks.length === 0) {
      return res.status(404).json({ success, message: "No tasks found" });
    }
    success = true;
    return res.status(200).json({ success, tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
};

// ADD TASK
exports.addTask = async function (req, res) {
  let success = false;
  try {
    let { id } = req.params;
    const { title, priority, status, startTime, endTime } = req.body;
    if (startTime > endTime) {
      return res
        .status(404)
        .json({ success, message: "End Date should be after Start Date" });
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
    success = true;
    return res.status(200).json({ success, savedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
};

// UPDATE TASK
exports.updateTask = async function (req, res) {
  let success = false;
  try {
    let { id } = req.params;
    const { taskId, title, priority, status, startTime, endTime } = req.body;
    if (startTime > endTime) {
      return res
        .status(404)
        .json({ success, message: "End Date should be after Start Date" });
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
      return res.status(404).json({ success, message: "Task not found" });
    }
    success = true;
    return res.status(200).json({ success, updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
};

// DELETE TASK
exports.deleteTask = async function (req, res) {
  let success = false;
  try {
    let { id } = req.params;
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
      return res
        .status(404)
        .json({ success, message: "Some tasks were not found" });
    }
    success = true;
    return res.status(200).json({ success });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
};

// SHOW DASHBOARD
exports.showDashboard = async function (req, res) {
  let success = false;
  try {
    let { id } = req.params;
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
    success = true;
    return res.status(200).json({ success, tasks, dashboardData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success, message: "Internal Server Error" });
  }
};
