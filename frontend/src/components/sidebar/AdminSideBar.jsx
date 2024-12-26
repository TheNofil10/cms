import React from "react";
import Sidebar, { SidebarItem } from "./Sidebar";
import { FaHome, FaUsers, FaUserPlus, FaCalendarAlt, FaBuilding, FaFolderPlus } from 'react-icons/fa';
import { MdOutlineCardGiftcard } from "react-icons/md";
import { Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminSideBar = ({ expanded, onToggle }) => {
  const { logout } = useAuth();

  return (
    <Sidebar expanded={expanded} onToggle={onToggle}>
      <SidebarItem icon={<FaHome />} text="Dashboard" to="/admin/dashboard" />
      <SidebarItem icon={<FaUsers />} text="Employees List" to="/admin/employees" />
      <SidebarItem icon={<FaUserPlus />} text="Add Employee" to="/admin/employees/add" />
      <SidebarItem icon={<FaCalendarAlt />} text="Attendance" to="/admin/attendance" />
      <SidebarItem icon={<MdOutlineCardGiftcard />} text="Voucher" to="/admin/vouchers" />
      <SidebarItem icon={<FaBuilding />} text="Departments" to="/admin/departments" />
      <SidebarItem icon={<FaFolderPlus />} text="Add Department" to="/admin/departments/add" />
      <hr className="my-3" />
      <SidebarItem icon={<Settings />} text="Settings" to="/settings" />
      <SidebarItem icon={<LogOut />} text="Logout" onClick={logout} />
    </Sidebar>
  );
};

export default AdminSideBar;
