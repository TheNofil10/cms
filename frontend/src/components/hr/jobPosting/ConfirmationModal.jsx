import React from 'react';

const ConfirmationModal = ({ onConfirm, onCancel, message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-4 rounded shadow-lg">
        <p>{message}</p>
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={onConfirm}>Yes</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onCancel}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
