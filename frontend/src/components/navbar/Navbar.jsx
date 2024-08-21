import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ navItems }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-transparent z-10 fixed top-0 left-0 w-full">
      {/* Navbar Container */}
      <div className="container mx-auto px-6 py-1">
        {/* Big Rounded Button Navbar */}
        <div className="hidden lg:flex justify-center items-center">
          <div className="max-w-fit text-center">
            <div className="bg-black text-white px-8 py-4 rounded-full shadow-xl flex justify-center items-center">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `mx-4 text-white font-bold transition-colors duration-300 transform ${
                      isActive ? "text-gray-300" : ""
                    } hover:text-gray-400`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="flex lg:hidden  justify-between items-center">
          <div className="ml-auto flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-black bg-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Items */}
        {isOpen && (
          <div className="absolute top-full right-5 rounded w-fit bg-black z-50 shadow-xl">
            <div className="lg:hidden mt-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `block px-4 py-2 mt-2 text-white font-bold bg-black rounded-md transition-colors duration-300 transform hover:bg-gray-800 ${
                      isActive ? "text-gray-300" : ""
                    }`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
