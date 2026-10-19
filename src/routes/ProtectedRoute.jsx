import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('kanban_token');

  // Si no hay token de autenticación (o mock), redirigir a /login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
