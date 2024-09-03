import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";
const api = 'http://127.0.0.1:8000'
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
  const [employeeSuggestions, setEmployeeSuggestions] = useState([]);
  
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
        // const attendanceResponse = await axios.get(
        //   "http://127.0.0.1:8000/api/attendance/",
        //   {
        //     headers: {
        //       Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        //     },
        //     params: {
        //       start_date: startDate,
        //       end_date: endDate,
        //       employee_id: searchType === "id" ? selectedEmployeeId : "",
        //       username:
        //         searchType === "username" ? selectedEmployeeUsername : "",
        //     },
        //   }
        // );

        // const filteredData = attendanceResponse.data.filter(
        //   (entry) =>
        //     new Date(entry.date) >= new Date(startDate) &&
        //     new Date(entry.date) <= new Date(endDate)
        // );

        // setAttendanceData(filteredData);
      } catch (error) {
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
  ]);;

  const handleEmployeeSearch = async (query) => {
    if (!query) {
      setEmployeeSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/employee-suggestions/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            q: query,
          },
        }
      );
      console.log(response.data)
      setEmployeeSuggestions(response.data);
    } catch (error) {
      console.log(employeeSuggestions)
      console.error("Error fetching employee suggestions:", error);
    }
  };

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
    setEmployeeSuggestions([]);
    setSearchType("");
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
    <div className="max-w-7xl px-5 mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Attendance Dashboard</h1>

      {/* Employee Selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Enter Employee ID or Name"
              value={selectedEmployeeId || selectedEmployeeUsername}
              onChange={(e) => {
                const query = e.target.value;
                setSelectedEmployeeId(query);
                setSelectedEmployeeUsername(query);
                handleEmployeeSearch(query);
              }}
              className="border p-2 rounded-lg w-full"
            />
            {employeeSuggestions.length > 0 && (
              <ul className="absolute bg-white border rounded-lg w-full mt-1 z-10 max-h-60 overflow-y-auto">
                {employeeSuggestions.map((employee) => (
                  (!employee.is_superuser && <li
                    key={employee.id}
                    onClick={() => {
                      setSelectedEmployeeId(employee.id);
                      setSelectedEmployeeUsername("");
                      setEmployeeSuggestions([]);
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-200 flex items-center space-x-2"
                  >
                    <img
                      src={employee.profile_image}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">
                        {employee.first_name} {employee.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {employee.position}
                      </p>
                    </div>
                  </li>)
                ))}
              </ul>
            )}
          </div>
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
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Casual Leaves</h2>
                <p className="text-2xl">{stats.casual_leave || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Annual Leaves</h2>
                <p className="text-2xl">{stats.annual_leave || 0}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold">Other Leaves</h2>
                <p className="text-2xl">{stats.other_leaves || 0}</p>
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
