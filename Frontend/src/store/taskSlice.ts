import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../utils/axios";
import { AxiosError } from "axios";
import { dispatch } from "./store";
import { toast } from "react-toastify";

interface Task {
  _id: string;
  title: string;
  priority: number;
  status: string;
  startTime: string;
  endTime: string;
}

interface DashboardData {
  totalTask: number;
  pendingTasks: number;
  completedTaskPercentage: number;
  pendingTaskPercentage: number;
  avgTimePerCompletedTask: number;
  totalTimeLapsed: number;
  totalTimeToFinish: number;
  dashboardTable: object
}

interface State {
  tasks: Task[];
  dashboardData: Partial<DashboardData>;
}

const initialState: State = {
  tasks: [],
  dashboardData: {},
}

export const taskSlice = createSlice({
  name: "taskStore",
  initialState,

  reducers: {
    updateDashboardAndTaskData(state, action) {
      const { tasks, dashboardData } = action.payload;
      state.tasks = tasks;
      state.dashboardData = dashboardData;
    },

    updateFetchedTaskData(state, action) {
      const { tasks } = action.payload;
      state.tasks = tasks;
    },

    addTaskData: (state, action: PayloadAction<{ savedTask: Task }>) => {
      const { savedTask } = action.payload;
      state.tasks = [...state.tasks, savedTask];
    },

    updateTaskData(state, action) {
      const { updatedTask } = action.payload;
      const index = state.tasks.findIndex(task => task._id === updatedTask._id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
    },

    deleteTaskData(state, action) {
      state.tasks = state.tasks.filter((task) => {
        return !action.payload.includes(task._id);
      });
    }

  },
});

// export const {} = taskSlice.actions;
export default taskSlice.reducer;


export function fetchDashboard() {
  return async () => {
    try {
      const response = await axios.get("task/showDashboard");
      dispatch(taskSlice.actions.updateDashboardAndTaskData(response.data));
    } catch {
      toast.error("Failed to fetch dashboard data");
    }
  };
}

export function fetchTasks() {
  return async () => {
    try {
      const response = await axios.get("task/showTask");
      dispatch(taskSlice.actions.updateFetchedTaskData(response.data));
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(
        (axiosError.response?.data as { message?: string })?.message ||
        "Something went wrong. Please try again",
      );
    }
  };
}

export function addTask(body: object) {
  return async () => {
    try {
      const response = await axios.post("task/addTask", body);
      dispatch(taskSlice.actions.addTaskData(response.data));
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(
        (axiosError.response?.data as { message?: string })?.message ||
        "Something went wrong. Please try again",
      );
    }
  };
}

export function updateTask(body: object) {
  return async () => {
    try {
      const response = await axios.put("task/updateTask", body);
      dispatch(taskSlice.actions.updateTaskData(response.data));
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(
        (axiosError.response?.data as { message?: string })?.message ||
        "Something went wrong. Please try again",
      );
    }
  };
}

export function deleteTask(collectIdForDelete: string[]) {
  return async () => {
    const body = { taskIdArray: collectIdForDelete }
    try {
      const response = await axios.delete("task/deleteTask", { data: body });
      if (response.data.success) dispatch(taskSlice.actions.deleteTaskData(collectIdForDelete))
    } catch (error) {
      const axiosError = error as AxiosError;
      toast.error(
        (axiosError.response?.data as { message?: string })?.message ||
        "Something went wrong. Please try again",
      );
    }
  };
}
