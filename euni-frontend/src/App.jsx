import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Cours from './pages/Cours';
import CoursDetail from './pages/CoursDetail';
import Notes from './pages/Notes';
import Paiements from './pages/Paiements';
import Messages from './pages/Messages';
import Bibliotheque from './pages/Bibliotheque';

export default function App() {
  const { user } = useAuth();

  const routes = (
    <Routes>
      <Route path="/connexion" element={<Login />} />
      <Route path="/inscription" element={<Register />} />
      <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
      <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cours"
        element={
          <ProtectedRoute>
            <Cours />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cours/:id"
        element={
          <ProtectedRoute>
            <CoursDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <Notes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/paiements"
        element={
          <ProtectedRoute roles={['etudiant']}>
            <Paiements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bibliotheque"
        element={
          <ProtectedRoute>
            <Bibliotheque />
          </ProtectedRoute>
        }
      />
    </Routes>
  );

  if (!user) return routes;

  return (
    <NotificationProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 px-8 py-10 lg:px-12">
          <div className="mx-auto max-w-5xl">{routes}</div>
        </main>
      </div>
    </NotificationProvider>
  );
}
