import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
const EmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/employees/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setEmployee(response.data);
        toast.success("Employee data loaded successfully");
      } catch (error) {
        console.error("Error fetching employee:", error);
        setError("Unable to fetch employee data.");
        toast.error("Failed to load employee data");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleDeleteProfile = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/employees/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      toast.error("Employee profile deleted successfully");
      navigate("/admin/employees");
    } catch (error) {
      console.error("Error deleting profile:", error);
      toast.error("Failed to delete employee profile");
    }
  };

  const handleUpdateProfile = () => {
    if (currentUser && currentUser.is_superuser) {
      toast.error("Admins cannot update their own profiles");
    } else {
      navigate(`/admin/employees/${id}/update`);
    }
  };

  if (loading) return <div className="text-center p-6 text-black">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-white text-black min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">{employee.first_name} {employee.last_name}</h1>
      <div className="flex justify-center">
        {employee.profile_image ? (
          <img
            src={employee.profile_image}
            alt={`${employee.first_name} ${employee.last_name}`}
            className="w-32 h-32 rounded-full"
          />
        ) : (
          <FaUserCircle size={128} className="text-gray-500" />
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p>Email: {employee.email}</p>
          <p>Position: {employee.position}</p>
          <p>Department: {employee.department}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <p>Phone: {employee.phone}</p>
          <p>Address: {employee.address}</p>
        </div>
      </div>
      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={handleUpdateProfile}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Update Profile
        </button>
        <button
          onClick={handleDeleteProfile}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Delete Profile
        </button>
        <button
          onClick={() => navigate("/admin/employees")}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Back to Employees List
        </button>
      </div>
    </div>
  );
};

export default EmployeeProfile;
