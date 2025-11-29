// FILE: /src/pages/Register.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useAuth } from '../contexts/AuthContext'

/**
 * Register page
 */
export const Register = () => {
  const navigate = useNavigate()
  const { register, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [localError, setLocalError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    setLocalError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)

    // Validation
    if (!formData.name || !formData.username || !formData.email || !formData.password) {
      setLocalError('Please fill in all fields')
      return
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }

    try {
      // Prepare register data according to backend API spec
      // RegisterRequest schema: username*, email*, password*, password_confirm*, first_name, last_name, phone
      const nameParts = formData.name.trim().split(/\s+/)
      const firstName = nameParts[0] || formData.name
      const lastName = nameParts.slice(1).join(' ') || ''
      
      // Backend expects password_confirm (not password2)
      let registerData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        password_confirm: formData.confirmPassword, // Backend uses password_confirm, not password2
      }
      
      // Add optional name fields
      if (firstName) {
        registerData.first_name = firstName
      }
      if (lastName) {
        registerData.last_name = lastName
      }
      // phone is optional, skip for now
      
      console.log('Registering with data:', { 
        ...registerData, 
        password: '***', 
        password_confirm: '***' 
      })
      
      const response = await register(registerData)
      // If register returns user data, update user state
      if (response.user) {
        // User will be set by AuthContext
      }
      navigate('/')
    } catch (err) {
      // Better error handling
      let errorMsg = 'Registration failed. Please try again.'
      
      if (err.message) {
        errorMsg = err.message
      } else if (err.data) {
        if (err.data.detail) {
          errorMsg = typeof err.data.detail === 'string' 
            ? err.data.detail 
            : JSON.stringify(err.data.detail)
        } else if (err.data.message) {
          errorMsg = err.data.message
        } else if (typeof err.data === 'string') {
          errorMsg = err.data
        } else if (Array.isArray(err.data)) {
          errorMsg = err.data.join(', ')
        } else if (typeof err.data === 'object') {
          // Handle field-specific errors
          const fieldErrors = Object.entries(err.data)
            .map(([field, errors]) => {
              const errorList = Array.isArray(errors) ? errors.join(', ') : errors
              return `${field}: ${errorList}`
            })
            .join('; ')
          errorMsg = fieldErrors || errorMsg
        }
      }
      
      setLocalError(errorMsg)
      console.error('Registration error:', err)
    }
  }


  return (
    <main className="min-h-screen flex items-center justify-center bg-background-secondary py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-background-default rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Create Account</h1>
            <p className="text-text-secondary">Sign up to get started</p>
          </div>

          {(error || localError) && (
            <ErrorMessage error={error || localError} className="mb-6" />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent bg-background-default text-text-primary"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent bg-background-default text-text-primary"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent bg-background-default text-text-primary"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent bg-background-default text-text-primary"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent bg-background-default text-text-primary"
                placeholder="••••••••"
                minLength={6}
              />
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                required
                className="rounded border-border-default text-accent-primary focus:ring-accent-primary"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-text-secondary">
                I agree to the{' '}
                <a href="/terms" className="text-accent-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-accent-primary hover:underline">
                  Privacy Policy
                </a>
              </label>
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
                  Creating account...
                </span>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}


