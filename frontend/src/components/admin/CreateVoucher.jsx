import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaAddressCard,
  FaCalendar,
  FaMoneyBillWave,
  FaUserShield,
  FaSpinner,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Line } from "rc-progress";
import axios from "axios";
import API from "../../api/api";
import { useAuth } from "../../contexts/AuthContext";

const SERVER_URL = API;

const AddVoucher = () => {
  const { currentUser } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState("");
  const [departmentHead, setDepartmentHead] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          `${API}/departments/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setDepartments(response.data.results || response.data || []);
        if (response.data.length === 1) {
          updateDepartmentDetails(0)
          formData.department = response.data.at(0).id
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError("There was an error fetching the department data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();

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
        setEmployees(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("There was an error fetching the employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
}, []);

  const [formData, setFormData] = useState({
    employee: currentUser.id,
    head_of_department: "",
    department: "",
    project: "",
    category: "",
    other_category: "",
    reason: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    documents: [],
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const updateDepartmentDetails = (value) => {
    console.log("Selected Value:", value);
    const selectedDepartment = departments.find((department) => department.id === Number(value));
    console.log(selectedDepartment);
    const head = selectedDepartment?.manager
      ? selectedDepartment?.manager
      : null;
    console.log("Department Head:", head);
    setDepartmentHead(head ? `${head.first_name} ${head.last_name}` : "No Head");
    return {
      department: value,
      head_of_department: head?.id || null,
    };
  };
  
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "department") {
      const updatedData = updateDepartmentDetails(value);
      console.log("Updated Data:", updatedData);
      setFormData((prev) => ({
        ...prev,
        ...updatedData,
      }));
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
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
    console.log(formData);
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
        return formData.department && formData.date && formData.amount && formData.reason;
      default:
        return false;
    }
  };

 
  const handleCreate = (e) => {
    e.preventDefault();
    setLoading(true);
  
    const formDataObj = new FormData();
    
    // Loop through formData and append necessary fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        // Handle documents array
        if (key === "documents" && formData[key].length > 0) {
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
      .post(`${SERVER_URL}/vouchers/`, formDataObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success("Signed Up Successfully");
        
        // Reset form data after successful signup
        setFormData({
          department: "",
          head_of_department: "",
          project: "",
          category: "",
          other_category: "",
          reason: "",
          amount: "",
          documents: [],
        });
  
        setStep(1);
        if (currentUser.is_superuser) navigate("/admin/dashboard");
        else if (currentUser.is_hr) navigate("/hr/dashboard");
        else navigate("/employee/dashboard");
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getProgress = () => (step / 2) * 100;


  return (
    <div className="min-h-screen flex flex-col justify-start items-center mt-10 rounded shadow-xl bg-white text-gray-900">
      <div className="w-full max-w-md">
        <h2 className="text-3xl mb-6 text-black text-center">
          Voucher Details
        </h2>
        
        <Line percent={getProgress()} strokeWidth="2" strokeColor="black" />
        <form
          onSubmit={handleCreate}
          className="bg-white text-black p-8 rounded-lg shadow-2xl"
        >
          {/* Step 1 */}
          {step === 1 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Department *</label>
                <div className="flex items-center bg-gray-200 rounded">
                    <FaUserShield className="m-2" />
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-gray-200 border-none outline-none"
                    >
                      {
                        (currentUser.is_hr_manager || currentUser.is_superuser) && (
                          <option value="">-- Select a department --</option>
                        )
                      }
                        {departments.map((department) => (
                            <option key={department.id} value={department.id}>
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-4">
                    <label className="block text-sm mb-2">Head of Department</label>
                    <input
                        type="text"
                        name="head_of_department"
                        value={departmentHead}
                        readOnly
                        disabled
                        className="w-full p-2 bg-gray-200 border-none outline-none text-gray-500 cursor-not-allowed"
                    />
                </div>
            </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Project</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUserShield className="m-2" />
                  <input
                    type="text"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Date *</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaCalendar className="m-2" />
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    disabled
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none text-gray-500 cursor-not-allowed"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Amount (PKR) *</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaMoneyBillWave className="m-2" />
                  <input
                    type="text"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm mb-2">Category</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaUserShield className="m-2" />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                  >
                    <option value={""}>-- Select a category --</option>
                    <option value={"fuel"}>Fuel</option>
                    <option value={"mobile phone"}>Mobile Phone</option>
                    <option value={"travel"}>Travel</option>
                    <option value={"internet"}>Internet</option>
                    <option value={"software"}>Software</option>
                    <option value={"entertainment/food"}>Entertainment / Food</option>
                    <option value={"office supplies"}>Office Supplies</option>
                    <option value={"labour"}>Labour</option>
                    <option value={"wellness"}>Wellness</option>
                    <option value={"other"}>Other...</option>
                  </select>
                </div>
              </div>

              {formData.category === "other" && (
                  <div className="mb-4">
                  <label className="block text-sm mb-2">Other Category</label>
                  <div className="flex items-center bg-gray-200 rounded">
                    <FaAddressCard className="m-2" />
                    <input
                      type="text"
                      name="other_category"
                      value={formData.other_category}
                      onChange={handleInputChange}
                      className="w-full p-2 bg-gray-200 border-none outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm mb-2">Reason *</label>
                <div className="flex items-center bg-gray-200 rounded">
                  <FaAddressCard className="m-2" />
                  <input
                    type="text"
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 border-none outline-none"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
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
          {step == 2 && (
            <>
              {/* Document Upload */}
              <div className="mb-4">
                <label className="block text-sm mb-2">Upload Supporting Documents</label>
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
                  type="submit"
                  className="bg-black text-white p-2 rounded hover:bg-gray-800 transition duration-200"
                  disabled={loading}
                >
                  {loading ? <FaSpinner className="animate-spin" /> : "Create"}
                </button> 
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddVoucher;
