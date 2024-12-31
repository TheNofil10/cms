import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const EmployeeRoute = ({ element, employeeOnly }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  console.log("emojfdhf", employeeOnly);

  if (employeeOnly && currentUser.is_staff) {
    toast.error("CAN'T ACCESS THIS PAGE")
    return <Navigate to="/admin/dashboard" />;
  }

  return element;
};

export default EmployeeRoute;