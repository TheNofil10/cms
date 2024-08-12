import React from "react";
import { FaEye as ViewIcon, FaTrash as DeleteIcon } from "react-icons/fa";

const EmployeeCard = ({ employee, onView, onDelete }) => {
  // Use a default placeholder image if none is provided
  const imageUrl = employee.image || "path/to/placeholder-image.png";

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md flex flex-col items-center">
      <img
        src={employee.profile_image}
        alt={`${employee.first_name} ${employee.last_name}`}
        className="w-24 h-24 rounded-full mb-4 object-cover"
      />
      <h2 className="text-xl font-semibold">{employee.first_name} {employee.last_name}</h2>
      <p className="text-sm">Email: {employee.email}</p>
      <p className="text-sm">Position: {employee.position}</p>
      <p className="text-sm">Department: {employee.department}</p>
      <div className="flex space-x-2 mt-2">
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={onView}
        >
          <ViewIcon />
        </button>
        <button
          className="text-red-600 hover:text-red-800"
          onClick={onDelete}
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
