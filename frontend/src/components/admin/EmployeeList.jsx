import React, { useEffect, useMemo, useState } from "react";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import axios from "axios";
import { FaFilter, FaSort, FaSortDown, FaSortUp, FaSearch } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import EmployeeProfile from "./EmployeeProfile";
import EmployeeCard from "./EmployeeCard";
import { useNavigate } from "react-router-dom";
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("table"); // "table" or "card"
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/employees/", {
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
  }, []);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "First Name", accessor: "first_name" },
      { Header: "Last Name", accessor: "last_name" },
      { Header: "Email", accessor: "email" },
      { Header: "Position", accessor: "position" },
      { Header: "Department", accessor: "department" },
    ],
    []
  );

  const data = useMemo(() => employees, [employees]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable({ columns, data }, useFilters, useGlobalFilter, useSortBy);

  const { globalFilter } = state;

  const navigate = useNavigate(); // Initialize useNavigate

  const handleEmployeeClick = (employee) => {
    navigate(`/admin/employees/${employee.id}`); // Navigate to the employee profile page
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/employees/${employeeId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      toast.error("Employee deleted successfully");
      setEmployees(employees.filter((emp) => emp.id !== employeeId));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Employee not found");
      } else {
        console.error("Error deleting employee:", error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <FaSearch size={20} className="text-gray-500 mr-2" />
          <input
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search employees..."
            className="border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div>
          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 rounded-lg mr-2 ${view === "table" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Table View
          </button>
          <button
            onClick={() => setView("card")}
            className={`px-4 py-2 rounded-lg ${view === "card" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            Card View
          </button>
        </div>
      </div>

      {selectedEmployee && (
        <EmployeeProfile
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onDelete={() => handleDeleteEmployee(selectedEmployee.id)}
        />
      )}

      {view === "table" ? (
        <table {...getTableProps()} className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-4 py-2 border-b text-left"
                  >
                    <div className="flex items-center">
                      {column.render("Header")}
                      <span className="ml-2">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <FaSortDown />
                          ) : (
                            <FaSortUp />
                          )
                        ) : (
                          <FaSort />
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} onClick={() => handleEmployeeClick(row.original)}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="px-4 py-2 border-b">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onClick={() => handleEmployeeClick(employee)}
            />
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default EmployeeList;
