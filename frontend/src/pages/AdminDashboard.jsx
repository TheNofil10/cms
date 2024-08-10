import React from "react";

import EmployeeList from "../components/EmployeeList"; // Import EmployeeList component
import AdminSideBar from "../components/sidebar/AdminSideBar";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSideBar />
      <div className="pl-64">
        <EmployeeList />
      </div>
    </div>
  );
};

export default AdminDashboard;
