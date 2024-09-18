import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import {
  FaFilter,
  FaSearch,
  FaBox,
  FaTrashAlt,
  FaChevronDown,
  FaChevronUp,
  FaSortDown,
  FaSortUp,
  FaSort,
  FaEye,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
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
import { useAuth } from "../../contexts/AuthContext";
import API from "../../api/api";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const JobApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
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
    const fetchApplications = async () => {
      try {
        const response = await axios.get(
          `${API}/applications/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setApplications(response.data || []);
        setFilteredData(response.data.data || []);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError("There was an error fetching the application data.");
      } finally {
        console.log(applications);
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    if (filters.filterBy && filters.filterValue) {
      const filtered = applications.filter((app) =>
        app[filters.filterBy]
          ?.toString()
          .toLowerCase()
          .includes(filters.filterValue.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(applications);
    }
  }, [filters, applications]);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Job Title", accessor: "job_posting.title" },
      { Header: "Applicant Name", accessor: "applicant.name" },
      { Header: "Status", accessor: "status" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="text-blue-600 hover:text-blue-800"
              onClick={() => handleViewApplication(row.original)}
            >
              <FaEye />
            </button>
          </div>
        ),
      },
    ],
    [applications, filteredData]
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

  const handleViewApplication = (application) => {
    navigate(`/hr/applications/${application.id}`);
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applications");
    XLSX.writeFile(workbook, "applications.xlsx");
  };

  const handleExportToPdf = () => {
    const docDefinition = {
      content: [
        { text: "Job Applications", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*"],
            body: [
              [
                { text: "Job Title", style: "tableHeader" },
                { text: "Applicant Name", style: "tableHeader" },
                { text: "Status", style: "tableHeader" },
              ],
              ...filteredData.map((application) => [
                { text: application.job_posting.title, style: "tableData" },
                { text: application.applicant.name, style: "tableData" },
                { text: application.status, style: "tableData" },
              ]),
            ],
          },
          layout: {
            fillColor: (rowIndex) => (rowIndex % 2 === 0 ? "#F0F0F0" : null),
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "black",
          fillColor: "#4CAF50",
          alignment: "center",
        },
        tableData: {
          fontSize: 11,
          margin: [0, 2, 0, 2],
          alignment: "center",
        },
      },
      pageMargins: [40, 60, 40, 40],
    };

    pdfMake.createPdf(docDefinition).download("applications.pdf");
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
    <div className="max-w-7xl mx-auto p-1">
      <ToastContainer />
      <div className="flex justify-between mb-4">
        <h1 className="text-3xl font-bold">Applications List</h1>
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
            <option value="job_posting.job_title">Job Title</option>
            <option value="applicant.applicant_name">Applicant Name</option>
            <option value="status">Status</option>
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
            className="bg-black text-white border-none font-medium py-1 px-3 rounded-md"
          >
            <FaSearch />
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 bg-black text-white py-2 px-4 rounded-md"
          >
            Export <FaChevronDown />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
              <button
                onClick={() => handleExportSelection("excel")}
                className="w-full py-2 px-4 text-sm text-left hover:bg-gray-100"
              >
                Export to Excel
              </button>
              <button
                onClick={() => handleExportSelection("pdf")}
                className="w-full py-2 px-4 text-sm text-left hover:bg-gray-100"
              >
                Export to PDF
              </button>
            </div>
          )}
        </div>
      </div>
      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200"
      >
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="py-2 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <FaSortDown className="inline-block ml-1" />
                      ) : (
                        <FaSortUp className="inline-block ml-1" />
                      )
                    ) : (
                      <FaSort className="inline-block ml-1" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className="bg-white divide-y divide-gray-200"
        >
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="py-2 px-4 text-sm font-medium text-gray-900"
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
            className="py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50"
          >
           <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50"
          >
           <FaAngleLeft />
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50"
          >
           <FaAngleRight />
          </button>
          <button
            onClick={() => gotoPage(pageOptions.length - 1)}
            disabled={!canNextPage}
            className="py-2 px-4 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
        <span className="text-sm">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <select
          value={pageSize}
          onChange={(e) => {
            setTablePageSize(Number(e.target.value));
            setPageSize(Number(e.target.value));
          }}
          className="py-1 px-2 border border-gray-400 rounded text-sm"
        >
          {[10, 20, 30, 40, 50].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default JobApplicationsPage;
