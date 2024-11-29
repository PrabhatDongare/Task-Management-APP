import React, { useEffect, useState, useRef } from "react";
import { useForm, SubmitHandler, FieldError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { AppDispatch } from "../store/store";

import { FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
} from "../store/taskSlice";
import { formatDate, getTimeFinished } from "../utils/dateUtility";
import { sortTasks } from "../utils/sortUtility";

interface TaskType {
  _id?: string;
  title: string;
  priority: number;
  status: string;
  startTime: string;
  endTime: string;
}

const TaskList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskType>();

  const [modal, setModal] = useState<boolean>(false);
  const [addModal, setAddModal] = useState<boolean>(true);
  const [sortType, setSortType] = useState<string>("All");
  const [priority, setPriority] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const tasks = useSelector((state: RootState) => state.taskStore.tasks);
  const taskIdRef = useRef<string | null>(null);
  const [collectIdForDelete, setCollectIdForDelete] = useState<string[]>([]);

  const onSubmit: SubmitHandler<TaskType> = async (
    data: TaskType,
  ): Promise<void> => {
    if (addModal) {
      await dispatch(addTask(data));
    } else {
      const { title, priority, status, startTime, endTime } = data;
      const body = {
        taskId: taskIdRef.current,
        title,
        priority,
        status,
        startTime,
        endTime,
      };
      await dispatch(updateTask(body));
    }
    setModal(false);
  };

  const handleTaskCheckbox =
    (id: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setCollectIdForDelete((value) => [...value, id]);
      } else {
        setCollectIdForDelete((value) =>
          value.filter((taskId) => taskId !== id),
        );
      }
    };

  const handleAllTaskCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.checked) {
      const allTaskIds = tasks.map((task) => task._id);
      setCollectIdForDelete(allTaskIds);
    } else {
      setCollectIdForDelete([]);
    }
  };

  const handleDeleteTask = async () => {
    if (collectIdForDelete.length > 0) {
      await dispatch(deleteTask(collectIdForDelete));
      setCollectIdForDelete([]);
    }
  };

  const handleEditTask = (task: TaskType) => {
    setModal(true);
    setAddModal(false);
    taskIdRef.current = task?._id ?? "";
    reset({
      title: task.title,
      priority: task.priority,
      status: task.status,
      startTime: task.startTime.slice(0, 16),
      endTime: task.endTime.slice(0, 16),
    });
  };

  const sortFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortType(event.target.value);
  };
  const priorityFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(event.target.value);
  };
  const statusFilter = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(event.target.value);
  };

  const filteredTasks = tasks.filter((task) => {
    const checkPriority =
      priority === "All" || task.priority === Number(priority);
    const checkStatus = status === "All" || task.status === status;
    return checkPriority && checkStatus;
  });

  const fetchData = async () => {
    if (tasks.length < 1) await dispatch(fetchTasks());
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    fetchData();
  }, []);

  return (
    <section className="mx-10 my-4">
      <h1 className="text-2xl font-semibold">Task list</h1>
      <div className="flex justify-between pb-8 pt-5">
        <div className="flex gap-5">
          <button
            onClick={() => {
              setModal(!modal);
              setAddModal(true);
            }}
            className="flex items-center gap-2 rounded-md border-2 border-purple-400 px-2 py-1 text-sm text-purple-500"
          >
            <FaPlus />
            <span>Add task</span>
          </button>
          <button
            onClick={handleDeleteTask}
            className="flex items-center gap-2 rounded-md border-2 border-red-400 px-2 py-1 text-sm text-red-500"
          >
            <MdDelete />
            <span>Delete selected</span>
          </button>
        </div>
        <div className="flex gap-5">
          {/* Sort Date */}
          <select
            style={{
              border: "2px solid #71797E",
              width: "150px",
              borderRadius: "7px",
              padding: "0 5px",
            }}
            value={sortType === "All" ? "" : sortType}
            onChange={sortFilter}
          >
            <option
              value=""
              disabled
              selected
              style={{ backgroundColor: "white" }}
            >
              Sort
            </option>
            <option value="startTimeASC" style={{ backgroundColor: "white" }}>
              Start time: ASC
            </option>
            <option value="startTimeDESC" style={{ backgroundColor: "white" }}>
              Start time: DESC
            </option>
            <option value="endTimeASC" style={{ backgroundColor: "white" }}>
              End time: ASC
            </option>
            <option value="endTimeDESC" style={{ backgroundColor: "white" }}>
              End time: DESC
            </option>
            <option
              value="All"
              style={{
                backgroundColor: "white",
                color: "red",
              }}
            >
              Remove sort
            </option>
          </select>
          {/* Priority Filter */}
          <select
            style={{
              width: "110px",
              border: "2px solid #71797E",
              borderRadius: "7px",
              padding: "0 5px",
            }}
            value={priority === "All" ? "" : priority}
            onChange={priorityFilter}
          >
            <option value="" disabled>
              Priority
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option
              value="All"
              style={{
                backgroundColor: "white",
                color: "red",
              }}
            >
              Remove filter
            </option>
          </select>
          {/* Status Filter */}
          <select
            style={{
              width: "110px",
              border: "2px solid #71797E",
              borderRadius: "7px",
              padding: "0 5px",
            }}
            value={status === "All" ? "" : status}
            onChange={statusFilter}
          >
            <option value="" disabled selected>
              Status
            </option>
            <option value="Pending">Pending</option>
            <option value="Finished">Finished</option>
            <option
              value="All"
              style={{
                backgroundColor: "white",
                color: "red",
              }}
            >
              Remove filter
            </option>
          </select>
        </div>
      </div>
      {/* Add and Edit task Modal */}
      {modal && (
        <div
          // onClick={() => setModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div className="h-[62vh] w-[40vw] overflow-hidden bg-white p-10 shadow-xl">
            <h1 className="pb-0.5 text-2xl font-medium">
              {addModal ? "Add new task" : "Edit task"}
            </h1>
            <p> {addModal ? "" : `Task ID: ${taskIdRef.current}`}</p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              autoComplete="off"
              className="bg-slate-60 w-full py-2"
            >
              {/* Title */}
              <div className="mb-5 w-2/3">
                <div className="mb-2 flex items-center justify-between">
                  <label>Title</label>
                  {errors.title && (
                    <span className="text-base text-red-500">
                      {(errors.title as FieldError).message}
                    </span>
                  )}
                </div>
                <input
                  {...register("title", {
                    required: {
                      value: true,
                      message: "* This field is required",
                    },
                    pattern: {
                      value: /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/,
                      message: "* invalid title",
                    },
                  })}
                  className="w-full rounded-md border border-black bg-slate-100 px-2 py-1"
                />
              </div>

              <div className="mb-5 flex w-full gap-10">
                {/* Priority */}
                <div className="w-1/2">
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="priority">Priority</label>
                    {errors.priority && (
                      <span className="text-base text-red-500">
                        {(errors.priority as FieldError).message}
                      </span>
                    )}
                  </div>
                  <select
                    {...register("priority", {
                      required: {
                        value: true,
                        message: "* This field is required",
                      },
                      validate: (value) =>
                        [1, 2, 3, 4, 5].includes(Number(value)) ||
                        "* Invalid priority",
                      valueAsNumber: true,
                    })}
                    id="priority"
                    className="w-full rounded-md border border-black bg-slate-100 px-2 py-1"
                  >
                    <option value="" disabled selected>
                      Select priority
                    </option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </div>
                {/* Status */}
                <div className="w-1/2">
                  <div className="mb-2 flex items-center justify-between">
                    <label>Status</label>
                    {errors.status && (
                      <span className="text-base text-red-500">
                        {(errors.status as FieldError).message}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        {...register("status", {
                          required: {
                            value: true,
                            message: "* This field is required",
                          },
                        })}
                        type="radio"
                        value="Finished"
                        className="cursor-pointer"
                      />
                      <span>Finished</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        {...register("status", {
                          required: {
                            value: true,
                            message: "* This field is required",
                          },
                        })}
                        type="radio"
                        value="Pending"
                        className="cursor-pointer"
                      />
                      <span>Pending</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-5 flex w-full gap-10">
                {/* Start Time */}
                <div className="w-1/2">
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="startTime">Start Time</label>
                    {errors.startTime && (
                      <span className="text-base text-red-500">
                        {(errors.startTime as FieldError).message}
                      </span>
                    )}
                  </div>
                  <input
                    {...register("startTime", {
                      required: {
                        value: true,
                        message: "* This field is required",
                      },
                      validate: (value) =>
                        !isNaN(new Date(value).getTime()) ||
                        "* Invalid date and time",
                    })}
                    id="startTime"
                    type="datetime-local"
                    className="w-full rounded-md border border-black bg-slate-100 px-2 py-1"
                  />
                </div>
                {/* End Time */}
                <div className="w-1/2">
                  <div className="mb-2 flex items-center justify-between">
                    <label htmlFor="endTime">End Time</label>
                    {errors.endTime && (
                      <span className="text-base text-red-500">
                        {(errors.endTime as FieldError).message}
                      </span>
                    )}
                  </div>
                  <input
                    {...register("endTime", {
                      required: {
                        value: true,
                        message: "* This field is required",
                      },
                      validate: (value) =>
                        !isNaN(new Date(value).getTime()) ||
                        "* Invalid date and time",
                    })}
                    id="endTime"
                    type="datetime-local"
                    className="w-full rounded-md border border-black bg-slate-100 px-2 py-1"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <input
                disabled={isSubmitting}
                type="submit"
                value={addModal ? "Add task" : "Update task"}
                className="cursor-pointer rounded-md bg-purple-500 px-4 py-1 text-white"
              />
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setModal(false)}
                className="mx-4 rounded-md border-2 border-black px-4 py-1"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Task Table */}
      <table>
        <thead style={{ backgroundColor: "#71797E", color: "white" }}>
          <tr>
            <th style={{ padding: "0 20px", border: "2px solid #C0C0C0" }}>
              {tasks.length > 0 ? (
                <input type="checkbox" onChange={handleAllTaskCheckbox} />
              ) : (
                "-"
              )}
            </th>
            <th style={{ padding: "0 20px", border: "2px solid #C0C0C0" }}>
              Task ID
            </th>
            <th style={{ padding: "0 20px", border: "2px solid #C0C0C0" }}>
              Title
            </th>
            <th style={{ padding: "0 20px", border: "2px solid #C0C0C0" }}>
              Priority
            </th>
            <th style={{ padding: "0 20px", border: "2px solid #C0C0C0" }}>
              Status
            </th>
            <th style={{ padding: "0 20px", border: "2px solid #C0C0C0" }}>
              Start Time
            </th>
            <th style={{ padding: "0 20px", border: "2px solid #C0C0C0" }}>
              End Time
            </th>
            <th
              style={{
                padding: "0 20px",
                border: "2px solid #C0C0C0",
                width: "140px",
              }}
            >
              Total time to finish (hrs)
            </th>
            <th style={{ padding: "0 20px", border: "2px solid #C0C0C0" }}>
              Edit
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.length > 0 ? (
            sortTasks(filteredTasks, sortType).map((task: TaskType) => {
              return (
                <tr key={task._id}>
                  <td
                    style={{
                      padding: "2px 20px",
                      textAlign: "center",
                      border: "2px solid #C0C0C0",
                    }}
                  >
                    <input
                      type="checkbox"
                      onChange={handleTaskCheckbox(task?._id ?? "")}
                    />
                  </td>
                  <td
                    style={{
                      padding: "2px 20px",
                      textAlign: "center",
                      border: "2px solid #C0C0C0",
                    }}
                  >
                    {task._id}
                  </td>
                  <td
                    style={{
                      padding: "2px 20px",
                      textAlign: "center",
                      border: "2px solid #C0C0C0",
                    }}
                  >
                    {task.title}
                  </td>
                  <td
                    style={{
                      padding: "2px 20px",
                      textAlign: "center",
                      border: "2px solid #C0C0C0",
                    }}
                  >
                    {task.priority}
                  </td>
                  <td
                    style={{
                      padding: "2px 20px",
                      textAlign: "center",
                      border: "2px solid #C0C0C0",
                    }}
                  >
                    {task.status}
                  </td>
                  <td
                    style={{
                      padding: "2px 20px",
                      textAlign: "center",
                      border: "2px solid #C0C0C0",
                    }}
                  >
                    {formatDate(task.startTime)}
                  </td>
                  <td
                    style={{
                      padding: "2px 20px",
                      textAlign: "center",
                      border: "2px solid #C0C0C0",
                    }}
                  >
                    {formatDate(task.endTime)}
                  </td>
                  <td
                    style={{
                      padding: "2px 20px",
                      textAlign: "center",
                      border: "2px solid #C0C0C0",
                    }}
                  >
                    {getTimeFinished(task.startTime, task.endTime)}
                  </td>
                  <td
                    style={{
                      padding: "3px 25px",
                      textAlign: "center",
                      border: "2px solid #C0C0C0",
                    }}
                  >
                    <button onClick={() => handleEditTask(task)}>
                      <MdEdit />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            // Table without data
            <tr>
              <td
                style={{
                  padding: "2px 20px",
                  textAlign: "center",
                  border: "2px solid #C0C0C0",
                }}
              >
                -
              </td>
              <td
                style={{
                  padding: "2px 20px",
                  textAlign: "center",
                  border: "2px solid #C0C0C0",
                }}
              >
                -
              </td>
              <td
                style={{
                  padding: "2px 20px",
                  textAlign: "center",
                  border: "2px solid #C0C0C0",
                }}
              >
                -
              </td>
              <td
                style={{
                  padding: "2px 20px",
                  textAlign: "center",
                  border: "2px solid #C0C0C0",
                }}
              >
                -
              </td>
              <td
                style={{
                  padding: "2px 20px",
                  textAlign: "center",
                  border: "2px solid #C0C0C0",
                }}
              >
                -
              </td>
              <td
                style={{
                  padding: "2px 20px",
                  textAlign: "center",
                  border: "2px solid #C0C0C0",
                }}
              >
                -
              </td>
              <td
                style={{
                  padding: "2px 20px",
                  textAlign: "center",
                  border: "2px solid #C0C0C0",
                }}
              >
                -
              </td>
              <td
                style={{
                  padding: "2px 20px",
                  textAlign: "center",
                  border: "2px solid #C0C0C0",
                }}
              >
                -
              </td>
              <td
                style={{
                  padding: "2px 20px",
                  textAlign: "center",
                  border: "2px solid #C0C0C0",
                }}
              >
                -
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </section>
  );
};

export default TaskList;
