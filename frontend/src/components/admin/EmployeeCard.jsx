import React from "react";
import { FaEye as ViewIcon, FaTrash as DeleteIcon } from "react-icons/fa";
import profile from "../../assets/profile.png";

const EmployeeCard = ({ employee, onView, onDelete }) => {
  const imageUrl = employee.profile_image || profile;

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md flex items-center space-x-8">
      {/* Employee Image */}
      <img
        src={imageUrl}
        alt={`${employee.first_name} ${employee.last_name}`}
        className="w-20 h-20 rounded-full object-cover"
      />

      {/* Employee Details in a Row */}
      <div className="flex-grow flex items-center space-x-8">
        <div className="text-lg font-medium">
          {employee.first_name} {employee.last_name}
        </div>
        <div className="text-gray-600">{employee.username}</div>
        <div className="text-gray-600">{employee.position}</div>
        <div className="text-gray-600">{employee.department}</div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => onView(employee)}
        >
          <ViewIcon />
        </button>
        <button
          className="text-red-600 hover:text-red-800"
          onClick={() => onDelete(employee.id)}
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
