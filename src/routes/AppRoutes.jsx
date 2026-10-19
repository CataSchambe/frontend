import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import BoardsListPage from '../pages/BoardsListPage';
import BoardDetailPage from '../pages/BoardDetailPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta pública de autenticación */}
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas */}
      <Route
        path="/boards"
        element={
          <ProtectedRoute>
            <BoardsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/boards/:boardId"
        element={
          <ProtectedRoute>
            <BoardDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/boards" replace />} />
    </Routes>
  );
};

export default AppRoutes;
