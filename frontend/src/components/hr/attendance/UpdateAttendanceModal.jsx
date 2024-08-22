import React, { useState } from "react";
import axios from "axios";

const UpdateAttendanceModal = ({ isOpen, onClose, attendanceData, onUpdate }) => {
  const [formData, setFormData] = useState({ ...attendanceData });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/admin/attendance/${formData.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error updating attendance record:", error);
    }
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <button onClick={onClose} className="close-button">X</button>
          <form onSubmit={handleSubmit}>
            <label>
              Time In:
              <input
                type="time"
                name="time_in"
                value={formData.time_in}
                onChange={handleChange}
              />
            </label>
            <label>
              Time Out:
              <input
                type="time"
                name="time_out"
                value={formData.time_out}
                onChange={handleChange}
              />
            </label>
            <label>
              Status:
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="leave">Leave</option>
                <option value="absent">Absent</option>
              </select>
            </label>
            <label>
              Comments:
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Update</button>
          </form>
        </div>
      </div>
    )
  );
};

export default UpdateAttendanceModal;
