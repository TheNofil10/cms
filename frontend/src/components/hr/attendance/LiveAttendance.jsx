import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../contexts/AuthContext";
import * as XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useTable, useSortBy, usePagination } from "react-table";
import {
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaSortDown,
  FaSortUp,
  FaSpinner,
  FaSort,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import UpdateAttendanceModal from "./UpdateAttendanceModal";
import { ToastContainer } from "react-toastify";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const LiveAttendance = () => {
  const { currentUser } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    filterBy: "",
    filterValue: "",
    startDate: "",
    endDate: "",
    employee_id: "",
    username: "",
  });
  const [pageSize, setPageSize] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeData, setEmployeeData] = useState({});

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/admin/live-attendance/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );

        setAttendanceData(response.data || []);
        setFilteredData(response.data || []);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setError("Unable to fetch attendance data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/employees/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setEmployeeData(response.data.results || response.data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError("There was an error fetching the employee data.");
      } finally {
        console.log("Employees:", employeeData);
        setLoading(false);
      }
    };

    fetchAttendanceData();
    fetchEmployeeData();
  }, [filters, currentUser.id]);

  useEffect(() => {
    let filtered = attendanceData;

    if (filters.employee_id) {
      filtered = filtered.filter((record) =>
        record.employee_id
          ?.toString()
          .toLowerCase()
          .includes(filters.employee_id.toLowerCase())
      );
    }

    if (filters.username) {
      filtered = filtered.filter((record) =>
        (employeeData[record.employee_id].username || "")
          .toLowerCase()
          .includes(filters.username.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [filters, attendanceData, employeeData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const columns = useMemo(
    () => [
      { Header: "Employee ID", accessor: "employee_id" },
      {
        Header: "Employee Name",
        accessor: (row) => {
          const employee = employeeData.find(
            (emp) => emp.id === row.employee_id
          );
          return employee ? employee.username : "Unknown";
        },
      },

      { Header: "Date", accessor: "date" },
      { Header: "Log Time", accessor: "log_time" },
    ],
    [employeeData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    previousPage,
    nextPage,
    setPageSize: setTablePageSize,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: {
        pageSize,
        sortBy: [
          {
            id: "date",
            desc: true,
          },
        ],
      },
    },
    useSortBy,
    usePagination
  );

  const handleExportToPdf = () => {
    const docDefinition = {
      content: [
        { text: "Employee Attendance", style: "header" },
        {
          table: {
            headerRows: 1,
            widths: ["*", "*", "*", "*"],
            body: [
              [
                { text: "Employee ID", style: "tableHeader" },
                { text: "Employee Name", style: "tableHeader" },
                { text: "Date", style: "tableHeader" },
                { text: "Log Time", style: "tableHeader" },
              ],
              ...filteredData.map((record) => [
                { text: record.employee_id, style: "tableData" },
                {
                  text: employeeData[record.employee_id].username || "Unknown",
                  style: "tableData",
                },
                { text: record.date, style: "tableData" },
                { text: record.log_time, style: "tableData" },
              ]),
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        tableHeader: {
          bold: true,
          fontSize: 10,
          color: "black",
          fillColor: "#4CAF50",
          alignment: "center",
        },
        tableData: {
          fontSize: 8,
          margin: [0, 2, 0, 2],
          alignment: "center",
        },
      },
      pageMargins: [40, 60, 40, 40],
    };

    pdfMake.createPdf(docDefinition).download("attendance.pdf");
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((record) => ({
        employee_id: record.employee_id,
        username: employeeData[record.employee_id] || "Unknown",
        date: record.date,
        log_time: record.log_time,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance.xlsx");
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
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Live Attendance</h1>
      </div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <input
            type="text"
            name="employee_id"
            value={filters.employee_id}
            onChange={handleFilterChange}
            placeholder="Filter by Employee ID"
            className="border px-2 py-1 rounded-md mr-2"
          />
        </div>
        <div>
          <input
            type="text"
            name="username"
            value={filters.username}
            onChange={handleFilterChange}
            placeholder="Filter by Employee Name"
            className="border px-2 py-1 rounded-md mr-2"
          />
        </div>
        <div>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-gray-300 py-1 px-2 rounded-md"
          >
            Export <FaChevronDown className="inline ml-2" />
          </button>
          {isDropdownOpen && (
            <div className="absolute bg-white border border-gray-300 mt-2 rounded-md shadow-lg">
              <button
                onClick={() => handleExportSelection("excel")}
                className="block px-4 py-2 hover:bg-gray-200"
              >
                Export to Excel
              </button>
              <button
                onClick={() => handleExportSelection("pdf")}
                className="block px-4 py-2 hover:bg-gray-200"
              >
                Export to PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      )}

      {error && <div className="text-red-500 text-center">{error}</div>}

      <table
        {...getTableProps()}
        className="min-w-full divide-y divide-gray-200"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.render("Header")}
                  <span>
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
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
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
        <div>
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="p-2 border border-gray-300 rounded-md"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="p-2 border border-gray-300 rounded-md mx-1"
          >
            <FaAngleLeft />
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="p-2 border border-gray-300 rounded-md mx-1"
          >
            <FaAngleRight />
          </button>
          <button
            onClick={() => gotoPage(pageOptions.length - 1)}
            disabled={!canNextPage}
            className="p-2 border border-gray-300 rounded-md"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
        <div>
          <span className="text-sm">
            Page {pageIndex + 1} of {pageOptions.length}
          </span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setTablePageSize(Number(e.target.value));
            }}
            className="ml-2 border border-gray-300 rounded-md"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isModalOpen && selectedRecord && (
        <UpdateAttendanceModal
          record={selectedRecord}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default LiveAttendance;
