import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const ManagerRoute = ({ element, managerOnly }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  console.log("managerOnly", managerOnly);
  console.log("currentUser.is_manager", currentUser.is_manager);

  if (managerOnly) {
    return element;
  }
  else {
    toast.error("Cannot access Manager page")
    return <Navigate to="/admin/dashboard" />;
  }


};

export default ManagerRoute;