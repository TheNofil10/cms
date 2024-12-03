import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSideBar from "../sidebar/AdminSideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(prevState => !prevState);
  };

  return (
    <div className="min-h-screen flex bg-white text-black">
      <AdminSideBar 
        expanded={sidebarExpanded}
        onToggle={toggleSidebar} 
      />
      <div
        className={`flex-1 transition-all duration-300 ml-${sidebarExpanded ? "64" : "16"}`}
      >
        <Outlet />
      </div>
      
    </div>
  );
};

export default AdminLayout;
