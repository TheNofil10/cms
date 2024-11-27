import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../navbar/Navbar";
import { ToastContainer } from "react-toastify";

const ManagerAttendanceLayout = () => {
  const navItems = [
    { name: "Dashboard", path: "/manager/attendance" },
    { name: "Table", path: "/manager/attendance/table" },
    { name: "Leave Applications", path: "/manager/attendance/leaves" },
  ];
  return (
    <div className="flex-grow  bg-white">
      <div>
        <header className="bg-black text-white p-5 shadow-md w-full mb-4">
          <h1 className="text-2xl font-semibold">Attendence</h1>
        </header>
      </div>
      <Navbar navItems={navItems} />
      <div className="py-20">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
};

export default ManagerAttendanceLayout;
