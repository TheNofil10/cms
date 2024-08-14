import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MembersCard from "../components/employee/MembersCard";
import ManagerCard from "../components/employee/ManagerCard";
import { FaEdit, FaPlus } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const imageBaseUrl = "http://127.0.0.1:8000";

const DepartmentDetailPage = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    office_phone: "",
    contact_info: "",
    location: "",
  });
  const navigate = useNavigate();

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
        console.log(response.data)
        setFormData({
          name: response.data.name || "",
          description: response.data.description || "",
          office_phone: response.data.office_phone || "",
          contact_info: response.data.contact_info || "",
          location: response.data.location || "",
        });
      } catch (error) {
        setError("Error fetching department data");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateDepartment = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/departments/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      toast.success("Successfully udpated")
      setActiveTab("overview")
    } catch (error) {
      setError("Error updating department");
      toast.error(error)
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleManageMembers = () => {
    navigate(`/departments/${id}/manage-members`);
  };

  return (
    <div className="container mx-auto">
      {/* Tabs */}
      <div className="flex justify-center mb-6">
        <button
          className={`px-6 py-2 rounded-t-lg ${
            activeTab === "overview" ? "bg-black text-white" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg ml-2 ${
            activeTab === "members" ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("members")}
        >
          Members
        </button>
        <button
          className={`px-6 py-2 rounded-t-lg ml-2 ${
            activeTab === "update" ? "bg-black text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("update")}
        >
          Update
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-black p-6 min-h-full h-full rounded-lg shadow-lg">
        {activeTab === "overview" && (
          <div className="text-white">
            {/* Department Header */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold mb-2">{department?.name}</h1>
              <p className="text-lg mb-4">{department?.description}</p>
              <div className="mt-4">
                <h2 className="text-2xl font-semibold">Contact Information</h2>
                <p className="text-lg">Phone: {department?.office_phone}</p>
                <p className="text-lg">Email: {department?.contact_info}</p>
                <p className="text-lg">Location: {department?.location}</p>
              </div>
            </div>

            {/* Manager Section */}
            <div>
              <h2 className="text-2xl font-semibold text-balc mb-4">Manager</h2>
              {department?.manager_name !== "N/A" ? (
                <ManagerCard
                  profileImage={`${imageBaseUrl}${department.manager_image}`}
                  name={department.manager_name}
                  department={department.name}
                  position="Manager"
                  username={department.manager.username}
                  email={department.manager_email}
                  phone={department.manager_phone}
                />
              ) : (
                <p>No manager assigned</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">Members</h2>
            <div className="flex justify-end mb-4">
              <button
                onClick={handleManageMembers}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              >
                <FaPlus className="mr-2" /> Manage Members
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1  gap-6">
              {department?.members?.map((member) => (
                <>
                  <Link to={`/admin/employees/${member.id}`}>
                    <MembersCard
                      key={member.username}
                      profileImage={member.profile_image}
                      name={`${member.first_name} ${member.last_name}`}
                      position={member.position}
                      username={member.username}
                      email={member.email}
                      phone={member.phone}
                    />
                  </Link>
                </>
              ))}
            </div>
          </div>
        )}

        {activeTab === "update" && (
          <div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Update Department
            </h2>
            {/* Update Form */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter department name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter department description"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">
                  Office Phone
                </label>
                <input
                  type="text"
                  name="office_phone"
                  value={formData.office_phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter office phone number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">
                  Contact Information
                </label>
                <input
                  type="text"
                  name="contact_info"
                  value={formData.contact_info}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter contact information"
                />
              </div>
              <div className="mb-4">
                <label className="block text-black font-semibold mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  placeholder="Enter location"
                />
              </div>
              <button
                onClick={handleUpdateDepartment}
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
              >
                <FaEdit className="mr-2" /> Update Department
              </button>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default DepartmentDetailPage;
