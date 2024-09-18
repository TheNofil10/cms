import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaEye } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import API from '../../api/api';

const EmployeeTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API}/tasks/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks.');
    }
  };

  const handleViewTaskDetails = (taskId) => {
    navigate(`/employee/tasks/${taskId}`); 
  };
  

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>
      <table className="w-full bg-white shadow-md rounded mb-4">
        <thead>
          <tr>
            <th className="p-2 border-b">Title</th>
            <th className="p-2 border-b">Status</th>
            <th className="p-2 border-b">Priority</th>
            <th className="p-2 border-b">Due Date</th>
            <th className="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="p-2 border-b">{task.title}</td>
              <td className={`p-2 border-b ${task.status === 'completed' ? 'text-green-500' : ''}`}>
                {task.status}
              </td>
              <td className="p-2 border-b">{task.priority}</td>
              <td className="p-2 border-b">{task.due_date}</td>
              <td className="p-2 border-b flex space-x-2">
                <button
                  onClick={() => handleViewTaskDetails(task.id)}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  <FaEye />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTaskList;
