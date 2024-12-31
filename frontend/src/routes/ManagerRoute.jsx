import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const ManagerRoute = ({ element, managerOnly }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  console.log("dffsdsfds",managerOnly);

  if (managerOnly && !currentUser.is_manager) {
    toast.error("CAN'T ACCESS THIS PAGE")
    return <Navigate to="/admin/dashboard" />;
  }

  return element;
};

export default ManagerRoute;