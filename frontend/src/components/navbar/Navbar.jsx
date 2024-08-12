import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link to="/admin/dashboard" className="text-2xl font-bold text-blue-600">
          Admin Dashboard
        </Link>
      </div>

      <div className="flex items-center">
        <div className="relative">
          <FaBell className="text-gray-600 mr-6 text-xl cursor-pointer" />
          {/* Notification Badge */}
          <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-600 rounded-full"></span>
        </div>

        <div className="relative">
          <button
            className="flex items-center focus:outline-none"
            onClick={() => document.getElementById('dropdown').classList.toggle('hidden')}
          >
            <FaUserCircle className="text-gray-600 text-2xl mr-2" />
            <span className="text-gray-600">Admin</span>
          </button>
          <div
            id="dropdown"
            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 hidden"
          >
            <Link
              to="/admin/profile"
              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Profile
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                window.location.href = "/login";
              }}
              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
