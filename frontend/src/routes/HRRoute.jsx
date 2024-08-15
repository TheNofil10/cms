import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const HRRoute = ({ element }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (!currentUser.is_hr_manager) {
    toast.error("cAN'T ACCESS THIS PAGE")
    return <Navigate to="/employee/dashboard" />;
  }

  return element;
};

export default HRRoute;