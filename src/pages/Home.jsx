// FILE: /src/pages/Home.jsx
import React, { useState, useEffect } from 'react'
import { HeroSection } from '../components/HeroSection'
import { MovieCard } from '../components/MovieCard'
import { SeriesCard } from '../components/SeriesCard'
import { CategoryFilter } from '../components/CategoryFilter'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { SkeletonCard } from '../components/Skeleton'
import { movieService } from '../services/movieService'
import { useApi } from '../hooks/useApi'

/**
 * Home page - main landing page
 */
export const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  const categories = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller']
  
  // Fetch trending movies - use useCallback to prevent infinite loop
  const fetchTrendingMovies = React.useCallback(() => {
    return movieService.getTrendingMovies()
  }, [])
  
  const {
    data: trendingMoviesData,
    loading: moviesLoading,
    error: moviesError,
    execute: fetchMovies,
  } = useApi(fetchTrendingMovies, true)
  
  const normalizeResults = (payload) => {
    if (!payload) return []
    if (Array.isArray(payload)) return payload
    if (Array.isArray(payload.results)) return payload.results
    if (Array.isArray(payload.data)) return payload.data
    return []
  }

  const trendingMovies = normalizeResults(trendingMoviesData)

  // Get featured content (first trending movie)
  const featuredContent = trendingMovies.length > 0
    ? {
        id: trendingMovies[0]?.slug || trendingMovies[0]?.id,
        title: trendingMovies[0]?.title,
        description: trendingMovies[0]?.description,
        backdrop: trendingMovies[0]?.backdrop_image || trendingMovies[0]?.backdrop,
        poster: trendingMovies[0]?.poster_image || trendingMovies[0]?.poster,
        type: 'movie',
        rating: trendingMovies[0]?.rating ? trendingMovies[0].rating / 2 : null,
        trailer: null,
      }
    : null
  
  // Filter movies by category
  const filteredMovies = selectedCategory && selectedCategory !== 'All'
    ? trendingMovies.filter((movie) => 
        movie.genres?.some((g) => 
          typeof g === 'string' ? g === selectedCategory : g.name === selectedCategory
        )
      )
    : trendingMovies

  return (
    <main>
      {/* Hero Section */}
      {featuredContent && <HeroSection featured={featuredContent} />}
      
      {/* Trending Movies */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-12" aria-label="Trending movies">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-text-primary">Trending Movies</h2>
          <a href="/movies" className="text-accent-primary hover:underline text-sm font-medium">
            View All
          </a>
        </div>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          className="mb-6"
        />
        
        {moviesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[...Array(5)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : moviesError ? (
          <ErrorMessage error={moviesError} onRetry={fetchMovies} />
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredMovies.slice(0, 10).map((movie) => (
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
        ) : (
          <p className="text-text-secondary text-center py-8">No movies found</p>
        )}
      </section>
      
    </main>
  )
}

