import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeSideBar from "../sidebar/EmployeeSideBar";
import { Outlet } from "react-router-dom";

const EmployeeLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="min-h-screen flex bg-white text-black">
      <EmployeeSideBar expanded={sidebarExpanded} onToggle={handleToggleSidebar} />
      <main className={`flex-grow transition-all duration-300 ml-${sidebarExpanded ? "64" : "16"} bg-white`}>
        <Outlet />
      </main>
      
    </div>
  );
};

export default EmployeeLayout;
