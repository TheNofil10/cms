import React from 'react';
import { FaTimes } from 'react-icons/fa';

const TaskDetail= ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Task Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Title:</h3>
          <p>{task.title}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Description:</h3>
          <p>{task.description}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Assigned To:</h3>
          <p>{task.assigned_to}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Department:</h3>
          <p>{task.department}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Status:</h3>
          <p>{task.status}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Priority:</h3>
          <p>{task.priority}</p>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Due Date:</h3>
          <p>{task.due_date}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
