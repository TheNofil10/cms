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
    <div className="flex-grow mt-8 rounded-md md:px-16 sm:px-16 bg-white">
      <Navbar navItems={navItems} />
      <div className="py-7">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
};

export default EmployeeAttendanceLayout;
