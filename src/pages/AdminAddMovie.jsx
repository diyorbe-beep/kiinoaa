// FILE: /src/pages/AdminAddMovie.jsx
// Admin page for adding new movies

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { AdminLayout } from '../components/AdminLayout'
import { movieService } from '../services/movieService'
import { apiService } from '../services/api'
import { API_ENDPOINTS } from '../config/api'

export const AdminAddMovie = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    release_date: '',
    duration: '',
    poster_image: '',
    backdrop_image: '',
    genres: [],
    director: '',
    cast: '',
    rating: '',
  })

  const genresList = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Adventure', 'Animation', 'Crime', 'Documentary', 'Family', 'Fantasy', 'History', 'Music', 'Mystery', 'War', 'Western']

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (type === 'checkbox') {
      if (checked) {
        setFormData(prev => ({
          ...prev,
          genres: [...prev.genres, value]
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          genres: prev.genres.filter(g => g !== value)
        }))
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
    
    setError(null)
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      // Prepare movie data
      const movieData = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        description: formData.description,
        release_date: formData.release_date || null,
        duration: formData.duration ? parseInt(formData.duration) : null,
        poster_image: formData.poster_image || null,
        backdrop_image: formData.backdrop_image || null,
        genres: formData.genres,
        director: formData.director || null,
        cast: formData.cast ? formData.cast.split(',').map(c => c.trim()) : [],
        rating: formData.rating ? parseFloat(formData.rating) : null,
      }

      // Send to backend
      const response = await apiService.post(API_ENDPOINTS.movies.list, movieData)
      
      setSuccess(true)
      setTimeout(() => {
        navigate('/admin')
      }, 2000)
    } catch (err) {
      setError(err.message || err.data?.detail || 'Failed to add movie. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-8 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="text-accent-primary hover:underline mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-text-primary mb-2">Add New Movie</h1>
          <p className="text-text-secondary">Fill in the details to add a new movie to the platform</p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            Movie added successfully! Redirecting...
          </div>
        )}

        {error && (
          <ErrorMessage error={error} className="mb-6" />
        )}

        <form onSubmit={handleSubmit} className="bg-background-default rounded-lg shadow-lg p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary bg-background-default text-text-primary"
              placeholder="Movie title"
            />
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-text-primary mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              name="slug"
              type="text"
              required
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary bg-background-default text-text-primary"
              placeholder="movie-slug"
            />
            <p className="mt-1 text-sm text-text-secondary">URL-friendly identifier (auto-generated from title)</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary bg-background-default text-text-primary"
              placeholder="Movie description/overview"
            />
          </div>

          {/* Release Date & Duration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="release_date" className="block text-sm font-medium text-text-primary mb-2">
                Release Date
              </label>
              <input
                id="release_date"
                name="release_date"
                type="date"
                value={formData.release_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary bg-background-default text-text-primary"
              />
            </div>
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-text-primary mb-2">
                Duration (minutes)
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary bg-background-default text-text-primary"
                placeholder="120"
              />
            </div>
          </div>

          {/* Poster & Backdrop Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="poster_image" className="block text-sm font-medium text-text-primary mb-2">
                Poster Image URL
              </label>
              <input
                id="poster_image"
                name="poster_image"
                type="url"
                value={formData.poster_image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary bg-background-default text-text-primary"
                placeholder="https://example.com/poster.jpg"
              />
            </div>
            <div>
              <label htmlFor="backdrop_image" className="block text-sm font-medium text-text-primary mb-2">
                Backdrop Image URL
              </label>
              <input
                id="backdrop_image"
                name="backdrop_image"
                type="url"
                value={formData.backdrop_image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary bg-background-default text-text-primary"
                placeholder="https://example.com/backdrop.jpg"
              />
            </div>
          </div>

          {/* Genres */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Genres
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {genresList.map((genre) => (
                <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    value={genre}
                    checked={formData.genres.includes(genre)}
                    onChange={handleChange}
                    className="rounded border-border-default text-accent-primary focus:ring-accent-primary"
                  />
                  <span className="text-sm text-text-primary">{genre}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Director & Cast */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="director" className="block text-sm font-medium text-text-primary mb-2">
                Director
              </label>
              <input
                id="director"
                name="director"
                type="text"
                value={formData.director}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary bg-background-default text-text-primary"
                placeholder="Director name"
              />
            </div>
            <div>
              <label htmlFor="cast" className="block text-sm font-medium text-text-primary mb-2">
                Cast (comma-separated)
              </label>
              <input
                id="cast"
                name="cast"
                type="text"
                value={formData.cast}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary bg-background-default text-text-primary"
                placeholder="Actor 1, Actor 2, Actor 3"
              />
            </div>
          </div>

          {/* Rating */}
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-text-primary mb-2">
              Initial Rating (0-10)
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="10"
              step="0.1"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary bg-background-default text-text-primary"
              placeholder="7.5"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  Adding Movie...
                </span>
              ) : (
                'Add Movie'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate('/admin')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}



