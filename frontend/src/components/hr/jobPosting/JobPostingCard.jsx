import React, { useState } from 'react';
import { FaEye, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from './ConfirmationModal'; 

const JobPostingCard = ({ job, onDelete, onToggleStatus }) => {
  const [showModal, setShowModal] = useState(false);
  const [isActive, setIsActive] = useState(job.is_active);
  const navigate = useNavigate();

  const handleDelete = () => {
    onDelete(job.id);
    setShowModal(false);
  };

  const handleToggleStatus = () => {
    const newStatus = !isActive;
    setIsActive(newStatus);
    onToggleStatus(job.id, newStatus);
  };

  const handleViewDetails = () => {
    navigate(`/hr/job-postings/${job.id}`);
  };

  return (
    <div className={`bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 ${isActive ? 'border-green-500' : 'border-gray-400'} p-4 mb-4`}>
      <div className="flex flex-row items-center">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>
          <p className="text-gray-600">{job.location}</p>
          <p className="text-gray-600">{job.job_type}</p>
        </div>
        <div className="flex flex-row items-center ml-4 space-x-2">
          <button
            onClick={handleViewDetails}
            className="text-blue-500 hover:text-blue-700 transition"
            aria-label="View Details"
          >
            <FaEye size={28} />
          </button>
          <button
            onClick={handleToggleStatus}
            className="text-green-500 hover:text-green-700 transition"
            aria-label="Toggle Status"
          >
            {isActive ? <FaToggleOn size={28} /> : <FaToggleOff size={28} />}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="text-red-500 hover:text-red-700 transition"
            aria-label="Delete"
          >
            <FaTrash size={28} />
          </button>
        </div>
      </div>
      {showModal && (
        <ConfirmationModal
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
          message="Are you sure you want to delete this job posting?"
        />
      )}
    </div>
  );
};

export default JobPostingCard;
