import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, jwt, role, requiredRole }) => {
  if (!jwt || role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;