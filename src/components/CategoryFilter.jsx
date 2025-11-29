// FILE: /src/components/CategoryFilter.jsx
import React from 'react'

/**
 * CategoryFilter component - filter chips/buttons
 */
export const CategoryFilter = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  className = '',
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`} role="group" aria-label="Filter by category">
      {categories.map((category) => (
        <button
          key={category.id || category}
          type="button"
          onClick={() => onCategoryChange && onCategoryChange(category.id || category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary ${
            selectedCategory === (category.id || category)
              ? 'bg-accent-primary text-text-inverse'
              : 'bg-primary-100 text-text-primary hover:bg-primary-200'
          }`}
          aria-pressed={selectedCategory === (category.id || category)}
        >
          {category.name || category}
        </button>
      ))}
    </div>
  )
}

