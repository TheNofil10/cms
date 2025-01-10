import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaUserShield,
  FaCalendarCheck,
  FaBuilding,
  FaIdCard,
  FaBriefcase,
  FaGripLines,
  FaMoneyBillWave 
} from "react-icons/fa";
import { IoMdArchive } from "react-icons/io";
import { useAuth } from "../../contexts/AuthContext";
import ConfirmationModal from "./ConfirmationModal";
import API from "../../api/api";
import StatusImage from "./StatusImage";

const AdminVoucherProfile = () => {
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showConfirmArchiveModal, setShowConfirmArchiveModal] = useState(false);
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);
  const [showRejectConfirmModal, setShowRejectConfirmModal] = useState(false);
  const [voucherToArchive, setVoucherToArchive] = useState(null);
  const [voucherToApprove, setVoucherToApprove] = useState(null);
  const [voucherToReject, setVoucherToReject] = useState(null);
  const [remarks, setRemarks] = useState("");


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
    } catch (error) {
      console.error("Error fetching vouchers:", error);
      setError("Unable to fetch voucher data.");
      toast.error("Failed to load voucher data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoucher();
  }, [id]);

  const handleArchiveVoucher = (voucherId) => {
    setVoucherToArchive({ id: voucherId });
    setShowConfirmArchiveModal(true);
  };

  const confirmArchiveVoucher = async () => {
    if (!voucherToArchive) return;

    try {
      if (voucher.archived) throw new Error("Archive Failed: Voucher is already archived")
      if(voucher.manager_status !== "rejected" && voucher.superuser_status === 'pending') throw new Error(`Archive Failed: voucher is still pending. Please approve or reject`)
        console.log(voucher);
      await axios.put(`${API}/vouchers/${voucher.id}/`, {...voucher, archived: true}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Voucher archived successfully");
      navigate("/admin/vouchers");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowConfirmArchiveModal(false);
      setVoucherToArchive(null);
    }
  }

  const handleApproveVoucher = ({ voucherId }) => {
    setVoucherToApprove({ id: voucherId });
    setShowApproveConfirmModal(true);
  }

  const handleRejectVoucher = ({ voucherId }) => {
    setVoucherToReject({ id: voucherId });
    setShowRejectConfirmModal(true);
  }

  const confirmApproveVoucher = async () => {
    if (!voucherToApprove) return;

    try {
      if(!currentUser.is_manager && !currentUser.is_superuser) throw new Error("You must be a manager or superuser to reject vouchers")
      if(voucher.manager_status != "pending" && currentUser.is_manager) throw new Error(`Approval Failed: voucher already ${voucher.manager_status}`)
      if (voucher.superuser_status != 'pending' && currentUser.is_superuser) throw new Error(`Approval Failed: Voucher already ${voucher.manager_status}`)

      const updatedVoucher = {
        ...voucher,
        remarks,
        ...(currentUser.is_manager && { manager_status: "approved", manager_remarks: remarks }),
        ...(currentUser.is_superuser && { superuser_status: "approved", admin_remarks: remarks }),
      };
        
      await axios.put(`${API}/vouchers/${id}/`, updatedVoucher, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Voucher approved successfully");
      window.location.reload()
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowApproveConfirmModal(false);
      setVoucherToApprove(null);
    }
  }

  const confirmRejectVoucher = async () => {
    if (!voucherToReject) return;

    try {
      if(!currentUser.is_manager && !currentUser.is_superuser) throw new Error("You must be a manager or superuser to reject vouchers")
      if(voucher.manager_status != "pending" && currentUser.is_manager) throw new Error(`Rejection Failed: Voucher already ${voucher.manager_status}`)
      if(voucher.superuser_status != 'pending' && currentUser.is_superuser) throw new Error(`Rejection Failed: voucher already ${voucher.manager_status}`)
      if(!remarks) throw new error ("you have to give a reason for rejection")
      
      const updatedVoucher = {
        ...voucher,
        remarks,
        ...(currentUser.is_manager && { manager_status: "rejected", manager_remarks: remarks }),
        ...(currentUser.is_superuser && { superuser_status: "rejected", admin_remarks: remarks }),
      };
      
      // const voucherUpdate = currentUser.is_manager ? {...voucher, manager_status: "rejected", remarks: remarks, status: 0} : {...voucher, superuser_status: "rejected", remarks: remarks, status: 0}
      await axios.put(`${API}/vouchers/${id}/`, {...updatedVoucher, remarks: remarks}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Voucher rejected successfully");
      window.location.reload()
    } catch (error) {
      toast.error(error.message);
    } finally {
      setShowRejectConfirmModal(false);
      setVoucherToApprove(null);
    }
  }

  const getDocumentName = (url) => {
    const urlParts = url.split('/');
    return decodeURIComponent(urlParts[urlParts.length - 1]);
  };

  if (loading)
    return <div className="text-center p-6 text-black">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-8 bg-gray-200 rounded-lg shadow-lg max-w-5xl mt-10 mb-10">
      <div className="flex justify-end items-center mb-6">
        <div className="flex justify-end space-x-3">
          {(currentUser.is_superuser || currentUser.is_manager) && (
            <>
            {!(voucher.manager_status !== "rejected" && voucher.superuser_status === 'pending') && !voucher.archived && (
              <button
                onClick={() => handleArchiveVoucher(voucher.id)}
                className="bg-yellow-600 text-white px-4 py-2 rounded-full hover:bg-yellow-700"
              >
                <IoMdArchive className="inline-block mr-1" /> Archive
              </button>
            )}
            
            {!(voucher.manager_status != "pending" && currentUser.is_manager) && !(voucher.superuser_status != 'pending' && currentUser.is_superuser) && (
              <>
                <button
                  onClick={() => handleApproveVoucher(voucher.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
                >
                  Approve
                </button>

                <button
                  onClick={() => handleRejectVoucher(voucher.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700"
                >
                  Reject
                </button>
              </>
            )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">

        {/* Voucher Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">Voucher Information</h2>
          <p><FaIdCard className="inline-block mr-2" /><b> Voucher ID: </b>{`${voucher.id}`}</p>
          <p><FaUserShield className="inline-block mr-2" /><b> Created By: </b>{`${voucher.employee_first_name} ${voucher.employee_middle_name} ${voucher.employee_last_name}`}</p>
          {console.log(voucher)}
          <p><FaBuilding className="inline-block mr-2" /><b> Department: </b>{`${voucher.department_name}`}</p>
          <p><FaUserShield className="inline-block mr-2" /><b> Head of Department: </b>{`${voucher.head_of_department_first_name} ${voucher.head_of_department_last_name}`}</p>
          <p><FaCalendarCheck className="inline-block mr-2" /><b> Date Created: </b>{`${voucher.date}`}</p>
          <p><FaBriefcase className="inline-block mr-2" /><b> Project: </b>{`${voucher.project}`}</p>
          <p><FaBriefcase className="inline-block mr-2" /><b> Category: </b>{voucher.category? voucher.category : voucher.other_category}</p>
          <p><FaMoneyBillWave className="inline-block mr-2" /><b> Amount: </b>{`PKR ${voucher.amount}`}</p>
        </div>

        {/* Status and Remarks */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-xl font-bold mb-4">Status and Remarks</h1>
          <h2 className="text-xl font-semibold mb-2">Manager Status:</h2>
          <StatusImage className="inline-block-mr-2 mb-4" status={voucher.manager_status}/>

          {voucher.manager_remarks && (
            <>
              <h2 className="text-xl font-semibold">Manager Remarks: </h2>
              <p className="mb-4">{`${voucher.manager_remarks}`}</p>
            </>
          )}

          <h2 className="text-xl font-semibold mb-2">Admin Status:</h2>
          <StatusImage className="inline-block-mr-2 mb-4" status={voucher.superuser_status}/>
          {voucher.remarks && (
            <>
              <h2 className="text-xl font-semibold">Remarks: </h2>
              <p className="mb-4">{`${voucher.remarks}`}</p>
            </>
          )}

          {voucher.admin_remarks && (
            <>
              <h2 className="text-xl font-semibold">Admin Remarks: </h2>
              <p className="mb-4">{`${voucher.admin_remarks}`}</p>
            </>
          )}
        </div>

        {/* Reason */}
        <div className="bg-white p-6 rounded-lg shadow-sm h-60 max-h-60 overflow-y-auto">
          <h1 className="text-xl font-bold mb-4">Reason for Voucher</h1>
          <p>{`${voucher.reason}`}</p>
        </div>

        {/* Documents */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-">Documents</h2>
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
        </div>
      </div>

      

      {/* Confirmation Modal for Deleting Employee */}
      <ConfirmationModal
        isOpen={showConfirmArchiveModal}
        task="Deletion"
        onConfirm={confirmArchiveVoucher}
        onClose={() => setShowConfirmArchiveModal(false)}
        message={`Are you sure you want to delete voucher#${voucherToArchive?.id}? This action cannot be undone.`}
      >
        <p>Are you sure you want to archive voucher#{voucherToArchive?.id}? This action cannot be undone.</p>
      </ConfirmationModal>

      <ConfirmationModal
        isOpen={showApproveConfirmModal}
        task="Voucher Approval"
        onConfirm={confirmApproveVoucher}
        onClose={() => setShowApproveConfirmModal(false)}
        message={`Are you sure you want to Approve this voucher? This action cannot be undone.`}
      >
        <p>Are you sure you want to Approve this voucher?</p>
        <textarea
            value={remarks}
            className="w-full p-2 bg-gray-200 border-none outline-none"
            onChange={(event) => setRemarks(event.target.value)}
            required
          />
      </ConfirmationModal>

      <ConfirmationModal
        task="Voucher Rejection"
        isOpen={showRejectConfirmModal}
        onConfirm={confirmRejectVoucher}
        onClose={() => setShowRejectConfirmModal(false)}
        message={`Are you sure you want to reject this voucher? This action cannot be undone.`}
      >
          <p>Please enter a reason for rejecting the voucher?</p>
          <textarea
            value={remarks}
            className="w-full p-2 bg-gray-200 border-none outline-none"
            onChange={(event) => setRemarks(event.target.value)}
            required
          />
        </ConfirmationModal>
    </div>
  );
};

export default AdminVoucherProfile;
