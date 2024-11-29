import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { AppDispatch } from "../store/store";

import { fetchDashboard } from "../store/taskSlice";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const dashboardData = useSelector(
    (state: RootState) => state.taskStore.dashboardData,
  );

  const fetchData = async () => {
    await dispatch(fetchDashboard());
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
    fetchData();
  }, []);

  return (
    <>
      <section className="mx-10 my-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <h3 className="text-xl">Summary</h3>
        <ul className="flex gap-11 py-3">
          <li>
            <p className="text-center text-3xl font-bold text-purple-600">
              {dashboardData?.totalTask ?? 0}
            </p>
            <span className="text-sm">Total tasks</span>
          </li>
          <li>
            <p className="text-center text-3xl font-bold text-purple-600">
              {dashboardData?.completedTaskPercentage ?? 0}%
            </p>
            <span className="text-sm">Tasks completed</span>
          </li>
          <li>
            <p className="text-center text-3xl font-bold text-purple-600">
              {dashboardData?.pendingTaskPercentage ?? 0}%
            </p>
            <span className="text-sm">Tasks pending</span>
          </li>
          <li className="w-28">
            <p className="text-center text-3xl font-bold text-purple-600">
              {dashboardData?.avgTimePerCompletedTask ?? 0} hrs
            </p>
            <p className="text-center text-sm">
              Average time per completed task
            </p>
          </li>
        </ul>

        <h3 className="text-xl">Pending task summary</h3>
        <ul className="flex gap-8 py-3">
          <li>
            <p className="text-center text-3xl font-bold text-purple-600">
              {dashboardData?.pendingTasks ?? 0}
            </p>
            <span className="text-sm">Pending tasks</span>
          </li>
          <li>
            <p className="text-center text-3xl font-bold text-purple-600">
              {dashboardData?.totalTimeLapsed ?? 0} hrs
            </p>
            <span className="text-sm">Total time lapsed</span>
          </li>
          <li className="w-48">
            <p className="text-center text-3xl font-bold text-purple-600">
              {dashboardData?.totalTimeToFinish ?? 0} hrs
            </p>
            <p className="text-center text-sm">
              Total time to finish estimated based on endtime
            </p>
          </li>
        </ul>
      </section>

      <section className="mx-10 my-7">
        <table style={{ borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#71797E", color: "white" }}>
            <tr>
              <th style={{ padding: "0 20px", border: "2px solid #C0C0C0" }}>
                Task priority
              </th>
              <th style={{ padding: "0 20px", border: "2px solid #C0C0C0" }}>
                Pending tasks
              </th>
              <th style={{ padding: "0 20px", border: "2px solid #C0C0C0" }}>
                Time lapsed (hrs)
              </th>
              <th style={{ padding: "0 20px", border: "2px solid #C0C0C0" }}>
                Time to finish (hrs)
              </th>
            </tr>
          </thead>

          <tbody>
            {dashboardData?.dashboardTable ? (
              Object.entries(dashboardData.dashboardTable).map(
                ([key, value]) => (
                  <tr key={key}>
                    <td
                      style={{
                        padding: "2px 20px",
                        textAlign: "center",
                        border: "2px solid #C0C0C0",
                      }}
                    >
                      {key}
                    </td>
                    <td
                      style={{
                        padding: "2px 20px",
                        textAlign: "center",
                        border: "2px solid #C0C0C0",
                      }}
                    >
                      {value.priorityCount}
                    </td>
                    <td
                      style={{
                        padding: "2px 20px",
                        textAlign: "center",
                        border: "2px solid #C0C0C0",
                      }}
                    >
                      {value.timeLapsed}
                    </td>
                    <td
                      style={{
                        padding: "2px 20px",
                        textAlign: "center",
                        border: "2px solid #C0C0C0",
                      }}
                    >
                      {value.timeToFinish}
                    </td>
                  </tr>
                ),
              )
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
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default Dashboard;
