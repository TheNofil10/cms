import React from 'react';
import { Outlet } from 'react-router-dom';
import HRSideBar from '../sidebar/HRSideBar';
const HRLayout = () => {
  return (
    <div className="min-h-screen flex bg-white text-black">
      <HRSideBar />
      <div className="flex-grow px-6 md:px-20 sm:px-30 bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default HRLayout;
