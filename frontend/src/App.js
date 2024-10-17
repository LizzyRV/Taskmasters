import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './Components/LoginForm';
import Register from './containers/Register';
import Layout from './hocs/Layout';
import Dashboard from './Components/Dashboard';
import RecuperarContrasena from './Components/RecuperarContraseña';
import PasswordResetConfirm from './Components/PasswordResetConfirm';
import CreateTask from './containers/CreateTask';
import KanbanBoard from './containers/KanbanBoard';
import Profile from './containers/Profile';

function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('access_token');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>

          {/* Ruta para redirigir al dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Rutas públicas */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
          <Route path="/password-reset-confirm/:uidb64/:token" element={<PasswordResetConfirm />} />

          {/* Rutas protegidas */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/tasks/create" element={<ProtectedRoute><CreateTask /></ProtectedRoute>} />
          <Route path="/kanban" element={<ProtectedRoute><KanbanBoard /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
