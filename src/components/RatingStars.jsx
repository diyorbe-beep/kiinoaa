// FILE: /src/components/RatingStars.jsx
import React from 'react'
import { StarIcon } from '../assets/icons/StarIcon'

/**
 * RatingStars component - displays or allows rating input
 * @param {number} rating - Current rating (0-5)
 * @param {boolean} interactive - Allow user to set rating
 * @param {function} onRatingChange - Callback when rating changes
 * @param {string} size - 'sm' | 'md' | 'lg'
 */
export const RatingStars = ({
  rating = 0,
  interactive = false,
  onRatingChange,
  size = 'md',
  className = '',
}) => {
  const [hoverRating, setHoverRating] = React.useState(0)
  
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }
  
  const handleClick = (value) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }
  
  const displayRating = hoverRating || rating
  
  return (
    <div className={`flex items-center gap-1 ${className}`} role={interactive ? 'radiogroup' : 'img'} aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          className={interactive ? 'cursor-pointer focus:outline-none' : 'cursor-default'}
          onClick={() => handleClick(value)}
          onMouseEnter={() => interactive && setHoverRating(value)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          aria-label={`${value} star${value !== 1 ? 's' : ''}`}
          disabled={!interactive}
        >
          <StarIcon
            className={`${sizes[size]} ${value <= displayRating ? 'text-yellow-400' : 'text-gray-300'}`}
            filled={value <= displayRating}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-sm text-text-secondary">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}

