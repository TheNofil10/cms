import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import API from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaClock,
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaAddressCard,
  FaUpload,
  FaSpinner,
  FaCalendar,
  FaDollarSign,
  FaUserShield,
  FaToggleOn,
  FaToggleOff,
  FaAddressBook,
} from "react-icons/fa";

const UpdateProfileForm = ({ employee, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({

    first_name: "",
    middle_name: "",
    last_name: "",
    address: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    alternate_phone: "",
    date_of_birth: "",
    employment_date: "",
    department: "",
    position: "",
    salary: "",
    manager: "",
    profile_image: null,
    imagePreview: null,
    is_staff: false,
    is_active: true,
    is_hr_manager: false,
    is_manager: false,
    documents: [],
    permanent_address: "",
    check_in_time: "",
    working_hours: "",
    location: "",
    eobi_no: "",
    blood_group: "",
    gender: "",
    marital_status: null,
    cnic_no: "",
    cnic_issue_date: "",
    cnic_expiry_date: "",
    dv_license_no: "",
    dv_license_issue_date: "",
    dv_license_expiry_date: "",
    company_email: "",
    father_name: "",
    father_cnic_no: "",
    em_name_1: "",
    em_relationship_1: "",
    em_contact_1: "",
    em_email_1: "",
    em_name_2: "",
    em_relationship_2: "",
    em_contact_2: "",
    em_email_2: "",
    nok_name: "",
    nok_relationship: "",
    nok_cnic: "",
    nok_contact: "",
    nok_email: "",
    nok_permanent_address: "",
    nationality: "",
    religion: "",
    disability: "",
    ref_name_1: "",
    ref_mobile_1: "",
    ref_email_1: "",
    ref_designation_1: "",
    ref_company_1: "",
    ref_name_2: "",
    ref_mobile_2: "",
    ref_email_2: "",
    ref_designation_2: "",
    ref_company_2: "",
    spouse_name: "",
    spouse_date_of_birth: "",
    spouse_relationship: "",
    spouse_cnic: "",
    qualifications: [{ institute: '', degree: '', year_from: '', year_to: '', gpa: '' }],
    employments: [{ company_name: '', designation: '', year_from: '', year_to: '', reason_for_leaving: '' }],
    dependents: [{ name: '', date_of_birth: '', relation: '', cnic: '' }],

  });
  const [preview, setPreview] = useState('');
  const [documents, setDocuments] = useState([]);  // State to hold documents
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { currentUser } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {

    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API}/employees/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setEmployees(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("There was an error fetching the employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${API}/departments/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setDepartments(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError("There was an error fetching the department data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();

    if (employee) {
      console.log(employee);
      setFormData({
        first_name: employee.first_name,
        middle_name: employee.middle_name || '',
        last_name: employee.last_name,
        username: employee.username,
        email: employee.email,
        phone: employee.phone,
        alternate_phone: employee.alternate_phone || '',
        address: employee.address,
        permanent_address: employee.permanent_address || '',
        date_of_birth: employee.date_of_birth,
        employment_date: employee.employment_date,
        department: employee.department,
        position: employee.position,
        location: employee.location,
        check_in_time: employee.check_in_time,
        working_hours: employee.working_hours,
        eobi_no: employee.eobi_no,
        salary: employee.salary || '',
        manager: employee.manager || '',
        profile_pic: employee.profile_image || null,

        // Dependent Information (if any dependents exist)
        dependents: employee.dependents || [],

        // Emergency Information (if any dependents exist)
        em_name_1: employee.emergency_contacts[0]?.em_name_1 || "",
        em_relationship_1: employee.emergency_contacts[0]?.em_relationship_1 || "",
        em_contact_1: employee.emergency_contacts[0]?.em_contact_1 || "",
        em_email_1: employee.emergency_contacts[0]?.em_email_1 || "",
        em_name_2: employee.emergency_contacts[0]?.em_name_2 || "",
        em_relationship_2: employee.emergency_contacts[0]?.em_relationship_2 || "",
        em_contact_2: employee.emergency_contacts[0]?.em_contact_2 || "",
        em_email_2: employee.emergency_contacts[0]?.em_email_2 || "",


        // Documents (if any documents exist)
        documents: employee.documents || [],

        // Next of Kin (NOK) Information
        nok_name: employee.nok_name || '',
        nok_relationship: employee.nok_relationship || '',
        nok_cnic: employee.nok_cnic || '',
        nok_contact: employee.nok_contact || '',
        nok_email: employee.nok_email || '',
        nok_permanent_address: employee.nok_permanent_address || '',

        // Other Fields
        is_active: employee.is_active || true,
        blood_group: employee.blood_group || '',
        gender: employee.gender || '',
        marital_status: employee.marital_status || false,
        cnic_no: employee.cnic_no || '',
        cnic_issue_date: employee.cnic_issue_date || '',
        cnic_expiry_date: employee.cnic_expiry_date || '',
        dv_license_no: employee.dv_license_no || '',
        dv_license_issue_date: employee.dv_license_issue_date || '',
        dv_license_expiry_date: employee.dv_license_expiry_date || '',
        company_email: employee.company_email || '',
        father_name: employee.father_name || '',
        father_cnic_no: employee.father_cnic_no || '',
        nationality: employee.nationality || '',
        religion: employee.religion || '',
        disability: employee.disability || '',
        spouse_name: employee.spouse_name || '',
        spouse_date_of_birth: employee.spouse_date_of_birth || '',
        spouse_relationship: employee.spouse_relationship || '',
        spouse_cnic: employee.spouse_cnic || '',
        qualifications: employee.qualifications || [],
        employments: employee.employments || [],
        ref_name_1: employee.ref_name_1 || '',
        ref_mobile_1: employee.ref_mobile_1 || '',
        ref_email_1: employee.ref_email_1 || '',
        ref_designation_1: employee.ref_designation_1 || '',
        ref_company_1: employee.ref_company_1 || '',
        ref_name_2: employee.ref_name_2 || '',
        ref_mobile_2: employee.ref_mobile_2 || '',
        ref_email_2: employee.ref_email_2 || '',
        ref_designation_2: employee.ref_designation_2 || '',
        ref_company_2: employee.ref_company_2 || '',
      });

      setPreview(employee.profile_image);
    }


    setDocuments(employee.documents);  // Set the documents from the response

  }, [employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleQualificationChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedQualifications = [...prev.qualifications];
      updatedQualifications[index] = { ...updatedQualifications[index], [name]: value };
      return { ...prev, qualifications: updatedQualifications };
    });
  };

  const addQualification = () => {
    setFormData((prev) => ({
      ...prev,
      qualifications: [
        ...prev.qualifications,
        { institute: '', degree: '', year_from: '', year_to: '', gpa: '' },
      ],
    }));
  };

  const removeQualification = (index) => {
    setFormData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
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

  const handleFilesChange = (event) => {
    const files = event.target.files;
    const selectedFiles = Array.from(files); // Convert FileList to an array
    setSelectedFiles(selectedFiles);  // Store selected files in the state
  };

  const handleDocumentsUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files before uploading.");
      return
    }


    const formData = new FormData();

    // Append each file to FormData
    selectedFiles.forEach((file, index) => {
      formData.append("documents", file);  // Append each file with the same key
    });

    // Append employee_id to formData
    formData.append("employee_id", employee.id);

    try {
      const response = await axios.put(`${API}/update-employee-documents/${employee.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Documents uploaded successfully!");
      setSelectedFiles([]); // Clear the file input after upload
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.error("Failed to upload documents. Please try again.");
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white w-[90%] lg:w-[70%] h-[80vh] overflow-auto p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
        <form onSubmit={handleSubmit}>
          {/* Required Information */}
          <div className="my-8 text-center">
            <div className="flex items-center">
              <hr className="flex-grow border-t border-gray-300" />
              <h1 className="mx-4 text-2xl font-bold tracking-wide">Required Information</h1>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">First Name *</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                  required
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Middle Name</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Last Name *</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                  required
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Username *</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Department *</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUserShield className="m-2" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                >
                  <option value="">-- Select a department --</option>
                  {departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Password *</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaLock className="m-2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>
          </div>

          <div className="my-8 text-center">
            <div className="flex items-center">
              <hr className="flex-grow border-t border-gray-300" />
              <h1 className="mx-4 text-2xl font-bold tracking-wide">Contact Information</h1>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Company Email</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaEnvelope className="m-2" />
                <input
                  type="text"
                  name="company_email"
                  value={formData.company_email}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Alternative Email</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaEnvelope className="m-2" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Phone</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaPhone className="m-2" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Alternate Phone</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaPhone className="m-2" />
                <input
                  type="text"
                  name="alternate_phone"
                  value={formData.alternate_phone}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="my-8 text-center">
            <div className="flex items-center">
              <hr className="flex-grow border-t border-gray-300" />
              <h1 className="mx-4 text-2xl font-bold tracking-wide">Personal Information</h1>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Current Address</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaAddressCard className="m-2" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Permanent Address</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaAddressCard className="m-2" />
                <input
                  type="text"
                  name="permanent_address"
                  value={formData.permanent_address}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Date of Birth</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaCalendar className="m-2" />
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Gender</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={() => handleInputChange({ target: { name: "gender", value: "male" } })}
                    className="mr-2"
                  />
                  Male
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={() => handleInputChange({ target: { name: "gender", value: "female" } })}
                    className="mr-2"
                  />
                  Female
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Blood Group</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="blood_group"
                  value={formData.blood_group}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Marital Status</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="marital_status"
                    value="Single"
                    checked={formData.marital_status === false}
                    onChange={() => handleInputChange({ target: { name: "marital_status", value: false } })}
                    className="mr-2"
                  />
                  Single
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="marital_status"
                    value="Married"
                    checked={formData.marital_status === true}
                    onChange={() => handleInputChange({ target: { name: "marital_status", value: true } })}
                    className="mr-2"
                  />
                  Married
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Nationality</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Religion</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Any Disability/Sickness</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="disability"
                  value={formData.disability}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2"></div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/3">
              <label className="block text-sm mb-2">CNIC No.</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaAddressCard className="m-2" />
                <input
                  type="text"
                  name="cnic_no"
                  value={formData.cnic_no}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/3">
              <label className="block text-sm mb-2">Issue Date</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaCalendar className="m-2" />
                <input
                  type="date"
                  name="cnic_issue_date"
                  value={formData.cnic_issue_date}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/3">
              <label className="block text-sm mb-2">Expiry Date</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaCalendar className="m-2" />
                <input
                  type="date"
                  name="cnic_expiry_date"
                  value={formData.cnic_expiry_date}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/3">
              <label className="block text-sm mb-2">Driving License No.</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaAddressCard className="m-2" />
                <input
                  type="text"
                  name="dv_license_no"
                  value={formData.dv_license_no}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/3">
              <label className="block text-sm mb-2">Issue Date</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaCalendar className="m-2" />
                <input
                  type="date"
                  name="dv_license_issue_date"
                  value={formData.dv_license_issue_date}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/3">
              <label className="block text-sm mb-2">Expiry Date</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaCalendar className="m-2" />
                <input
                  type="date"
                  name="dv_license_expiry_date"
                  value={formData.dv_license_expiry_date}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>
          </div>

          <div className="my-8 text-center">
            <div className="flex items-center">
              <hr className="flex-grow border-t border-gray-300" />
              <h1 className="mx-4 text-2xl font-bold tracking-wide">Employment Details</h1>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Position</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUserShield className="m-2" />
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Salary</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaDollarSign className="m-2" />
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Check-In Time</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaClock className="m-2" />
                <input
                  type="time"
                  name="check_in_time"
                  value={formData.check_in_time}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Working Hours</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaClock className="m-2" />
                <input
                  type="number"
                  name="working_hours"
                  value={formData.working_hours}
                  onChange={handleInputChange}
                  min="0"
                  step="0.5"
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                  placeholder="Enter hours (e.g., 8.5)"
                />
                <span className="ml-2 text-gray-500">hours</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Manager</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUserShield className="m-2" />
                <select
                  name="manager"
                  value={formData.manager}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                >
                  <option value="">-- Select a Manager --</option>
                  console.log(employees);
                  {employees.map((employee) => (
                    employee.is_hr_manager || employee.is_hr_manager || employee.is_manager
                      ? <option key={employee.id} value={employee.id}>
                        {`${employee.first_name} ${employee.last_name}`}
                      </option>
                      : null
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Date of Joining</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaCalendar className="m-2" />
                <input
                  type="date"
                  name="employment_date"
                  value={formData.employment_date}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">HR Manager</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUserShield className="m-2" />
                <select
                  name="is_hr_manager"
                  value={formData.is_hr_manager}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                >
                  <option value={false}>False</option>
                  <option value={true}>True</option>
                </select>
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Manager</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUserShield className="m-2" />
                <select
                  name="is_manager"
                  value={formData.is_manager}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                >
                  <option value={false}>False</option>
                  <option value={true}>True</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Location</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaAddressCard className="m-2" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">EOBI No.</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="eobi_no"
                  value={formData.eobi_no}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>
          </div>

          <div className="mb-4 w-full lg:w-1/2">
            <label className="block text-sm mb-2">Active Status</label>
            <div className="flex items-center bg-gray-200 rounded">
              {formData.is_active ? (
                <FaToggleOn className="m-2" />
              ) : (
                <FaToggleOff className="m-2" />
              )}
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="ml-2"
              />
              <span className="ml-2">Active</span>
            </div>
          </div>

          {/* Family Information */}
          <div className="my-8 text-center">
            <div className="flex items-center">
              <hr className="flex-grow border-t border-gray-300" />
              <h1 className="mx-4 text-2xl font-bold tracking-wide">Family Information</h1>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Father's Name (as per CNIC)</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">CNIC No.</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaAddressCard className="m-2" />
                <input
                  type="text"
                  name="father_cnic_no"
                  value={formData.father_cnic_no}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Spouse Name</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="spouse_name"
                  value={formData.spouse_name}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Date of Birth</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaCalendar className="m-2" />
                <input
                  type="date"
                  name="spouse_date_of_birth"
                  value={formData.spouse_date_of_birth}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Relation</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="spouse_relationship"
                  value={formData.spouse_relationship}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">CNIC No.</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaAddressCard className="m-2" />
                <input
                  type="text"
                  name="spouse_cnic"
                  value={formData.spouse_cnic}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            {formData.qualifications.map((qualification, index) => (
              <div
                key={index}
                className="qualification-section mb-4 flex flex-wrap items-center gap-4 bg-gray-100 p-4 rounded shadow"
              >
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm mb-1">Institute</label>
                  <input
                    type="text"
                    name="institute"
                    value={qualification.institute}
                    onChange={(e) => handleQualificationChange(index, e)}
                    className="w-full p-2 bg-gray-200 border-none outline-none rounded"
                  />
                </div>

                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm mb-1">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    value={qualification.degree}
                    onChange={(e) => handleQualificationChange(index, e)}
                    className="w-full p-2 bg-gray-200 border-none outline-none rounded"
                  />
                </div>

                <div className="flex-1 min-w-[100px]">
                  <label className="block text-sm mb-1">Year From</label>
                  <input
                    type="number"
                    name="year_from"
                    value={qualification.year_from}
                    onChange={(e) => handleQualificationChange(index, e)}
                    className="w-full p-2 bg-gray-200 border-none outline-none rounded"
                  />
                </div>

                <div className="flex-1 min-w-[100px]">
                  <label className="block text-sm mb-1">Year To</label>
                  <input
                    type="number"
                    name="year_to"
                    value={qualification.year_to}
                    onChange={(e) => handleQualificationChange(index, e)}
                    className="w-full p-2 bg-gray-200 border-none outline-none rounded"
                  />
                </div>

                <div className="flex-1 min-w-[100px]">
                  <label className="block text-sm mb-1">GPA</label>
                  <input
                    type="number"
                    name="gpa"
                    step="0.1"
                    value={qualification.gpa}
                    onChange={(e) => handleQualificationChange(index, e)}
                    className="w-full p-2 bg-gray-200 border-none outline-none rounded"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeQualification(index)}
                  className="bg-red-500 text-white rounded hover:underline min-w-[80px] mt-4 md:mt-0"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addQualification}
              className="bg-blue-500 text-white p-2 rounded min-w-[80px] mt-4"
            >
              Add Qualification
            </button>
          </div>

          {/* <div className="mb-4">
              {formData.dependents.map((dependent, index) => (
                <div key={index} className="dependent-section mb-4 flex flex-wrap items-center gap-4 bg-gray-100 p-4 rounded shadow">

                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm mb-2">Dependent Name</label>
                    <input
                      type="text"
                      name="name"
                      value={dependent.name}
                      onChange={(e) => handleDependentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"

                    />
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={dependent.date_of_birth}
                      onChange={(e) => handleDependentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"

                    />
                  </div>

                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-sm mb-2">Relation</label>
                    <input
                      type="text"
                      name="relation"
                      value={dependent.relation}
                      onChange={(e) => handleDependentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"

                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm mb-2">CNIC No.</label>
                    <input
                      type="text"
                      name="cnic"
                      value={dependent.cnic}
                      onChange={(e) => handleDependentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"

                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeDependent(index)}
                    className="bg-red-500 text-white rounded hover:underline min-w-[80px] mt-4 md:mt-0"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addDependent}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add Dependent
              </button>
            </div> */}

          {/* Next of Kin */}
          <div className="my-8 text-center">
            <div className="flex items-center">
              <hr className="flex-grow border-t border-gray-300" />
              <h1 className="mx-4 text-2xl font-bold tracking-wide">Next of Kin</h1>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Next of Kin Name (as per CNIC)</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="nok_name"
                  value={formData.nok_name}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Relationship</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="nok_relationship"
                  value={formData.nok_relationship}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">CNIC No.</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaAddressCard className="m-2" />
                <input
                  type="text"
                  name="nok_cnic"
                  value={formData.nok_cnic}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Contact No.</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaPhone className="m-2" />
                <input
                  type="text"
                  name="nok_contact"
                  value={formData.nok_contact}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Email Address</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaEnvelope className="m-2" />
                <input
                  type="text"
                  name="nok_email"
                  value={formData.nok_email}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Permanent Address</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaAddressCard className="m-2" />
                <input
                  type="text"
                  name="nok_permanent_address"
                  value={formData.nok_permanent_address}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>
          </div>

          <div>
            {/* Emergency Contact Section */}
            <div className="my-8 text-center">
              <div className="flex items-center">
                <hr className="flex-grow border-t border-gray-300" />
                <h1 className="mx-4 text-2xl font-bold tracking-wide">Emergency Contact</h1>
                <hr className="flex-grow border-t border-gray-300" />
              </div>
            </div>

            {/* Emergency Contact 1 */}
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <div className="mb-4 w-full lg:w-1/2">
                <label className="block text-sm mb-2">Emergency Contact Name</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="em_name_1"
                    value={formData.em_name_1 || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>
              <div className="mb-4 w-full lg:w-1/2">
                <label className="block text-sm mb-2">Relationship</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="em_relationship_1"
                    value={formData.em_relationship_1 || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <div className="mb-4 w-full lg:w-1/2">
                <label className="block text-sm mb-2">Emergency Contact</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaPhone className="m-2" />
                  <input
                    type="text"
                    name="em_contact_1"
                    value={formData.em_contact_1 || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>
              <div className="mb-4 w-full lg:w-1/2">
                <label className="block text-sm mb-2">Email Address</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaEnvelope className="m-2" />
                  <input
                    type="text"
                    name="em_email_1"
                    value={formData.em_email_1 || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact 2 */}
            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <div className="mb-4 w-full lg:w-1/2">
                <label className="block text-sm mb-2">Emergency Contact Name</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="em_name_2"
                    value={formData.em_name_2 || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>
              <div className="mb-4 w-full lg:w-1/2">
                <label className="block text-sm mb-2">Relationship</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="em_relationship_2"
                    value={formData.em_relationship_2 || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:space-x-4">
              <div className="mb-4 w-full lg:w-1/2">
                <label className="block text-sm mb-2">Emergency Contact</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaPhone className="m-2" />
                  <input
                    type="text"
                    name="em_contact_2"
                    value={formData.em_contact_2 || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>
              <div className="mb-4 w-full lg:w-1/2">
                <label className="block text-sm mb-2">Email Address</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaEnvelope className="m-2" />
                  <input
                    type="text"
                    name="em_email_2"
                    value={formData.em_email_2 || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>
            </div>
          </div>


          {/* Experience */}
          {/* <div className="my-8 text-center">
              <div className="flex items-center">
                <hr className="flex-grow border-t border-gray-300" />
                <h1 className="mx-4 text-2xl font-bold tracking-wide">Experience</h1>
                <hr className="flex-grow border-t border-gray-300" />
              </div>
            </div>

            <div className="b-4">
              {formData.employments.map((employment, index) => (
                <div key={index} className="employment-section mb-4 flex flex-wrap items-center gap-4 bg-gray-100 p-4 rounded shadow">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm mb-2">Company Name</label>
                    <input
                      type="text"
                      name="company_name"
                      value={employment.company_name}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"

                    />
                  </div>

                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-sm mb-2">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={employment.designation}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"

                    />
                  </div>

                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-sm mb-2">Year From</label>
                    <input
                      type="number"
                      name="year_from"
                      value={employment.year_from}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"

                    />
                  </div>

                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-sm mb-2">Year To</label>
                    <input
                      type="number"
                      name="year_to"
                      value={employment.year_to}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"

                    />
                  </div>

                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm mb-2">Reason for Leaving</label>
                    <input
                      type="text"
                      name="reason_for_leaving"
                      step="0.1"
                      value={employment.reason_for_leaving}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"

                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeEmployment(index)}
                    className="bg-red-500 text-white rounded hover:underline min-w-[80px] mt-4 md:mt-0"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addEmployment}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add Employment
              </button>
            </div> */}

          {/* References */}
          <div className="my-8 text-center">
            <div className="flex items-center">
              <hr className="flex-grow border-t border-gray-300" />
              <h1 className="mx-4 text-2xl font-bold tracking-wide">References</h1>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Reference Name #1</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="ref_name_1"
                  value={formData.ref_name_1}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Mobile No.</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaPhone className="m-2" />
                <input
                  type="text"
                  name="ref_mobile_1"
                  value={formData.ref_mobile_1}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Email Address</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaEnvelope className="m-2" />
                <input
                  type="text"
                  name="ref_email_1"
                  value={formData.ref_email_1}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Designation</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaAddressCard className="m-2" />
                <input
                  type="text"
                  name="ref_designation_1"
                  value={formData.ref_designation_1}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Company Name</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaAddressCard className="m-2" />
                <input
                  type="text"
                  name="ref_company_1"
                  value={formData.ref_company_1}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Reference Name #2</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaUser className="m-2" />
                <input
                  type="text"
                  name="ref_name_2"
                  value={formData.ref_name_2}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Mobile No.</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaPhone className="m-2" />
                <input
                  type="text"
                  name="ref_mobile_2"
                  value={formData.ref_mobile_2}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Email Address</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaEnvelope className="m-2" />
                <input
                  type="text"
                  name="ref_email_2"
                  value={formData.ref_email_2}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Designation</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaAddressCard className="m-2" />
                <input
                  type="text"
                  name="ref_designation_2"
                  value={formData.ref_designation_2}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>

            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Company Name</label>
              <div className="flex items-center bg-gray-200 rounded">
                <FaAddressCard className="m-2" />
                <input
                  type="text"
                  name="ref_company_2"
                  value={formData.ref_company_2}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none"

                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="my-8 text-center">
            <div className="flex items-center">
              <hr className="flex-grow border-t border-gray-300" />
              <h1 className="mx-4 text-2xl font-bold tracking-wide">Documents</h1>
              <hr className="flex-grow border-t border-gray-300" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-4">
            <div className="mb-4 w-full lg:w-1/2">
              <label className="block text-sm mb-2">Profile Image</label>
              <input
                type="file"
                name="profile_image"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {formData.imagePreview && (
                <img
                  src={formData.imagePreview}
                  alt="Profile Preview"
                  className="w-32 h-32 object-cover mt-2 rounded"
                />
              )}
            </div>
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

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Upload Documents:</label>
              <input
                type="file"
                name="document"
                onChange={handleFilesChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                multiple
              />
              <button
                type="button"
                onClick={handleDocumentsUpload}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Upload
              </button>
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