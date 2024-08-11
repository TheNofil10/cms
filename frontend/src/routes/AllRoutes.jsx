import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../components/admin/SignUp";
import ForgetPass from "../pages/ForgetPass";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import AdminDashboard from "../components/admin/AdminDashboard";
import  EmployeesPage from "../components/admin/EmployeesPage"
import Attendance from "../components/admin/Attendance"
import AdminSettings from "../components/admin/AdminSettings"
import ProtectedRoute from "./ProtectedRoute";
import EmployeeRoute from "./EmployeeRoute";
import LoggedInRoute from "./LoggedInRoute";
import HomeRoute from "./HomeRoute";
import AdminLayout from "../components/admin/AdminLayout"
const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<LoggedInRoute element={<Login />} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forget-password" element={<ForgetPass />} />
      
      {/* Employee Routes */}
      <Route path="/employee/dashboard" element={<EmployeeRoute element={<EmployeeDashboard />} employeeOnly={true} />} />
      
      {/* Admin Routes */}
      <Route element={<ProtectedRoute element={<AdminLayout />} adminOnly />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<EmployeesPage />} />
        <Route path="/admin/employees/add" element={<SignUp />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
