import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../navbar/Navbar";

const JobPostingLayout = () => {
  const navItems = [
    { name: "Jobs", path: "/hr/job-postings" },
    { name: "Create", path: "/hr/job-postings/new" },
    { name: "Analytics", path: "/hr/job-postings/dashboard" },
  ];
  return (
    <div className="flex-grow md:px-20 sm:px-20 bg-white">
      <Navbar navItems={navItems} />
      <div className="py-20">
        <Outlet />
      </div>
    </div>
  );
};

export default JobPostingLayout;
