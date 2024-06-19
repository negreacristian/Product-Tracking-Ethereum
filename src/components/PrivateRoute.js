import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, jwt, role, requiredRole }) => {
  if (!jwt) {
    return <Navigate to="/login" />;
  }

  if (role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
