import React, { useEffect } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ProfilePage from './features/profile/ProfilePage';
import ComputersPage from './features/computers/ComputersPage';
import BookingPage from './features/booking/BookingPage';
import MyBookingsPage from './features/booking/MyBookingsPage';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminUsers from './features/admin/AdminUsers';
import AdminComputers from './features/admin/AdminComputers';
import AdminBookings from './features/admin/AdminBookings';
import AnalyticsPage from './features/analytics/AnalyticsPage';
import NotFoundPage from './components/common/NotFoundPage';

import { Spinner } from "@heroui/react";

export default function App() {
  const { isInitialized, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);


  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
          <p className="text-lg">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      {/* Protected routes */}
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/computers" replace />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/computers" element={<ComputersPage />} />
          <Route path="/booking/:computerId" element={<BookingPage />} />
          <Route path="/my-bookings" element={<MyBookingsPage />} />
        </Route>
        
        {/* Admin routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/computers" element={<AdminComputers />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
        </Route>
      </Route>
      
      {/* Not found route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}