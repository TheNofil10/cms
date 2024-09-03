import React from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import { FaHome, FaUser, FaCalendarAlt, FaTasks, FaBuilding, FaUsers } from 'react-icons/fa';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const ManagerSideBar = ({ expanded, onToggle }) => {
  const { logout } = useAuth();

  return (
    <Sidebar expanded={expanded} onToggle={onToggle}>
      <SidebarItem icon={<FaHome />} text="Dashboard" to="/manager/dashboard" />
      <SidebarItem icon={<FaUser />} text="Profile" to="/manager/profile" />
      <SidebarItem icon={<FaUsers/>} text="Employees List" to="/manager/employees" />
      <SidebarItem icon={<FaCalendarAlt />} text="Attendance" to="/manager/attendance" />
      <SidebarItem icon={<FaTasks />} text="Tasks" to="/manager/tasks" />
      <SidebarItem icon={<FaBuilding />} text="My Department" to="/manager/department" />
      <hr className="my-3" />
      <SidebarItem icon={<Settings />} text="Settings" to="/settings" />
      <SidebarItem icon={<LogOut />} text="Logout" onClick={logout} />
    </Sidebar>
  );
};

export default ManagerSideBar;
