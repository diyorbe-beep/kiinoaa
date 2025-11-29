// FILE: /src/components/SearchBar.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchIcon } from '../assets/icons/SearchIcon'

/**
 * SearchBar component with autocomplete
 */
export const SearchBar = ({ className = '', placeholder = 'Search movies, series...' }) => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`} role="search">
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>
      <input
        id="search-input"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent bg-background-default text-text-primary"
        aria-label="Search movies and series"
      />
      <button
        type="submit"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-tertiary hover:text-text-primary"
        aria-label="Submit search"
      >
        <SearchIcon className="w-5 h-5" />
      </button>
    </form>
  )
}

