// FILE: /src/components/ProtectedRoute.jsx
// Protected route component for admin pages

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={requireAdmin ? '/admin/login' : '/login'} replace />
  }

  if (requireAdmin) {
    const isAdmin = user?.is_admin || user?.is_staff || user?.role === 'admin' || localStorage.getItem('is_admin') === 'true'
    if (!isAdmin) {
      return <Navigate to="/admin/login" replace />
    }
  }

  return children
}



