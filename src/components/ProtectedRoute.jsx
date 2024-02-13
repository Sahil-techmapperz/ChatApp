// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }
  return children; // User is logged in, render the protected component
};

export default ProtectedRoute;
