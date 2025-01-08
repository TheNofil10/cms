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
  FaHome,
  FaHeartbeat,
  FaPray,
  FaPassport,
  FaWheelchair,
  FaCalendarCheck,
  FaRegClock,
  FaBusinessTime,
  FaIdBadge,
  FaMapMarkedAlt,
  FaBuilding,
  FaUserAlt,
  FaIdCard,
  FaUser,
  FaBriefcase,
  FaUserCircle,
  FaTrash,
  FaFileAlt,
  FaVenusMars,
  FaCar,
  FaMale,
  FaUserFriends,
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

  const generateEmployeeCard = async (employeeId) => {
    try {
      // Triggering the backend API call
      const employeeResponse = await axios.get(`${API}/generate-card/${employeeId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        responseType: "blob", // This is important to handle file downloads as blobs
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([employeeResponse.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "employee_card.zip");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error generating card:", error);
      toast.error("Failed to generate card");
    }
  };


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
            {employee.first_name} {employee.middle_name ? `${employee.middle_name} ` : ""}{employee.last_name}
          </h1>

          <p className="text-gray-600 text-xl">
            <FaUserTie className="inline-block mr-2" /> {employee.position || "-"}
          </p>
          <p className="text-gray-600">
            <FaRegBuilding className="inline-block mr-2" /> {department ? department.name : "Loading..."}
          </p>
        </div>
        <div className="flex space-x-3">
        {!currentUser.is_manager && (
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          >
            <FaEdit className="inline-block mr-1" /> Edit
          </button>
          )}
          {currentUser.is_superuser && (
            <button
              onClick={() => handleDeleteEmployee(employee.id, employee.first_name)}
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
            >
              <FaTrash className="inline-block mr-1" /> Delete
            </button>
          )}

        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">

        {/* Personal Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <p><FaUserShield className="inline-block mr-2" /> Full Name: {`${employee.first_name} ${employee.middle_name} ${employee.last_name}`}</p>
          <p><FaUserShield className="inline-block mr-2" /> Username: {`${employee.username}`}</p>
          <p><FaUserShield className="inline-block mr-2" /> Email: {`${employee.email}`}</p>
          <p><FaBirthdayCake className="inline-block mr-2" /> Date of Birth: {employee.date_of_birth || "-"}</p>
          <p><FaPray className="inline-block mr-2" /> Religion: {employee.religion || "-"}</p>
          <p><FaPassport className="inline-block mr-2" /> Nationality: {employee.nationality || "-"}</p>
          <p><FaWheelchair className="inline-block mr-2" /> Disability: {employee.disability ? "Yes" : "No"}</p>
          <p><FaIdCard className="inline-block mr-2" /> CNIC: {employee.cnic_no || "-"}</p>
          <p><FaCalendarAlt className="inline-block mr-2" /> CNIC Issue Date: {employee.cnic_issue_date || "-"}</p>
          <p><FaCalendarAlt className="inline-block mr-2" /> CNIC Expiry Date: {employee.cnic_expiry_date || "-"}</p>
        </div>

        {/* Other Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Other Information</h2>
          <p><FaUserCircle className="inline-block mr-2" /> Marital Status: {employee.marital_status ? "Married" : "Single"}</p>
          <p><FaHeartbeat className="inline-block mr-2" /> Blood Group: {employee.blood_group || "-"}</p>
          <p><FaVenusMars className="inline-block mr-2" /> Gender: {employee.gender || "-"}</p>
          <p><FaCar className="inline-block mr-2" /> Driving License: {employee.dv_license_no || "-"}</p>
          <p><FaCalendarAlt className="inline-block mr-2" /> Driving License Issue: {employee.dv_license_issue_date || "-"}</p>
          <p><FaCalendarAlt className="inline-block mr-2" /> Driving License Expiry: {employee.dv_license_expiry_date || "-"}</p>
          <p><FaEnvelope className="inline-block mr-2" /> Company Email: {employee.company_email || "-"}</p>
          <p><FaMale className="inline-block mr-2" /> Father's Name: {employee.father_name || "-"}</p>
          <p><FaIdCard className="inline-block mr-2" /> Father's CNIC: {employee.father_cnic_no || "-"}</p>
          <p><FaUserFriends className="inline-block mr-2" /> Spouse Name: {employee.spouse_name || "-"}</p>
          <p><FaCalendarAlt className="inline-block mr-2" /> Spouse D.O.B: {employee.spouse_date_of_birth || "-"}</p>
          <p><FaUserFriends className="inline-block mr-2" /> Spouse Relation: {employee.spouse_relationship || "-"}</p>
          <p><FaIdCard className="inline-block mr-2" /> Spouse CNIC: {employee.spouse_cnic || "-"}</p>
        </div>

        {/* Job Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Job Details</h2>
          <p><FaIdBadge className="inline-block mr-2" /> Employee ID: {employee.id || "-"}</p>
          <p><FaBriefcase className="inline-block mr-2" /> Department: {department ? department.name : "-"}</p>
          <p><FaBriefcase className="inline-block mr-2" /> Position: {employee.position}</p>
          <p><FaUserShield className="inline-block mr-2" /> Manager: {manager ? `${manager.first_name} ${manager.last_name}` : "-"}</p>
          <p><FaCalendarCheck className="inline-block mr-2" /> Employment Date: {employee.employment_date || "-"}</p>
          <p><FaMoneyBillWave className="inline-block mr-2" /> Salary: {employee.salary || "-"} PKR</p>
          <p><FaRegClock className="inline-block mr-2" /> Check-in Time: {employee.check_in_time || "-"}</p>
          <p><FaBusinessTime className="inline-block mr-2" /> Working Hours: {employee.working_hours || "-"}</p>
          <p><FaMapMarkedAlt className="inline-block mr-2" /> Location: {employee.location || "-"}</p>
          <p><FaBuilding className="inline-block mr-2" /> EOBI No: {employee.eobi_no || "-"}</p>
        </div>

        {/* References */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">References</h2>
          <p><FaUserAlt className="inline-block mr-2" /> Ref Name 1: {employee.ref_name_1 || "-"}</p>
          <p><FaPhone className="inline-block mr-2" /> Mobile 1: {employee.ref_mobile_1 || "-"}</p>
          <p><FaEnvelope className="inline-block mr-2" /> Email 1: {employee.ref_email_1 || "-"}</p>
          <p><FaBuilding className="inline-block mr-2" /> Company 1: {employee.ref_company_1 || "-"}</p>
          <p><FaBriefcase className="inline-block mr-2" /> Designation 1: {employee.ref_designation_1 || "-"}</p>
          <p><FaUserAlt className="inline-block mr-2" /> Ref Name 2: {employee.ref_name_2 || "-"}</p>
          <p><FaPhone className="inline-block mr-2" /> Mobile 2: {employee.ref_mobile_2 || "-"}</p>
          <p><FaEnvelope className="inline-block mr-2" /> Email 2: {employee.ref_email_2 || "-"}</p>
          <p><FaBuilding className="inline-block mr-2" /> Company 2: {employee.ref_company_2 || "-"}</p>
          <p><FaBriefcase className="inline-block mr-2" /> Designation 2: {employee.ref_designation_2 || "-"}</p>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <p><FaUserAlt className="inline-block mr-2" /> Phone No: {employee.phone || "-"}</p>
          <p><FaPhone className="inline-block mr-2" /> Alternate Phone No: {employee.alternate_phone || "-"}</p>
          <p><FaHome className="inline-block mr-2" /> Current Address: {employee.address || "-"}</p>
          <p><FaHome className="inline-block mr-2" /> Permanent Address: {employee.permanent_address || "-"}</p>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Emergency Contacts</h2>
          {employee.emergency_contacts && employee.emergency_contacts.length > 0 ? (
            <>
              <p><FaUserAlt className="inline-block mr-2" /> Name 1: {employee.emergency_contacts[0]?.em_name_1 || "-"}</p>
              <p><FaPhone className="inline-block mr-2" /> Contact 1: {employee.emergency_contacts[0]?.em_contact_1 || "-"}</p>
              <p><FaEnvelope className="inline-block mr-2" /> Email 1: {employee.emergency_contacts[0]?.em_email_1 || "-"}</p>
              <p><FaHeartbeat className="inline-block mr-2" /> Relation 1: {employee.emergency_contacts[0]?.em_relationship_1 || "-"}</p>
              <p><FaUserAlt className="inline-block mr-2" /> Name 2: {employee.emergency_contacts[0]?.em_name_2 || "-"}</p>
              <p><FaPhone className="inline-block mr-2" /> Contact 2: {employee.emergency_contacts[0]?.em_contact_2 || "-"}</p>
              <p><FaEnvelope className="inline-block mr-2" /> Email 2: {employee.emergency_contacts[0]?.em_email_2 || "-"}</p>
              <p><FaHeartbeat className="inline-block mr-2" /> Relation 2: {employee.emergency_contacts[0]?.em_relationship_2 || "-"}</p>
            </>
          ) : (
            <p>No emergency contacts available.</p> // This will show if the emergency_contacts array is empty or undefined
          )}
        </div>


        {/* NOK */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Next Of Kin Details</h2>
          <p><FaUserAlt className="inline-block mr-2" /> Name: {employee.nok_name || "-"}</p>
          <p><FaHeartbeat className="inline-block mr-2" /> Relation: {employee.nok_relationship || "-"}</p>
          <p><FaIdCard className="inline-block mr-2" /> CNIC: {employee.nok_cnic || "-"}</p>
          <p><FaPhone className="inline-block mr-2" /> Contact: {employee.nok_contact || "-"}</p>
          <p><FaEnvelope className="inline-block mr-2" /> Email: {employee.nok_email || "-"}</p>
          <p><FaHome className="inline-block mr-2" /> Address: {employee.nok_permanent_address || "-"}</p>
        </div>

        {/* Qualifications Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-4">Qualifications</h3>
            {employee.qualifications.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 py-1">Institute</th>
                    <th className="border border-gray-300 px-2 py-1">Degree</th>
                    <th className="border border-gray-300 px-2 py-1">Year From</th>
                    <th className="border border-gray-300 px-2 py-1">Year To</th>
                    <th className="border border-gray-300 px-2 py-1">GPA</th>
                  </tr>
                </thead>
                <tbody>
                  {employee.qualifications.map((q, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-1">{q.institute}</td>
                      <td className="border border-gray-300 px-2 py-1">{q.degree}</td>
                      <td className="border border-gray-300 px-2 py-1">{q.year_from}</td>
                      <td className="border border-gray-300 px-2 py-1">{q.year_to}</td>
                      <td className="border border-gray-300 px-2 py-1">{q.gpa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm">No qualifications available.</p>
            )}
          </div>
        </div>

        {/* Experience Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-4">Experience</h3>
            {employee.employments.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 py-1">Company</th>
                    <th className="border border-gray-300 px-2 py-1">Position</th>
                    <th className="border border-gray-300 px-2 py-1">Year From</th>
                    <th className="border border-gray-300 px-2 py-1">Year To</th>
                    <th className="border border-gray-300 px-2 py-1">Reason For Leaving</th>
                  </tr>
                </thead>
                <tbody>
                  {employee.employments.map((exp, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-1">{exp.company_name}</td>
                      <td className="border border-gray-300 px-2 py-1">{exp.designation}</td>
                      <td className="border border-gray-300 px-2 py-1">{exp.year_from}</td>
                      <td className="border border-gray-300 px-2 py-1">{exp.year_to}</td>
                      <td className="border border-gray-300 px-2 py-1">{exp.reason_for_leaving}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm">No experience available.</p>
            )}
          </div>
        </div>

        {/* Dependents Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-4">Dependents</h3>
            {employee.dependents.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 py-1">Name</th>
                    <th className="border border-gray-300 px-2 py-1">Relation</th>
                    <th className="border border-gray-300 px-2 py-1">Date of Birth</th>
                    <th className="border border-gray-300 px-2 py-1">CNIC</th>
                  </tr>
                </thead>
                <tbody>
                  {employee.dependents.map((dep, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-2 py-1">{dep.name}</td>
                      <td className="border border-gray-300 px-2 py-1">{dep.relation}</td>
                      <td className="border border-gray-300 px-2 py-1">{dep.date_of_birth}</td>
                      <td className="border border-gray-300 px-2 py-1">{dep.cnic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm">No dependents available.</p>
            )}
          </div>
        </div>



        {/* Documents */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          {employee.documents && employee.documents.length > 0 ? (
            <ul>
              {employee.documents.map((doc, index) => (
                <li key={index} className="mb-2">
                  <a
                    href={doc.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {getDocumentName(doc.document)}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No documents available</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        onClick={() => generateEmployeeCard(employee.id)}
        className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200 my-5">
        Generate Employee Card
      </button>

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
