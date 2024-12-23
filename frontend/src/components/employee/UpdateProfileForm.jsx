import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

const UpdateProfileForm = ({ employee, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    alternate_phone: '',
    address: '',
    date_of_birth: '',
    employment_date: '',
    department: '',
    position: '',
    salary: '',
    manager: '',
    emergency_contact: '',
    profile_pic: null
  });
  const [preview, setPreview] = useState('');
  const [documents, setDocuments] = useState([]);  // State to hold documents
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {

    if (employee) {
      setFormData({
        first_name: employee.first_name,
        middle_name: employee.middle_name || '',
        last_name: employee.last_name,
        username: employee.username,
        email: employee.email,
        phone: employee.phone,
        alternate_phone: employee.alternate_phone || '',
        address: employee.address,
        date_of_birth: employee.date_of_birth,
        employment_date: employee.employment_date,
        department: employee.department,
        position: employee.position,
        salary: employee.salary || '',
        manager: employee.manager || '',
        emergency_contact: employee.emergency_contact || '',
        profile_pic: null
      });
      setPreview(employee.profile_image);
    }


    setDocuments(employee.documents);  // Set the documents from the response

  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profile_image: file,
    });
    setPreview(URL.createObjectURL(file))
  };
  const getDocumentName = (url) => {
    const urlParts = url.split('/');
    return decodeURIComponent(urlParts[urlParts.length - 1]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'profile_pic' && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });
    console.log(formDataToSend)
    try {
      await axios.put(
        `${API}/employees/${employee.id}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(formData)
      toast.success("Profile updated successfully");
      onUpdate();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const handleDocumentDelete = async (documentId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      console.log(documentId);
      try {
        const response = await axios.delete(`${API}/employee-documents/${documentId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Adjust for your auth setup
          },
        });
        if (response.status === 204) {
          toast.success("Document deleted successfully!");
          // Optionally remove the document from local state
          setDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== documentId));
        }
      } catch (error) {
        console.error("Error deleting document:", error);
        toast.error("Failed to delete the document. Please try again.");
      }
    }
  };

  // Handle multiple file input changes
  const handleFilesChange = (e) => {
    setSelectedFiles([...e.target.files]); // Store all selected files
  };

  // Handle multiple document uploads
  const handleDocumentsUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files before uploading.");
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("documents", file); // Add each file to FormData
    });
    formData.append("employee_id", employee.id); // Assuming `employee.id` is available

    try {
      const response = await axios.post(`${API}/employee-documents/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Documents uploaded successfully!");
      setDocuments((prevDocs) => [...prevDocs, ...response.data]); // Update the document list
      setSelectedFiles([]); // Clear the file input
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error("Failed to upload documents.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white w-full max-w-md h-[80vh] overflow-auto p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit}>
          {/* File Input for Profile Picture */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Profile Picture:</label>
            <input
              type="file"
              name="profile_pic"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
            {preview && (
              <div className="mt-4">
                <img
                  src={preview}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full border-4 border-gray-300"
                />
              </div>
            )}
          </div>

          {/* Other form fields */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">First Name:</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Middle Name:</label>
            <input
              type="text"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              disabled={!currentUser.is_superuser}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Alternate Phone:</label>
            <input
              type="text"
              name="alternate_phone"
              value={formData.alternate_phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Date of Birth:</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Employment Date:</label>
            <input
              type="date"
              name="employment_date"
              value={formData.employment_date} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Department:</label>
            <input
              type="text"
              name="department"
              value={formData.department} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Position:</label>
            <input
              type="text"
              name="position"
              value={formData.position} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Salary:</label>
            <input
              type="number"
              name="salary" 
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Manager:</label>
            <input
              type="text"
              name="manager"
              value={formData.manager} 
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Emergency Contact:</label>
            <input
              type="text"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          {/* Displaying the available documents */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Available Documents:</label>
            {documents.length > 0 ? (
              <ul className="list-disc pl-5">
                {documents.map((doc, index) => (
                  <li key={index} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => handleDocumentDelete(doc.id)} // Delete functionality
                      className="text-red-600 mr-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <a
                      href={doc.document} // Assuming `doc.url` is the URL to download the document
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {getDocumentName(doc.document)}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No documents available.</p>
            )}

            {/* Add Multiple Documents Section */}
            <div className="mt-4">
              <label className="block text-gray-700 mb-2">Upload New Documents:</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  multiple // Allow multiple files
                  onChange={handleFilesChange} // Handle multiple file changes
                  className="block w-full text-gray-700 border rounded-md"
                />
                <button
                  type="button"
                  onClick={handleDocumentsUpload} // Add multiple documents
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </div>

          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileForm;