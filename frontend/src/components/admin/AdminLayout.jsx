import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminSideBar from "../sidebar/AdminSideBar";
import Navbar from "../navbar/Navbar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-white text-black">
      <AdminSideBar />
      <main className="flex-grow md:px-20 sm:px-20 bg-white">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
};

export default AdminLayout;
