import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import MembersCard from "../components/employee/MembersCard";
import {
  FaSearch,
  FaPlus,
  FaTrash,
  FaCross,
  FaWindowMinimize,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../api/api";
const ManageMembersPage = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(
          `${API}/departments/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setDepartment(response.data);
      } catch (error) {
        toast.error("Error fetching department data");
      }
    };

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `${API}/employees/`,
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

    fetchDepartment();
    fetchEmployees();
  }, [id]);

  const handleSearch = async (e) => {
    setSearch(e.target.value);
  };

  const handleAddMember = async (employeeId) => {
    try {
      await axios.patch(
        `${API}/employees/${employeeId}/`,
        { department: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setEmployees(employees.filter((emp) => emp.id !== employeeId));
      const response = await axios.get(
        `${API}/departments/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setDepartment(response.data);
      toast.success("Member added successfully!");
    } catch (error) {
      toast.error("Error adding member");
    }
  };

  const handleRemoveMember = async (employeeId) => {
    try {
      await axios.patch(
        `${API}/employees/${employeeId}/`,
        { department: null },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      const response = await axios.get(
        `${API}/departments/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setDepartment(response.data);
      toast.success("Member removed successfully!");
    } catch (error) {
      toast.error("Error removing member");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto">
      
      <h1 className="text-4xl font-bold mb-6">Manage Department Members</h1>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded flex items-center mb-6"
      >
        <FaPlus className="mr-2" /> Add Employee
      </button>

      <div className="mb-6 bg-black text-black rounded px-4 py-2">
        <h2 className="text-2xl font-semibold mb-4">Current Members</h2>
        {department?.members?.map((member) => (
          <Link to={`/admin/employees/${member.id}`}>
            <div
              key={member.username}
              className="flex items-center justify-between mb-4"
            >
              <MembersCard
                profileImage={member.profile_image}
                name={`${member.first_name} ${member.last_name}`}
                position={member.position}
                username={member.username}
                email={member.email}
                phone={member.phone}
              />
              <Link to={"#"}>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="bg-red-500 text-white ml-2 px-4 py-2 rounded flex items-center"
                >
                  <FaTrash className="mr-2" />
                </button>
              </Link>
            </div>{" "}
          </Link>
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
              <FaWindowMinimize />
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
                .filter((employee) =>
                  employee.username.toLowerCase().includes(search.toLowerCase())
                )
                .map((employee) => (
                  <div
                    key={employee.username}
                    className="flex items-center justify-between mb-4"
                  >
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
