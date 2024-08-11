import React from "react";
import EmployeeList from "./EmployeeList";
const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      <EmployeeList />
    </div>
  );
};

export default AdminDashboard;
