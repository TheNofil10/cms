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
import UpdateAttendanceModal from "./UpdateAttendanceModal"; // Import your modal
import { ToastContainer } from "react-toastify";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const AttendanceTable = () => {
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
    employee_name: "",
    dateFilter: "today",
  });
  const [pageSize, setPageSize] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        let queryParams = `dateFilter=${filters.dateFilter}`;
        if (
          filters.startDate &&
          filters.endDate &&
          filters.dateFilter === "custom"
        ) {
          queryParams += `&start_date=${filters.startDate}&end_date=${filters.endDate}`;
        }

        const response = await axios.get(
          `http://127.0.0.1:8000/api/admin/attendance/?${queryParams}`,
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
  }, [filters, currentUser.id]);

  useEffect(() => {
    let filtered = attendanceData;

    const currentDate = new Date();
    const startOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay())
    );
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    if (filters.dateFilter === "today") {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate.toDateString() === new Date().toDateString();
      });
    } else if (filters.dateFilter === "yesterday") {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate.toDateString() === yesterday.toDateString();
      });
    } else if (filters.dateFilter === "this_week") {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startOfWeek;
      });
    } else if (filters.dateFilter === "this_month") {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startOfMonth;
      });
    } else if (filters.dateFilter === "this_year") {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        return recordDate >= startOfYear;
      });
    } else if (
      filters.dateFilter === "custom" &&
      filters.startDate &&
      filters.endDate
    ) {
      filtered = filtered.filter((record) => {
        const recordDate = new Date(record.date);
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        return recordDate >= startDate && recordDate <= endDate;
      });
    }

    if (filters.employee_id) {
      filtered = filtered.filter((record) =>
        record.employee_id
          ?.toString()
          .toLowerCase()
          .includes(filters.employee_id.toLowerCase())
      );
    }

    if (filters.employee_name) {
      filtered = filtered.filter((record) =>
        record.employee_name
          ?.toLowerCase()
          .includes(filters.employee_name.toLowerCase())
      );
    }

    setFilteredData(filtered);
  }, [filters, attendanceData]);

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
      { Header: "Employee Name", accessor: "employee_name" },
      { Header: "Date", accessor: "date" },
      { Header: "Time In", accessor: "time_in" },
      { Header: "Time Out", accessor: "time_out" },
      { Header: "Status", accessor: "status" },
      { Header: "Hours Worked", accessor: "hours_worked" },
      { Header: "Overtime", accessor: "is_overtime" },
      { Header: "Comments", accessor: "comments" },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            onClick={() => {
              setSelectedRecord(row.original);
              setIsModalOpen(true);
            }}
            className="bg-blue-500 text-white py-1 px-2 rounded-md"
          >
            Edit
          </button>
        ),
      },
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
            widths: ["*", "*", "*", "*", "*", "*"],
            body: [
              [
                { text: "Date", style: "tableHeader" },
                { text: "Time In", style: "tableHeader" },
                { text: "Time Out", style: "tableHeader" },
                { text: "Status", style: "tableHeader" },
                { text: "Hours Worked", style: "tableHeader" },
                { text: "Overtime", style: "tableHeader" },
              ],
              ...filteredData.map((record) => [
                { text: record.date, style: "tableData" },
                { text: record.time_in, style: "tableData" },
                { text: record.time_out, style: "tableData" },
                { text: record.status, style: "tableData" },
                { text: record.hours_worked || "", style: "tableData" },
                { text: record.is_overtime ? "Yes" : "No", style: "tableData" },
              ]),
            ],
          },
          layout: {
            fillColor: (rowIndex) => {
              if (filteredData[rowIndex - 1]?.status === "present")
                return "#d4edda";
              if (filteredData[rowIndex - 1]?.status === "late")
                return "#aaaaaa";
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
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
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
        <h1 className="text-2xl font-semibold">Attendance Summary</h1>
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
            name="employee_name"
            value={filters.employee_name}
            onChange={handleFilterChange}
            placeholder="Filter by Employee Name"
            className="border px-2 py-1 rounded-md mr-2"
          />
        </div>
        <div className="relative">
          <select
            name="dateFilter"
            value={filters.dateFilter}
            onChange={handleFilterChange}
            className="border px-2 py-1 rounded-md mr-2"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="this_year">This Year</option>
            <option value="custom">Custom</option>
          </select>
          {filters.dateFilter === "custom" && (
            <>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="border px-2 py-1 rounded-md mr-2"
              />
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="border px-2 py-1 rounded-md"
              />
            </>
          )}
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
      <div className="overflow-x-auto">
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
                  <FaSpinner className="animate-spin text-gray-600 text-xl" />
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
                    ? "bg-green-200"
                    : status === "late"
                    ? "bg-green-100"
                    : status === "leave" ||
                      status === "sick_leave" ||
                      status === "casual_leave" ||
                      status === "Sick Leave" ||
                      status === "Casual Leave"
                    ? "bg-yellow-100"
                    : status === "absent"
                    ? "bg-red-100"
                    : "bg-white";

                return (
                  <tr
                    {...row.getRowProps()}
                    className={`text-sm ${rowBgColor}`}
                  >
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
        <ToastContainer />
        <UpdateAttendanceModal
          isOpen={isModalOpen}
          onClose={() =>
            setIsModalOpen(false).then(setFilteredData(filteredData))
          }
          record={selectedRecord}
        />
      </div>
    </div>
  );
};

export default AttendanceTable;
