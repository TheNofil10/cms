import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaClock,
  FaMoneyBillWave,
  FaBriefcase,
  FaCalendarAlt,
  FaCheckCircle,
  FaShareAlt
} from "react-icons/fa";
import { toast } from "react-toastify";
import EditJobPostingModal from "./EditJobPostingModal";
import ShareJobModal from "./ShareJobModal";
const JobPostingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false); // State for share modal

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/job-postings/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setJob(response.data);
      } catch (error) {
        setError("Error fetching job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/job-postings/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      toast.success("Deleted Successfully");
      navigate("/hr/job-postings");
    } catch (error) {
      toast.error("Error deleting job posting.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!job) return <p>No job found</p>;

  return (
    <div className="job-posting-details container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="text-lg text-gray-700">
          <p className="flex items-center mb-2">
            <FaBuilding className="mr-2 text-blue-500" /> {job.company}
          </p>
          <p className="flex items-center mb-2">
            <FaMapMarkerAlt className="mr-2 text-red-500" /> {job.location}
          </p>
          <p className="flex items-center mb-2">
            <FaBriefcase className="mr-2 text-green-500" /> {job.job_type}
          </p>
        </div>
        <div className="text-lg text-gray-700">
          <p className="flex items-center mb-2">
            <FaMoneyBillWave className="mr-2 text-yellow-500" />{" "}
            {job.salary_min ? `$${job.salary_min}` : "N/A"} -{" "}
            {job.salary_max ? `$${job.salary_max}` : "N/A"}
          </p>
          <p className="flex items-center mb-2">
            <FaCalendarAlt className="mr-2 text-purple-500" /> Deadline:{" "}
            {job.application_deadline
              ? new Date(job.application_deadline).toLocaleDateString()
              : "N/A"}
          </p>
          <p className="flex items-center">
            <FaCheckCircle
              className={`mr-2 ${
                job.is_active ? "text-green-500" : "text-red-500"
              }`}
            />{" "}
            Status: {job.is_active ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Job Description</h2>
        <p className="text-gray-700 text-lg">{job.description}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Job Specifications</h2>
        <p className="text-gray-700 text-lg">{job.specifications}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Qualifications</h2>
        <p className="text-gray-700 text-lg">{job.qualifications}</p>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          Edit
        </button>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={() => setIsShareModalOpen(true)} // Open the share modal
        >
          <FaShareAlt className="inline-block mr-2" /> Share
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>

      {isModalOpen && (
        <EditJobPostingModal
          job={job}
          setIsModalOpen={setIsModalOpen}
          setJob={setJob}
        />
      )}

      {isShareModalOpen && (
        <ShareJobModal
          job={job}
          setIsShareModalOpen={setIsShareModalOpen}
        />
      )}
    </div>
  );
};

export default JobPostingDetails;
