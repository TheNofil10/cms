import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const ProtectedRoute = ({ element, adminOnly }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  console.log("adminOnly", adminOnly);
  console.log("currentUser.is_staff", currentUser.is_staff);

  if (adminOnly) {
    return element;
  }
  else {
    toast.error("Cannot access Admin page")
    return <Navigate to="/manager/dashboard" />;
  }


};

export default ProtectedRoute;