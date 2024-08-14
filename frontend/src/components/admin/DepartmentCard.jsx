import React from "react";

const DepartmentCard = ({ department, onView, onDelete }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
      <h3 className="text-lg font-semibold">{department.name}</h3>
      <p className="text-sm text-gray-600">{department.description}</p>
      <div className="mt-4 flex justify-between">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onView}
        >
          View
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DepartmentCard;
