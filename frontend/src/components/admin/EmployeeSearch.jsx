import React from "react";

const EmployeeSearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search employees..."
      className="border border-gray-300 p-2 rounded-lg"
    />
  );
};

export default EmployeeSearch;
 