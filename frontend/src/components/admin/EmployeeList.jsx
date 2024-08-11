import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeProfile from "./EmployeeProfile"; // New component
import EmployeeCard from "./EmployeeCard"; // New component
import EmployeeFilters from "./EmployeeFilters"; // New component
import EmployeeSorting from "./EmployeeSorting"; // New component
import EmployeeSearch from "./EmployeeSearch"; // New component
import { toast, ToastContainer } from "react-toastify";
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("table"); // "table" or "card"
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

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
        console.log("Fetched employees:", response.data); // Log the response data
        setEmployees(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("There was an error fetching the employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/employees/${employeeId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      toast.error("Employee deleted successfully");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Employee not found");
      } else {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const filteredEmployees = employees
    .filter(
      (emp) =>
        emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((emp) => {
      // Add your filtering logic based on `filters`
      return true; // This should be replaced with actual filter logic
    });

  // Sorting logic should be added here

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Employee List</h1>
      <div className="mb-4">
        <EmployeeSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <EmployeeFilters filters={filters} setFilters={setFilters} />
        <EmployeeSorting />
        <button onClick={() => handleViewChange("table")}>Table View</button>
        <button onClick={() => handleViewChange("card")}>Card View</button>
      </div>
      {selectedEmployee && (
        <EmployeeProfile
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onDelete={() => handleDeleteEmployee(selectedEmployee.id)}
        />
      )}
      {view === "table" ? (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID</th>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Position</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <tr
                  key={employee.id}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <td className="px-4 py-2 border-b">{employee.id}</td>
                  <td className="px-4 py-2 border-b">
                    {employee.first_name} {employee.last_name}
                  </td>
                  <td className="px-4 py-2 border-b">{employee.email}</td>
                  <td className="px-4 py-2 border-b">{employee.position}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-2 border-b text-center">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                onClick={() => handleEmployeeClick(employee)}
              />
            ))
          ) : (
            <div className="text-center col-span-full">No employees found</div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default EmployeeList;
