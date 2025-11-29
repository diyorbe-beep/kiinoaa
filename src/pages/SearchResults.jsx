// FILE: /src/pages/SearchResults.jsx
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MovieCard } from '../components/MovieCard'
import { SeriesCard } from '../components/SeriesCard'
import { CategoryFilter } from '../components/CategoryFilter'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { SkeletonCard } from '../components/Skeleton'
import { movieService } from '../services/movieService'
import { useApi } from '../hooks/useApi'

/**
 * Search Results page
 */
export const SearchResults = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [filter, setFilter] = useState('all')
  
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'movies', label: 'Movies' },
    { id: 'series', label: 'Series' },
  ]
  
  // Fetch search results - use useCallback to prevent infinite loop
  const fetchSearchData = React.useCallback(() => {
    if (!query) return Promise.resolve({ results: [] })
    return movieService.searchMovies(query)
  }, [query])
  
  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
    execute: performSearch,
  } = useApi(fetchSearchData, !!query, [query, filter])
  
  // Normalize API response
  const normalizeResults = (data) => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (data.results) return data.results
    if (data.data) return Array.isArray(data.data) ? data.data : []
    return []
  }
  
  const displayResults = normalizeResults(searchData)
  
  return (
    <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Search Results {query && `for "${query}"`}
        </h1>
        <div className="flex items-center gap-4">
          <CategoryFilter
            categories={filters.map(f => ({ id: f.id, name: f.label }))}
            selectedCategory={filter}
            onCategoryChange={setFilter}
          />
          {!searchLoading && (
            <span className="text-text-secondary text-sm">
              {displayResults.length} result{displayResults.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
      
      {searchLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : searchError ? (
        <ErrorMessage error={searchError} onRetry={performSearch} />
      ) : displayResults.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg mb-2">No results found</p>
          <p className="text-text-tertiary">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {displayResults.map((item) => (
            <MovieCard 
              key={item.id || item.slug} 
              movie={{
                id: item.slug || item.id,
                title: item.title,
                year: item.release_date 
                  ? new Date(item.release_date).getFullYear() 
                  : item.year || (item.created_at ? new Date(item.created_at).getFullYear() : null),
                rating: item.rating ? item.rating / 2 : null,
                poster: item.poster_image || item.poster,
              }} 
            />
          ))}
        </div>
      )}
    </main>
  )
}

