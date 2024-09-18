import React, { useState, useEffect } from 'react';
import JobPostingCard from './JobPostingCard';
import axios from 'axios';
import { toast } from 'react-toastify';
import API from '../../../api/api';
const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]);

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await axios.get( `${API}/job-postings/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setJobPostings(response.data);
      } catch (error) {
        toast.error(`Error:${error}`)
        console.error('Error fetching job postings:', error);
      }
    };

    fetchJobPostings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/job-postings/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setJobPostings(jobPostings.filter(job => job.id !== id));
      toast.success("Deleted Successfully")
    } catch (error) {
      console.error('Error deleting job posting:', error);
      toast.error('Error deleting job posting:', error);
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await axios.patch(
        `${API}/job-postings/${id}/`,
        { is_active: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          }
        }
      );
      setJobPostings(jobPostings.map(job =>
        job.id === id ? { ...job, is_active: newStatus } : job
      ));
      toast.success("Status updated Successfully")
    } catch (error) {
      console.error('Error toggling job status:', error);
      toast.error('Error toggling job status:', error);
    }
  };

  return (
    <div>
      {jobPostings.map((job) => (
        <JobPostingCard
          key={job.id}
          job={job}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      ))}
    </div>
  );
};

export default JobPostingList;
