import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

import API from "../../../api/api";
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
          `${API}/attendance/stats/company/`,
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
  ]);

  const handleEmployeeSearch = async (query) => {
    if (!query) {
      setEmployeeSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `${API}/employee-suggestions/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            q: query,
          },
        }
      );
      setEmployeeSuggestions(response.data);
    } catch (error) {
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
    <div>

      <div className="max-w-full mx-auto px-5 space-y-2 overflow-hidden">
        <div className="grid grid-cols-2">
          {/* Employee Selector */}
          <div className="bg-white p-2 rounded-lg shadow-sm mb-2">
            <div className="flex flex-col md:flex-row items-center md:space-x-2 space-y-2 md:space-y-0">
              <div className="relative w-full md:w-2/3">
                <label
                  htmlFor="start-date"
                  className="block text-sm font-semibold mb-1"
                >
                  Search:
                </label>
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
                  className="border p-2 rounded-lg w-full text-sm"
                />
                {employeeSuggestions.length > 0 && (
                  <ul className="absolute bg-white border rounded-lg w-full mt-1 z-10 max-h-40 overflow-y-auto text-sm">
                    {employeeSuggestions.map(
                      (employee) =>
                        !employee.is_superuser && (
                          <li
                            key={employee.id}
                            onClick={() => {
                              setSelectedEmployeeId(employee.id);
                              setSelectedEmployeeUsername("");
                              setEmployeeSuggestions([]);
                            }}
                            className="p-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <img
                              src={employee.profile_image}
                              alt="Profile"
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold text-sm">
                                {employee.first_name} {employee.last_name}
                              </p>
                              <p className="text-xs text-gray-600">
                                {employee.position}
                              </p>
                            </div>
                          </li>
                        )
                    )}
                  </ul>
                )}
              </div>
            </div>
          </div>

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
        </div>
        {/* Statistics and Chart */}
        <div className="bg-white p-2 rounded-lg shadow-sm flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
          <div className="flex-1 space-y-2">
            {loading ? (
              <div className="flex justify-center items-center">
                <ClipLoader color="black" size={30} />
              </div>
            ) : (
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
            )}
          </div>
          <div
            className="flex-1 flex items-center justify-center"
            style={{ height: "300px" }}
          >
            <Pie data={pieChartData} />
          </div>
        </div>

        
      </div>

    </div>

  );
};

export default AttendanceDashboard;
