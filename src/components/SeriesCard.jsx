// FILE: /src/components/SeriesCard.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { RatingStars } from './RatingStars'
import { HeartIcon } from '../assets/icons/HeartIcon'
import { PlayIcon } from '../assets/icons/PlayIcon'

/**
 * SeriesCard component - displays series poster, title, seasons, rating, and actions
 */
export const SeriesCard = ({ series, className = '' }) => {
  const [isFavorite, setIsFavorite] = React.useState(false)
  
  return (
    <article className={`group relative ${className}`}>
      <Link
        to={`/series/${series.id}`}
        className="block"
        aria-label={`View details for ${series.title}`}
      >
        <div className="relative overflow-hidden rounded-lg bg-primary-200 aspect-[2/3] mb-3">
          {series.poster ? (
            <img
              src={series.poster}
              alt={`${series.title} poster`}
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
          
          {/* Seasons badge */}
          {series.seasons && (
            <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-70 rounded text-xs text-text-inverse">
              {series.seasons} {series.seasons === 1 ? 'Season' : 'Seasons'}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="font-semibold text-text-primary mb-1 line-clamp-2 group-hover:text-accent-primary transition-colors">
            {series.title}
          </h3>
          {series.year && (
            <p className="text-sm text-text-secondary mb-2">
              {series.year} {series.seasons && `• ${series.seasons} Seasons`}
            </p>
          )}
          {series.rating !== undefined && (
            <RatingStars rating={series.rating} size="sm" />
          )}
        </div>
      </Link>
    </article>
  )
}

