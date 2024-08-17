import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobPostingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/job-postings/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setJob(response.data);
      } catch (error) {
        setError('Error fetching job details.');
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
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      navigate('/hr/job-postings');
    } catch (error) {
      console.error('Error deleting job posting:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!job) return <p>No job found</p>;

  return (
    <div className="job-posting-details p-4">
      <h1 className="text-2xl font-bold">{job.title}</h1>
      <p className="text-lg">{job.company}</p>
      <p>{job.location}</p>
      <p>{job.type}</p>
      <p className="mt-2">{job.description}</p>
      <p>{job.qualifications}</p>
      <p>{job.responsibilities}</p>
      <p>Deadline: {job.deadline}</p>
      <p>Status: {job.isActive ? 'Active' : 'Inactive'}</p>
      <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate(`/hr/job-postings/edit/${id}`)}>Edit</button>
      <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default JobPostingDetails;
