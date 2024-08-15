import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaInfoCircle,
  FaPhone,
  FaMapMarkerAlt,
  FaDollarSign,
  FaCalendar,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import { Line } from "rc-progress";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const AddDepartment = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    contact_info: "",
    location: "",
    budget: "",
    office_phone: "",
    manager_id: "",
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://127.0.0.1:8000/api/departments/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      navigate("/admin/departments");
      toast.success("Department added successfully!");
    } catch (error) {
      setError("Failed to add department. Please try again.");
      console.error("Error creating department", error);
      toast.error("Error creating department");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast.error("Please fill out all required fields.");
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.description;
      case 2:
        return formData.contact_info && formData.location;
      case 3:
        return formData.budget && formData.office_phone;
      case 4:
        return formData.manager_id;
      default:
        return true;
    }
  };

  const getProgress = () => (step / 4) * 100;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white">
      <div className="w-full max-w-md">
        <h2 className="text-3xl mb-6 text-black text-center">
          Add New Department
        </h2>
        <Line percent={getProgress()} strokeWidth="2" strokeColor="black" />
        <form
          onSubmit={handleSubmit}
          className="bg-white text-black p-8 rounded-lg shadow-2xl mt-4"
        >
          {step === 1 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Department Name</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaInfoCircle className="m-2" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter department name"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Description</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaInfoCircle className="m-2" />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter description"
                    rows="4"
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
                <label className="block text-sm mb-2">Email Info</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaEnvelope className="m-2" />
                  <input
                    type="text"
                    name="contact_info"
                    value={formData.contact_info}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter Email info"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Location</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaMapMarkerAlt className="m-2" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter location"
                  />
                </div>
              </div>
              <div className="flex justify-between mb-4">
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
                <label className="block text-sm mb-2">Budget</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaDollarSign className="m-2" />
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter budget"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Office Phone</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaPhone className="m-2" />
                  <input
                    type="text"
                    name="office_phone"
                    value={formData.office_phone}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter office phone"
                  />
                </div>
              </div>
              <div className="flex justify-between mb-4">
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
                <label className="block text-sm mb-2">Manager ID</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="manager_id"
                    value={formData.manager_id}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    placeholder="Enter manager ID"
                  />
                </div>
              </div>
              <div className="flex justify-between mb-4">
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
                  Submit
                </button>
              </div>
            </>
          )}
        </form>
      </div>
      {loading && <p className="mt-4 text-gray-500">Submitting...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      <ToastContainer />
    </div>
  );
};

export default AddDepartment;
