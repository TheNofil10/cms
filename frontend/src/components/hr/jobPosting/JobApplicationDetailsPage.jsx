import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../../../api/api";
const JobApplicationDetailsPage = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState("");
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${API}/applications/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setApplication(response.data);
        setStatus(response.data.status);
        setStatusHistory(Array.isArray(response.data.status_history) ? response.data.status_history : []);
      } catch (error) {
        toast.error("Error fetching job application details");
        console.error(error.response ? error.response.data : error.message);
      } finally {
        console.log(application)
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setLoading(true);
    try {
      const response = await axios.patch(
        `${API}/applications/${id}/update_status/`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success("Status updated successfully!");
      setApplication((prevApplication) => ({
        ...prevApplication,
        status: newStatus,
        statusHistory: [
          ...(Array.isArray(prevApplication.statusHistory) ? prevApplication.statusHistory : []),
          {
            status: newStatus,
            changed_at: new Date().toISOString(),
          },
        ],
      }));
      setStatus(newStatus);
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error.response ? error.response.data : error.message);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center p-4">Loading...</div>;

  if (!application)
    return <div className="text-center p-4">Application not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Job Application Details</h1>
      <div className="mb-6">
        <p className="text-lg font-semibold">Applicant:</p>
        <p className="text-gray-700">{application.applicant?.name || "N/A"}</p>
      </div>
      <div className="mb-6">
        <p className="text-lg font-semibold">Position Applied:</p>
        <p className="text-gray-700">
          {application.job_posting?.title || "N/A"}
        </p>
      </div>
      <div className="mb-6">
        <p className="text-lg font-semibold">Date Applied:</p>
        <p className="text-gray-700">
          {new Date(application.submission_date).toLocaleDateString() || "N/A"}
        </p>
      </div>
      <div className="mb-6">
        <p className="text-lg font-semibold">Resume:</p>
        <a
          href={application.resume || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          {application.resume ? "View Resume" : "Resume Not Available"}
        </a>
      </div>

      <div className="mb-6">
        <label htmlFor="status" className="block text-lg font-semibold mb-2">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
          className="block w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="Applied">Applied</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Interview Scheduled">Interview Scheduled</option>
          <option value="Offer Extended">Offer Extended</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Status History</h2>
        <ul className="list-disc pl-5">
          {statusHistory.length > 0 ? (
            statusHistory.map((entry, index) => (
              <li key={index} className="text-gray-700">
                {new Date(entry.changed_at).toLocaleDateString()} - {entry.status}
              </li>
            ))
          ) : (
            <li className="text-gray-700">No status history available</li>
          )}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
};

export default JobApplicationDetailsPage;
