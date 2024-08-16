import React, { useState, useEffect } from "react";
import JobPostingCard from "./JobPostingCard";

const JobPostingList = () => {
  const [jobPostings, setJobPostings] = useState([]);

  useEffect(() => {
    // Fetch job postings from API
    // Example fetch logic:
    // fetch("/api/job-postings")
    //   .then(res => res.json())
    //   .then(data => setJobPostings(data));

    // For now, mock data
    setJobPostings([
      { id: 1, title: "Software Engineer", description: "Develop and maintain software applications.", department: "Engineering", location: "New York" },
      { id: 2, title: "Product Manager", description: "Manage product development and strategy.", department: "Product", location: "San Francisco" },
    ]);
  }, []);

  const handleView = (id) => {
    // Navigate to the view job posting page or show details
    console.log("View job posting with ID:", id);
  };

  const handleDelete = (id) => {
    // Confirm deletion and handle API call
    console.log("Delete job posting with ID:", id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Job Postings</h1>
      <div className="space-y-4">
        {jobPostings.map((jobPosting) => (
          <JobPostingCard
            key={jobPosting.id}
            jobPosting={jobPosting}
            onView={handleView}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default JobPostingList;
