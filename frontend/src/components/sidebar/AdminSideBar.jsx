import React from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import { FaHome, FaUsers, FaUserPlus, FaCalendarAlt, FaBuilding, FaHouseUser } from 'react-icons/fa';
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminSideBar = () => {
  const { logout } = useAuth();

  return (
    <Sidebar>
      <SidebarItem icon={<FaHome />} text="Dashboard" to="/admin/dashboard" />
      <SidebarItem icon={<FaUsers />} text="Employees List" to="/admin/employees" />
      <SidebarItem icon={<FaUserPlus />} text="Add Employee" to="/admin/employees/add" />
      <SidebarItem icon={<FaCalendarAlt />} text="Attendance" to="/admin/attendance" />
      <SidebarItem icon={<FaBuilding />} text="Departments" to="/admin/departments" />
      <SidebarItem icon={<FaHouseUser />} text="Add Department" to="/admin/departments/add" />
      <hr className="my-3" />
      <SidebarItem icon={<Settings />} text="Settings" to="/settings" />
      <SidebarItem icon={<LogOut />} text="Logout" onClick={logout} />
    </Sidebar>
  );
};

export default AdminSideBar;
