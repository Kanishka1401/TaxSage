import React from 'react';
import { Navigate } from 'react-router-dom';

const CAProtectedRoute = ({ children }) => {
  const caToken = localStorage.getItem('ca_token');
  const caUser = localStorage.getItem('ca_user');

  if (!caToken || !caUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default CAProtectedRoute;