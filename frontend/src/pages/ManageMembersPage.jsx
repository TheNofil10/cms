import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import MembersCard from "../components/employee/MembersCard";
import { FaSearch, FaPlus, FaTrash } from 'react-icons/fa';

const ManageMembersPage = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/departments/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setDepartment(response.data);
      } catch (error) {
        setError("Error fetching department data");
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/employees/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setEmployees(response.data);
      } catch (error) {
        setError("Error fetching employees");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
    fetchEmployees();
  }, [id]);

  const handleSearch = async (e) => {
    setSearch(e.target.value);
  };

  const handleAddMember = async (employeeId) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/employees/${employeeId}/`,
        { department: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setEmployees(employees.filter(emp => emp.id !== employeeId));
      const response = await axios.get(
        `http://127.0.0.1:8000/api/departments/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setDepartment(response.data);
    } catch (error) {
      setError("Error adding member");
    }
  };

  const handleRemoveMember = async (employeeId) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/employees/${employeeId}/`,
        { department: null },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const response = await axios.get(
        `http://127.0.0.1:8000/api/departments/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setDepartment(response.data);
    } catch (error) {
      setError("Error removing member");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-bold mb-6">Manage Department Members</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center mb-6"
      >
        <FaPlus className="mr-2" /> Add Employee
      </button>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Current Members</h2>
        {department?.members?.map(member => (
          <div key={member.username} className="flex items-center justify-between mb-4">
            <MembersCard
              profileImage={member.profile_image}
              name={`${member.first_name} ${member.last_name}`}
              position={member.position}
              username={member.username}
              email={member.email}
              phone={member.phone}
            />
            <button
              onClick={() => handleRemoveMember(member.id)}
              className="bg-red-500 text-white px-4 py-2 rounded flex items-center"
            >
              <FaTrash className="mr-2" /> Remove
            </button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl h-3/4 overflow-auto relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <FaTrash />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Add Employees</h2>
            <input
              type="text"
              placeholder="Search employees"
              value={search}
              onChange={handleSearch}
              className="border p-2 rounded w-full mb-4"
            />
            <div className="max-h-full overflow-y-auto">
              {employees
                .filter(employee =>
                  employee.username.toLowerCase().includes(search.toLowerCase())
                )
                .map(employee => (
                  <div key={employee.username} className="flex items-center justify-between mb-4">
                    <MembersCard
                      profileImage={employee.profile_image}
                      name={`${employee.first_name} ${employee.last_name}`}
                      position={employee.position}
                      username={employee.username}
                      email={employee.email}
                      phone={employee.phone}
                    />
                    <button
                      onClick={() => handleAddMember(employee.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                    >
                      <FaPlus className="mr-2" /> Add
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMembersPage;
