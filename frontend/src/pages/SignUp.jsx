import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaAddressCard, FaUpload, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Line } from 'rc-progress';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    profileImage: null,
    imagePreview: null,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    department: '',
    position: '',
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file, imagePreview: URL.createObjectURL(file) });
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
    else{
        toast.error("Data Not Entered")
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return (formData.firstName && formData.lastName && formData.username);
      case 2:
        return formData.email && formData.password;
      case 3:
        return formData.phone && formData.address;
      case 4:
        return formData.dateOfBirth && formData.department && formData.position;
      default:
        
        return true;
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate signup process
    setTimeout(() => {
      setLoading(false);
      toast.success('Signup successful!');
    }, 2000);
    console.log(formData)
  };

  const getProgress = () => (step / 5) * 100;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white text-white">
      <div className="w-full max-w-md">
        <h2 className="text-3xl mb-6 text-black text-center shadow-slate-1000">Employee Signup</h2>
        <Line percent={getProgress()} strokeWidth="2" strokeColor="black" />
        <form onSubmit={handleSignup} className="bg-white text-black p-8 rounded-lg shadow-lg shadow-black mt-4 ">
        {step === 1 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">First Name</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
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
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter last name"
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
                <Link to="/login" className="text-black text-sm underline">
                  Already have an account? Login
                </Link>
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
                  <FaAddressCard className="m-2" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Department</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
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
                  <FaAddressCard className="m-2" />
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
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-700">
                    {formData.imagePreview ? (
                      <img src={formData.imagePreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-700">
                        <FaUser className="text-4xl text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full cursor-pointer">
                    <FaUpload />
                    <input type="file" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200 flex items-center justify-center"
              >
                {loading ? <FaSpinner className="animate-spin mr-2" /> : 'Signup'}
              </button>
            </>
          )}
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
