// FILE: /src/pages/AdminDashboard.jsx
import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { movieService } from '../services/movieService'
import { commentService } from '../services/commentService'
import { ratingService } from '../services/ratingService'
import { AdminLayout } from '../components/AdminLayout'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { Button } from '../components/Button'

export const AdminDashboard = () => {
  const navigate = useNavigate()

  // Fetch real data from backend
  const moviesApi = useCallback(() => movieService.getMovies({ limit: 1 }), [])
  const commentsApi = useCallback(() => commentService.getComments({ limit: 1 }), [])
  const ratingsApi = useCallback(() => ratingService.getRatings({ limit: 1 }), [])

  const { data: moviesData, loading: moviesLoading, error: moviesError } = useApi(moviesApi, true)
  const { data: commentsData, loading: commentsLoading, error: commentsError } = useApi(commentsApi, true)
  const { data: ratingsData, loading: ratingsLoading, error: ratingsError } = useApi(ratingsApi, true)

  const getCount = (data) => {
    if (!data) return 0
    if (data.count !== undefined) return data.count
    if (data.total !== undefined) return data.total
    if (Array.isArray(data)) return data.length
    if (data.results && Array.isArray(data.results)) return data.total || data.results.length
    return 0
  }

  const totalMovies = getCount(moviesData)
  const totalComments = getCount(commentsData)
  const totalRatings = getCount(ratingsData)

  const stats = [
    { label: 'Total Movies', value: moviesLoading ? '...' : totalMovies.toLocaleString(), change: '', link: '/admin/movies' },
    { label: 'Total Comments', value: commentsLoading ? '...' : totalComments.toLocaleString(), change: '', link: '/admin/comments' },
    { label: 'Total Ratings', value: ratingsLoading ? '...' : totalRatings.toLocaleString(), change: '', link: '/admin/ratings' },
    { label: 'Platform Status', value: 'Operational', change: '', status: 'green' },
  ]

  const quickActions = [
    { label: 'Add Movie', icon: '➕', link: '/admin/movies/add', variant: 'primary' },
    { label: 'Manage Movies', icon: '🎬', link: '/admin/movies', variant: 'outline' },
    { label: 'Moderate Comments', icon: '💬', link: '/admin/comments', variant: 'outline' },
    { label: 'View Ratings', icon: '⭐', link: '/admin/ratings', variant: 'outline' },
  ]

  return (
    <AdminLayout>
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
          <p className="text-text-secondary">
            Monitor platform health, review content, and manage community at a glance.
          </p>
        </header>

        {/* Error Messages */}
        {(moviesError || commentsError || ratingsError) && (
          <div className="mb-6 space-y-2">
            {moviesError && <ErrorMessage error={`Movies: ${moviesError}`} />}
            {commentsError && <ErrorMessage error={`Comments: ${commentsError}`} />}
            {ratingsError && <ErrorMessage error={`Ratings: ${ratingsError}`} />}
          </div>
        )}

        {/* KPI cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className={`rounded-lg border border-border-default bg-background-default p-5 shadow-sm ${
                stat.link ? 'cursor-pointer hover:border-accent-primary transition-colors' : ''
              }`}
              onClick={stat.link ? () => navigate(stat.link) : undefined}
            >
              <p className="text-sm text-text-secondary mb-2">{stat.label}</p>
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-3xl font-semibold text-text-primary">{stat.value}</h3>
                  {stat.link && (
                    <p className="text-xs text-text-tertiary mt-1">Click to view details</p>
                  )}
                </div>
                {stat.status === 'green' && (
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                    ✓ Active
                  </span>
                )}
              </div>
            </article>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.link)}
                className={`rounded-lg border border-border-default p-6 text-left hover:border-accent-primary transition-colors ${
                  action.variant === 'primary'
                    ? 'bg-accent-primary text-text-inverse border-accent-primary'
                    : 'bg-background-default'
                }`}
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <p className={`font-semibold ${action.variant === 'primary' ? 'text-text-inverse' : 'text-text-primary'}`}>
                  {action.label}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* Platform Status */}
        <section className="rounded-lg border border-border-default bg-background-default p-6">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Platform Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['API', 'Database', 'Media CDN', 'Authentication'].map((service) => (
              <div key={service} className="rounded-lg border border-border-default p-4 bg-background-secondary">
                <p className="text-sm text-text-secondary mb-1">{service}</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <p className="text-sm font-semibold text-text-primary">Operational</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}


