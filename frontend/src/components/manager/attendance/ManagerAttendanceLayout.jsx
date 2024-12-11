import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../navbar/Navbar";
import { ToastContainer } from "react-toastify";

const ManagerAttendanceLayout = () => {
  const navItems = [
    { name: "Dashboard", path: "/manager/attendance" },
    { name: "Table", path: "/manager/attendance/table" },
    { name: "Leave Applications", path: "/manager/attendance/leaves" },
    { name: "App Attendance", path: "/manager/app_attendance" },
  ];
  return (
    <div className="flex-grow bg-white">
      <div>
        <header className="bg-black text-white p-5 shadow-md w-full mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold mr-6">Attendance</h1>
        </header>
      </div>
      <Navbar  navItems={navItems} />
      <div className="py-10 px-10">
        <Outlet />
      </div>
    </div>
  );
};

export default ManagerAttendanceLayout;
