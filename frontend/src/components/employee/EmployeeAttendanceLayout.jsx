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
    <div className="flex-grow mt-8 rounded-md md:px-20 sm:px-20 bg-white">
      <Navbar navItems={navItems} />
      <div className="py-8">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeeAttendanceLayout;
