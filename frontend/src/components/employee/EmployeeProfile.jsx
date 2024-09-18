import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaUserTie,
  FaRegBuilding,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaUserCircle,
  FaBirthdayCake,
  FaCalendarAlt,
  FaAddressCard,
  FaMoneyBillWave,
  FaPhoneAlt,
  FaUserShield,
} from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import UpdateProfileForm from "./UpdateProfileForm";

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
        `${API}/employees/${currentUser.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setEmployee(response.data);

      const departmentResponse = await axios.get(
        `${API}/department/me/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setDepartment(departmentResponse.data);
    } catch (error) {
      console.error("Error fetching Employee data:", error);
      setError("Unable to fetch Employee data.");
    } finally {
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
    <div className="container mx-auto p-6 space-y-6">
      {/* Cover Photo */}
      <div className="relative mb-6 w-full h-48 bg-black rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
        <img
          src={employee.profile_image}
          alt={`${employee.first_name} ${
            employee.middle_name ? employee.middle_name + " " : ""
          }${employee.last_name}'s profile`}
          className="w-36 h-36 rounded-full border-4 border-white shadow-lg object-cover"
        />
      </div>

      {/* Profile Header */}
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
        <h1 className="text-3xl font-semibold mb-2">
          {employee.first_name}{" "}
          {employee.middle_name ? employee.middle_name + " " : ""}
          {employee.last_name}
        </h1>
        <p className="text-gray-600 text-lg flex items-center mb-2">
          <FaUserTie className="mr-2 text-blue-600" /> {employee.position}
        </p>
        <p className="text-gray-600 text-lg flex items-center">
          <FaRegBuilding className="mr-2 text-blue-600" />{" "}
          {department ? department.name : "Loading..."}
        </p>
        <button
          onClick={handleUpdateProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded-full mt-4 hover:bg-blue-700 transition-colors"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* About Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaUserShield className="mr-2 text-gray-600" /> About
          </h2>
          <p className="text-gray-700 text-lg mb-2">
            <FaUserTie className="inline mr-2" /> Position: {employee.position}
          </p>
          <p className="text-gray-700 text-lg mb-2">
            <FaRegBuilding className="inline mr-2" /> Department:{" "}
            {department ? department.name : "Loading..."}
          </p>
          <p className="text-gray-700 text-lg mb-2">
            <FaCalendarAlt className="inline mr-2" /> Employment Date:{" "}
            {employee.employment_date}
          </p>
          <p className="text-gray-700 text-lg mb-2">
            <FaBirthdayCake className="inline mr-2" /> Date of Birth:{" "}
            {employee.date_of_birth}
          </p>
          <p className="text-gray-700 text-lg">
            <FaUserCircle className="inline mr-2" /> Manager:{" "}
            {department.manager
              ? `${department.manager.first_name} ${department.manager.last_name}`
              : "N/A"}
          </p>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaPhoneAlt className="mr-2 text-gray-600" /> Contact Information
          </h2>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <FaEnvelope className="text-gray-600 mr-2" />
              <span className="text-gray-700 text-lg">{employee.email}</span>
            </div>
            <div className="flex items-center">
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
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaMoneyBillWave className="mr-2 text-gray-600" /> Additional
            Information
          </h2>
          <div className="flex justify-between">
            <p className="text-gray-700 text-lg mb-2">
              <FaPhoneAlt className="inline mr-2" /> Alternate Phone:{" "}
              {employee.alternate_phone || "N/A"}
            </p>
          </div>
          <p className="text-gray-700 text-lg mb-2">
            <FaUserShield className="inline mr-2" /> Emergency Contact:{" "}
            {employee.emergency_contact || "N/A"}
          </p>
          <p className="text-gray-700 text-lg mb-2">
            <FaAddressCard className="inline mr-2" /> Address:{" "}
            {employee.address}
          </p>
          <p className="text-gray-700 text-lg">
            <FaMoneyBillWave className="inline mr-2" /> Salary:{" "}
            {employee.salary}
          </p>
        </div>
        {/* Experience Section */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaAddressCard className="mr-2 text-gray-600" /> Experience
          </h2>
          <p className="text-gray-700 text-lg">
            Experience details...will be added by HR soon
          </p>
        </div>
      </div>
      <ToastContainer />
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
