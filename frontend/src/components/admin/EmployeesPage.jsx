import React from "react";
import EmployeeList from "./EmployeeList";
import EmployeeListWithErrorBoundary from "./EmployeeList";

const EmployeesPage = () => {
  return (
    <div className="w-full">
      
      <header className="bg-black text-white p-5 shadow-md w-full">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Employees List</h1>
        </div>
      </header>
      
      <EmployeeList />
    </div>
  );
};

export default EmployeesPage;
