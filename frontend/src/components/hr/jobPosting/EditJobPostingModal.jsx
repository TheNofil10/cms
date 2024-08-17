import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditJobPostingModal = ({ job, setIsModalOpen, setJob }) => {
  // Initialize form data state with controlled values
  const [formData, setFormData] = useState({
    title: job.title || "",
    location: job.location || "",
    job_type: job.job_type || "",
    salary_min: job.salary_min || "",
    salary_max: job.salary_max || "",
    application_deadline: job.application_deadline ? job.application_deadline.split("T")[0] : "",
    description: job.description || "",
    specifications: job.specifications || "",
    qualifications: job.qualifications || "",
    is_active: job.is_active ?? true, // default to true if undefined
    posted_by: job.posted_by || "",
});

  // Handle input changes and update state
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle form submission to update job posting
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Before Submit:", formData); // Debug logging
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/job-postings/${job.id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setJob(response.data);
      toast.success("Job updated successfully");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating job posting:", error.response?.data || error.message);
      toast.error("Error updating job posting.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-800 bg-opacity-40 z-50">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-center">Edit Job Posting</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="border rounded p-2"
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="job_type" className="font-semibold">Job Type</label>
            <input
              type="text"
              id="job_type"
              name="job_type"
              value={formData.job_type}
              onChange={handleInputChange}
              className="border rounded p-2"
              required
            />
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
            <label htmlFor="description" className="font-semibold">Job Description</label>
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
            <label htmlFor="specifications" className="font-semibold">Job Specifications</label>
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
          <div className="flex flex-col space-y-2">
            <label htmlFor="is_active" className="font-semibold">Is Active</label>
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={() => setFormData({ ...formData, is_active: !formData.is_active })}
              className="border rounded p-2"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white rounded px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJobPostingModal;
