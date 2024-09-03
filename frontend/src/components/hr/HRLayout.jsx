import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import HRSideBar from '../sidebar/HRSideBar';

const HRLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const handleToggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="min-h-screen flex bg-white text-black">
      <HRSideBar expanded={sidebarExpanded} onToggle={handleToggleSidebar} />
      <div className={`flex-grow transition-all duration-300 ml-${sidebarExpanded ? "64" : "16"} px-6 md:px-20 sm:px-30 bg-white`}>
        <Outlet />
      </div>
    </div>
  );
};

export default HRLayout;
