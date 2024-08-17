import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
const CreateJobPostingPage = () => {
  const {currentUser} = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    location: "onsite", // Default value
    job_type: "fulltime", // Default value
    salary_min: "",
    salary_max: "",
    application_deadline: "",
    description: "",
    specifications: "",
    qualifications: "",
    is_active: true,
    posted_by: currentUser.id, // Add any other necessary fields here
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/job-postings/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success("Job posted successfully");
      navigate("/hr/job-postings");
    } catch (error) {
      console.error("Error creating job posting:", error.response?.data || error.message);
      toast.error("Error creating job posting.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create New Job Posting</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="title" className="font-semibold">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="location" className="font-semibold">Location</label>
          <select
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          >
            <option value="onsite">Onsite</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="job_type" className="font-semibold">Job Type</label>
          <select
            id="job_type"
            name="job_type"
            value={formData.job_type}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          >
            <option value="fulltime">Full-Time</option>
            <option value="parttime">Part-Time</option>
            <option value="contract">Contract</option>
          </select>
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="salary_min" className="font-semibold">Minimum Salary</label>
          <input
            type="number"
            id="salary_min"
            name="salary_min"
            value={formData.salary_min}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="salary_max" className="font-semibold">Maximum Salary</label>
          <input
            type="number"
            id="salary_max"
            name="salary_max"
            value={formData.salary_max}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="application_deadline" className="font-semibold">Application Deadline</label>
          <input
            type="date"
            id="application_deadline"
            name="application_deadline"
            value={formData.application_deadline}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="description" className="font-semibold">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="border rounded p-2"
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="specifications" className="font-semibold">Specifications</label>
          <textarea
            id="specifications"
            name="specifications"
            value={formData.specifications}
            onChange={handleInputChange}
            className="border rounded p-2"
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="qualifications" className="font-semibold">Qualifications</label>
          <textarea
            id="qualifications"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleInputChange}
            className="border rounded p-2"
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="is_active" className="font-semibold">Active</label>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
            className="flex items-center space-x-2"
          >
            {formData.is_active ? (
              <FaToggleOn size={24} color="green" />
            ) : (
              <FaToggleOff size={24} color="red" />
            )}
            <span className="font-semibold">{formData.is_active ? 'Yes' : 'No'}</span>
          </button>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => navigate("/hr/job-postings")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateJobPostingPage;
