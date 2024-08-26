import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

Chart.register(...registerables);

const EmployeeAttendanceDashboard = () => {
  const { currentUser } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({});
  const [startDate, setStartDate] = useState("2024-08-01");
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const statsResponse = await axios.get(
          "http://127.0.0.1:8000/api/attendance/stats/employee/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            params: {
              start_date: startDate,
              end_date: endDate,
            },
          }
        );
        setStats(statsResponse.data);
        console.log(statsResponse.data);

        // Fetching attendance data
        const attendanceResponse = await axios.get(
          "http://127.0.0.1:8000/api/attendance/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            params: {
              start_date: startDate,
              end_date: endDate,
            },
          }
        );

        // Filtering attendance data based on date range
        const filteredData = attendanceResponse.data.filter(
          (entry) =>
            new Date(entry.date) >= new Date(startDate) &&
            new Date(entry.date) <= new Date(endDate)
        );

        setAttendanceData(filteredData);
      } catch (error) {
        toast.error("Error fetching attendance data");
        console.error("Error fetching attendance data:", error);
      }
    };

    fetchAttendanceData();
  }, [currentUser, startDate, endDate]);

  const lineChartData = {
    labels: attendanceData.map((entry) => entry.date),
    datasets: [
      {
        label: "Hours Worked",
        data: attendanceData.map((entry) => entry.hours_worked),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: attendanceData.map((entry) => entry.date),
    datasets: [
      {
        label: "Days Present",
        data: attendanceData.map((entry) =>
          entry.status === "Present" ? 1 : 0
        ),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Days Absent",
        data: attendanceData.map((entry) =>
          entry.status === "Absent" ? 1 : 0
        ),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
      {
        label: "Days Late",
        data: attendanceData.map((entry) => (entry.status === "Late" ? 1 : 0)),
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
      {
        label: "Sick Leave",
        data: Array(attendanceData.length).fill(stats.sick_leave || 0),
        backgroundColor: "rgba(153, 102, 255, 0.6)",
      },
      {
        label: "Casual Leave",
        data: Array(attendanceData.length).fill(stats.casual_leave || 0),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
      },
    ],
  };

  const pieChartData = {
    labels: ["Present", "Absent", "Late", "Leaves"],
    datasets: [
      {
        data: [
          stats.days_present || 0,
          stats.days_absent || 0,
          stats.days_late || 0,
          stats.total_leaves,
        ],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#9966FF"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#9966FF"],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Employee Attendance Dashboard</h1>

      <div className="bg-white p-4 rounded-lg shadow grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="start-date" className="block text-lg font-semibold">
            Start Date:
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded-lg w-full"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-lg font-semibold">
            End Date:
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded-lg w-full"
          />
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Days Present</h2>
          <p className="text-2xl">{stats.days_present || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Days Absent</h2>
          <p className="text-2xl">{stats.days_absent || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Leaves</h2>
          <p className="text-2xl">{stats.total_leaves || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Days Late</h2>
          <p className="text-2xl">{stats.days_late || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Overtime Hours</h2>
          <p className="text-2xl">{stats.overtime_hours || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Sick Leaves</h2>
          <p className="text-2xl">{stats.sick_leave || 0}</p>
        </div>
        {stats.casual_leave && stats.casual_leave !== 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Casual Leaves</h2>
            <p className="text-2xl">{stats.casual_leave || 0}</p>
          </div>
        )}
        {stats.annual_leave && stats.annual_leave !== 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Annual Leaves</h2>
            <p className="text-2xl">{stats.annual_leave || 0}</p>
          </div>
        )}
        {stats.other_leaves && stats.other_leaves !== 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Other Leaves</h2>
            <p className="text-2xl">{stats.other_leaves || 0}</p>
          </div>
        )}
        {stats.overtime_hours && stats.overtime_hours !== 0 && (
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold">Overtime Hours</h2>
            <p className="text-2xl">{stats.overtime_hours || 0}</p>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <div className="py-5">
          <div className="bg-white p-4 " style={{ height: "400px" }}>
            <h2 className="text-lg font-semibold">Hours Worked</h2>
            <Line
              data={lineChartData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
        <div className="p-5">
          <div className="bg-white p-4 " style={{ height: "400px" }}>
            <h2 className="text-lg font-semibold">Overview</h2>
            <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </section>

      <ToastContainer />
    </div>
  );
};

export default EmployeeAttendanceDashboard;
