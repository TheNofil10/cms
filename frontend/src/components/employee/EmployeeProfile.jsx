import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaUserCircle,
  FaUserTie,
  FaRegBuilding,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
} from "react-icons/fa";
import UpdateProfileForm from "./UpdateProfileForm";
import { defaultOrderByFn } from "react-table";
import { ToastContainer } from "react-toastify";

const EmployeeProfile = () => {
  const { currentUser } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchEmployee = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/employees/${currentUser.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setEmployee(response.data);

      // Fetch department details if needed

      const departmentResponse = await axios.get(
        `http://127.0.0.1:8000/api/department/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setDepartment(departmentResponse.data);
      console.log(departmentResponse.data);
    } catch (error) {
      console.error("Error fetching Employee data:", error);
      setError("Unable to fetch Employee data.");
    } finally {
      console.log(employee);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, [currentUser.id]);

  const handleUpdateProfile = () => {
    setIsEditing(true);
  };

  const handleCloseUpdateForm = () => {
    setIsEditing(false);
  };

  const handleProfileUpdated = async () => {
    await fetchEmployee(); // Refresh employee data
    setIsEditing(false);
  };

  if (loading)
    return <div className="text-center p-6 text-black">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      {/* Cover Photo */}
      <div className="relative mb-6 w-full h-48 bg-black rounded-lg shadow-lg flex items-center justify-center">
        <img
          src={employee.profile_image}
          alt={`${employee.first_name} ${
            employee.middle_name ? employee.middle_name + " " : ""
          }${employee.last_name}'s profile`}
          className="w-40 h-40 rounded-full border-4 border-white shadow-lg"
        />
      </div>

      {/* Profile Header */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            {employee.first_name}{" "}
            {employee.middle_name ? employee.middle_name + " " : ""}{" "}
            {employee.last_name}
          </h1>
          <p className="text-gray-600 text-lg flex items-center justify-center mb-2">
            <FaUserTie className="mr-2" /> {employee.position}
          </p>
          <p className="text-gray-600 text-lg flex items-center justify-center">
            <FaRegBuilding className="mr-2" />{" "}
            {department ? department.name : "Loading..."}
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-600 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-3xl font-semibold mb-4">About</h2>
        <p className="text-gray-700 text-lg">Position: {employee.position}</p>
        <p className="text-gray-700 text-lg">
          Department: {department ? department.name : "Loading..."}
        </p>
        <p className="text-gray-700 text-lg">
          Employment Date: {employee.employment_date}
        </p>
        <p className="text-gray-700 text-lg">
          Date of Birth: {employee.date_of_birth}
        </p>
        <p className="text-gray-700 text-lg">
          Manager:{" "}
          {department.manager
            ? `${department.manager.first_name} ${department.manager.last_name}`
            : "N/A"}
        </p>
      </div>

      {/* Experience Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-3xl font-semibold mb-4">Experience</h2>
        <p className="text-gray-700 text-lg">
          Experience details...will be added by HR soon
        </p>
      </div>

      {/* Contact Information Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-3xl font-semibold mb-4">Contact Information</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-2 sm:mb-0">
            <FaEnvelope className="text-gray-600 mr-2" />
            <span className="text-gray-700 text-lg">{employee.email}</span>
          </div>
          <div className="flex items-center mb-2 sm:mb-0">
            <FaPhone className="text-gray-600 mr-2" />
            <span className="text-gray-700 text-lg">{employee.phone}</span>
          </div>
          <div className="flex items-center">
            <FaLinkedin className="text-gray-600 mr-2" />
            <a
              href={employee.linkedin}
              className="text-blue-600 text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Profile
            </a>
          </div>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-3xl font-semibold mb-4">Additional Information</h2>
        <p className="text-gray-700 text-lg">
          Alternate Phone: {employee.alternate_phone || "N/A"}
        </p>
        <p className="text-gray-700 text-lg">
          Emergency Contact: {employee.emergency_contact || "N/A"}
        </p>
        <p className="text-gray-700 text-lg">Address: {employee.address}</p>
        <p className="text-gray-700 text-lg">Salary: {employee.salary}</p>
      </div>
      <ToastContainer />
      {/* Update Profile Form */}
      {isEditing && (
        <UpdateProfileForm
          employee={employee}
          onClose={handleCloseUpdateForm}
          onUpdate={handleProfileUpdated}
        />
      )}
    </div>
  );
};

export default EmployeeProfile;
