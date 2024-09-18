import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DepartmentCard from "../components/admin/DepartmentCard";
import DepartmentConfirmationModal from "../components/admin/DepartmentConfirmationModal";
import { ToastContainer, toast } from "react-toastify";
import {
  FaFilter,
  FaSearch,
  FaTrashAlt,
  FaChevronDown,
  FaChevronUp,
  FaTable as TableIcon,
  FaTh as CardIcon,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaSortDown,
  FaSortUp,
  FaSort,
  FaEye,
  FaBox,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
} from "react-table";
import { useAuth } from "../contexts/AuthContext";

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const DepartmentsPage = () => {
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("table");
  const [filters, setFilters] = useState({
    filterBy: "",
    filterValue: "",
  });
  const [pageSize, setPageSize] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentUser } = useAuth();
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/departments/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setDepartments(response.data.results || response.data || []);
        setFilteredData(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching departments:", error);
        setError("There was an error fetching the department data.");
      } finally {
        setLoading(false);
        console.log(departments);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    if (filters.filterBy && filters.filterValue) {
      const filtered = departments.filter((department) =>
        department[filters.filterBy]
          ?.toString()
          .toLowerCase()
          .includes(filters.filterValue.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(departments);
    }
  }, [filters, departments]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Name", accessor: "name" },
      { Header: "Description", accessor: "description" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => handleViewDepartment(row.original)}
            >
              <FaEye />
            </button>
            {!currentUser.is_hr_manager && (
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() =>
                  handleDeleteDepartment(row.original.id, row.original.name)
                }
              >
                <FaTrashAlt />
              </button>
            )}
          </div>
        ),
      },
    ],
    [departments, filteredData]
  );

  const data = useMemo(() => filteredData, [filteredData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
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

  const handleViewDepartment = (department) => {
    if (currentUser.is_hr_manager) navigate(`/hr/departments/${department.id}`);
    else if (currentUser.is_staff)
      navigate(`/admin/departments/${department.id}`);
  };

  const handleDeleteDepartment = (departmentId, departmentName) => {
    setDepartmentToDelete({ id: departmentId, name: departmentName });
    setShowConfirmModal(true);
  };

  const confirmDeleteDepartment = async () => {
    if (!departmentToDelete) return;

    try {
      console.log("Deleting department:", departmentToDelete.id); // Debugging
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/departments/${departmentToDelete.id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      console.log("Delete response:", response); // Debugging
      toast.success("Department deleted successfully");
      setDepartments(
        departments.filter((dep) => dep.id !== departmentToDelete.id)
      );
      setFilteredData(
        filteredData.filter((dep) => dep.id !== departmentToDelete.id)
      );
    } catch (error) {
      console.error("Error deleting department:", error); // Debugging
      toast.error("There was an error deleting the department.");
    } finally {
      setShowConfirmModal(false);
      setDepartmentToDelete(null);
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Departments");
    XLSX.writeFile(workbook, "departments.xlsx");
  };

  const handleExportToPdf = () => {
    const docDefinition = {
      content: [
        {
          text: "Departments List",
          style: "header",
          alignment: "center",
        },
        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "*"],
            body: [
              // Table Headers
              [
                { text: "ID", style: "tableHeader", alignment: "center" },
                { text: "Name", style: "tableHeader", alignment: "center" },
                {
                  text: "Description",
                  style: "tableHeader",
                  alignment: "center",
                },
              ],
              // Table Body
              ...filteredData.map((department) => [
                { text: department.id, alignment: "center" },
                { text: department.name, alignment: "center" },
                { text: department.description, alignment: "center" },
              ]),
            ],
          },
          layout: {
            fillColor: function (rowIndex) {
              return rowIndex % 2 === 0 ? "#F0F0F0" : null;
            },
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          marginBottom: 10,
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: "black",
        },
      },
      pageMargins: [40, 40, 40, 40],
    };

    pdfMake.createPdf(docDefinition).download("departments.pdf");
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
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Departments </h1>
      <div className="p-6">
        <ToastContainer />
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-semibold">Departments List</h1>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <FaFilter />
            <select
              name="filterBy"
              value={filters.filterBy}
              onChange={handleFilterByChange}
              className="py-1 px-2 border border-gray-400 rounded text-sm"
            >
              <option value="">Filter by...</option>
              <option value="name">Name</option>
              <option value="description">Description</option>
            </select>
            <input
              type="text"
              name="filterValue"
              value={filters.filterValue}
              onChange={handleFilterChange}
              className="py-1 px-2 border border-gray-400 rounded text-sm"
            />

            <button
              onClick={applyFilters}
              className="bg-black text-white border-none font-medium py-1 px-4 rounded text-sm flex items-center"
            >
              Apply
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                className="bg-black text-white border-none font-medium py-1 px-4 rounded text-sm flex items-center"
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
            <button
              className="bg-black text-white border-none font-medium py-1 px-4 rounded text-sm flex items-center"
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
          </div>
        </div>
        <div className={`overflow-x-auto ${view === "card" ? "hidden" : ""}`}>
          <table {...getTableProps()} className="min-w-full bg-white">
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
                  <tr {...row.getRowProps()} className="hover:bg-gray-100">
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="py-2 px-4 border-b"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
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
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setTablePageSize(Number(e.target.value));
              }}
              className="border rounded px-2 py-1"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  Show {size}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${
            view === "table" ? "hidden" : ""
          }`}
        >
          {filteredData.map((department) => (
            <DepartmentCard
              key={department.id}
              department={department}
              onView={() => handleViewDepartment(department)}
              onDelete={() =>
                handleDeleteDepartment(department.id, department.name)
              }
            />
          ))}
        </div>
        {showConfirmModal && (
          <DepartmentConfirmationModal
            isOpen={showConfirmModal}
            onConfirm={confirmDeleteDepartment}
            onCancel={() => setShowConfirmModal(false)}
            message={`Are you sure you want to delete the department "${departmentToDelete.name}"?`}
          />
        )}
      </div>
    </div>
  );
};

export default DepartmentsPage;
