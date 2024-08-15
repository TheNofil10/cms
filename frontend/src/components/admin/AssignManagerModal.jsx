import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const AssignManagerModal = ({ isOpen, onClose, departmentId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const fetchEmployees = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/employees/?search=${searchQuery}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );
          setEmployees(response.data);
        } catch (error) {
          toast.error("Error fetching employees");
        } finally {
          setLoading(false);
        }
      };
      fetchEmployees();
    } else {
      setEmployees([]);
    }
  }, [searchQuery]);

  const handleAssignManager = async () => {
    if (!selectedEmployee) return;
    
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/departments/${departmentId}/`,
        { manager: selectedEmployee.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success("Manager assigned successfully");
      onClose();
    } catch (error) {
      toast.error("Error assigning manager");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-96 flex flex-col">
        <h2 className="text-2xl font-semibold mb-4">Assign Manager</h2>
        <input
          type="text"
          placeholder="Search employees..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <div className="flex-1 overflow-y-auto mb-4">
          {loading && (
            <div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-blue-500" size={24} />
            </div>
          )}
          {!loading && searchQuery.length > 2 && employees.length === 0 && (
            <p className="text-gray-500">No employees found</p>
          )}
          {searchQuery.length > 2 &&
            employees.map((employee) => (
              <div
                key={employee.id}
                className={`p-2 border rounded mb-2 cursor-pointer flex items-center ${
                  selectedEmployee?.id === employee.id ? "bg-black text-white" : ""
                }`}
                onClick={() => setSelectedEmployee(employee)}
              >
                <FaUser className="mr-2" />
                {employee.first_name} {employee.last_name}
              </div>
            ))}
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAssignManager}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={!selectedEmployee}
          >
            Assign
          </button>
          <button
            onClick={onClose}
            className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignManagerModal;
