import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import { FaPlus, FaTimes, FaUserPlus, FaUserCheck, FaCalendarAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { ToastContainer } from "react-toastify";
import API from "../../../api/api";
const CreateTaskModal = ({ onClose, onCreate }) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState(currentUser.department);
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [noEmployeesMessage, setNoEmployeesMessage] = useState("");
  const [assignees, setAssignees] = useState([{ name: "", employee: null }]);

  useEffect(() => {
    if (assignees[assignees.length - 1]?.name.length > 2) {
      fetchSuggestions(assignees[assignees.length - 1].name);
    } else {
      setSuggestions([]);
      setNoEmployeesMessage("");
    }
  }, [assignees]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `${API}/employee-suggestions/`,
        {
          params: { q: query },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      // Filter suggestions based on department
      const filteredSuggestions = (Array.isArray(response.data) ? response.data : [])
        .filter(employee => employee.department === currentUser.department);

      if (filteredSuggestions.length === 0) {
        setNoEmployeesMessage("No employees found in your department.");
      } else {
        setNoEmployeesMessage("");
      }

      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error("Error fetching employee suggestions:", error);
      setNoEmployeesMessage("Error fetching employee suggestions.");
    }
  };

  const handleAddAssigneeField = () => {
    setAssignees([...assignees, { name: "", employee: null }]);
  };

  const handleRemoveAssigneeField = (index) => {
    const newAssignees = assignees.filter((_, i) => i !== index);
    setAssignees(newAssignees);
  };

  const handleAssigneeChange = (index, value) => {
    const newAssignees = [...assignees];
    newAssignees[index].name = value;
    setAssignees(newAssignees);
  };

  const handleAssigneeSelect = (index, employee) => {
    const newAssignees = [...assignees];
    newAssignees[index] = { name: `${employee.first_name} ${employee.last_name}`, employee };
    setAssignees(newAssignees);
    setSuggestions([]);
    setNoEmployeesMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      title,
      description,
      assigned_to: assignees.map(a => a.employee?.id).filter(id => id !== undefined),
      department,
      status,
      priority,
      due_date: dueDate,
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg h-5/6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <FaUserPlus className="text-blue-500 mr-2" /> Create New Task
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm"
              required
            ></textarea>
          </div>
          {assignees.map((assignee, index) => (
            <div key={index} className="mb-4 relative">
              <label className="block text-gray-700 font-semibold">Assigned To</label>
              <input
                type="text"
                value={assignee.name}
                onChange={(e) => handleAssigneeChange(index, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg shadow-sm"
              />
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full mt-2 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                  {suggestions.map((employee) => (
                    <div
                      key={employee.id}
                      onClick={() => handleAssigneeSelect(index, employee)}
                      className="flex items-center p-3 cursor-pointer hover:bg-gray-100"
                    >
                      <img
                        src={employee.profile_image}
                        alt={`${employee.first_name} ${employee.last_name}`}
                        className="w-12 h-12 rounded-full mr-3"
                      />
                      <div>
                        <p className="font-semibold">{`${employee.first_name} ${employee.last_name}`}</p>
                        <p className="text-gray-600">{employee.username}</p>
                      </div>
                    </div>
                  ))}
                  {noEmployeesMessage && (
                    <div className="p-3 text-gray-600 text-center">
                      {noEmployeesMessage}
                    </div>
                  )}
                </div>
              )}
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleRemoveAssigneeField(index)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-600"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          ))}
          <div className="mb-4">
            <button
              type="button"
              onClick={handleAddAssigneeField}
              className="flex items-center text-blue-500 hover:text-blue-700"
            >
              <FaPlus className="mr-2" /> Add Another Assignee
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Department</label>
            <input
              type="text"
              value={department}
              className="w-full px-3 py-2 border rounded-lg shadow-sm"
              readOnly
              disabled
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm"
              required
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm"
              required
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg shadow-sm"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-300 text-black rounded-lg flex items-center hover:bg-gray-400"
            >
              <IoMdClose className="mr-2" /> Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600"
            >
              <FaUserCheck className="mr-2" /> Create Task
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateTaskModal;
