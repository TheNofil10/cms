import React, { useState } from 'react';
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";
import ManagerSideBar from "../sidebar/ManagerSideBar";

const ManagerLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="min-h-screen flex bg-white text-black">
      <ManagerSideBar expanded={sidebarExpanded} onToggle={handleToggleSidebar} />
      <div className={`flex-grow transition-all duration-300 ml-${sidebarExpanded ? "64" : "16"}  bg-white`}>
        <Outlet />
      </div>
    </div>
  );
};
export default ManagerLayout;