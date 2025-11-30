// FILE: /src/pages/AdminRatings.jsx
// Admin page for managing ratings

import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { ratingService } from '../services/ratingService'
import { AdminLayout } from '../components/AdminLayout'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { Button } from '../components/Button'

export const AdminRatings = () => {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [deleteLoading, setDeleteLoading] = useState(null)

  const apiFunction = useCallback(() => {
    return ratingService.getRatings({
      page,
      limit: 20,
      ordering: '-created_at',
    })
  }, [page])

  const { data, loading, error, execute } = useApi(apiFunction, true, [page])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rating? This action cannot be undone.')) {
      return
    }

    setDeleteLoading(id)
    try {
      await ratingService.deleteRating(id)
      execute()
    } catch (err) {
      alert(err.message || 'Failed to delete rating')
    } finally {
      setDeleteLoading(null)
    }
  }

  const normalizeResults = (data) => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (data.results && Array.isArray(data.results)) return data.results
    if (data.data && Array.isArray(data.data)) return data.data
    if (data.ratings && Array.isArray(data.ratings)) return data.ratings
    return []
  }

  const ratings = normalizeResults(data)
  const totalPages = data?.total_pages || data?.pages || 1
  const currentPage = data?.page || page

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-text-primary mb-2">Ratings Management</h1>
          <p className="text-text-secondary">View and manage all ratings on the platform</p>
        </div>

        {error && <ErrorMessage error={error} className="mb-6" />}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {ratings.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-secondary text-lg">No ratings found</p>
              </div>
            ) : (
              <div className="bg-background-default rounded-lg border border-border-default overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-background-secondary border-b border-border-default">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Movie
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                      {ratings.map((rating) => (
                        <tr key={rating.id} className="hover:bg-background-secondary">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-accent-primary">
                                {rating.rating || rating.value || 'N/A'}
                              </span>
                              <span className="text-text-secondary">/ 10</span>
                            </div>
                            {rating.review && (
                              <p className="text-sm text-text-secondary mt-1 max-w-md truncate">
                                {rating.review}
                              </p>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-text-primary font-medium">
                              {rating.user?.username || rating.user?.email || rating.username || 'Anonymous'}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            {rating.movie ? (
                              <button
                                onClick={() => navigate(`/movie/${rating.movie.slug || rating.movie}`)}
                                className="text-accent-primary hover:underline"
                              >
                                {rating.movie.title || rating.movie_slug || 'View Movie'}
                              </button>
                            ) : (
                              <span className="text-text-secondary">N/A</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-text-secondary text-sm">
                            {rating.created_at ? new Date(rating.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(rating.id)}
                              disabled={deleteLoading === rating.id}
                              className="text-error hover:text-error hover:border-error"
                            >
                              {deleteLoading === rating.id ? (
                                <LoadingSpinner size="sm" />
                              ) : (
                                'Delete'
                              )}
                            </Button>
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




