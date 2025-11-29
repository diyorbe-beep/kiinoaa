// FILE: /src/contexts/AuthContext.jsx
// Authentication context for managing user state

import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        } catch (err) {
          console.error('Auth check failed:', err)
          authService.logout()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  // Login
  const login = async (email, password) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authService.login(email, password)
      // Fetch user profile after login
      if (response.access) {
        const userProfile = await authService.getCurrentUser()
        setUser(userProfile)
      } else {
        setUser(response.user || response)
      }
      return response
    } catch (err) {
      setError(err.message || err.data?.detail || 'Login failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Register
  const register = async (userData) => {
    try {
      setError(null)
      setLoading(true)
      const response = await authService.register(userData)
      // Fetch user profile after registration
      if (response.access) {
        const userProfile = await authService.getCurrentUser()
        setUser(userProfile)
      } else {
        setUser(response.user || response)
      }
      return response
    } catch (err) {
      setError(err.message || err.data?.detail || 'Registration failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Logout
  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      setError(null)
    } catch (err) {
      console.error('Logout error:', err)
      // Clear user state even if API call fails
      setUser(null)
    }
  }

  // Update user
  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }))
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


