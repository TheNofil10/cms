import React from "react";
import { FaEye as ViewIcon, FaTrash as DeleteIcon } from "react-icons/fa";
import profile from '../../../assets/profile.png'
const JobPostingCard = ({ jobPosting, onView, onDelete }) => {
  const { title, description, department, location, id } = jobPosting;

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md flex items-center space-x-8">
      {/* Job Posting Details in a Row */}
      <div className="flex-grow flex items-center space-x-8">
        <div className="text-lg font-medium">{title}</div>
        <div className="text-gray-600">{department}</div>
        <div className="text-gray-600">{location}</div>
        <div className="text-gray-600">{description.slice(0, 50)}...</div> {/* Show a truncated description */}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => onView(id)}
        >
          <ViewIcon />
        </button>
        <button
          className="text-red-600 hover:text-red-800"
          onClick={() => onDelete(id)}
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

export default JobPostingCard;
