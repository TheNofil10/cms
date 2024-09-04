import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import HRSideBar from '../sidebar/HRSideBar';

const HRLayout = () => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="min-h-screen flex bg-white text-black">
      <HRSideBar expanded={sidebarExpanded} onToggle={handleToggleSidebar} />
      <div className={`flex-grow transition-all duration-300 ${sidebarExpanded ? 'ml-64' : 'ml-16'}`}>
        <Outlet />
      </div>
    </div>
  );
};

export default HRLayout;
