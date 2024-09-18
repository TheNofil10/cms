import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import API from "../../../api/api";
import {
  FaRegUser,
  FaCalendarAlt,
  FaTasks,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";
import {useAuth} from '../../../contexts/AuthContext'
const TaskDetail = () => {
  const { id } = useParams();
  const {currentUser} = useAuth()
  const [task, setTask] = useState(null);
  const [department, setDepartment] = useState(null);
  const [assignedEmployees, setAssignedEmployees] = useState([]);
  const [comments, setComments] = useState([]);
  const [employees, setEmployees] = useState({});
  const [newComment, setNewComment] = useState("");
  const SERVER_URL = "http://127.0.0.1:8000";
  useEffect(() => {
    fetchTaskDetails();
    fetchComments(); // Fetch comments when component mounts
  }, []);

  const fetchTaskDetails = async () => {
    try {
      const taskResponse = await axios.get(
        `${API}/tasks/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setTask(taskResponse.data);

      const departmentResponse = await axios.get(
        `${API}departments/${taskResponse.data.department}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setDepartment(departmentResponse.data);

      const employeeResponses = await Promise.all(
        taskResponse.data.assigned_to.map((employeeId) =>
          axios.get(`${API}/employees/${employeeId}/`, {
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
      const response = await axios.get(
        `${API}/tasks/${id}/comments/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const commentsData = response.data;
      console.log("Comments Data:", commentsData); 

      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleAddComment = async () => {
    if (newComment.trim() === "") return;

    try {
      await axios.post(
        `${API}/task-comments/`,
        {
          task: id, 
          comment: newComment, 
          
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
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
                  <img
                    src={employee.profile_image}
                    alt={employee.username}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaRegUser className="text-gray-500" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-800">
                    {employee.first_name} {employee.last_name}
                  </p>
                  <p className="text-gray-500">@{employee.username}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center my-4">
            <FaExclamationTriangle className="text-gray-500 mr-2" />
            <h2 className="text-xl font-medium">Status:</h2>
          </div>
          <p
            className={`text-xl font-semibold ${
              task.status === "completed" ? "text-green-600" : "text-yellow-600"
            }`}
          >
            {task.status}
          </p>

          <div className="flex items-center my-4">
            <FaCheckCircle className="text-gray-500 mr-2" />
            <h2 className="text-xl font-medium">Priority:</h2>
          </div>
          <p
            className={`text-xl font-semibold ${
              task.priority === "high" ? "text-red-600" : "text-blue-600"
            }`}
          >
            {task.priority}
          </p>

          <div className="flex items-center my-4">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <h2 className="text-xl font-medium">Due Date:</h2>
          </div>
          <p className="text-gray-800">{task.due_date}</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center space-x-4 mb-2">
                <img
                  src= {`${SERVER_URL}${comment.commenter.profile_image}`}
                  alt={comment.commenter.username}
                  className="w-10 h-10 rounded-full"
                />

                <div>
                  <p className="font-bold text-gray-800">
                    {comment.commenter.first_name}
                    {comment.commenter?.last_name}
                  </p>
                  <p className="text-gray-500">
                    @{comment.commenter.username}
                  </p>
                </div>
              </div>
              <p className="text-gray-800">{comment.comment}</p>

              <p className="text-gray-500 text-sm mt-1">
                {new Date(comment.created_at).toLocaleDateString()}
                {new Date(comment.created_at).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Add Comment</h3>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows="4"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleAddComment}
          >
            Add Comment
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
