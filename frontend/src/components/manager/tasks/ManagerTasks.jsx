import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import CreateTaskModal from './CreateTaskModal';
import TaskDetail from './TaskDetail';
import { ToastContainer } from 'react-toastify';

const ManagerTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const token = localStorage.getItem("access_token");
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/tasks/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreateTask = async (task) => {
    console.log(task)
    try {
      await axios.post('http://127.0.0.1:8000/api/tasks/', task, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
      setShowTaskModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId, updatedTask) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/tasks/${taskId}/`, updatedTask, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${taskId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleViewTaskDetails = (task) => {
    setCurrentTask(task);
    setShowTaskDetailModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manager Tasks</h1>
        <button
          onClick={() => setShowTaskModal(true)}
          className="flex items-center px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          <FaPlus className="mr-2" /> Create Task
        </button>
      </div>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Priority</th>
            <th className="py-2 px-4 border-b">Due Date</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="py-2 px-4 border-b">{task.title}</td>
              <td className="py-2 px-4 border-b">{task.status}</td>
              <td className="py-2 px-4 border-b">{task.priority}</td>
              <td className="py-2 px-4 border-b">{task.due_date}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleViewTaskDetails(task)}
                  className="mr-2 text-blue-500 hover:text-blue-700"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleUpdateTask(task.id, { /* update logic */ })}
                  className="mr-2 text-yellow-500 hover:text-yellow-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
      {showTaskModal && <CreateTaskModal onClose={() => setShowTaskModal(false)} onCreate={handleCreateTask} />}
      {showTaskDetailModal && <TaskDetail task={currentTask} onClose={() => setShowTaskDetailModal(false)} />}
    </div>
  );
};

export default ManagerTasks;
