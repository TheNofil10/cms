import React from 'react';

const LeaveApplicationDetails = ({ selectedApplication, handleStatusModalClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Application Details</h2>
          <button
            onClick={handleStatusModalClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        <p><strong>Employee:</strong> {selectedApplication.employee_name}</p>
        <p><strong>Leave Type:</strong> {selectedApplication.leave_type}</p>
        <p><strong>Start Date:</strong> {selectedApplication.start_date}</p>
        <p><strong>End Date:</strong> {selectedApplication.end_date}</p>
        <p><strong>Status:</strong> {selectedApplication.status}</p>
        <p><strong>Reason:</strong> {selectedApplication.reason}</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleStatusModalClose}
            className="text-gray-300 bg-gray-700 py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeaveApplicationDetails;
