// FILE: /src/components/MovieCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { RatingStars } from './RatingStars'
import { HeartIcon } from '../assets/icons/HeartIcon'
import { PlayIcon } from '../assets/icons/PlayIcon'

/**
 * MovieCard component - displays movie poster, title, rating, and actions
 */
export const MovieCard = ({ movie, className = '' }) => {
  const [isFavorite, setIsFavorite] = React.useState(false)
  
  return (
    <article className={`group relative ${className}`}>
      <Link
        to={`/movie/${movie.id || movie.slug}`}
        className="block"
        aria-label={`View details for ${movie.title}`}
      >
        <div className="relative overflow-hidden rounded-lg bg-primary-200 aspect-[2/3] mb-3">
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-tertiary">
              No Image
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 flex items-center justify-center">
            <PlayIcon className="w-12 h-12 text-text-inverse opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              setIsFavorite(!isFavorite)
            }}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-accent-primary"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <HeartIcon
              className="w-5 h-5 text-text-inverse"
              filled={isFavorite}
            />
          </button>
        </div>
        
        <div>
          <h3 className="font-semibold text-text-primary mb-1 line-clamp-2 group-hover:text-accent-primary transition-colors">
            {movie.title}
          </h3>
          {movie.year && (
            <p className="text-sm text-text-secondary mb-2">{movie.year}</p>
          )}
          {movie.rating !== undefined && (
            <RatingStars rating={movie.rating} size="sm" />
          )}
        </div>
      </Link>
    </article>
  )
}

