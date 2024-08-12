import React from "react";
import EmployeeList from "./EmployeeList";
import EmployeeListWithErrorBoundary from "./EmployeeList";

const EmployeesPage = () => {
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Employees</h1>
      <EmployeeList/>
    </div>
  );
};

export default EmployeesPage;
