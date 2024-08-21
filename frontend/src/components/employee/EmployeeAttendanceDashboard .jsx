import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

Chart.register(...registerables);

const EmployeeAttendanceDashboard = () => {
  const { currentUser } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [stats, setStats] = useState({});
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/attendance/stats/employee/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          params: {
            start_date: startDate,
            end_date: endDate,
          }
        });
        setStats(response.data);
        console.log(response.data);
      } catch (error) {
        toast.error("Error fetching attendance data");
        console.error("Error fetching attendance data:", error);
      }
    };
    
    fetchAttendanceData();
  }, [currentUser, startDate, endDate]);

  const lineChartData = {
    labels: attendanceData.map(entry => entry.date),
    datasets: [
      {
        label: 'Hours Worked',
        data: attendanceData.map(entry => entry.hours_worked),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const barChartData = {
    labels: attendanceData.map(entry => entry.date),
    datasets: [
      {
        label: 'Days Present',
        data: attendanceData.map(entry => entry.status === 'Present' ? 1 : 0),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
      {
        label: 'Days Absent',
        data: attendanceData.map(entry => entry.status === 'Absent' ? 1 : 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Days Late',
        data: attendanceData.map(entry => entry.status === 'Late' ? 1 : 0),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
    ],
  };

  const pieChartData = {
    labels: ['Present', 'Absent', 'Late'],
    datasets: [
      {
        data: [
          stats.days_present,
          stats.days_absent,
          stats.days_late,
        ],
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
        hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Employee Attendance Dashboard</h1>
      
      {/* Date Range Filter */}
      <div className="bg-white p-4 rounded-lg shadow">
        <label htmlFor="start-date" className="block text-lg font-semibold">Start Date:</label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />
        <label htmlFor="end-date" className="block text-lg font-semibold mt-2">End Date:</label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 rounded-lg w-full"
        />
      </div>
      
      {/* Overview Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Days</h2>
          <p className="text-2xl">{stats.total_days || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Days Present</h2>
          <p className="text-2xl">{stats.days_present || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Days Absent</h2>
          <p className="text-2xl">{stats.days_absent || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Days Late</h2>
          <p className="text-2xl">{stats.days_late || 0}</p>
        </div>
      </section>

      {/* Charts Section */}
      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold">Attendance Overview</h2>
        <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </section>

      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold">Attendance Breakdown</h2>
        <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </section>

      <section className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold">Attendance Distribution</h2>
        <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </section>

      <ToastContainer />
    </div>
  );
};

export default EmployeeAttendanceDashboard;
