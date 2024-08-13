import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaAddressCard,
  FaUpload,
  FaSpinner,
  FaCalendar,
  FaDollarSign,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Line } from "rc-progress";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    alternate_phone: "",
    address: "",
    date_of_birth: "",
    employment_date: "",
    department: "",
    position: "",
    salary: "",
    manager: "",
    emergency_contact: "",
    profile_image: null,
    imagePreview: null,
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profile_image: file,
      imagePreview: URL.createObjectURL(file),
    });
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast.error("Data Not Entered");
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return formData.first_name && formData.last_name && formData.username;
      case 2:
        return formData.email && formData.password;
      case 3:
        return formData.phone && formData.address;
      case 4:
        return (
          formData.date_of_birth && formData.department && formData.position
        );
      default:
        return true;
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        // Ensure we're not appending null values
        formDataObj.append(key, formData[key]);
      }
    });

    console.log([...formDataObj]); // Debug FormData

    axios
      .post("http://localhost:8000/api/employees/", formDataObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data", // Ensure the content type is set to multipart
        },
      })
      .then((response) => {
        console.log(response.data);
        toast.success("Signed Up Successfully");
        setFormData({
          first_name: "",
          middle_name: "",
          last_name: "",
          username: "",
          email: "",
          password: "",
          phone: "",
          alternate_phone: "",
          address: "",
          date_of_birth: "",
          employment_date: "",
          department: "",
          position: "",
          salary: "",
          manager: "",
          emergency_contact: "",
          profile_image: null,
          imagePreview: null,
        });
        setStep(1);
        navigate("/admin/employees/add");
      })
      .catch((error) => {
        console.error(error.response.data);
        toast.error(
          "Error " + (error.response.data.error || "An error occurred")
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getProgress = () => (step / 5) * 100;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-inherit text-white">
      <div className="w-full max-w-md">
        <h2 className="text-3xl mb-6 text-black text-center shadow-slate-1000">
          Employee Signup
        </h2>
        <Line percent={getProgress()} strokeWidth="2" strokeColor="black" />
        <form
          onSubmit={handleSignup}
          className="bg-white text-black p-8 rounded-lg shadow-lg shadow-black mt-4"
        >
          {step === 1 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">First Name</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter first name"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Last Name</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Middle Name</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="middle_name"
                    value={formData.middle_name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter middle name"
                  />
                </div>
              </div>
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
              <div className="flex justify-between mb-4">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Email</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaEnvelope className="m-2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter email"
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
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Phone</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaPhone className="m-2" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Alternate Phone</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaPhone className="m-2" />
                  <input
                    type="text"
                    name="alternate_phone"
                    value={formData.alternate_phone}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter alternate phone number"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Emergency Contact</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaPhone className="m-2" />
                  <input
                    type="text"
                    name="emergency_contact"
                    value={formData.emergency_contact}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter emergency contact"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Address</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter address"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Date of Birth</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter date of birth"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Department</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter department"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Position</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter position"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Employment Date</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaCalendar className="m-2" />
                  <input
                    type="date"
                    name="employment_date"
                    value={formData.employment_date}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Salary</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaDollarSign className="m-2" />
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter salary"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Profile Image</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUpload className="m-2" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
                {formData.imagePreview && (
                  <img
                    src={formData.imagePreview}
                    alt="Profile Preview"
                    className="mt-4 w-20 h-20 object-cover rounded-full"
                  />
                )}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : "Sign Up"}
                </button>
              </div>
            </>
          )}
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
