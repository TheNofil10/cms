import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaLock, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Please enter both username and password.");
      return;
    }
    setLoading(true);
    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      toast.success("Login successful!");
      // Redirect or perform additional actions after successful login
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-white">
      <div className="w-full max-w-md">
        <h2 className="text-3xl mb-6 text-black text-center shadow-slate-1000">
          Employee Login
        </h2>
        <form
          onSubmit={handleLogin}
          className="bg-white text-black p-8 rounded-lg shadow-lg shadow-black mt-4"
        >
          <div className="mb-4">
            <label className="block text-sm mb-2">Username</label>
            <div className="flex items-center bg-gray-200 rounded">
              <FaUser className="m-2" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 border-none outline-none"
                placeholder="Enter username"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm mb-2">Password</label>
            <div className="flex items-center bg-gray-200 rounded">
              <FaLock className="m-2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-200 border-none outline-none"
                placeholder="Enter password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200 flex items-center justify-center"
          >
            {loading ? <FaSpinner className="animate-spin mr-2" /> : "Login"}
          </button>
          <div className="flex justify-between mb-4">
            <Link to="/signup" className="text-black text-sm underline">
              Sign Up
            </Link>
            <Link to="/forget-password" className="text-black text-sm underline">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
