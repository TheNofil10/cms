import React from "react";

import { FaTimes } from "react-icons/fa";

const DepartmentConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Confirm Action</h2>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={onCancel}
          >
            <FaTimes />
          </button>
        </div>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end space-x-2">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentConfirmationModal;
