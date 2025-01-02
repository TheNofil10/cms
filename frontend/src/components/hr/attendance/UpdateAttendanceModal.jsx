import React, { useState, useCallback, useEffect } from "react";
import { toast, ToastContainer } from 'react-toastify';
import axios from "axios";
import API from "../../../api/api";
const UpdateAttendanceModal = ({ isOpen, onClose, record }) => {
  const [updatedRecord, setUpdatedRecord] = useState({});

  useEffect(() => {
    if (record) {
      setUpdatedRecord(record);
      console.log(record);
    }
  }, [record]);

  const close = () => {
    setUpdatedRecord({});
    onClose();
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setUpdatedRecord((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSave = useCallback(async (e) => {
    e.preventDefault();
    if (!updatedRecord.id) {
      toast.error("Record ID is missing.");
      return;
    }

    console.log(updatedRecord);

    try {
      await axios.patch(
        `${API}/admin/attendance/update/${updatedRecord.id}/`,
        updatedRecord,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success("Attendance record updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Error updating attendance record: " + (error.response?.data?.detail || "Unknown error"));
    }
  }, [updatedRecord, onClose]);

  if (!isOpen) return null;

  if (!record) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md w-1/3 max-w-lg">
          <h2 className="text-lg font-semibold mb-4">Update Attendance Record</h2>
          <div className="flex items-center justify-between m-4" >
            <div>
              <b>Employee :</b> {updatedRecord.employee_name}
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={updatedRecord.date || ""}
              onChange={handleChange}
              className="border px-2 py-1 rounded-md w-full"
              disabled
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Time In</label>
            <input
              type="time"
              name="time_in"
              value={updatedRecord.time_in || ""}
              onChange={handleChange}
              className="border px-2 py-1 rounded-md w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Time Out</label>
            <input
              type="time"
              name="time_out"
              value={updatedRecord.time_out || ""}
              onChange={handleChange}
              className="border px-2 py-1 rounded-md w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Comments</label>
            <textarea
              name="comments"
              value={updatedRecord.comments || ""}
              onChange={handleChange}
              className="border px-2 py-1 rounded-md w-full h-24 resize-none"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1">Status</label>
            <select
              name="status"
              value={updatedRecord.status || ""}
              onChange={handleChange}
              className="border px-2 py-1 rounded-md w-full"
            >
              <option value="">Select Status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="sick_leave">Sick Leave</option>
              <option value="casual_leave">Casual Leave</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white py-1 px-2 rounded-md"
            >
              Save
            </button>
            <button
              onClick={close}
              className="bg-gray-500 text-white py-1 px-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default UpdateAttendanceModal;
