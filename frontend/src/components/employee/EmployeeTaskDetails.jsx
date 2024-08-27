import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaRegUser, FaCalendarAlt, FaTasks, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const EmployeeTaskDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [task, setTask] = useState(null);
  const [department, setDepartment] = useState(null);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const SERVER_URL = "http://127.0.0.1:8000";

  useEffect(() => {
    fetchTaskDetails();
    fetchComments();
  }, []);

  const fetchTaskDetails = async () => {
    try {
      const taskResponse = await axios.get(`http://127.0.0.1:8000/api/tasks/${id}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setTask(taskResponse.data);

      const departmentResponse = await axios.get(`http://127.0.0.1:8000/api/departments/${taskResponse.data.department}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setDepartment(departmentResponse.data);

      const employeeResponses = await Promise.all(
        taskResponse.data.assigned_to.map((employeeId) =>
          axios.get(`http://127.0.0.1:8000/api/employees/${employeeId}/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          })
        )
      );
      setAssignedEmployees(employeeResponses.map((res) => res.data));
    } catch (error) {
      console.error("Error fetching task details:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/tasks/${id}/comments/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      await axios.post(`http://127.0.0.1:8000/api/task-comments/`, {
        task: id,
        comment: newComment,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setNewComment("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error.response?.data || error.message);
    }
  };

  if (!task || !department) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Task Details</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <FaTasks className="text-gray-500 mr-2" />
            <h2 className="text-xl font-medium">Title:</h2>
          </div>
          <p className="text-gray-800">{task.title}</p>

          <div className="flex items-center my-4">
            <FaRegUser className="text-gray-500 mr-2" />
            <h2 className="text-xl font-medium">Description:</h2>
          </div>
          <p className="text-gray-800">{task.description}</p>

          <div className="flex items-center my-4">
            <FaRegUser className="text-gray-500 mr-2" />
            <h2 className="text-xl font-medium">Department:</h2>
          </div>
          <p className="text-gray-800">{department.name}</p>

          <div className="flex items-center my-4">
            <FaRegUser className="text-gray-500 mr-2" />
            <h2 className="text-xl font-medium">Assigned Employees:</h2>
          </div>
          <div className="space-y-4">
            {assignedEmployees.map((employee) => (
              <div key={employee.id} className="flex items-center space-x-4">
                {employee.profile_image ? (
                  <img src={employee.profile_image} alt={employee.username} className="w-12 h-12 rounded-full" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                )}
                <div>
                  <p className="text-lg font-semibold">{employee.first_name} {employee.last_name}</p>
                  <p className="text-sm text-gray-600">@{employee.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center mb-4">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <h2 className="text-xl font-medium">Due Date:</h2>
          </div>
          <p className="text-gray-800">{task.due_date}</p>

          <div className="flex items-center my-4">
            <FaExclamationTriangle className="text-gray-500 mr-2" />
            <h2 className="text-xl font-medium">Status:</h2>
          </div>
          <p className={`text-gray-800 ${task.status === 'completed' ? 'text-green-500' : 'text-red-500'}`}>
            {task.status}
          </p>
        </div>
      </div>

      <div className="my-6 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-medium mb-4">Comments</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start space-x-4">
              
                <img src={`${SERVER_URL}${comment.commenter.profile_image}`} alt={comment.commenter.username} className="w-12 h-12 rounded-full" />

              <div>
                <p className="text-lg font-semibold">{comment.commenter.first_name} {comment.commenter.last_name}</p>
                <p className="text-sm text-gray-600">@{comment.commenter.username}</p>
                <p className="text-gray-800 mt-2">{comment.comment}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(comment.created_at).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows="4"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Add a comment..."
          />
          <button
            onClick={handleAddComment}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTaskDetails;
