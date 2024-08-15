import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaChartPie } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { ToastContainer } from "react-toastify";

const AdminDashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/employees/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        const departmentResponse = await axios.get(
          "http://127.0.0.1:8000/api/departments/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        const employees = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        const departmentsData = Array.isArray(departmentResponse.data)
          ? departmentResponse.data
          : departmentResponse.data.results || [];

        setDepartments(departmentsData);
        setTotalEmployees(employees.length);
        setTotalDepartments(departmentsData.length); // Update with the length of the fetched departments
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("Unable to fetch employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading)
    return <div className="text-center p-6 text-white">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 text-black">
      <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="flex justify-end items-center mb-4">
          <div className="bg-white p-4 rounded-lg shadow-lg text-black">
            Good Morning {currentUser.first_name} {currentUser.last_name} 🌳
          </div>
        </div>
        <Link to={"/admin/employees"}>
          <div className="bg-white p-4 hover:bg-gray-100 rounded-lg shadow-md flex items-center">
            <FaUsers size={40} className="text-black mr-4" />
            <div>
              <p className="text-xl font-semibold">Total Employees</p>
              <p className="text-2xl">{totalEmployees}</p>
            </div>
          </div>
        </Link>
        <Link to={"/admin/departments"}>
          <div className="bg-white p-4 hover:bg-gray-100 rounded-lg shadow-md flex items-center">
            <FaChartPie size={40} className="text-black mr-4" />
            <div>
              <p className="text-xl font-semibold">Department Distribution</p>
              <p className="text-2xl">{totalDepartments} Departments</p>
            </div>
          </div>
        </Link>
      </div>
      <div className="mb-4 flex justify-between items-center">
        <Link
          to="/admin/employees"
          className="px-4 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition duration-200"
        >
          Manage Employees
        </Link>
        <Link
          to="/admin/employees/add"
          className="px-4 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition duration-200"
        >
          Add Employee
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
