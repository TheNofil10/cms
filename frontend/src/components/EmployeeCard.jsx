import React from 'react';
import { FaRegEye } from "react-icons/fa";

const EmployeeCard = ({ profileImage, name, department, position, username }) => {
  return (
    <div className='flex items-center justify-between bg-white p-2 mb-2 rounded-lg shadow-md'>
      {/* Circular Profile Photo */}
      <img
        src={profileImage}
        alt={name}
        className="w-12 h-12 rounded-full mr-6"
      />

      {/* Employee Info */}
      <div className='flex-grow flex flex-col justify-between'>
        <div className='flex items-center space-x-44'>
          <h2 className='text-xl font-semibold text-gray-800'>{name}</h2>
          <p className='text-gray-600'>{department}</p>
          <p className='text-gray-600'>{position}</p>
          <p className='text-gray-600'>{username}</p>
        </div>
      </div>

      {/* View Profile Button */}
      <button className='flex items-center bg-blue-500 text-white py-2 px-3 mr-8 rounded-lg hover:bg-blue-600 transition'>
        <FaRegEye className='mr-2' size={16} />
        <span className='text-sm font-medium'>View Profile</span>
      </button>
    </div>
  );
};

export default EmployeeCard;
