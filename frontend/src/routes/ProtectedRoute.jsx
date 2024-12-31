import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const ProtectedRoute = ({ element, adminOnly }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !currentUser.is_staff) {
    toast.error("CAN'T ACCESS THIS PAGE")
    return <Navigate to="/employee/dashboard" />;
  }

  return element;
};

export default ProtectedRoute;