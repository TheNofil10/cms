import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../components/admin/SignUp";
import ForgetPass from "../pages/ForgetPass";
import EmployeeDashboard from "../components/employee/EmployeeDashboard";
import AdminDashboard from "../components/admin/AdminDashboard";
import HRDashboard from "../components/hr/HRDashboard"; // HR Dashboard
import EmployeesPage from "../components/admin/EmployeesPage";
import Attendance from "../components/admin/Attendance";
import AdminSettings from "../components/admin/AdminSettings";
import HRSettings from "../components/hr/HRSettings"; // HR Settings
import ProtectedRoute from "./ProtectedRoute";
import EmployeeRoute from "./EmployeeRoute";
import LoggedInRoute from "./LoggedInRoute";
import HomeRoute from "./HomeRoute";
import AdminLayout from "../components/admin/AdminLayout";
import EmployeeLayout from "../components/employee/EmployeeLayout";
import HRLayout from "../components/hr/HRLayout"; // HR Layout
import EmployeeProfile from "../components/employee/EmployeeProfile";
import EmployeeSettings from "../components/employee/EmployeeSettings";
import EmployeeTasks from "../components/employee/EmployeeTasks";
import EmployeeAttendance from "../components/employee/EmployeeAttendance";
import AdminEmployeeProfile from "../components/admin/AdminEmployeeProfile";
import DepartmentDetailPage from "../pages/DepartmentDetailPage ";
import AddDepartment from "../pages/AddDepartment";
import DepartmentsPage from "../pages/DepartmentsPage";
import EmployeeDepartment from "../pages/EmployeeDepartment";
import ManageMembersPage from "../pages/ManageMembersPage";
import HRRoute from "./HRRoute";
import HRJobPosting from "../pages/HR/HRJobPosting";
import HRApplications from "../pages/HR/HRApplications";
import PerformanceReviewList from "../components/hr/PerformanceReviewList";
import HRPerformanceReviews from "../pages/HR/HRPerformanceReviews";
import HRPayRoll from "../pages/HR/HRPayRoll";

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
        <Route
          path="/departments/:id/manage-members"
          element={<ManageMembersPage />}
        />
      </Route>

      {/* HR Routes */}
      <Route
        element={<HRRoute element={<HRLayout />} adminOnly={false} hrOnly />}
      >
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route path="/hr/job-postings" element={<HRJobPosting />} />
        <Route path="/hr/employees" element={<EmployeesPage />} />
        <Route path="/hr/payroll" element={<HRPayRoll />} />
        <Route path="/hr/applications" element={<HRApplications />} />
        <Route path="/hr/performance-reviews" element={<HRPerformanceReviews />} />
        <Route path="/hr/employees/add" element={<SignUp />} />
        <Route path="/hr/attendance" element={<Attendance />} />
        <Route path="/hr/dashboard" element={<HRDashboard />} />
        <Route path="/hr/settings" element={<HRSettings />} />
        <Route path="/hr/employees/:id" element={<AdminEmployeeProfile />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
