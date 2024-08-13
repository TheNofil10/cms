import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  FaUserCircle,
  FaUserTie,
  FaRegBuilding,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaTrash,
  FaLinkedin,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmationModal from "./ConfirmationModal";

const AdminEmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/employees/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setEmployee(response.data);
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

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/employees/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.error("Employee deleted successfully");
      // Optionally navigate or update state to reflect the deletion
      navigate("/admin/employees"); // Redirect to employee list page
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Employee not found");
      } else {
        console.error("Error deleting employee:", error);
      }
    } finally {
      setShowConfirmModal(false);
      setEmployeeToDelete(null);
    }
  };

  const handleUpdateProfile = () => {
    if (currentUser && currentUser.is_superuser) {
      toast.error("Admins cannot update profiles");
    } else {
      navigate(`/admin/employees/${id}/update`);
    }
  };

  const handleDeleteEmployee = (employeeId, employeeName) => {
    setEmployeeToDelete({ id: employeeId, name: employeeName });
    setShowConfirmModal(true);
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
            <FaRegBuilding className="mr-2" /> {employee.department}
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-blue-600 transition-colors"
          >
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
        <h2 className="text-3xl font-semibold mb-4">About</h2>
        <p className="text-gray-700 text-lg">Position: {employee.position}</p>
        <p className="text-gray-700 text-lg">
          Department: {employee.department}
        </p>
        <p className="text-gray-700 text-lg">
          Employment Date: {employee.employment_date}
        </p>
        <p className="text-gray-700 text-lg">
          Date of Birth: {employee.date_of_birth}
        </p>
        <p className="text-gray-700 text-lg">
          Manager:{" "}
          {employee.manager
            ? `${employee.manager.first_name} ${employee.manager.last_name}`
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
      {/* Delete Profile Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => handleDeleteEmployee(employee.id, `${employee.first_name} ${employee.last_name}`)}
          className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center hover:bg-red-600 transition-colors"
        >
          <FaTrash className="mr-2" /> Delete Profile
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDeleteEmployee}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${employeeToDelete?.name}?`}
      />

      <ToastContainer />
    </div>
  );
};

export default AdminEmployeeProfile;
