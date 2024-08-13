import React, { createContext, useContext, useState } from "react";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import logo from '../../assets/logo.png';
import defaultProfilePic from '../../assets/profile.png'; // Replace with your default profile image
import { useNavigate } from "react-router-dom";

const SidebarContext = createContext();

export default function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(false);
    const [showSidebar, setShowSidebar] = useState(true);
    const { currentUser, logout } = useAuth();
    const userProfilePic = currentUser?.profile_image || defaultProfilePic;
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleToggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <>
            {showSidebar && (
                <aside className={`fixed top-0 left-0 h-screen bg-white shadow-lg transition-transform duration-300 ease-in-out ${expanded ? "w-64" : "w-16"} z-30`}>
                    <nav className="h-full flex flex-col">
                        <div className="p-4 pb-2 flex justify-between items-center">
                            <img
                                src={logo}
                                alt="Logo"
                                className={`transition-all ${expanded ? "w-32" : "w-0"}`}
                            />
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                            >
                                {expanded ? <ChevronLeft /> : <ChevronRight />}
                            </button>
                        </div>
                        <SidebarContext.Provider value={{ expanded }}>
                            <ul className="flex-1 px-3">
                                {children}
                            </ul>
                        </SidebarContext.Provider>
                        <div className="border-t flex p-3 items-center relative">
                            <img
                                src={userProfilePic}
                                alt="Profile"
                                className="w-10 h-10 rounded-md"
                            />
                            <div className={`flex-1 ml-3 transition-all ${expanded ? "opacity-100" : "opacity-0"}`}>
                                <h4 className="font-semibold">{currentUser?.username || "User"}</h4>
                                <span className="text-xs text-gray-600">{currentUser?.email || "user@example.com"}</span>
                            </div>
                        </div>
                    </nav>
                </aside>
            )}
            {!showSidebar && (
                <button
                    onClick={handleToggleSidebar}
                    className="fixed top-0 left-0 p-4 bg-white shadow-lg rounded-full z-30"
                >
                    <ChevronRight size={20} />
                </button>
            )}
            {expanded && showSidebar && (
                <div
                    className="fixed inset-0 bg-black opacity-40 z-20"
                    onClick={() => setExpanded(false)}
                />
            )}
        </>
    );
}

export function SidebarItem({ icon, text, to, onClick }) {
    const { expanded } = useContext(SidebarContext);
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
            className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group hover:bg-indigo-50 ${expanded ? "text-gray-600" : ""}`}
        >
            <span className="text-xl">{icon}</span>
            {expanded && <span className="ml-3">{text}</span>}
            {!expanded && (
                <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-gray-100 text-gray-800 text-sm invisible opacity-0 transition-all group-hover:visible group-hover:opacity-100`}>
                    {text}
                </div>
            )}
        </li>
    );
}
