import React from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaClipboardList,
  FaTasks,
  FaFileAlt,
  FaDollarSign,
  FaStar,
  FaPaperPlane,
  FaBriefcase,
  FaUserPlus,
} from "react-icons/fa";
import { Settings, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const HRSideBar = () => {
  const { logout } = useAuth();

  return (
    <Sidebar>
      <SidebarItem icon={<FaHome />} text="Dashboard" to="/hr/dashboard" />
      <SidebarItem
        icon={<FaBriefcase />}
        text="Job Postings"
        to="/hr/job-postings"
      />
      <SidebarItem
        icon={<FaPaperPlane />}
        text="Applications"
        to="/hr/applications"
      />
      <SidebarItem
        icon={<FaStar />}
        text="Performance Reviews"
        to="/hr/performance-reviews"
      />
      <SidebarItem
        icon={<FaCalendarAlt />}
        text="Leave Management"
        to="/hr/attendance"
      />
      <SidebarItem icon={<FaDollarSign />} text="Payroll" to="/hr/payroll" />
      <SidebarItem
        icon={<FaUsers />}
        text="Employees List"
        to="/hr/employees"
      />
      <SidebarItem
        icon={<FaUserPlus />}
        text="Add Employee"
        to="/hr/employees/add"
      />
      <hr className="my-3" />
      <SidebarItem icon={<Settings />} text="Settings" to="/hr/settings" />
      <SidebarItem icon={<LogOut />} text="Logout" onClick={logout} />
    </Sidebar>
  );
};

export default HRSideBar;
