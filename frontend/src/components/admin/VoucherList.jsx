/* eslint-disable react/jsx-key */
import { useEffect, useMemo, useState } from "react";
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
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
  FaBox,
  FaEye as ViewIcon,
  FaSortDown,
  FaSortUp,
  FaSort,
  FaChevronDown,
  FaChevronUp,
  FaPlus,
} from "react-icons/fa";
import { IoMdArchive } from "react-icons/io";
import { toast } from "react-toastify";
import AdminEmployeeProfile from "./AdminEmployeeProfile";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import ConfirmationModal from "./ConfirmationModal";
import { useAuth } from "../../contexts/AuthContext";
import API from "../../api/api";
import StatusImage from "./StatusImage";

// Initialize pdfMake with fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const VoucherList = () => {
  const [showConfirmArchiveModal, setShowConfirmArchiveModal] = useState(false);
  const [voucherToArchive, setVoucherToArchive] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [filters, setFilters] = useState({
    filterBy: "",
    filterValue: "",
  });
  const [pageSize, setPageSize] = useState(10);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        setFilteredData(response.data.results || response.data || []);
        console.log(vouchers);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
        setError("There was an error fetching the voucher data.");
      } finally {
        console.log(vouchers)
        setLoading(false);
      }
    };

    fetchVouchers();

  }, []);

  useEffect(() => {
    if (filters.filterBy && filters.filterValue) {
      const filtered = vouchers.filter((voucher) =>
        voucher[filters.filterBy]
          ?.toString()
          .toLowerCase()
          .includes(filters.filterValue.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(vouchers);
    }
  }, [filters, vouchers]);

  const filteredVouchers = useMemo(
  () => vouchers.filter((voucher) => !voucher.archived), // Filter out archived vouchers
  [vouchers]
);

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "First Name", accessor: "employee_first_name" },
      { Header: "middle Name", accessor: "employee_middle_name" },
      { Header: "Last Name", accessor: "employee_last_name" },
      { Header: "Date", accessor: "date" },
      { Header: "Amount", 
        Cell: ({ row }) => (
          <span>PKR {row.original.amount}</span>
        )
       },
      {
        Header: "Status",
        Cell: ({ row }) => (
          <StatusImage status={row.original.status}/>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="text-blue-600 hover:text-blue-800 bg-transparent border-none"
              onClick={() => handleVoucherClick(row.original)}
            >
              <ViewIcon onClick={() => handleVoucherClick(row.original)} />
            </button>
            <button
              className="text-yellow-600 disabled:text-gray-300 disabled:hover:text-gray-300 hover:text-red-800 bg-transparent border-none"
              onClick={() => handleArchiveVoucher(row.original.id)}
              disabled={(!currentUser.is_superuser && !currentUser.is_manager) || row.original.archived}
            >
              <IoMdArchive />
            </button>
          </div>
        ),
      },
    ],
    [vouchers, filteredData]
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
    { columns, data: showArchived ? data : filteredVouchers, initialState: { pageSize } },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const navigate = useNavigate();

  const handleVoucherClick = (voucher) => {
    if (currentUser.is_superuser)
      navigate(`/admin/vouchers/${voucher.id}`);
    else if (currentUser.is_hr_manager)
      navigate(`/hr/vouchers/${voucher.id}`);
    else if (currentUser.is_manager)
      navigate(`/manager/vouchers/${voucher.id}`)
    else navigate(`/employee/vouchers/${voucher.id}`);
  };

  const handleArchiveVoucher = (voucherID) => {
    setVoucherToArchive({ id: voucherID });
    setShowConfirmArchiveModal(true);
  };

  const confirmArchiveVoucher = async () => {
    if (!voucherToArchive) return;
    const voucher = vouchers.filter((v) => v.id === voucherToArchive.id)[0]
    if (voucher.archived) throw new error ("Voucher is already archived")

    try {
      if(voucher.status === "pending") throw new error(`Voucher is still pending. Please approve or reject`)
        console.log(voucher);
      await axios.put(`${API}/vouchers/${voucher.id}/`, {...voucher, archived: true}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success("Voucher archived successfully");
      window.location.reload()
    } catch (error) {
      toast.error("Error archiving voucher");
    } finally {
      setShowConfirmArchiveModal(false);
      setVoucherToArchive(null);
    }
  }

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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vouchers");
    XLSX.writeFile(workbook, "vouchers.xlsx");
  };

  const handleExportToPdf = () => {
    const docDefinition = {
      content: filteredData.map((voucher) => ({
        columns: [
          { text: voucher.id, fontSize: 10 , width:"7%"},
          { text: voucher.employee_first_name, fontSize: 10, width:"8%" },
          { text: voucher.employee_middle_name, fontSize: 10, width:"8%" },
          { text: voucher.employee_last_name, fontSize: 10, width:"8%" },
          { text: voucher.department, fontSize: 10, width:"8%" },
          { text: voucher.head_of_department, fontSize: 10, width:"8%" },
          { text: voucher.date, fontSize: 10, width:"7%" },
          { text: voucher.project, fontSize: 10, width:"8%" },
          { text: voucher.category, fontSize: 10, width:"8%" },
          { text: `PKR ${voucher.amount}`, fontSize: 10, width:"7%" },
          { text: voucher.reason, fontSize: 10, width:"8%" },
          { text: voucher.status, fontSize: 10, width:"7%" },
          { text: voucher.reason_for_rejection, fontSize: 10, width:"8%" },
        ],
      })),
      // pageMargins: [40, 40, 40, 40],
      pageOrientation: "landscape",
    };

    pdfMake.createPdf(docDefinition).download("vouchers.pdf");
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
            <option value="id">ID</option>
            <option value="employee_first_name">First Name</option>
            <option value="employee_middle_name">Middle Name</option>
            <option value="employee_last_name">First Name</option>
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="status">Status</option>
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
          {(currentUser.is_superuser || currentUser.is_manager) && (
            <button
              className="bg-black text-white border-none font-medium py-1 px-3 rounded text-sm"
              onClick={() => setShowArchived((showArchived) => !showArchived)}
            >
              <IoMdArchive className="inline mr-1" /> {showArchived ? "Hide Archived" : "Show Archived"}
            </button>
          )}

          {/* Create Voucher Button */}
            <button
              className="bg-black text-white border-none font-medium py-1 px-3 rounded text-sm"
              onClick={() => 
                {if (currentUser.is_superuser) navigate("/admin/vouchers/add")
                else if (currentUser.is_hr_manager) navigate("/hr/vouchers/add")
                else if (currentUser.is_manager) navigate("/manager/vouchers/add")
                else navigate("/employee/vouchers/add")
                }}
            >
              <FaPlus className="inline mr-1" /> Create Voucher
            </button>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
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
      {selectedVoucher && (
        <AdminEmployeeProfile
          voucher={selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
        />
      )}

      <ConfirmationModal
        task="Voucher Rejection"
        isOpen={showConfirmArchiveModal}
        onConfirm={confirmArchiveVoucher}
        onClose={() => setShowConfirmArchiveModal(false)}
        message={`Are you sure you want to reject this voucher? This action cannot be undone.`}
      >
        {`Are you sure you want to archive voucher#${voucherToArchive?.id}? This action cannot be undone.`}
        </ConfirmationModal>
    </div>
  );
};

export default VoucherList;