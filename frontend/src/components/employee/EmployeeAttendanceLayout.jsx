import React from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "../navbar/Navbar";

const EmployeeAttendanceLayout = () => {
  const navItems = [
    { name: "Dashboard", path: "/employee/attendance" },
    { name: "Details", path: "/employee/attendance/details" },
    { name: "Applications", path: "/employee/attendance/applications" },
  ];

  return (
    <div>
      {/* Header Section */}
      <header className="bg-black text-white p-5 shadow-md w-full">
        <h1 className="text-2xl font-semibold">Employee Attendance</h1>
      </header>

      {/* Navbar */}
      <Navbar navItems={navItems} />
      
      {/* Outlet for nested routes */}
      <div className="py-7">
        <Outlet />
      </div>

      {/* Toast Container for notifications */}
      
    </div>
  );
};

export default EmployeeAttendanceLayout;
