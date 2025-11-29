// FILE: /src/services/api.js
// API service with error handling and token management

import { API_BASE_URL } from '../config/api'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  // Get auth tokens from localStorage
  getToken() {
    return localStorage.getItem('access_token')
  }

  getRefreshToken() {
    return localStorage.getItem('refresh_token')
  }

  // Set auth tokens
  setTokens(accessToken, refreshToken) {
    if (accessToken) {
      localStorage.setItem('access_token', accessToken)
    } else {
      localStorage.removeItem('access_token')
    }
    
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken)
    } else {
      localStorage.removeItem('refresh_token')
    }
  }

  // Clear all tokens
  clearTokens() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  // Build full URL
  buildURL(endpoint) {
    if (endpoint.startsWith('http')) {
      return endpoint
    }
    return `${this.baseURL}${endpoint}`
  }

  // Build headers
  buildHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }

    const token = this.getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    // Add Content-Type for requests with body
    if (!customHeaders['Content-Type'] && !customHeaders['content-type']) {
      headers['Content-Type'] = 'application/json'
    }

    return headers
  }

  // Handle response
  async handleResponse(response) {
    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')

    let data
    if (isJson) {
      try {
        data = await response.json()
      } catch (e) {
        data = {}
      }
    } else {
      data = await response.text()
    }

    if (!response.ok) {
      // Better error message handling
      let errorMessage = `HTTP error! status: ${response.status}`
      
      if (data) {
        if (data.detail) {
          errorMessage = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)
        } else if (data.message) {
          errorMessage = data.message
        } else if (typeof data === 'string') {
          errorMessage = data
        } else if (Array.isArray(data)) {
          errorMessage = data.map(err => {
            if (typeof err === 'string') return err
            if (err.msg) return err.msg
            if (err.message) return err.message
            return JSON.stringify(err)
          }).join(', ')
        } else if (typeof data === 'object') {
          // Handle field-specific errors
          // Check if it's a validation error with nested errors object
          if (data.errors && typeof data.errors === 'object') {
            // Backend returns {id: "VALIDATION_ERROR", message: "...", errors: {...}}
            const fieldErrors = Object.entries(data.errors)
              .map(([field, errors]) => {
                // Handle non_field_errors which might be an object with language keys
                if (field === 'non_field_errors') {
                  if (typeof errors === 'object' && !Array.isArray(errors)) {
                    // Multi-language error object: {en: "...", uz: "...", ru: "..."}
                    // Use English by default, or first available language
                    return errors.en || errors.uz || errors.ru || Object.values(errors)[0] || String(errors)
                  } else if (Array.isArray(errors)) {
                    return errors.join(', ')
                  }
                  return String(errors)
                }
                // Regular field errors
                const errorList = Array.isArray(errors) ? errors.join(', ') : String(errors)
                return `${field}: ${errorList}`
              })
              .join('; ')
            errorMessage = fieldErrors || data.message || errorMessage
          } else {
            // Standard field errors format
            const fieldErrors = Object.entries(data)
              .map(([field, errors]) => {
                const errorList = Array.isArray(errors) ? errors.join(', ') : String(errors)
                return `${field}: ${errorList}`
              })
              .join('; ')
            errorMessage = fieldErrors || errorMessage
          }
        }
      }
      
      const error = new Error(errorMessage)
      error.status = response.status
      error.data = data
      
      // Log error for debugging
      if (import.meta.env.DEV) {
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          errorData: data,
          errorDataString: typeof data === 'object' ? JSON.stringify(data, null, 2) : data
        })
        // Also log separately for easier inspection
        console.error('Backend Error Details:', data)
        // Log errors object if it exists
        if (data.errors && typeof data.errors === 'object') {
          console.error('Backend Validation Errors:', JSON.stringify(data.errors, null, 2))
          console.error('Missing/Invalid Fields:', Object.keys(data.errors))
          // Log each field error separately
          Object.entries(data.errors).forEach(([field, errors]) => {
            let errorMsg = ''
            if (field === 'non_field_errors') {
              // Handle multi-language error object
              if (typeof errors === 'object' && !Array.isArray(errors)) {
                errorMsg = errors.en || errors.uz || errors.ru || Object.values(errors)[0] || JSON.stringify(errors)
              } else {
                errorMsg = Array.isArray(errors) ? errors.join(', ') : String(errors)
              }
            } else {
              errorMsg = Array.isArray(errors) ? errors.join(', ') : String(errors)
            }
            console.error(`  ❌ ${field}: ${errorMsg}`)
          })
        } else if (typeof data === 'object' && !data.errors) {
          // If no errors object, log the whole data object
          console.error('Backend Error Data (full):', JSON.stringify(data, null, 2))
        }
      }
      
      throw error
    }

    return data
  }

  // GET request
  async get(endpoint, options = {}) {
    const url = this.buildURL(endpoint)
    const headers = this.buildHeaders(options.headers)

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        ...options,
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error('GET request failed:', error)
      throw error
    }
  }

  // POST request
  async post(endpoint, data = {}, options = {}) {
    const url = this.buildURL(endpoint)
    const headers = this.buildHeaders(options.headers)
    
    // Log request for debugging (hide sensitive data)
    if (import.meta.env.DEV) {
      const logData = { ...data }
      if (logData.password) logData.password = '***'
      if (logData.password2) logData.password2 = '***'
      if (logData.password_confirmation) logData.password_confirmation = '***'
      console.log('API POST Request:', {
        url,
        endpoint,
        data: logData,
        headers: { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : undefined }
      })
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
        ...options,
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error('POST request failed:', error)
      throw error
    }
  }

  // PUT request
  async put(endpoint, data = {}, options = {}) {
    const url = this.buildURL(endpoint)
    const headers = this.buildHeaders(options.headers)

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
        ...options,
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error('PUT request failed:', error)
      throw error
    }
  }

  // PATCH request
  async patch(endpoint, data = {}, options = {}) {
    const url = this.buildURL(endpoint)
    const headers = this.buildHeaders(options.headers)

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(data),
        ...options,
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error('PATCH request failed:', error)
      throw error
    }
  }

  // DELETE request
  async delete(endpoint, options = {}) {
    const url = this.buildURL(endpoint)
    const headers = this.buildHeaders(options.headers)

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
        ...options,
      })

      return await this.handleResponse(response)
    } catch (error) {
      console.error('DELETE request failed:', error)
      throw error
    }
  }
}

export const apiService = new ApiService()


