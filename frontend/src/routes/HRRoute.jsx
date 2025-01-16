import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const HRRoute = ({ element }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  console.log("currentUser.is_hr_manager", currentUser.is_hr_manager);

  if (currentUser.is_hr_manager) {
    return element;
  }
  else {
    toast.error("Cannot access HR page")
    return <Navigate to="/admin/dashboard" />;
  }

};

export default HRRoute;