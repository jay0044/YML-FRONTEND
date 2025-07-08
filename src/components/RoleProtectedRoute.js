// src/components/RoleProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const RoleProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useUser();

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
