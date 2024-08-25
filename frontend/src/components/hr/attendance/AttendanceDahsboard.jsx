import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners"; // Import a spinner from react-spinners

Chart.register(...registerables);

const AttendanceDashboard = () => {
  const { currentUser } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({});
  const [startDate, setStartDate] = useState("2024-08-01");
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedEmployeeUsername, setSelectedEmployeeUsername] = useState("");
  const [searchType, setSearchType] = useState("id");

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        const statsResponse = await axios.get(
          "http://127.0.0.1:8000/api/attendance/stats/company/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            params: {
              start_date: startDate,
              end_date: endDate,
              employee_id: searchType === "id" ? selectedEmployeeId : "",
              username:
                searchType === "username" ? selectedEmployeeUsername : "",
            },
          }
        );
        setStats(statsResponse.data);
        const attendanceResponse = await axios.get(
          "http://127.0.0.1:8000/api/attendance/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            params: {
              start_date: startDate,
              end_date: endDate,
              employee_id: searchType === "id" ? selectedEmployeeId : "",
              username:
                searchType === "username" ? selectedEmployeeUsername : "",
            },
          }
        );

        const filteredData = attendanceResponse.data.filter(
          (entry) =>
            new Date(entry.date) >= new Date(startDate) &&
            new Date(entry.date) <= new Date(endDate)
        );

        setAttendanceData(filteredData);
      } catch (error) {
        toast.error("Error fetching attendance data");
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
        console.log(stats);
      }
    };

    fetchAttendanceData();
  }, [
    selectedEmployeeId,
    selectedEmployeeUsername,
    searchType,
    startDate,
    endDate,
  ]);

  const handleApply = () => {
    if (!selectedEmployeeId && !selectedEmployeeUsername) {
      toast.error("Please enter either Employee ID or Username.");
      return;
    }
    if (selectedEmployeeId && selectedEmployeeUsername) {
      toast.error(
        "Please enter only one filter at a time (either ID or Username)."
      );
      return;
    }
    if (selectedEmployeeId) {
      setSearchType("id");
    } else if (selectedEmployeeUsername) {
      setSearchType("username");
    }
  };

  const handleClear = () => {
    setSelectedEmployeeId("");
    setSelectedEmployeeUsername("");
    setSearchType("");
  };

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
      {
        label: "Additional Metric 1", // Replace with actual metric name
        data: Array(attendanceData.length).fill(stats.additional_metric_1 || 0),
        backgroundColor: "rgba(255, 99, 71, 0.6)", // Example color
      },
      {
        label: "Additional Metric 2", // Replace with actual metric name
        data: Array(attendanceData.length).fill(stats.additional_metric_2 || 0),
        backgroundColor: "rgba(0, 255, 255, 0.6)", // Example color
      },
    ],
  };

  const pieChartData = {
    labels: [
      "Present",
      "Absent",
      "Late",
      "Sick Leave",
      "Casual Leave",
      "Additional Metric 1",
      "Additional Metric 2",
    ],
    datasets: [
      {
        data: [
          stats.days_present || 0,
          stats.days_absent || 0,
          stats.days_late || 0,
          stats.sick_leave || 0,
          stats.casual_leave || 0,
          stats.additional_metric_1 || 0,
          stats.additional_metric_2 || 0,
        ],
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#9966FF",
          "#FF9F40",
          "#FF6F61",
          "#6B5B95",
        ],
        hoverBackgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#9966FF",
          "#FF9F40",
          "#FF6F61",
          "#6B5B95",
        ],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Attendance Dashboard</h1>

      {/* Employee Selector */}
      <div className="bg-white p-4 rounded-lg shadow grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter Employee ID"
            value={selectedEmployeeId}
            onChange={(e) => {
              setSelectedEmployeeId(e.target.value);
              setSearchType("id");
            }}
            className="border p-2 rounded-lg w-full"
          />
          <input
            type="text"
            placeholder="Enter Employee Username"
            value={selectedEmployeeUsername}
            onChange={(e) => {
              setSelectedEmployeeUsername(e.target.value);
              setSearchType("username");
            }}
            className="border p-2 rounded-lg w-full"
          />
          <button
            onClick={handleApply}
            className="bg-blue-500 text-white p-2 rounded-lg"
          >
            Apply
          </button>
          <button
            onClick={handleClear}
            className="bg-gray-500 text-white p-2 rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
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

      {/* Statistics Section */}

      {/* Charts */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader color="black" size={100} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Present</h2>
                <p className="text-2xl">{stats.days_present || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Absent</h2>
                <p className="text-2xl">{stats.days_absent || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Sick Leaves</h2>
                <p className="text-2xl">{stats.sick_leave || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Casual Leaves</h2>
                <p className="text-2xl">{stats.casual_leave || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Late</h2>
                <p className="text-2xl">{stats.days_late || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Overtime Hours</h2>
                <p className="text-2xl">{stats.overtime_hours || 0}</p>
              </div>
            </div>
            {/* <div>
              <h2 className="text-xl font-semibold">Attendance Overview</h2>
              <Bar data={barChartData} options={{ responsive: true }} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Attendance Trends</h2>
              <Line data={lineChartData} options={{ responsive: true }} />
            </div> */}

            <div className="flex justify-center" style={{ height: "400px" }}>
              <h2 className="text-xl text-center font-semibold">
                Attendance Distribution
              </h2>
              <Pie data={pieChartData} options={{ responsive: true }} />
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default AttendanceDashboard;
