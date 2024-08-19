import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../navbar/Navbar";
import { ToastContainer } from "react-toastify";

const JobPostingLayout = () => {
  const navItems = [
    { name: "Applications", path: "/hr/job-applications" },
  ];
  return (
    <div className="flex-grow md:px-20 sm:px-20 bg-white">
      <Navbar navItems={navItems} />
      <div className="py-20">
        <Outlet />
      </div>
      <ToastContainer />
    </div>
  );
};

export default JobPostingLayout;
