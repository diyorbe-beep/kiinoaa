// FILE: /src/pages/AdminMovies.jsx
// Admin page for managing all movies

import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { movieService } from '../services/movieService'
import { apiService } from '../services/api'
import { API_ENDPOINTS } from '../config/api'
import { AdminLayout } from '../components/AdminLayout'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { Button } from '../components/Button'

export const AdminMovies = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(null)

  const apiFunction = useCallback(() => {
    const params = {
      page,
      limit: 20,
      ordering: '-created_at',
    }
    if (searchQuery) {
      params.search = searchQuery
    }
    return movieService.getMovies(params)
  }, [page, searchQuery])

  const { data, loading, error, execute } = useApi(apiFunction, true, [page, searchQuery])

  const handleDelete = async (slug, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }

    setDeleteLoading(slug)
    try {
      await apiService.delete(API_ENDPOINTS.movies.delete(slug))
      // Refresh the list
      execute()
    } catch (err) {
      alert(err.message || 'Failed to delete movie')
    } finally {
      setDeleteLoading(null)
    }
  }

  const normalizeResults = (data) => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (data.results && Array.isArray(data.results)) return data.results
    if (data.data && Array.isArray(data.data)) return data.data
    if (data.movies && Array.isArray(data.movies)) return data.movies
    return []
  }

  const movies = normalizeResults(data)
  const totalPages = data?.total_pages || data?.pages || 1
  const currentPage = data?.page || page

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-text-primary mb-2">Movies Management</h1>
            <p className="text-text-secondary">Manage all movies on the platform</p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/admin/movies/add')}
          >
            + Add New Movie
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="w-full md:w-96 px-4 py-2 border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary bg-background-default text-text-primary"
          />
        </div>

        {error && <ErrorMessage error={error} className="mb-6" />}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {movies.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-secondary text-lg">No movies found</p>
              </div>
            ) : (
              <div className="bg-background-default rounded-lg border border-border-default overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-background-secondary border-b border-border-default">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Movie
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Release Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                      {movies.map((movie) => (
                        <tr key={movie.slug || movie.id} className="hover:bg-background-secondary">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              {movie.poster_image && (
                                <img
                                  src={movie.poster_image}
                                  alt={movie.title}
                                  className="w-16 h-24 object-cover rounded"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                  }}
                                />
                              )}
                              <div>
                                <p className="font-semibold text-text-primary">{movie.title}</p>
                                <p className="text-sm text-text-secondary">{movie.slug}</p>
                                {movie.genres && movie.genres.length > 0 && (
                                  <p className="text-xs text-text-tertiary mt-1">
                                    {Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-text-secondary">
                            {movie.release_date ? new Date(movie.release_date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-text-primary font-medium">
                              {movie.rating ? movie.rating.toFixed(1) : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/admin/movies/${movie.slug}/edit`)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/movie/${movie.slug}`)}
                              >
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(movie.slug, movie.title)}
                                disabled={deleteLoading === movie.slug}
                                className="text-error hover:text-error hover:border-error"
                              >
                                {deleteLoading === movie.slug ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  'Delete'
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-text-secondary">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}





