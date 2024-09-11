import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../navbar/Navbar";
import { ToastContainer } from "react-toastify";

const HrAttendanceLayout = () => {
  const navItems = [
    { name: "Dashboard", path: "/hr/attendance" },
    { name: "Table", path: "/hr/attendance/table" },
    { name: "Leave Applications", path: "/hr/attendance/leaves" },
    { name: "Today", path: "/hr/attendance/live" },
  ];
  return (
    <div className="flex-grow  bg-white">
      <Navbar navItems={navItems} />
      <div className="py-20">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
};

export default HrAttendanceLayout;
