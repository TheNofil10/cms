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
    <div className={`job-posting-card ${isActive ? 'bg-green-500' : 'bg-gray-500'} p-4 mb-4 rounded`}>
      <h3 className="text-lg font-semibold">{job.title}</h3>
      <p>{job.company}</p>
      <p>{job.location}</p>
      <p>{job.type}</p>
      <div className="flex justify-between items-center">
        <button onClick={handleViewDetails}><FaEye /></button>
        <button onClick={handleToggleStatus}>
          {isActive ? <FaToggleOn /> : <FaToggleOff />}
        </button>
        <button onClick={() => setShowModal(true)}><FaTrash /></button>
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
