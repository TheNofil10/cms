import React, { createContext, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import logo from "/logo.png";
import defaultProfilePic from "../../assets/profile.png";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children, expanded, onToggle }) {
  const { currentUser, logout } = useAuth();
  const userProfilePic = currentUser?.profile_image || defaultProfilePic;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <aside
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          expanded ? "w-64" : "w-16"
        } z-20`}
      >
        <nav className="h-full flex flex-col">
          <div className="p-4 pb-0 flex items-center justify-between">
            <div className="flex-grow flex justify-center">
              <img
                src={logo}
                alt="Logo"
                className={`transition-all ${expanded ? "w-32" : "w-0"}`}
              />
            </div>

            {/* Toggle button on the right */}
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg bg-gray-50  hover:bg-gray-100"
            >
              {expanded ? <ChevronLeft /> : <ChevronRight />}
            </button>
          </div>
          {expanded && (<hr className="mx-3" />)}
          <ul className="flex-1 px-3">{children}</ul>
          <div className="border-t flex p-3 items-center">
            <img
              src={userProfilePic}
              alt="Profile"
              className="w-10 h-10 rounded-md object-cover"
            />
            <div
              className={`flex-1 ml-3 transition-all ${
                expanded ? "opacity-100" : "opacity-0"
              }`}
            >
              <h4 className="font-semibold">
                {currentUser?.username || "User"}
              </h4>
              <span className="text-xs text-gray-600">
                {currentUser?.email || "user@example.com"}
              </span>
            </div>
          </div>
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
}

export function SidebarItem({ icon, text, to, onClick }) {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("SidebarItem must be used within a Sidebar component");
  }

  const { expanded } = context;
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to); // Navigate to the specified route
    }
    if (onClick) {
      onClick(); // Execute any additional click handler
    }
  };

  return (
    <li
      onClick={handleClick}
      className={`relative flex items-center py-1 px-2 my-1 font-medium rounded-md cursor-pointer transition-colors group hover:bg-indigo-50 ${
        expanded ? "text-gray-600" : ""
      }`}
    >
      <span className="text-xl">{icon}</span>
      {expanded && <span className="ml-3">{text}</span>}
      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-100 text-gray-800 text-xs invisible opacity-0 transition-all group-hover:visible group-hover:opacity-100`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
