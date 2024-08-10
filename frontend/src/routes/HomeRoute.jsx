import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const HomeRoute = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  if (currentUser.is_staff) {
    // If the user is an admin, redirect to the admin dashboard
    return <Navigate to="/admin/dashboard" />;
  }

  // If the user is logged in and not an admin, redirect to the employee dashboard
  return <Navigate to="/employee/dashboard" />;
};

export default HomeRoute;
