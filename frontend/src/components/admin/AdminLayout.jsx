import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";
import AdminSideBar from "../sidebar/AdminSideBar"
const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSideBar />
      <div className="flex-1 pl-16 md:pl-64">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;