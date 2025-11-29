// FILE: /src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Button } from '../components/Button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { useAuth } from '../contexts/AuthContext'

/**
 * Login page
 */
export const Login = () => {
  const navigate = useNavigate()
  const { login, loading, error } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

    if (!formData.email || !formData.password) {
      setLocalError('Please fill in all fields')
      return
    }

    try {
      const response = await login(formData.email, formData.password)
      // If login returns user data, update user state
      if (response.user) {
        // User will be set by AuthContext
      }
      navigate('/')
    } catch (err) {
      // Better error handling
      let errorMsg = 'Login failed. Please try again.'
      
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
        }
      }
      
      setLocalError(errorMsg)
      console.error('Login error:', err)
    }
  }


  return (
    <main className="min-h-screen flex items-center justify-center bg-background-secondary py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-background-default rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome Back</h1>
            <p className="text-text-secondary">Sign in to your account</p>
          </div>

          {(error || localError) && (
            <ErrorMessage error={error || localError} className="mb-6" />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-border-default text-accent-primary focus:ring-accent-primary"
                />
                <span className="ml-2 text-sm text-text-secondary">Remember me</span>
              </label>
              <a href="#" className="text-sm text-accent-primary hover:underline">
                Forgot password?
              </a>
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
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}


