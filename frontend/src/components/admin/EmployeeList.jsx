import React, { useEffect, useMemo, useState } from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  usePagination,
} from "react-table";
import axios from "axios";
import {
  FaFilter,
  FaSearch,
  FaTable as TableIcon,
  FaTh as CardIcon,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaBox,
  FaEye as ViewIcon,
  FaTrash as DeleteIcon,
  FaSortDown,
  FaSortUp,
  FaSort,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import AdminEmployeeProfile from "./AdminEmployeeProfile";
import EmployeeCard from "./EmployeeCard";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import ConfirmationModal from "./ConfirmationModal"; // Import the ConfirmationModal component
import { useAuth } from "../../contexts/AuthContext";
import API from "../../api/api";

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const EmployeeList = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("table");
  const { currentUser } = useAuth();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filters, setFilters] = useState({
    filterBy: "",
    filterValue: "",
  });
  const [pageSize, setPageSize] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
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
        setFilteredData(response.data.results || response.data || []);

      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("There was an error fetching the employee data.");
      } finally {
        console.log(employees)
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (filters.filterBy && filters.filterValue) {
      const filtered = employees.filter((employee) =>
        employee[filters.filterBy]
          ?.toString()
          .toLowerCase()
          .includes(filters.filterValue.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(employees);
    }
  }, [filters, employees]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "First Name", accessor: "first_name" },
      { Header: "Last Name", accessor: "last_name" },
      { Header: "Email", accessor: "email" },
      { Header: "Position", accessor: "position" },
      { Header: "Department", accessor: "department" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="text-blue-600 hover:text-blue-800 bg-transparent border-none"
              onClick={() => handleEmployeeClick(row.original)}
            >
              <ViewIcon onClick={() => handleEmployeeClick(row.original)} />
            </button>
            <button
              className="text-red-600 disabled:text-gray-300 disabled:hover:text-gray-300 hover:text-red-800 bg-transparent border-none"
              onClick={() => handleDeleteEmployee(row.original.id)}
              disabled={currentUser.is_hr_manager}
            >
              <DeleteIcon />
            </button>
          </div>
        ),
      },
    ],
    [employees, filteredData]
  );

  const data = useMemo(() => filteredData, [filteredData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    setAllFilters,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize: setTablePageSize,
    state: { pageIndex },
  } = useTable(
    { columns, data, initialState: { pageSize } },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const navigate = useNavigate();

  const handleEmployeeClick = (employee) => {
    if (currentUser.is_staff) navigate(`/admin/employees/${employee.id}`);
    else if (currentUser.is_hr_manager)
      navigate(`/hr/employees/${employee.id}`);
  };
  const handleDeleteEmployee = (employeeId, employeeName) => {
    setEmployeeToDelete({ id: employeeId, name: employeeName });
    setShowConfirmModal(true);
  };
  // const handleDeleteEmployee = async (employeeId) => {
  //   try {
  //     await axios.delete(`${API}/employees/${employeeId}/`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //       },
  //     });
  //     toast.error("Employee deleted successfully");
  //     setEmployees(employees.filter((emp) => emp.id !== employeeId));
  //     setFilteredData(filteredData.filter((emp) => emp.id !== employeeId));
  //     toast.success("Successfully deleted")
  //   } catch (error) {
  //     if (error.response && error.response.status === 404) {
  //       toast.error("Employee not found");
  //     } else {
  //       console.error("Error deleting employee:", error);
  //     }
  //   }
  // };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      await axios.delete(
        `${API}/employees/${employeeToDelete.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id));
      setFilteredData(
        filteredData.filter((emp) => emp.id !== employeeToDelete.id)
      );
      toast.success("Successfully deleted");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        toast.error("Employee not found");
      } else {
        console.error("Error deleting employee:", error);
      }
    } finally {
      setShowConfirmModal(false);
      setEmployeeToDelete(null);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleFilterByChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      filterBy: e.target.value,
      filterValue: "",
    }));
  };

  const applyFilters = () => {
    // Trigger useEffect to filter data
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");
    XLSX.writeFile(workbook, "employees.xlsx");
  };

  const handleExportToPdf = () => {
    const docDefinition = {
      content: filteredData.map((employee) => ({
        columns: [
          { text: employee.first_name, fontSize: 10 },
          { text: employee.last_name, fontSize: 10 },
          { text: employee.email, fontSize: 10 },
          { text: employee.position, fontSize: 10 },
          { text: employee.department, fontSize: 10 },
        ],
      })),
      pageMargins: [40, 40, 40, 40],
    };

    pdfMake.createPdf(docDefinition).download("employees.pdf");
  };

  const handleExportSelection = (format) => {
    if (format === "excel") {
      handleExportToExcel();
    } else if (format === "pdf") {
      handleExportToPdf();
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="container mx-auto p-4 bg-white text-black">

      <div className="flex justify-between items-center mb-4">
        {/* Left Section: Filters */}
        <div className="flex items-center space-x-2">
          <FaFilter className="text-sm" />
          <select
            name="filterBy"
            value={filters.filterBy}
            onChange={handleFilterByChange}
            className="py-1 px-2 border border-gray-400 rounded text-sm"
          >
            <option value="">Filter by...</option>
            <option value="first_name">First Name</option>
            <option value="last_name">Last Name</option>
            <option value="email">Email</option>
            <option value="position">Position</option>
            <option value="department">Department</option>
          </select>
          <input
            type="text"
            name="filterValue"
            value={filters.filterValue}
            onChange={handleFilterChange}
            placeholder="Enter value"
            className="py-1 px-2 border border-gray-400 rounded text-sm"
          />
          <button
            className="bg-black text-white border-none font-medium py-1 px-3 rounded text-xs"
            onClick={applyFilters}
          >
            Apply
          </button>
        </div>

        {/* Right Section: Export, View Toggle, Add Employee */}
        <div className="flex items-center space-x-2">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              className="bg-black text-white border-none font-medium py-1 px-3 rounded text-sm flex items-center"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FaBox className="inline mr-1" /> Export
              {isDropdownOpen ? (
                <FaChevronUp className="ml-1" />
              ) : (
                <FaChevronDown className="ml-1" />
              )}
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg">
                <button
                  className="w-full py-2 px-4 text-left hover:bg-gray-100"
                  onClick={() => handleExportSelection("excel")}
                >
                  <FaBox className="inline mr-1" /> Excel
                </button>
                <button
                  className="w-full py-2 px-4 text-left hover:bg-gray-100"
                  onClick={() => handleExportSelection("pdf")}
                >
                  <FaBox className="inline mr-1" /> PDF
                </button>
              </div>
            )}
          </div>

          {/* View Toggle Button */}
          <button
            className="bg-black text-white border-none font-medium py-1 px-3 rounded text-sm"
            onClick={() => setView(view === "table" ? "card" : "table")}
          >
            {view === "table" ? (
              <>
                <CardIcon className="inline mr-1" /> Card
              </>
            ) : (
              <>
                <TableIcon className="inline mr-1" /> Table
              </>
            )}
          </button>

          {/* Add Employee Button */}
          {currentUser.is_hr_manager && (
            <button
              className="bg-black text-white border-none font-medium py-1 px-3 rounded text-sm"
              onClick={() => navigate("/hr/employees/add")}
            >
              <FaPlus className="inline mr-1" /> Add Employee
            </button>
          )}
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {view === "table" && (
        <div>
          <table
            {...getTableProps()}
            className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm"
          >
            <thead className="bg-gray-100">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-4 py-2 border-b text-left text-black"
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
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="px-4 py-2 border-b text-black"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className="px-4 py-2 bg-gray-200 text-black rounded-lg"
              >
                <FaAngleDoubleLeft />
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="px-4 py-2 bg-gray-200 text-black rounded-lg"
              >
                <FaAngleLeft />
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="px-4 py-2 bg-gray-200 text-black rounded-lg"
              >
                <FaAngleRight />
              </button>
              <button
                onClick={() => gotoPage(pageOptions.length - 1)}
                disabled={!canNextPage}
                className="px-4 py-2 bg-gray-200 text-black rounded-lg"
              >
                <FaAngleDoubleRight />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-black">Page Size:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  const newSize = Number(e.target.value);
                  setPageSize(newSize);
                  setTablePageSize(newSize);
                }}
                className="border border-gray-300 rounded-lg p-2 bg-white text-black"
              >
                {[10, 20, 30, 40, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      {view === "card" && (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
          {filteredData.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onView={handleEmployeeClick}
              onDelete={handleDeleteEmployee}
            />
          ))}
        </div>
      )}
      {selectedEmployee && (
        <AdminEmployeeProfile
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDeleteEmployee}
        employeeName={employeeToDelete ? employeeToDelete.name : ""}
      />
    </div>
  );
};

export default EmployeeList;
