import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const EmployeeRoute = ({ element, employeeOnly }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (employeeOnly && currentUser.is_staff) {
    toast.error("cAN'T ACCESS THIS PAGE")
    return <Navigate to="/admin/dashboard" />;
  }

  return element;
};

export default EmployeeRoute;