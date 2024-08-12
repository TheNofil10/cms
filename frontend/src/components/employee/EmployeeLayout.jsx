import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmployeeSideBar from "../sidebar/EmployeeSideBar"; // Adjust the import path as needed
import Navbar from "../navbar/Navbar"; // If applicable for the Employee layout
import { Outlet } from "react-router-dom";

const EmployeeLayout = () => {
  return (
    <div className="min-h-screen flex bg-white text-black">
      <EmployeeSideBar />
      <main className="flex-grow p-6 md:px-20 sm:px-20 bg-white">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
};

export default EmployeeLayout;