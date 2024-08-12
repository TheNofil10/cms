import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import 'react-toastify/dist/ReactToastify.css';

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
    profileImage: null,
  });
  const [previewImage, setPreviewImage] = useState(null);

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
          profileImage: response.data.profile_image,
        });
        setPreviewImage(response.data.profile_image);
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
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0],
      });
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const data = new FormData();
      data.append('first_name', formData.firstName);
      data.append('last_name', formData.lastName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('date_of_birth', formData.dateOfBirth);
      data.append('department', formData.department);
      data.append('position', formData.position);
      if (formData.profileImage) {
        data.append('profile_image', formData.profileImage);
      }

      await axios.patch(`http://127.0.0.1:8000/api/employees/${currentUser.id}/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
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
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 20],
        },
      },
      pageMargins: [40, 60, 40, 60],
    };

    pdfMake.createPdf(docDefinition).download('employee-profile.pdf');
  };

  const handleConfirmUpdate = () => {
    handleUpdate();
  };

  if (loading) return <div className="text-center p-6 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Employee Profile</h1>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img
            src={previewImage || '/default-profile.png'}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-300"
          />
        </div>
        {isEditing ? (
          <div>
            <input
              type="file"
              name="profileImage"
              onChange={handleChange}
              className="block w-full mb-4 p-3 border border-gray-300 rounded-md"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {Object.entries({
                firstName: "First Name",
                lastName: "Last Name",
                email: "Email",
                phone: "Phone",
                address: "Address",
                dateOfBirth: "Date of Birth",
                department: "Department",
                position: "Position",
              }).map(([key, placeholder]) => (
                <input
                  key={key}
                  type={key === "email" ? "email" : key === "dateOfBirth" ? "date" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="block w-full p-3 border border-gray-300 rounded-md"
                  placeholder={placeholder}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={handleConfirmUpdate}
                className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 text-white p-3 rounded-md hover:bg-gray-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {Object.entries({
                'Name': `${profile.first_name} ${profile.last_name}`,
                'Email': profile.email,
                'Phone': profile.phone,
                'Address': profile.address,
                'Date of Birth': profile.date_of_birth,
                'Department': profile.department,
                'Position': profile.position,
              }).map(([label, value]) => (
                <div key={label} className="p-3 border-b border-gray-300">
                  <span className="font-semibold text-gray-700">{label}:</span>
                  <span className="ml-2 text-gray-600">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Edit
              </button>
              <button
                onClick={handleExportPDF}
                className="bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition duration-200"
              >
                Export PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeProfile;
