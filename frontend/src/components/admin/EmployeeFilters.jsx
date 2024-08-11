import React from "react";

const EmployeeFilters = ({ filters, setFilters }) => {
  // Implement filter logic here
  return (
    <div className="flex space-x-4">
      <select
        value={filters.department || ""}
        onChange={(e) => setFilters({ ...filters, department: e.target.value })}
        className="border border-gray-300 p-2 rounded-lg"
      >
        <option value="">Select Department</option>
        {/* Add department options here */}
      </select>
      {/* Add other filters here */}
    </div>
  );
};

export default EmployeeFilters;
