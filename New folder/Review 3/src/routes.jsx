// routes.jsx
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Customize from './pages/Customize';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import Banquet from './pages/Banquet';
import Payment from './pages/Payment';
import PageNotFound from './pages/PageNotFound';
import { useAuth } from './context/AuthContext';

// Router guard to protect logged-in routes
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  
  return currentUser ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/rooms" element={<ProtectedRoute><Rooms /></ProtectedRoute>} />
      <Route path="/banquet" element={<ProtectedRoute><Banquet /></ProtectedRoute>} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Protected Routes */}
      <Route path="/customize" element={<ProtectedRoute><Customize /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      
      {/* Admin Panel (Not protected by guest Auth, handles its own login) */}
      <Route path="/admin" element={<Admin />} />
      
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
