import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const EmployeeProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    department: "",
    position: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/employees/${currentUser.id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setProfile(response.data);
        setFormData({
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          dateOfBirth: response.data.date_of_birth,
          department: response.data.department,
          position: response.data.position,
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Unable to fetch profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser.id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`http://127.0.0.1:8000/api/employees/${currentUser.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setProfile({
        ...profile,
        ...formData,
      });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile.");
    }
  };

  const handleExportPDF = () => {
    const docDefinition = {
      content: [
        { text: 'Employee Profile', style: 'header' },
        {
          table: {
            widths: ['*', '*'],
            body: [
              ['Field', 'Value'],
              ['Name', `${profile.first_name} ${profile.last_name}`],
              ['Email', profile.email],
              ['Phone', profile.phone],
              ['Address', profile.address],
              ['Date of Birth', profile.date_of_birth],
              ['Department', profile.department],
              ['Position', profile.position],
            ],
          },
          layout: 'lightHorizontalLines',
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 20],
        },
      },
      pageMargins: [40, 60, 40, 60],
    };

    pdfMake.createPdf(docDefinition).download('employee-profile.pdf');
  };

  if (loading) return <div className="text-center p-6 text-white">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 text-black">
      <h1 className="text-4xl font-bold mb-6 text-center">Profile</h1>
      <div className="bg-white p-6 rounded-lg">
        <img
          src={profile.profile_image || '/default-profile.png'}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-4"
        />
        {isEditing ? (
          <div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
              placeholder="First Name"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
              placeholder="Last Name"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
              placeholder="Email"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
              placeholder="Phone"
            />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
              placeholder="Address"
            />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
              placeholder="Date of Birth"
            />
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
              placeholder="Department"
            />
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="block w-full mb-2 p-2 border border-gray-300 rounded"
              placeholder="Position"
            />
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-500 text-white p-2 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg">Name: {profile.first_name} {profile.last_name}</p>
            <p className="text-lg">Email: {profile.email}</p>
            <p className="text-lg">Phone: {profile.phone}</p>
            <p className="text-lg">Address: {profile.address}</p>
            <p className="text-lg">Date of Birth: {profile.date_of_birth}</p>
            <p className="text-lg">Department: {profile.department}</p>
            <p className="text-lg">Position: {profile.position}</p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white p-2 rounded mt-4"
            >
              Update Profile
            </button>
            <button
              onClick={handleExportPDF}
              className="bg-green-500 text-white p-2 rounded ml-2 mt-4"
            >
              Export to PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
