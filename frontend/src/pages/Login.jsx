import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaLock, FaSpinner } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import logo from "/logo.png"; // Import your logo

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { login, currentUser } = useAuth();
  let navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Please enter both username and password.");
      return;
    }
    setLoading(true);
    console.log(formData);
    const success = await login(formData.username, formData.password);

    if (success) {
      setLoading(false);
      console.log(currentUser);
      if (currentUser) {
        navigate("/");
      }
    } else {
      setLoading(false);
      toast.error("Invalid username or password.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-white">
      {/* Top Navbar */}
      <nav className="w-full bg-black py-3 px-6 flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-10" />
      </nav>

      {/* Login Form */}
      <div className="flex-grow flex justify-center items-center">
        <div className="w-full max-w-md">
          <h2 className="text-3xl mb-6 text-black text-center">Employee Login</h2>
          <form
            onSubmit={handleLogin}
            className="bg-white text-black p-8 rounded-lg shadow-lg shadow-black mt-4"
          >
            <div className="mb-4">
              <label className="block text-sm mb-2">Username</label>
              <div className="flex items-center bg-gray-200 rounded">
              <FaUser className="m-2" style={{ color: "#92363E" }} />

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
                <FaLock className="m-2" style={{ color: "#92363E" }} />
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
              style={{ backgroundColor: "#92363E" }} // Inline style for primary color
              className="w-full text-white p-2 rounded hover:bg-opacity-90 transition duration-200 flex items-center justify-center"
            >
              {loading ? <FaSpinner className="animate-spin mr-2" /> : "Login"}
            </button>

            <div className="flex justify-between mt-4">
              <Link to="/forget-password" className="text-black text-sm underline">
                Forgot Password?
              </Link>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
