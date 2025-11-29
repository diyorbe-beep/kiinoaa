// FILE: /src/pages/AdminLogin.jsx
// Admin login page - separate from regular user login

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { authService } from '../services/authService'

/**
 * Admin Login page - separate login for admin access
 */
export const AdminLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    try {
      // Admin login - use authService to login (username, not email)
      const response = await authService.login(formData.username, formData.password)
      
      // After login, fetch user profile to check admin status
      let userProfile = null
      try {
        userProfile = await authService.getCurrentUser()
      } catch (profileErr) {
        console.error('Failed to fetch user profile:', profileErr)
        // Try to get user from response if available
        userProfile = response.user || response
      }
      
      // Check if user is admin (backend should return is_admin, is_staff, or role field)
      const isAdmin = userProfile?.is_admin || 
                     userProfile?.is_staff || 
                     userProfile?.role === 'admin' ||
                     userProfile?.user_type === 'admin'
      
      if (isAdmin) {
        // Store admin flag
        localStorage.setItem('is_admin', 'true')
        // Reload page to update AuthContext
        window.location.href = '/admin'
      } else {
        setError('Access denied. Admin privileges required.')
        await authService.logout()
        localStorage.removeItem('is_admin')
      }
    } catch (err) {
      console.error('Admin login error:', err)
      setError(err.message || err.data?.detail || err.data?.message || 'Login failed. Please try again.')
      localStorage.removeItem('is_admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-800 to-primary-900 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-background-default rounded-lg shadow-xl p-8 border-2 border-accent-primary">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-primary rounded-full mb-4">
              <svg className="w-8 h-8 text-text-inverse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Portal</h1>
            <p className="text-text-secondary">Sign in to access admin dashboard</p>
          </div>

          {error && (
            <ErrorMessage error={error} className="mb-6" />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="admin-username" className="block text-sm font-medium text-text-primary mb-2">
                Admin Username
              </label>
              <input
                id="admin-username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent bg-background-default text-text-primary"
                placeholder="admin"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent bg-background-default text-text-primary"
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  Signing in...
                </span>
              ) : (
                'Sign In as Admin'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-sm text-text-secondary hover:text-accent-primary hover:underline"
            >
              Regular user login →
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}


