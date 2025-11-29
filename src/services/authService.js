// FILE: /src/services/authService.js
// Authentication service

import { apiService } from './api'
import { API_ENDPOINTS } from '../config/api'

export const authService = {
  // Login
  // Backend expects username (not email) for login
  async login(emailOrUsername, password) {
    // Backend requires username field, but user might enter email
    // Try with username first (backend requirement)
    const response = await apiService.post(API_ENDPOINTS.auth.login, {
      username: emailOrUsername, // Backend expects username field
      password,
    })
    
    if (response.access) {
      apiService.setTokens(response.access, response.refresh)
    }
    
    return response
  },

  // Register
  async register(userData) {
    const response = await apiService.post(API_ENDPOINTS.auth.register, userData)
    
    if (response.access) {
      apiService.setTokens(response.access, response.refresh)
    }
    
    return response
  },

  // Logout
  async logout() {
    try {
      await apiService.post(API_ENDPOINTS.auth.logout)
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      apiService.clearTokens()
    }
  },

  // Get current user profile
  async getCurrentUser() {
    return apiService.get(API_ENDPOINTS.auth.profile)
  },

  // Update profile
  async updateProfile(userData) {
    return apiService.put(API_ENDPOINTS.auth.updateProfile, userData)
  },

  // Refresh token
  async refreshToken() {
    const refreshToken = apiService.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await apiService.post(API_ENDPOINTS.auth.refresh, {
      refresh: refreshToken,
    })
    
    if (response.access) {
      apiService.setTokens(response.access, response.refresh || refreshToken)
    }
    
    return response
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiService.getToken()
  },

  // Check email availability
  async checkEmail(email) {
    return apiService.post(API_ENDPOINTS.auth.checkEmail, { email })
  },

  // Check username availability
  async checkUsername(username) {
    return apiService.post(API_ENDPOINTS.auth.checkUsername, { username })
  },

  // Change password
  async changePassword(oldPassword, newPassword) {
    return apiService.post(API_ENDPOINTS.auth.changePassword, {
      old_password: oldPassword,
      new_password: newPassword,
    })
  },
}
