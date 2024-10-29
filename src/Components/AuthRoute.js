import React from "react";
import { Navigate } from "react-router-dom";

const AuthRoute = ({ element, isAdmin }) => {
  const token = localStorage.getItem("token"); // Get token from local storage
  const isAuthenticated = !!token; // Check if token exists
  const userAdmin = isAdmin; // Assume you have this value from user state or context

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }

  if (isAdmin && !userAdmin) {
    return <Navigate to="/" replace />; // Redirect if not an admin
  }

  return element; // Render the component if authenticated and authorized
};

export default AuthRoute;
