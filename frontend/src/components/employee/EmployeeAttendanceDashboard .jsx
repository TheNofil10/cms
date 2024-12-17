import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../api/api";
Chart.register(...registerables);

const EmployeeAttendanceDashboard = () => {
  const { currentUser } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({});
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  });
  
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const statsResponse = await axios.get(
          `${API}/attendance/stats/employee/`,
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
           ` ${API}/attendance/ `,
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
    <div className="max-w-full mx-auto space-y-2 overflow-hidden">
      {/* Date Range Selector */}
      <div className="bg-white p-2 rounded-lg shadow-sm mb-2 grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <label
            htmlFor="start-date"
            className="block text-sm font-semibold mb-1"
          >
            Start Date:
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded-lg w-full text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="end-date"
            className="block text-sm font-semibold mb-1"
          >
            End Date:
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded-lg w-full text-sm"
          />
        </div>
      </div>

      {/* Statistics and Chart */}
      <div className="bg-white p-2 rounded-lg shadow-sm flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
        <div className="flex-1 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 p-2 rounded-lg shadow-sm text-md">
              <h2 className="font-semibold">Total Days</h2>
              <p className="text-lg">{stats.total_days || 0}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg shadow-sm text-md">
              <h2 className="font-semibold">Present Days</h2>
              <p className="text-lg">{stats.days_present || 0}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg shadow-sm text-md">
              <h2 className="font-semibold">Days Absent</h2>
              <p className="text-lg">{stats.days_absent || 0}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg shadow-sm text-md">
              <h2 className="font-semibold">Days Late</h2>
              <p className="text-lg">{stats.days_late || 0}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg shadow-sm text-md">
              <h2 className="font-semibold">Hours Worked</h2>
              <p className="text-lg">{stats.hours_worked || 0}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg shadow-sm text-md">
              <h2 className="font-semibold">Average Hours/Day</h2>
              <p className="text-lg">{stats.average_hours_per_day || 0}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg shadow-sm text-md">
              <h2 className="font-semibold">Overtime Hours</h2>
              <p className="text-lg">{stats.overtime_hours || 0}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg shadow-sm text-md">
              <h2 className="font-semibold">Total Leave</h2>
              <p className="text-lg">{stats.total_leaves || 0}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg shadow-sm text-md">
              <h2 className="font-semibold">Sick Leave</h2>
              <p className="text-lg">{stats.sick_leave || 0}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded-lg shadow-sm text-md">
              <h2 className="font-semibold">Casual Leave</h2>
              <p className="text-lg">{stats.casual_leave || 0}</p>
            </div>
          </div>
        </div>
        <div
          className="flex-1 flex items-center justify-center"
          style={{ height: "300px" }}
        >
          <Pie data={pieChartData} />
        </div>
      </div>

      
    </div>
  );
};

export default EmployeeAttendanceDashboard;
