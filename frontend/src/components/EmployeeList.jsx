import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/employees/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        console.log("Fetched employees:", response.data); // Log the response data

        // Ensure you access the correct data structure
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
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Employee List</h1>
      {employees.length > 0 ? (
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
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-4 py-2 border-b">{employee.id}</td>
                <td className="px-4 py-2 border-b">{employee.first_name} {employee.last_name}</td>
                <td className="px-4 py-2 border-b">{employee.email}</td>
                <td className="px-4 py-2 border-b">{employee.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="px-4 py-2 text-center">No employees found</div>
      )}
    </div>
  );
};

export default EmployeeList;
