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
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmationModal from "./ConfirmationModal";
import API from "../../api/api";
import UpdateProfileForm from "../employee/UpdateProfileForm";

const AdminVoucherProfile = () => {
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);
  const [department, setDepartment] = useState(null);
  const [headOfDepartment, setHeadOfDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);


  const fetchVoucher = async () => {
    try {
      const voucherResponse = await axios.get(
        `${API}/vouchers/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setVoucher(voucherResponse.data);
      // console.log("Employee data: ", employeeResponse.data);

      if (voucherResponse.data.department) {
        const departmentResponse = await axios.get(
          `${API}/departments/${voucherResponse.data.department}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setDepartment(departmentResponse.data);
      }

      if (voucherResponse.data.head_of_department) {
        const headOfDepartmentResponse = await axios.get(
          `${API}/employees/${voucherResponse.data.head_of_department}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setHeadOfDepartment(headOfDepartmentResponse.data);
      }
    } catch (error) {
      console.error("Error fetching HOD:", error);
      setError("Unable to fetch HOD data.");
      toast.error("Failed to load HOD data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchVoucher();
  }, [id]);

  const handleUpdateProfile = () => {
    setIsEditing(true);
  };

  const handleCloseUpdateForm = () => {
    setIsEditing(false);
  };

  const handleProfileUpdated = async () => {
    await fetchVoucher(); // Refresh employee data after update
    setIsEditing(false);
  };

  const handleDeleteVoucher = (voucherId) => {
    setVoucherToDelete({ id: voucherId });
    setShowConfirmModal(true);
  };

  const confirmDeleteVoucher = async () => {
    if (!voucherToDelete) return;

    try {
      await axios.delete(`${API}/vouchers/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      toast.success("Voucher deleted successfully");
      navigate("/hr/vouchers");
    } catch (error) {
      toast.error("Error deleting voucher");
    } finally {
      setShowConfirmModal(false);
      setVoucherToDelete(null);
    }
  };


  // const getDocumentName = (url) => {
  //   const urlParts = url.split('/');
  //   return decodeURIComponent(urlParts[urlParts.length - 1]);
  // };

  if (loading)
    return <div className="text-center p-6 text-black">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-8 bg-gray-200 rounded-lg shadow-lg max-w-5xl mt-10 mb-10">
      <div className="flex items-center mb-6">
        <div className="flex space-x-3">
          <button
            onClick={handleUpdateProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          >
            <FaEdit className="inline-block mr-1" /> Edit
          </button>
          {currentUser.is_superuser && (
            <button
              onClick={() => handleDeleteVoucher(voucher.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
            >
              <FaTrash className="inline-block mr-1" /> Delete
            </button>
          )}

        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">

        {/* Voucher Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Voucher Information</h2>
          <p><FaUserShield className="inline-block mr-2" /> Voucher ID: {`${voucher.id}`}</p>
          <p><FaUserShield className="inline-block mr-2" /> Created By: {`${voucher.employee_first_name} ${voucher.employee_middle_name} ${voucher.employee_last_name}`}</p>
          {console.log(voucher)}
          <p><FaUserShield className="inline-block mr-2" /> Department: {`${voucher.department_name}`}</p>
          <p><FaUserShield className="inline-block mr-2" /> Head of Department: {`${voucher.head_of_department}`}</p>
        </div>


        {/* Documents */}
        {/* <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          {voucher.documents && voucher.documents.length > 0 ? (
            <ul>
              {voucher.documents.map((doc, index) => (
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
        </div> */}
      </div>

      {/* Confirmation Modal for Deleting Employee */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={confirmDeleteVoucher}
        onCancel={() => setShowConfirmModal(false)}
        message={`Are you sure you want to delete ${voucherToDelete?.id}? This action cannot be undone.`}
      />

      {isEditing && (
        <UpdateProfileForm
          employee={voucher}
          onClose={handleCloseUpdateForm}
          onUpdate={handleProfileUpdated}
        />
      )}

    </div>
  );
};

export default AdminVoucherProfile;
