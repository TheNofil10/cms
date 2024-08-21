import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
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
  FaSort,
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const EmployeeAttendanceTable = () => {
  const { currentUser } = useAuth();
  const [attendanceData, setAttendanceData] = useState([]);
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

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/attendance/me`,
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

    fetchAttendanceData();
  }, [currentUser.id]);

  useEffect(() => {
    if (filters.filterBy && filters.filterValue) {
      const filtered = attendanceData.filter((record) =>
        record[filters.filterBy]
          ?.toString()
          .toLowerCase()
          .includes(filters.filterValue.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(attendanceData);
    }
  }, [filters, attendanceData]);

  const columns = useMemo(
    () => [
      { Header: "Date", accessor: "date" },
      { Header: "Time In", accessor: "time_in" },
      { Header: "Time Out", accessor: "time_out" },
      { Header: "Status", accessor: "status" },
    ],
    []
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
    useSortBy,
    usePagination
  );

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance.xlsx");
  };

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
                { text: "Date", style: "tableHeader" },
                { text: "Time In", style: "tableHeader" },
                { text: "Time Out", style: "tableHeader" },
                { text: "Status", style: "tableHeader" },
              ],
              ...filteredData.map((record) => [
                { text: record.date, style: "tableData" },
                { text: record.time_in, style: "tableData" },
                { text: record.time_out, style: "tableData" },
                { text: record.status, style: "tableData" },
              ]),
            ],
          },
          layout: {
            fillColor: (rowIndex) => {
              if (filteredData[rowIndex - 1]?.status === "present")
                return "#d4edda";
              if (
                filteredData[rowIndex - 1]?.status === "leave" ||
                filteredData[rowIndex - 1]?.status === "sick_leave" ||
                filteredData[rowIndex - 1]?.status === "casual_leave"
              )
                return "#fff3cd";
              if (filteredData[rowIndex - 1]?.status === "absent")
                return "#f8d7da";
              return null;
            },
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
          fontSize: 12,
          color: "black",
          fillColor: "#4CAF50",
          alignment: "center",
        },
        tableData: {
          fontSize: 10,
          margin: [0, 2, 0, 2],
          alignment: "center",
        },
      },
      pageMargins: [40, 60, 40, 40],
    };

    pdfMake.createPdf(docDefinition).download("attendance.pdf");
  };

  const handleExportSelection = (format) => {
    if (format === "excel") {
      handleExportToExcel();
    } else if (format === "pdf") {
      handleExportToPdf();
    }
    setIsDropdownOpen(false);
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

  return (
    <div className="max-w-7xl mx-auto p-1">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Attendance Summary</h1>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <FaFilter />
          <select
            name="filterBy"
            value={filters.filterBy}
            onChange={handleFilterByChange}
            className="py-1 px-2 border border-gray-300 rounded text-sm"
          >
            <option value="">Filter by...</option>
            <option value="date">Date</option>
            <option value="status">Status</option>
          </select>
          <input
            type="text"
            name="filterValue"
            value={filters.filterValue}
            onChange={handleFilterChange}
            className="py-1 px-2 border border-gray-300 rounded text-sm"
          />
          <button
            onClick={applyFilters}
            className="bg-black text-white border-none font-medium py-1 px-2 rounded-md"
          >
            <FaSearch />
          </button>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 bg-black text-white py-2 px-3 rounded-md"
          >
            Export <FaChevronDown />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
              <button
                onClick={() => handleExportSelection("excel")}
                className="w-full py-1 px-3 text-sm text-left hover:bg-gray-100"
              >
                Export to Excel
              </button>
              <button
                onClick={() => handleExportSelection("pdf")}
                className="w-full py-1 px-3 text-sm text-left hover:bg-gray-100"
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
                  className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
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
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-sm text-gray-600"
              >
                Loading...
              </td>
            </tr>
          ) : error ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-sm text-red-600"
              >
                {error}
              </td>
            </tr>
          ) : (
            page.map((row) => {
              prepareRow(row);
              const status = row.values.status;
              const rowBgColor =
                status === "present"
                  ? "bg-green-100"
                  : status === "leave" ||
                    status === "sick_leave" ||
                    status === "casual_leave"
                  ? "bg-yellow-100"
                  : status === "absent"
                  ? "bg-red-100"
                  : "bg-white";

              return (
                <tr {...row.getRowProps()} className={`text-sm ${rowBgColor}`}>
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center justify-between">
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          className="px-3 py-1 bg-gray-300 rounded text-sm ml-3 disabled:bg-gray-200 disabled:text-gray-300"
        >
          <FaAngleDoubleLeft />
        </button>
        <button
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
          className="px-3 py-1 bg-gray-300 rounded text-sm ml-3 disabled:bg-gray-200 disabled:text-gray-300"
        >
          <FaAngleLeft />
        </button>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="px-3 py-1 bg-gray-300 rounded text-sm ml-3 disabled:bg-gray-200 disabled:text-gray-300"
        >
          <FaAngleRight />
        </button>
        <button
          onClick={() => gotoPage(pageOptions.length - 1)}
          disabled={!canNextPage}
          className="px-3 py-1 bg-gray-300 rounded text-sm ml-3 disabled:bg-gray-200 disabled:text-gray-300"
        >
          <FaAngleDoubleRight />
        </button>
        </div>
        <div className="text-sm">
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </div>
        <select
          value={pageSize}
          onChange={(e) => {
            setTablePageSize(Number(e.target.value));
            setPageSize(Number(e.target.value));
          }}
          className="ml-4 py-1 px-2 border border-gray-400 rounded text-xs"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default EmployeeAttendanceTable;
