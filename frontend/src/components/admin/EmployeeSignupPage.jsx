import React from "react";
// import axios from "axios";
import Signup from "./SignUp";
// import API from "../../api/api";

const EmployeeSignupPage = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <header className="bg-black text-white p-5 shadow-md w-full">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Add Employee</h1>
        </div>
      </header>

      <div className="flex h-screen bg-white">
        {/* Signup Form Section */}
          <div className="bg-white rounded-lg flex-1">
            <Signup />
          </div>
      </div>
    </div>
  );
};

export default EmployeeSignupPage;
