import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Edicoes from './pages/Edicoes';
import Equipes from './pages/Equipes';
import Atividades from './pages/Atividades';
import Relatorios from './pages/Relatorios';
import './App.css';

// Componente para redirecionar usuários autenticados
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated() ? <Navigate to="/" replace /> : children;
};

function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* Rotas protegidas */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edicoes"
          element={
            <ProtectedRoute requireAdmin>
              <Layout>
                <Edicoes />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/equipes"
          element={
            <ProtectedRoute>
              <Layout>
                <Equipes />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/atividades"
          element={
            <ProtectedRoute>
              <Layout>
                <Atividades />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/relatorios"
          element={
            <ProtectedRoute>
              <Layout>
                <Relatorios />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Rota padrão - redireciona para dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

