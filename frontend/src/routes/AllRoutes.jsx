import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../components/admin/SignUp";
import ForgetPass from "../pages/ForgetPass";
import EmployeeDashboard from "../components/employee/EmployeeDashboard";
import AdminDashboard from "../components/admin/AdminDashboard";
import EmployeesPage from "../components/admin/EmployeesPage";
import Attendance from "../components/admin/Attendance";
import AdminSettings from "../components/admin/AdminSettings";
import ProtectedRoute from "./ProtectedRoute";
import EmployeeRoute from "./EmployeeRoute";
import LoggedInRoute from "./LoggedInRoute";
import HomeRoute from "./HomeRoute";
import AdminLayout from "../components/admin/AdminLayout";
import EmployeeLayout from "../components/employee/EmployeeLayout"; // Adjust the import path as needed
import EmployeeProfile from "../components/employee/EmployeeProfile"; // Adjust the import path as needed
import EmployeeSettings from "../components/employee/EmployeeSettings";
import EmployeeTasks from "../components/employee/EmployeeTasks";
import EmployeeAttendance from "../components/employee/EmployeeAttendance";
import AdminEmployeeProfile from "../components/admin/AdminEmployeeProfile";
import DepartmentDetailPage from "../pages/DepartmentDetailPage ";
import AddDepartment from "../pages/AddDepartment";
import DepartmentsPage from "../pages/DepartmentsPage";
import EmployeeDepartment from "../pages/EmployeeDepartment";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeRoute />} />
      <Route path="/login" element={<LoggedInRoute element={<Login />} />} />

      <Route path="/forget-password" element={<ForgetPass />} />

      {/* Employee Routes */}
      <Route
        element={
          <EmployeeRoute element={<EmployeeLayout />} employeeOnly={true} />
        }
      >
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/profile" element={<EmployeeProfile />} />
        <Route path="/employee/settings" element={<EmployeeSettings />} />
        <Route path="/employee/tasks" element={<EmployeeTasks />} />
        <Route path="/employee/attendance" element={<EmployeeAttendance />} />
        <Route path="/employee/department" element={<EmployeeDepartment />} />
        {/* Add more employee routes here */}
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute element={<AdminLayout />} adminOnly />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<EmployeesPage />} />
        <Route path="/admin/employees/add" element={<SignUp />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/employees/:id" element={<AdminEmployeeProfile />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="/admin/departments" element={<DepartmentsPage />} />
        <Route path="/admin/departments/add" element={<AddDepartment />} />
        <Route
          path="/admin/departments/:id"
          element={<DepartmentDetailPage />}
        />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
