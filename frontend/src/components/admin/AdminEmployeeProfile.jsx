import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  FaUserTie,
  FaRegBuilding,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaBirthdayCake,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaUserShield,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaEdit,
  FaBriefcase,
  FaUserCircle,
  FaTrash,
  FaFileAlt,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmationModal from "./ConfirmationModal";
import API from "../../api/api";
import UpdateProfileForm from "../employee/UpdateProfileForm";

const AdminEmployeeProfile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [department, setDepartment] = useState(null);
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  const fetchEmployee = async () => {
    try {
      const employeeResponse = await axios.get(
        `${API}/employees/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setEmployee(employeeResponse.data);
      console.log("Employee data: ", employeeResponse.data);

      if (employeeResponse.data.department) {
        const departmentResponse = await axios.get(
          `${API}/departments/${employeeResponse.data.department}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setDepartment(departmentResponse.data);
      }

      if (employeeResponse.data.manager) {
        const managerResponse = await axios.get(
          `${API}/employees/${employeeResponse.data.manager}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setManager(managerResponse.data);
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      setError("Unable to fetch employee data.");
      toast.error("Failed to load employee data");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {

    fetchEmployee();
  }, [id]);

  const handleUpdateProfile = () => {
    setIsEditing(true);
  };

  const handleCloseUpdateForm = () => {
    setIsEditing(false);
  };

  const handleProfileUpdated = async () => {
    await fetchEmployee(); // Refresh employee data after update
    setIsEditing(false);
  };

  const handleDeleteEmployee = (employeeId, employeeName) => {
    setEmployeeToDelete({ id: employeeId, name: employeeName });
    setShowConfirmModal(true);
  };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      await axios.delete(`${API}/employees/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      toast.success("Employee deleted successfully");
      navigate("/hr/employees");
    } catch (error) {
      toast.error("Error deleting employee");
    } finally {
      setShowConfirmModal(false);
      setEmployeeToDelete(null);
    }
  };


  const getDocumentName = (url) => {
    const urlParts = url.split('/');
    return decodeURIComponent(urlParts[urlParts.length - 1]);
  };

  if (loading)
    return <div className="text-center p-6 text-black">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-8 bg-gray-200 rounded-lg shadow-lg max-w-5xl mt-10 mb-10">
      <div className="flex items-center mb-6">
        <img
          src={employee.profile_image}
          alt={`${employee.first_name} ${employee.last_name}`}
          className="w-24 h-24 rounded-full object-cover border-4 border-gray-300"
        />
        <div className="ml-6 flex-1">
          <h1 className="text-3xl font-bold">
            {employee.first_name} {employee.last_name}
          </h1>
          <p className="text-gray-600 text-xl">
            <FaUserTie className="inline-block mr-2" /> {employee.position}
          </p>
          <p className="text-gray-600">
            <FaRegBuilding className="inline-block mr-2" />{" "}
            {department ? department.name : "Loading..."}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          >
            <FaEdit className="inline-block mr-1" /> Edit
          </button>
          <button
            onClick={() => handleDeleteEmployee(employee.id, employee.first_name)}
            className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
          >
            <FaTrash className="inline-block mr-1" /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <p className="text-gray-800 mb-2">
            <FaEnvelope className="inline-block mr-2" /> {employee.email}
          </p>
          <p className="text-gray-800 mb-2">
            <FaPhone className="inline-block mr-2" /> {employee.phone || "Not provided"}
          </p>
          <p className="text-gray-800 mb-2">
            <FaPhone className="inline-block mr-2" /> {employee.alternate_phone || "Not provided"}
          </p>
          <p className="text-gray-800">
            <FaMapMarkerAlt className="inline-block mr-2" /> {employee.address}
          </p>
        </div>


        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <p className="text-gray-800 mb-2">
            <FaBirthdayCake className="inline-block mr-2" /> {employee.date_of_birth}
          </p>
          <p className="text-gray-800 mb-2">
            <FaCalendarAlt className="inline-block mr-2" /> Employment Date: {employee.employment_date}
          </p>
          <p className="text-gray-800 mb-2">
            <FaUserShield className="inline-block mr-2" /> Manager: {manager ? `${manager.first_name} ${manager.last_name}` : "No Manager"}
          </p>
          <p className="text-gray-800">
            <FaPhone className="inline-block mr-2" /> Emergency Contact: {employee.emergency_contact || "Not provided"}
          </p>
        </div>

        {/* Right Column */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Job Details</h2>
          <p className="text-gray-800 mb-2">
            <FaBriefcase className="inline-block mr-2" /> Position: {employee.position}
          </p>
          <p className="text-gray-800">
            <FaMoneyBillWave className="inline-block mr-2" /> Salary: {employee.salary} PKR
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">System Access</h2>
          <p className="text-gray-800 mb-2">
            <FaUserCircle className="inline-block mr-2" /> Username: {employee.username}
          </p>
          <p className="text-gray-800 mb-2">
            <FaUserShield className="inline-block mr-2" /> Role:{" "}
            {employee.is_superuser
              ? "Superuser"
              : employee.is_hr_manager
                ? "HR Manager"
                : employee.is_manager
                  ? "Manager"
                  : employee.is_staff
                    ? "Staff"
                    : "Employee"}
          </p>
          <p className="text-gray-800 mb-2">
            <FaCalendarAlt className="inline-block mr-2" /> Last Login: {employee.last_login || "Never"}
          </p>
          <p className="text-gray-800">
            <FaShieldAlt className="inline-block mr-2" /> Active: {employee.is_active ? "Yes" : "No"}
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FaFileAlt className="mr-2 text-gray-600" /> Documents
          </h2>
          <div className="max-h-60 overflow-y-auto">
            {employee.documents && employee.documents.length > 0 ? (
              <ul className="space-y-2">
                {employee.documents.map((doc, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <a
                      href={doc.document}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-lg"
                    >
                      {getDocumentName(doc.document)}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No documents available</p>
            )}
          </div>
        </div>

      </div>

      {/* Confirmation Modal for Deleting Employee */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={confirmDeleteEmployee}
        onCancel={() => setShowConfirmModal(false)}
        message={`Are you sure you want to delete ${employeeToDelete?.name}? This action cannot be undone.`}
      />

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

export default AdminEmployeeProfile;
