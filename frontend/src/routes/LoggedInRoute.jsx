import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoggedInRoute = ({ element, employeeOnly }) => {
  const { currentUser } = useAuth();

  if (currentUser) {
    return <Navigate to="/" />;
  }

  return element;
};

export default LoggedInRoute;