import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // REDIRECT TO AUTH IF NO NEURAL TOKEN
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    // REDIRECT TO DASHBOARD IF ALREADY AUTHENTICATED
    return <Navigate to="/" replace />;
  }

  return children;
};
