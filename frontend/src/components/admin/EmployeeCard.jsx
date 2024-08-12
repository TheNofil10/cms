import React from "react";
import { FaUserCircle } from "react-icons/fa";

const EmployeeCard = ({ employee, onClick }) => {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md flex items-center cursor-pointer mb-4 hover:bg-gray-800 transition duration-200"
      onClick={onClick}
    >
      {employee.profile_image ? (
        <img
          src={employee.profile_image}
          alt={`${employee.first_name} ${employee.last_name}`}
          className="w-12 h-12 rounded-full mr-4"
        />
      ) : (
        <FaUserCircle size={48} className="text-black mr-4" />
      )}
      <div>
        <p className="text-xl font-semibold text-black">{employee.first_name} {employee.last_name}</p>
        <p className="text-black">{employee.position}</p>
        <p className="text-black text-sm">{employee.department}</p>
      </div>
    </div>
  );
};

export default EmployeeCard;
