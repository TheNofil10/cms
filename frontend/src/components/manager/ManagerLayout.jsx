import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeSideBar from "../sidebar/EmployeeSideBar"; 
import { Outlet } from "react-router-dom";

const ManagerLayout = () => {
  return (
    <div className="min-h-screen flex bg-white text-black">
      <EmployeeSideBar />
      <main className="flex-grow md:px-20 sm:px-20 bg-white">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
};

export default ManagerLayout;