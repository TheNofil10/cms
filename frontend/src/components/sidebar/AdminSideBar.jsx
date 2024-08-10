import React from 'react';
import Sidebar, { SidebarItem } from "./Sidebar";
import { FaHome, FaBook, FaCalendar, FaFlag, FaLayerGroup } from 'react-icons/fa';
import { Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
const AdminSideBar = () => {
  const { currentUser } = useAuth();

  return (
    <Sidebar>
      <SidebarItem icon={<FaHome />} text="Home" />
      <SidebarItem icon={<FaBook />} text="Projects" />
      <SidebarItem icon={<FaCalendar />} text="Calendar" />
      <SidebarItem icon={<FaLayerGroup />} text="Tasks" />
      <SidebarItem icon={<FaFlag />} text="Reporting" />
      <hr className="my-3" />
      <SidebarItem icon={<Settings />} text="Settings" />
    </Sidebar>
  );
};

export default AdminSideBar;
