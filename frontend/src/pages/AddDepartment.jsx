import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBuilding, FaSpinner } from "react-icons/fa";
import AddDepartmentForm from "../components/admin/AddDepartmentForm";
import SmallEmployeeCard from "../components/admin/SmallEmployeeCard";
import API from "../api/api";
const AddDepartment = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${API}/employees/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
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
        const response = await axios.get(
          `${API}/departments/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
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
    <div className="flex p-4 bg-white max-h-screen">
      <div className="w-3/4">
        <div className="bg-white rounded-lg">
          <AddDepartmentForm />
        </div>
      </div>
      <div className="w-1/4 max-h-fit flex flex-col">
        <div className="bg-white p-4 rounded-lg shadow-lg flex-1 overflow-y-auto mb-4">
          <h2 className="text-xl font-bold mb-2">Latest Employees</h2>
          <div className="grid grid-cols-1  gap-4">
            {employees.map(
              (employee) =>
                !employee.is_hr_manager &&
                !employee.is_superuser && (
                  <SmallEmployeeCard key={employee.id} employee={employee} />
                )
            )}
          </div>
        </div>
        <div className="bg-white p-4 shadow-lg rounded-lg flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">Departments</h2>
          {departments.length === 0 ? (
            <p>No departments available</p>
          ) : (
            <ul>
              {departments.map((department) => (
                <li key={department.id} className="flex items-center mb-2">
                  <FaBuilding className="mr-2" />
                  {department.name || "No Department Name"} {" "}
                  ID: {department.id}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
