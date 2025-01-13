import React from 'react';
import axios from 'axios';
import {toast} from 'react-toastify'
import API from '../../api/api';
const NewLeaveApplicationForm = ({ handleFormClose }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API}/apply-leave/`, {
        leave_type: formData.get('leaveType'),
        start_date: formData.get('startDate'),
        end_date: formData.get('endDate'),
        reason: formData.get('reason'),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      handleFormClose();
      toast.success("Leave Application Sent Successfully");
    } catch (error) {
      console.error('Error submitting leave application:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center bg-black bg-opacity-75 justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <h2 className="text-xl font-semibold mb-4">New Leave Application</h2>
        <form onSubmit={handleSubmit}>
          {/* Leave Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Leave Type</label>
            <select name="leaveType" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
            </select>
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input type="date" name="startDate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input type="date" name="endDate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          {/* Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea name="reason" rows="3" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleFormClose}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md mr-2"
            >
              Cancel
            </button>
            <button type="submit" className="bg-black text-white py-2 px-4 rounded-md">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewLeaveApplicationForm;
