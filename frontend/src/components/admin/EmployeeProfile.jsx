import React from "react";
import picture from "../../assets/profile.png"
const EmployeeProfile = ({ employee, onClose, onDelete }) => {
  // Base URL for media files

  // Handle image load error
  const handleError = (e) => {
    e.target.src = picture; 
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <div className="flex items-center mb-4">
          <img
            src={employee.profile_image ? employee.profile_image: picture}
            alt="Profile"
            className="w-24 h-24 rounded-full mr-4"
            onError={handleError}
          />
          <div>
            <h2 className="text-xl font-semibold">{employee.first_name} {employee.last_name}</h2>
            <p className="text-gray-600">{employee.position}</p>
            <p className="text-gray-600">{employee.department}</p>
            <p className="text-gray-600">{employee.email}</p>
            <p className="text-gray-600">{employee.phone}</p>
            <p className="text-gray-600">{employee.date_of_birth}</p>
            <p className="text-gray-600">{employee.address}</p>
          </div>
        </div>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete User
        </button>
      </div>
    </div>
  );
};

export default EmployeeProfile;
