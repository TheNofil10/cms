import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ForgetPass from "../pages/ForgetPass";
import EmployeeDashboard from "../pages/EmployeeDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import EmployeeRoute from "./EmployeeRoute"
import LoggedInRoute from "./LoggedInRoute";
import HomeRoute from "./HomeRoute";
const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<LoggedInRoute  element={<Login />} />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forget-password" element={<ForgetPass />} />
      <Route
        path="/employee/dashboard"
        element={<EmployeeRoute element={<EmployeeDashboard />} employeeOnly={true}/>}
      />
      <Route
        path="/admin/dashboard"
        element={<ProtectedRoute element={<AdminDashboard />} adminOnly />}
      />
    </Routes>
  );
};

export default AllRoutes;
