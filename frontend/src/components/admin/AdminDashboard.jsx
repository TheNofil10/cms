import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import {
  FaTasks,
  FaCalendarAlt,
  FaTrash,
  FaCalendar,
  FaTachometerAlt,
  FaSpinner,
  FaPlus,
  FaCheck,
  FaTimes,
  FaUsers,
  FaRegBuilding,
} from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import "react-toastify/dist/ReactToastify.css";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import API from "../../api/api";
ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [employeeCount, setEmployeeCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quote, setQuote] = useState(
    "If you seek truth, you will not seek victory by dishonorable means, and if you find truth you will become invincible."
  );
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const SERVER_URL = API;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeResponse = await axios.get(
          `${SERVER_URL}/employees/${currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setEmployeeData(employeeResponse.data);

        const employeesResponse = await axios.get(
          `${SERVER_URL}/employees/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setEmployeeCount(employeesResponse.data.length);

        const departmentResponse = await axios.get(
          `${SERVER_URL}/departments/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setDepartmentCount(departmentResponse.data.length);

        const today = new Date();
        const oneWeekAgo = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];

        const attendanceResponse = await axios.get(
          `${SERVER_URL}/attendance/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            params: {
              start_date: oneWeekAgo,
              end_date: new Date().toISOString().split('T')[0],
            },
          }
        );
        setAttendance(attendanceResponse.data);

        const todoResponse = await axios.get(`${SERVER_URL}/todos/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setTodoList(todoResponse.data);

        setPerformanceMetrics({
          tasksCompleted: 12,
          goalsMet: 5,
          feedbackScore: 8.5,
        });

        setQuote(
          "If you seek truth, you will not seek victory by dishonorable means, and if you find truth you will become invincible."
        );
      } catch (error) {
        setError("Unable to fetch data.");
        console.log(error);
        toast.error("Unable to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser.id]);

  const handleAddTodo = async () => {
    if (newTodo.trim()) {
      try {
        console.log({ task: newTodo, status: "pending" });
        const response = await axios.post(
          `${SERVER_URL}/todos/`,
          { task: newTodo, status: "pending", employee: currentUser.id },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setTodoList([...todoList, response.data]);
        setNewTodo("");
      } catch (error) {
        console.log(error);
        toast.error("Unable to add new task.");
      }
    }
  };

  const handleCompleteTodo = async (id) => {
    try {
      const updatedTodo = todoList.find((todo) => todo.id === id);
      const response = await axios.patch(
        `${SERVER_URL}/todos/${id}/`,
        { status: "completed" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setTodoList(
        todoList.map((todo) =>
          todo.id === id ? { ...todo, status: response.data.status } : todo
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Unable to update task status.");
    }
  };

  const handleCancelTodo = async (id) => {
    try {
      const response = await axios.patch(
        `${SERVER_URL}/todos/${id}/`,
        { status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setTodoList(
        todoList.map((todo) =>
          todo.id === id ? { ...todo, status: response.data.status } : todo
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Unable to update task status.");
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${SERVER_URL}/todos/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setTodoList(todoList.filter((todo) => todo.id !== id));
    } catch (error) {
      console.log(error);
      toast.error("Unable to delete task.");
    }
  };

  const getAttendanceStats = () => {
    const stats = {
      days_present: 0,
      days_absent: 0,
      days_late: 0,
      total_leaves: 0,
    };
    attendance.forEach((record) => {
      if (record.status === "present") stats.days_present += 1;
      else if (record.status === "absent") stats.days_absent += 1;
      else if (record.status === "late") stats.days_late += 1;
      else if (record.status === "leave") stats.total_leaves += 1;
    });
    return stats;
  };

  const stats = getAttendanceStats();

  const pieChartData = {
    labels: ["Present", "Absent", "Late", "Leaves"],
    datasets: [
      {
        data: [
          stats.days_present,
          stats.days_absent,
          stats.days_late,
          stats.total_leaves,
        ],
        backgroundColor: ["#1DB954", "#FF6384", "#FFCE56", "#ACD8AA"],
        hoverBackgroundColor: ["#1DB954", "#FF6384", "#FFCE56", "#ACD8AA"],
      },
    ],
  };
  const handleViewAttendance = () => {
    navigate('/admin/attendance');
  };
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    else if (hour < 18) return "Good Afternoon";
    else return "Good Evening";
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-black">
        <FaSpinner className="animate-spin text-3xl" />
      </div>
    );
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="flex bg-gray-100 min-h-screen flex-col">
      {/* Top Nav Bar */}
      <header className="bg-black text-white p-5 shadow-md">
      <div className="w-full flex justify-between items-center">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto rounded-xl">
          <div className="text-xl font-semibold mb-4">
            {getGreeting()} {currentUser.first_name} {currentUser.last_name}
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-6">
            {/* Tasks Summary */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">
                Employees & Departments
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                  <p className="text-gray-600">
                    <FaUsers className="mb-1 inline" /> Employees:
                  </p>
                  <p className="font-bold">{employeeCount} </p>
                </div>
                <div className="flex justify-between items-center border-b border-gray-300 pb-2">
                  <p className="text-gray-600">
                    <FaRegBuilding className="mb-1 inline" /> Departments:
                  </p>
                  <p className="font-bold">{departmentCount}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow-md space-y-4">

                  <Link
                    to="/admin/employees"
                    className="text-center bg-black text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2"
                  >
                    <FaUsers className="text-xl" />
                    <span>Manage Employees</span>
                  </Link>
                  <Link
                    to="/admin/departments"
                    className="text-center bg-black text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2"
                  >
                    <FaRegBuilding className="text-xl" />
                    <span>Manage Departments</span>
                  </Link>
                  <Link
                    to="/admin/attendance"
                    className="text-center bg-black text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2"
                  >
                    <FaCalendar className="text-xl" />
                    <span>Manage Attendance</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Notifications */}
            {/* <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Notifications</h2>
              {notifications.length > 0 ? (
                <ul className="space-y-4">
                  {notifications.map((note, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b border-gray-300 pb-2"
                    >
                      <p>{note.message}</p>
                      <button
                        onClick={() => handleDismissNotification(index)}
                        className="text-red-500"
                      >
                        <FaTimes />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notifications</p>
              )}
            </div> */}

            {/* Attendance Summary */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Attendance Summary</h2>
              <Pie data={pieChartData} />

            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className="bg-white p-2 max-w-64">
          {/* Profile Section */}

          {/* To-Do List */}
          <div className="bg-gray-200 p-4 rounded-lg">
            <h2 className="text-xl font-semibold">To-Do List</h2>
            <div className="mb-4">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add new task..."
                className="border rounded-lg p-2 w-full"
              />
              <button
                onClick={handleAddTodo}
                className="bg-green-500 text-white items-center px-4 py-2 rounded-md mt-2"
              >
                <FaPlus className="inline-flex space-x-5" /> Add Task
              </button>
            </div>
            <ul className="space-y-4">
              {todoList.map((todo) => (
                <li
                  key={todo.id}
                  className="flex justify-between items-center border-b border-gray-300 pb-2"
                >
                  <span
                    className={`flex-1 ${todo.status === "completed"
                        ? "line-through text-gray-500"
                        : ""
                      }`}
                  >
                    {todo.task}
                  </span>
                  <div className="flex items-center space-x-2">
                    {todo.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleCompleteTodo(todo.id)}
                          className="text-green-500"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => handleCancelTodo(todo.id)}
                          className="text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        
      </div>
    </div>
  );
};

export default AdminDashboard;
