import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const EmployeeRoute = ({ element, employeeOnly }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  console.log("employeeOnly", employeeOnly);

  if (employeeOnly) {
    return element;
  }

  else {
    toast.error("Cannot access Employee page")
    return <Navigate to="/admin/dashboard" />;
  }

};

export default EmployeeRoute;