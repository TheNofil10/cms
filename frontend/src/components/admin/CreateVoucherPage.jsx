import { useEffect, useState } from "react";
import axios from "axios";
import CreateVoucher from "./CreateVoucher";
import { FaBuilding, FaSpinner } from "react-icons/fa";
import API from "../../api/api";

const AddVoucherPage = () => {
  const [voucher, setVouchers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get(
          `${API}/vouchers/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setVouchers(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        setError("There was an error fetching the voucher data.");
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
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
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError("There was an error fetching the department data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading)
    return (
      <div className="text-center">
        <FaSpinner className="animate-spin" />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="w-full">
      {/* Header */}
      <header className="bg-black text-white p-5 shadow-md w-full">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Create Voucher</h1>
        </div>
      </header>

      <div className="flex h-screen bg-white">
        <div className="w-3/4 flex flex-col">
          <div className="bg-white rounded-lg flex-1">
            <CreateVoucher />
          </div>
        </div>
        
        <div className="w-1/4 flex flex-col">
          <div className="bg-white p-4 shadow-lg h-64 rounded-lg flex-1 overflow-y-auto">
            <h2 className="text-xl font-bold mb-2">Departments</h2>
            {departments.length === 0 ? (
              <p>No departments available</p>
            ) : (
              <ul>
                {departments.map((department) => (
                  <li key={department.id} className="flex items-center mb-2">
                    <FaBuilding className="mr-2" />
                    <div className="flex-1">{department.name || "No Department Name"}</div>
                    <span className="text-gray-500 ml-2">
                      ID: {department.id}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVoucherPage;
