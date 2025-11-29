// FILE: /src/pages/Movies.jsx
import React, { useState } from 'react'
import { MovieCard } from '../components/MovieCard'
import { CategoryFilter } from '../components/CategoryFilter'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { SkeletonCard } from '../components/Skeleton'
import { movieService } from '../services/movieService'
import { useApi } from '../hooks/useApi'

/**
 * Movies listing page
 */
export const Movies = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [page, setPage] = useState(1)
  
  const categories = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Adventure']
  
  // Fetch movies - use useCallback to prevent infinite loop
  const fetchMoviesData = React.useCallback(() => {
    return movieService.getMovies({
      page,
      ...(selectedCategory !== 'All' && { genre: selectedCategory }),
    })
  }, [page, selectedCategory])
  
  const {
    data: moviesData,
    loading: moviesLoading,
    error: moviesError,
    execute: fetchMovies,
  } = useApi(fetchMoviesData, true, [page, selectedCategory])
  
  // Normalize API response
  const normalizeResults = (data) => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (data.results) return data.results
    if (data.data) return Array.isArray(data.data) ? data.data : []
    return []
  }
  
  const movies = normalizeResults(moviesData)
  const totalPages = moviesData?.count ? Math.ceil(moviesData.count / (moviesData?.page_size || 20)) : 1
  
  return (
    <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Movies</h1>
        <p className="text-text-secondary">
          Discover and explore our collection of movies
        </p>
      </div>
      
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        className="mb-6"
      />
      
      {moviesLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : moviesError ? (
        <ErrorMessage error={moviesError} onRetry={fetchMovies} />
      ) : movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">No movies found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id || movie.slug}
                movie={{
                  id: movie.slug || movie.id,
                  title: movie.title,
                  year: movie.release_date
                    ? new Date(movie.release_date).getFullYear()
                    : movie.year || (movie.created_at ? new Date(movie.created_at).getFullYear() : null),
                  rating: movie.rating ? movie.rating / 2 : null,
                  poster: movie.poster_image || movie.poster,
                }}
              />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-primary-100 text-text-primary rounded-md hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-text-secondary">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 bg-primary-100 text-text-primary rounded-md hover:bg-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}


