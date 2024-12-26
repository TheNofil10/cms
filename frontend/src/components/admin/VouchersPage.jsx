import React from "react";
import VoucherList from "./VoucherList";
// import EmployeeListWithErrorBoundary from "./EmployeeList";

const VouchersPage = () => {
  return (
    <div className="w-full">
      
      <header className="bg-black text-white p-5 shadow-md w-full">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Voucher List</h1>
        </div>
      </header>
      
      <VoucherList />
    </div>
  );
};

export default VouchersPage;
