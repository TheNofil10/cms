import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import LeaveApplicationDetails from '../../LeaveApplicationDetails';

const LeaveApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/api/leaves/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data.filter(app => app.status === 'approved_by_manager'));
      } catch (error) {
        if (error.response.status === 401) {
          try {
            const refreshToken = localStorage.getItem("refresh_token");
            const refreshResponse = await axios.post(
              "http://127.0.0.1:8000/api/token/refresh/",
              { refresh: refreshToken }
            );
            localStorage.setItem("access_token", refreshResponse.data.access);
            fetchApplications();
          } catch (refreshError) {
            console.error("Error refreshing token:", refreshError);
          }
        } else {
          console.error("Error fetching leave applications:", error);
        }
      }
    };

    fetchApplications();
  }, []);

  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `http://127.0.0.1:8000/api/approve-leave-hr/${id}/`,
        { action: 'approve' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: 'approved_by_hr' } : app
      ));
      toast.success("Leave application approved.");
    } catch (error) {
      console.error("Error approving leave:", error);
      toast.error("Error approving leave application.");
    }
  };

  const handleReject = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `http://127.0.0.1:8000/api/approve-leave-hr/${id}/`,
        { action: 'reject' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: 'rejected' } : app
      ));
      toast.success("Leave application rejected.");
    } catch (error) {
      console.error("Error rejecting leave:", error);
      toast.error("Error rejecting leave application.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">Leave Applications</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Leave Type
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => (
              <tr key={application.id}>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {application.leave_type}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {application.start_date}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {application.end_date}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  {application.status}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                  <button
                    onClick={() => handleApprove(application.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(application.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LeaveApplications;
