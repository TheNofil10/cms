import React, { useState, useEffect } from 'react';
import JobPostingCard from './JobPostingCard';
import axios from 'axios';

const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/job-postings/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setJobPostings(response.data.results || response.data || []);
      } catch (error) {
        setError('There was an error fetching the Job Postings data.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/job-postings/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setJobPostings(prev => prev.filter(job => job.id !== id));
    } catch (error) {
      console.error('Error deleting job posting:', error);
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/job-postings/${id}/`, {
        isActive: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setJobPostings(prev =>
        prev.map(job => job.id === id ? { ...job, isActive: newStatus } : job)
      );
    } catch (error) {
      console.error('Error toggling job posting status:', error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Job Postings</h1>
      <div className="space-y-4">
        {jobPostings.map(jobPosting => (
          <JobPostingCard
            key={jobPosting.id}
            job={jobPosting}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default JobPostingList;
