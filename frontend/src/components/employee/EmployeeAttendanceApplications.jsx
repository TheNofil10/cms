import React, { useState, useEffect } from "react";
import axios from "axios";
import LeaveApplicationDetails from "./leaveApplicationDetails";
import NewLeaveApplicationForm from "./NewLeaveApplicationForm";
import { ToastContainer } from "react-toastify";

const EmployeeAttendanceApplications = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/api/leaves/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data);
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

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
    setIsStatusModalOpen(true); // Open status modal
  };

  const handleNewApplicationClick = () => {
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  const handleStatusModalClose = () => {
    setIsStatusModalOpen(false);
    setSelectedApplication(null); // Clear selected application
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/apply-leave/",
        {
          leave_type: formData.get("leaveType"),
          start_date: formData.get("startDate"),
          end_date: formData.get("endDate"),
          reason: formData.get("reason"),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsFormOpen(false);
      setApplications([...applications, response.data]);
      toast.success("Leave Application Sent Successfully");
    } catch (error) {
      console.error("Error submitting leave application:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header and New Application Button */}
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Leave Applications</h1>
        <button
          onClick={handleNewApplicationClick}
          className="bg-black text-white py-2 px-4 rounded-md"
        >
          New Leave Application
        </button>
      </div>

      {/* Applications Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Employee
              </th>
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((application) => (
              <tr
                key={application.id}
                onClick={() => handleApplicationClick(application)}
                className="cursor-pointer hover:bg-gray-100"
              >
                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {application.employee_name}
                </td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <NewLeaveApplicationForm handleFormClose={handleFormClose} />
      )}

      {isStatusModalOpen && selectedApplication && (
        <LeaveApplicationDetails
          selectedApplication={selectedApplication}
          handleStatusModalClose={handleStatusModalClose}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default EmployeeAttendanceApplications;
