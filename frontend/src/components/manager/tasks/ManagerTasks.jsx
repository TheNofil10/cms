import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import UpdateTaskModal from './UpdateTaskModal'; // Make sure to import UpdateTaskModal
import CreateTaskModal from './CreateTaskModal'; // Import CreateTaskModal
import API from '../../../api/api';
const ManagerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
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

  const handleCreateTask = async (taskData) => {
    try {
      const response = await axios.post(`${API}/tasks/`, taskData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTasks([...tasks, response.data]);
      toast.success('Task created successfully.');
      setShowTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task.');
    }
  };

  const handleUpdateTask = async (taskId, updatedTaskData) => {
    try {
      const response = await axios.put(`${API}/tasks/${taskId}/`, updatedTaskData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTasks(tasks.map((task) => (task.id === taskId ? response.data : task)));
      toast.success('Task updated successfully.');
      setShowUpdateTaskModal(false);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API}/tasks/${taskId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setTasks(tasks.filter((task) => task.id !== taskId));
      toast.success('Task deleted successfully.');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task.');
    }
  };

  const handleViewTaskDetails = (taskId) => {
    navigate(`/manager/tasks/${taskId}`);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowUpdateTaskModal(true);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateTaskModal(false);
    setSelectedTask(null); // Clear selected task on close
  };

  const handleCloseCreateModal = () => {
    setShowTaskModal(false);
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button
          onClick={() => setShowTaskModal(true)}
          className="px-4 py-2 bg-black text-white rounded flex items-center"
        >
          <FaPlus className="mr-2" /> New Task
        </button>
      </div>
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
                <button
                  onClick={() => handleEditTask(task)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />

      {/* Conditionally render UpdateTaskModal */}
      {showUpdateTaskModal && selectedTask && (
        <UpdateTaskModal
          task={selectedTask}
          onClose={handleCloseUpdateModal}
          onUpdate={handleUpdateTask}
        />
      )}

      {/* Conditionally render CreateTaskModal */}
      {showTaskModal && (
        <CreateTaskModal
          onClose={handleCloseCreateModal}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
};

export default ManagerTasks;
