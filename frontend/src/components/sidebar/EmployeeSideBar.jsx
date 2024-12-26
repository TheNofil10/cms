import React from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import { FaHome, FaUser, FaCalendarAlt, FaTasks, FaBuilding } from 'react-icons/fa';
import { MdOutlineCardGiftcard } from "react-icons/md";
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const EmployeeSideBar = ({ expanded, onToggle }) => {
  const { logout } = useAuth();

  return (
    <Sidebar expanded={expanded} onToggle={onToggle}>
      <SidebarItem icon={<FaHome />} text="Dashboard" to="/employee/dashboard" />
      <SidebarItem icon={<FaUser />} text="Profile" to="/employee/profile" />
      <SidebarItem icon={<FaCalendarAlt />} text="Attendance" to="/employee/attendance" />
      <SidebarItem icon={<FaTasks />} text="Tasks" to="/employee/tasks" />
      <SidebarItem icon={<MdOutlineCardGiftcard />} text="Vouchers" to="/employee/vouchers" />
      <SidebarItem icon={<FaBuilding />} text="My Department" to="/employee/department" />
      <hr className="my-3" />
      <SidebarItem icon={<Settings />} text="Settings" to="/settings" />
      <SidebarItem icon={<LogOut />} text="Logout" onClick={logout} />
    </Sidebar>
  );
};

export default EmployeeSideBar;
