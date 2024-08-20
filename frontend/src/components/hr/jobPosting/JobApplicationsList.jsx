import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

const JobApplicationsList = ({ jobId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/job-postings/${jobId}/applications/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          }
        );
        setApplications(response.data);
      } catch (error) {
        setError('Error fetching job applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  const handleApplicationClick = (id) => {
    navigate.push(`/hr/applications/${id}`);
  };

  if (loading) return <p><FaSpinner className="animate-spin" /></p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="job-applications-list bg-white shadow-lg rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-semibold mb-4">Job Applications</h2>
      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul className="space-y-4">
          {applications.map((application) => (
            <li
              key={application.id}
              className="bg-blue-100 hover:bg-blue-200 transition-colors duration-300 p-4 rounded-lg shadow-md cursor-pointer"
              onClick={() => handleApplicationClick(application.id)}
            >
              <h3 className="text-xl font-semibold">{application.applicant.name}</h3>
              <p className="text-gray-700">Email: {application.applicant.email}</p>
              <p className="text-gray-700">Status: <span className="font-medium">{application.status}</span></p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JobApplicationsList;
