/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { Link, useNavigate } from "react-router-dom";
import { Line } from "rc-progress";
import axios from "axios";
import API from "../../api/api";

const SERVER_URL = API;

const Signup = () => {
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

  const handleEmploymentChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedEmployments = [...prev.employments];
      updatedEmployments[index] = { ...updatedEmployments[index], [name]: value };
      return { ...prev, employments: updatedEmployments };
    });
  };
  
  const addEmployment = () => {
    setFormData((prev) => ({
      ...prev,
      employments: [
        ...prev.employments,
        { company_name: '', designation: '', year_from: '', year_to: '', reason_for_leaving: '' },
      ],
    }));
  };
  
  const removeEmployment = (index) => {
    setFormData((prev) => ({
      ...prev,
      employments: prev.employments.filter((_, i) => i !== index),
    }));
  };

  const handleDependentChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedDependents = [...prev.dependents];
      updatedDependents[index] = { ...updatedDependents[index], [name]: value };
      return { ...prev, dependents: updatedDependents };
    });
  };
  
  const addDependent = () => {
    setFormData((prev) => ({
      ...prev,
      dependents: [
        ...prev.dependents,
        { name: '', date_of_birth: '', relation: '', cnic: '' },
      ],
    }));
  };
  
  const removeDependent = (index) => {
    setFormData((prev) => ({
      ...prev,
      dependents: prev.dependents.filter((_, i) => i !== index),
    }));
  };

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
    is_active: false,
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
    marital_status: false,
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

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profile_image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleDocumentsChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prev) => {
      const uniqueFiles = newFiles.filter(
        (newFile) =>
          !prev.documents.some(
            (doc) => doc.name === newFile.name && doc.size === newFile.size
          )
      );
      return {
        ...prev,
        documents: [...prev.documents, ...uniqueFiles],
      };
    });
  };
  
  
  const handleNextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        return formData.first_name && formData.last_name && formData.username;
      case 2:
        return formData.email && formData.password;
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return true;
    }
  };

 
  const handleSignup = (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formDataObj = new FormData();

    console.log(formData);
    
    // Loop through formData and append necessary fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        // Handle qualifications array
        if (key === 'qualifications' && formData[key].length > 0) {
          formData[key].forEach((qualification, index) => {
            Object.keys(qualification).forEach((qualificationKey) => {
              formDataObj.append(`qualifications[${index}][${qualificationKey}]`, qualification[qualificationKey]);
            });
          });
        }
        // Handle employments array
        else if (key === 'employments' && formData[key].length > 0) {
          formData[key].forEach((employment, index) => {
            Object.keys(employment).forEach((employmentKey) => {
              formDataObj.append(`employments[${index}][${employmentKey}]`, employment[employmentKey]);
            });
          });
        }
        // Handle dependents array
        else if (key === 'dependents' && formData[key].length > 0) {
          formData[key].forEach((dependent, index) => {
            Object.keys(dependent).forEach((dependentKey) => {
              formDataObj.append(`dependents[${index}][${dependentKey}]`, dependent[dependentKey]);
            });
          });
        }
        // Handle documents array
        else if (key === "documents" && formData[key].length > 0) {
          formData[key].forEach((file) => {
            formDataObj.append("documents", file);
          });
        }
        // Handle other form data fields
        else {
          formDataObj.append(key, formData[key]);
        }

    }});
  
    // Send form data via axios
    axios
      .post(`${SERVER_URL}/employees/`, formDataObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("Signed Up Successfully");
        
        // Reset form data after successful signup
        setFormData({
          first_name: "",
          middle_name: "",
          last_name: "",
          username: "",
          email: "",
          password: "",
          phone: "",
          alternate_phone: "",
          address: "",
          date_of_birth: "",
          employment_date: "",
          department: "",
          position: "",
          salary: "",
          manager: "",
          emergency_contact: "",
          profile_image: null,
          imagePreview: null,
          is_staff: false,
          is_active: true,
          is_hr_manager: false,
          is_manager: false,
          documents: [], // Reset documents array
          permanent_address: "",
          check_in_time: "",
          working_hours: "",
          employee_id: "",
          location: "",
          eobi_no: "",
          blood_group: "",
          gender: "",
          marital_status: false,
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
          qualifications: [], // Reset qualifications array
          employments: [], // Reset employments array
          dependents: [], // Reset dependents array
        });
  
        setStep(1);
        navigate("/hr/employees");
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getProgress = () => (step / 15) * 100;

  return (
    <div className="min-h-screen flex flex-col justify-start items-center mt-10 rounded shadow-xl bg-white text-gray-900">
      <div className="w-full max-w-md">
        <h2 className="text-3xl mb-6 text-black text-center">
          Employee Details
        </h2>
        <Line percent={getProgress()} strokeWidth="2" strokeColor="black" />
        <form
          onSubmit={handleSignup}
          className="bg-white text-black p-8 rounded-lg shadow-2xl"
        >
          {/* Step 1 */}
          {step === 1 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">First Name</label>
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
              <div className="mb-4">
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
              <div className="mb-4">
                <label className="block text-sm mb-2">Last Name</label>
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
              <div className="mb-4">
                <label className="block text-sm mb-2">Username</label>
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
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Email</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaEnvelope className="m-2" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Password</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaLock className="m-2" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Phone</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaPhone className="m-2" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
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

              <div className="mb-4">
                <label className="block text-sm mb-2">Current Address</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Permanent Address</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="text"
                    name="permanent_address"
                    value={formData.permanent_address}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Date of Birth</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaCalendar className="m-2" />
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Department</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Position</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUserShield className="m-2" />
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
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

              <div className="mb-4">
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

              <div className="mb-4">
                <label className="block text-sm mb-2">Date of Joining</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaCalendar className="m-2" />
                  <input
                    type="date"
                    name="employment_date"
                    value={formData.employment_date}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Location</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Salary</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaDollarSign className="m-2" />
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Manager</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUserShield className="m-2" />
                  <input
                    type="text"
                    name="manager"
                    value={formData.manager}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 5 */}
          {step == 5 && (
            <>
              <div className="mb-4">
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

              {/* Document Upload */}
              <div className="mb-4">
                <label className="block text-sm mb-2">Upload Documents</label>
                <input
                  type="file"
                  name="documents"
                  accept=".pdf,.doc,.docx,.jpg,.png"
                  multiple
                  onChange={handleDocumentsChange}
                  className="w-full"
                />
                {formData.documents.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-2">Selected Documents:</h4>
                    <ul className="list-disc pl-5">
                      {formData.documents.map((doc, index) => (
                        <li key={index} className="text-sm">
                          {doc.name} - {(doc.size / 1024).toFixed(2)} KB
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>


              {/* Navigation Buttons */}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 6 */}
          {step === 6 && (
            <>
              <div className="mb-4">
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
              <div className="mb-4">
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
              <div className="mb-4">
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
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 7 */}
          {step === 7 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">EOBI No.</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="eobi_no"
                    value={formData.eobi_no}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Blood Group</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="blood_group"
                    value={formData.blood_group}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
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

              <div className="mb-4">
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

              <div className="mb-4">
                <label className="block text-sm mb-2">CNIC No.</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="text"
                    name="cnic_no"
                    value={formData.cnic_no}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Issue Date</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaCalendar className="m-2" />
                  <input
                    type="date"
                    name="cnic_issue_date"
                    value={formData.cnic_issue_date}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Expiry Date</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaCalendar className="m-2" />
                  <input
                    type="date"
                    name="cnic_expiry_date"
                    value={formData.cnic_expiry_date}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Driving License No.</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="text"
                    name="dv_license_no"
                    value={formData.dv_license_no}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Issue Date</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaCalendar className="m-2" />
                  <input
                    type="date"
                    name="dv_license_issue_date"
                    value={formData.dv_license_issue_date}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Expiry Date</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaCalendar className="m-2" />
                  <input
                    type="date"
                    name="dv_license_expiry_date"
                    value={formData.dv_license_expiry_date}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Company Email</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaEnvelope className="m-2" />
                  <input
                    type="email"
                    name="company_email"
                    value={formData.company_email}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Father's Name (as per CNIC)</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">CNIC No.</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="text"
                    name="father_cnic_no"
                    value={formData.father_cnic_no}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 8 */}
          {step === 8 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Emergency Contact Name</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="em_name_1"
                    value={formData.em_name_1}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Relationship</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="em_relationship_1"
                    value={formData.em_relationship_1}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Emergency Contact</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaPhone className="m-2" />
                  <input
                    type="text"
                    name="em_contact_1"
                    value={formData.em_contact_1}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Email Address</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaEnvelope className="m-2" />
                  <input
                    type="email"
                    name="em_email_1"
                    value={formData.em_email_1}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Emergency Contact Name</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="em_name_2"
                    value={formData.em_name_2}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Relationship</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="em_relationship_2"
                    value={formData.em_relationship_2}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Emergency Contact</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaPhone className="m-2" />
                  <input
                    type="text"
                    name="em_contact_2"
                    value={formData.em_contact_2}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Email Address</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaEnvelope className="m-2" />
                  <input
                    type="email"
                    name="em_email_2"
                    value={formData.em_email_2}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 9 */}
          {step === 9 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Next of Kin Name (as per CNIC)</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="nok_name"
                    value={formData.nok_name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Relationship</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="nok_relationship"
                    value={formData.nok_relationship}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">CNIC No.</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="text"
                    name="nok_cnic"
                    value={formData.nok_cnic}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
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

              <div className="mb-4">
                <label className="block text-sm mb-2">Email Address</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaEnvelope className="m-2" />
                  <input
                    type="email"
                    name="nok_email"
                    value={formData.nok_email}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Permanent Address</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="text"
                    name="nok_permanent_address"
                    value={formData.nok_permanent_address}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 10 */}
          {step === 10 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Nationality</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Religion</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Any Disability/Sickness</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="disability"
                    value={formData.disability}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 11 */}
          {step === 11 && (
            <>
              {formData.qualifications.map((qualification, index) => (
                <div key={index} className="qualification-section mb-4">
                  <div className="mb-2">
                    <label className="block text-sm mb-2">Institute</label>
                    <input
                      type="text"
                      name="institute"
                      value={qualification.institute}
                      onChange={(e) => handleQualificationChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm mb-2">Degree</label>
                    <input
                      type="text"
                      name="degree"
                      value={qualification.degree}
                      onChange={(e) => handleQualificationChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm mb-2">Year From</label>
                    <input
                      type="number"
                      name="year_from"
                      value={qualification.year_from}
                      onChange={(e) => handleQualificationChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm mb-2">Year To</label>
                    <input
                      type="number"
                      name="year_to"
                      value={qualification.year_to}
                      onChange={(e) => handleQualificationChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm mb-2">GPA</label>
                    <input
                      type="number"
                      name="gpa"
                      step="0.1"
                      value={qualification.gpa}
                      onChange={(e) => handleQualificationChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeQualification(index)}
                    className="text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addQualification}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add Qualification
              </button>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 12 */}
          {step === 12 && (
            <>
              {formData.employments.map((employment, index) => (
                <div key={index} className="employment-section mb-4">
                  <div className="mb-2">
                    <label className="block text-sm mb-2">Company Name</label>
                    <input
                      type="text"
                      name="company_name"
                      value={employment.company_name}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm mb-2">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={employment.designation}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm mb-2">Year From</label>
                    <input
                      type="number"
                      name="year_from"
                      value={employment.year_from}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm mb-2">Year To</label>
                    <input
                      type="number"
                      name="year_to"
                      value={employment.year_to}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm mb-2">Reason for Leaving</label>
                    <input
                      type="text"
                      name="reason_for_leaving"
                      step="0.1"
                      value={employment.reason_for_leaving}
                      onChange={(e) => handleEmploymentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeEmployment(index)}
                    className="text-red-600"
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

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}
          
          {/* Step 13 */}
          {step === 13 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Reference Name #1</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="ref_name_1"
                    value={formData.ref_name_1}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Mobile No.</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaPhone className="m-2" />
                  <input
                    type="text"
                    name="ref_mobile_1"
                    value={formData.ref_mobile_1}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
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

              <div className="mb-4">
                <label className="block text-sm mb-2">Designation</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="email"
                    name="ref_designation_1"
                    value={formData.ref_designation_1}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Company Name</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="email"
                    name="ref_company_1"
                    value={formData.ref_company_1}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm mb-2">Reference Name #2</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="ref_name_2"
                    value={formData.ref_name_2}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Mobile No.</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaPhone className="m-2" />
                  <input
                    type="text"
                    name="ref_mobile_2"
                    value={formData.ref_mobile_2}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
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

              <div className="mb-4">
                <label className="block text-sm mb-2">Designation</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="email"
                    name="ref_designation_2"
                    value={formData.ref_designation_2}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Company Name</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="email"
                    name="ref_company_2"
                    value={formData.ref_company_2}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 14 */}
          {step === 14 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Spouse Name</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="spouse_name"
                    value={formData.spouse_name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Date of Birth</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaCalendar className="m-2" />
                  <input
                    type="date"
                    name="spouse_date_of_birth"
                    value={formData.spouse_date_of_birth}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Relation</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUser className="m-2" />
                  <input
                    type="text"
                    name="spouse_relationship"
                    value={formData.spouse_relationship}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">CNIC No.</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="text"
                    name="spouse_cnic"
                    value={formData.spouse_cnic}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {/* Step 15 */}
          {step === 15 && (
            <>
              {formData.dependents.map((dependent, index) => (
                <div key={index} className="dependent-section mb-4">
                  <div className="mb-2">
                    <label className="block text-sm mb-2">Dependent Name</label>
                    <input
                      type="text"
                      name="name"
                      value={dependent.name}
                      onChange={(e) => handleDependentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"
                      
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm mb-2">Date of Birth</label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={dependent.date_of_birth}
                      onChange={(e) => handleDependentChange(index, e)}
                      className="w-full p-2 bg-gray-200 border-none outline-none"
                      
                    />
                  </div>

                  <div className="mb-2">
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
                    className="text-red-600"
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

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                >
                  Previous
                </button>

                <button
                  type="submit"
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                  disabled={loading}
                >
                  {loading ? <FaSpinner className="animate-spin" /> : "Sign Up"}
                </button> 
              </div>
            </>
          )}


        </form>
      </div>
    </div>
  );
};

export default Signup;
