import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

const EmployeeDashboard = () => {
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/employees/${currentUser.id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setEmployeeData(response.data);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setError("Unable to fetch employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [currentUser.id]);

  if (loading) return <div className="text-center p-6 text-white">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 text-black">
      <h1 className="text-4xl font-bold mb-6 text-center">Employee Dashboard</h1>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold">Welcome, {employeeData.first_name}!</h2>
        <p className="text-lg mt-2">Department: {employeeData.department}</p>
        <p className="text-lg mt-2">Position: {employeeData.position}</p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;