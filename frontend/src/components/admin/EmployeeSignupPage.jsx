import React, { useEffect, useState } from "react";
import axios from "axios";
import Signup from "./SignUp";
import { FaBuilding, FaSpinner, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import SmallEmployeeCard from "./SmallEmployeeCard";
import API from "../../api/api";

const EmployeeSignupPage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // State to toggle sidebar visibility

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API}/employees/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setEmployees(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("There was an error fetching the employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API}/departments/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setDepartments(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError("There was an error fetching the department data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading)
    return (
      <div className="text-center">
        <FaSpinner className="animate-spin" />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full">
      {/* Header */}
      <header className="bg-black text-white p-5 shadow-md w-full">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Add Employee</h1>
        </div>
      </header>

      <div className="flex h-screen bg-white">
        {/* Signup Form Section */}
        <div className={`flex-1 ${isSidebarCollapsed ? "w-full" : "w-3/4"} flex flex-col`}>
          <div className="bg-white rounded-lg flex-1">
            <Signup />
          </div>
        </div>

        {/* Sidebar Section */}
        {!isSidebarCollapsed && (
          <div className="w-1/4 flex flex-col">
            <div className="bg-white p-4 rounded-lg h-64 shadow-lg flex-1 overflow-y-auto mb-4">
              <h2 className="text-xl font-bold mb-2">Latest Employees</h2>
              <div className="grid grid-cols-1 gap-4">
                {employees.map(
                  (employee) =>
                    !employee.is_hr_manager &&
                    !employee.is_superuser && (
                      <div key={employee.id} className="flex items-center mb-2">
                        <div className="flex-1">
                          <SmallEmployeeCard employee={employee} />
                        </div>
                        {/* Display Employee Name and ID */}
                        <div className="ml-4">
                          <p className="font-semibold">{employee.name}</p>
                          <p className="text-gray-500">ID: {employee.id}</p>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>

            <div className="bg-white p-4 shadow-lg h-64 rounded-lg flex-1 overflow-y-auto">
              <h2 className="text-xl font-bold mb-2">Departments</h2>
              {departments.length === 0 ? (
                <p>No departments available</p>
              ) : (
                <ul>
                  {departments.map((department) => (
                    <li key={department.id} className="flex items-center mb-2">
                      <FaBuilding className="mr-2" />
                      <div className="flex-1">{department.name || "No Department Name"}</div>
                      <span className="text-gray-500 ml-2">ID: {department.id}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Toggle Button */}
        <button
          className="absolute top-20 right-4 p-2 bg-black text-white rounded-lg shadow-md z-10"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        >
          {isSidebarCollapsed ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>
    </div>
  );
};

export default EmployeeSignupPage;
