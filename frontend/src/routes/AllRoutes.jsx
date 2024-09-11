import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
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
import HRLayout from "../components/hr/HRLayout";
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
import JobApplicationsPage from "../pages/HR/JobApplicationsPage";
import HRPerformanceReviews from "../pages/HR/HRPerformanceReviews";
import HRPayRoll from "../pages/HR/HRPayRoll";
import TalentHuntPage from "../pages/HR/TalentHuntPage";
import JobPostingLayout from "../components/hr/jobPosting/JobPostingLayout";
import JobPostingDetails from "../components/hr/jobPosting/JobPostingDetails";
import CreateJobPostingPage from "../pages/HR/CreateJobPostingPage";
import JobApplicants from "../components/hr/jobPosting/JobApplicants";
import Application from "../components/hr/jobPosting/JobApplicationDetailsPage.jsx";
import JobApplicationDetailsPage from "../components/hr/jobPosting/JobApplicationDetailsPage.jsx";
import EmployeeAttendanceLayout from "../components/employee/EmployeeAttendanceLayout.jsx";
import EmployeeAttendanceTable from "../components/employee/EmployeeAttendanceTable.jsx";
import EmployeeAttendanceApplications from "../components/employee/EmployeeAttendanceApplications.jsx";
import HrAttendanceLayout from "../components/hr/attendance/HrAttendanceLayout.jsx";
import AttendanceDahsboard from "../components/hr/attendance/AttendanceDahsboard.jsx";
import AttendanceTable from "../components/hr/attendance/AttendanceTable.jsx";
import LeaveApplications from "../components/hr/attendance/LeaveApplications.jsx";
import ManagerLayout from "../components/manager/ManagerLayout.jsx";
import ManagerRoute from "./ManagerRoute.jsx";
import ManagerDepartmentPage from "../pages/ManagerDepartmentPage.jsx";
import ManagerAttendanceLayout from "../components/manager/attendance/ManagerAttendanceLayout.jsx";
import ManagerLeaveApplications from "../components/manager/attendance/ManagerLeaveApplications.jsx";
import ManagerTasks from "../components/manager/tasks/ManagerTasks.jsx";
import TaskDetail from "../components/manager/tasks/TaskDetail.jsx";
import EmployeeTaskDetails from "../components/employee/EmployeeTaskDetails.jsx";
import EmployeeSignupPage from '../components/admin/EmployeeSignupPage.jsx'
import ManagerDashboard from "../components/manager/ManagerDashboard.jsx";
import LiveAttendance from "../components/hr/attendance/LiveAttendance.jsx";
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
        <Route path="/employee/tasks/:id" element={<EmployeeTaskDetails />} />
        <Route path="/employee/department" element={<EmployeeDepartment />} />
        <Route
          element={
            <EmployeeRoute
              element={<EmployeeAttendanceLayout />}
              employeeOnly={true}
            />
          }
        >
          <Route path="/employee/attendance" element={<EmployeeAttendance />} />
          <Route
            path="/employee/attendance/details"
            element={<EmployeeAttendanceTable />}
          />
          <Route
            path="/employee/attendance/applications"
            element={<EmployeeAttendanceApplications />}
          />
        </Route>
      </Route>
          
          {/* Manager Routes*/}
          <Route
        element={
          <ManagerRoute element={<ManagerLayout />} managerOnly={true} />
        }
      >
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        <Route path="/manager/profile" element={<EmployeeProfile />} />
        <Route path="/manager/settings" element={<EmployeeSettings />} />
        <Route path="/manager/tasks" element={<ManagerTasks />} />
        <Route path="/manager/tasks/:id" element={<TaskDetail />} />
        <Route path="/manager/employees/:id" element={<AdminEmployeeProfile />} />
        <Route path="/manager/employees" element={<EmployeesPage />} />
        <Route path="/manager/department" element={<ManagerDepartmentPage />} />
        <Route
          element={
            <ManagerRoute
              element={<ManagerAttendanceLayout />}
              managerOnly={true}
            />
          }
        >
          <Route path="/manager/attendance" element={<AttendanceDahsboard />} />
          <Route path="/manager/attendance/table" element={<AttendanceTable />} />
          <Route path="/manager/attendance/leaves" element={<ManagerLeaveApplications />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute element={<AdminLayout />} adminOnly />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<EmployeesPage />} />
        <Route path="/admin/employees/add" element={<EmployeeSignupPage />} />
        <Route path="/admin/attendance" element={<AttendanceTable />} />
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
        {/*JOb Posting*/}
        <Route
          element={
            <HRRoute element={<JobPostingLayout />} adminOnly={false} hrOnly />
          }
        >
          <Route path="/hr/job-postings" element={<HRJobPosting />} />
          <Route
            path="/hr/job-postings/new"
            element={<CreateJobPostingPage />}
          />
          <Route path="/hr/job-postings/:id" element={<JobPostingDetails />} />
          <Route
            path="/hr/job-applications"
            element={<JobApplicationsPage />}
          />
          <Route
            path="/hr/applications/:id"
            element={<JobApplicationDetailsPage />}
          />
          <Route
            path="hr/job-postings/:id/applications"
            element={<Application />}
          />
        </Route>

        {/*Attendance Layout*/}
        <Route
          element={
            <HRRoute
              element={<HrAttendanceLayout />}
              adminOnly={false}
              hrOnly
            />
          }
        >
          <Route path="/hr/attendance" element={<AttendanceDahsboard />} />
          <Route path="/hr/attendance/table" element={<AttendanceTable />} />
          <Route path="/hr/attendance/leaves" element={<LeaveApplications />} />
          <Route path="/hr/attendance/live" element={<LiveAttendance />} />
        </Route>

        <Route path="/hr/employees" element={<EmployeesPage />} />
        <Route path="/hr/employees/add" element={<EmployeeSignupPage />} />
        <Route path="/hr/employees/:id" element={<AdminEmployeeProfile />} />
        <Route path="/hr/departments/:id" element={<DepartmentDetailPage />} />
        <Route path="/hr/departments" element={<DepartmentsPage />} />
        <Route path="/hr/payroll" element={<HRPayRoll />} />
        <Route
          path="/hr/performance-reviews"
          element={<HRPerformanceReviews />}
        />
       
        <Route path="/hr/profile" element={<EmployeeProfile />} />
        <Route path="/hr/settings" element={<HRSettings />} />
        <Route path="/hr/talent-hunt" element={<TalentHuntPage />} />
      </Route>
    </Routes>
  );
};

export default AllRoutes;
