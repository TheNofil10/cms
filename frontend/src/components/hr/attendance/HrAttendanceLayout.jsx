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
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white p-5 shadow-md w-full">
        <h1 className="text-2xl font-semibold">Attendence</h1>
      </header>

      {/* Main Content */}
      <div className="flex-grow md:px-20 sm:px-20 bg-white">
        <Navbar navItems={navItems} />
        <div className="py-20">
          <Outlet />
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default HrAttendanceLayout;
