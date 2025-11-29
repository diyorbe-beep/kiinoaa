// FILE: /src/components/HeroSection.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './Button'
import { PlayIcon } from '../assets/icons/PlayIcon'

/**
 * HeroSection component - featured content banner with CTA
 */
export const HeroSection = ({ featured, className = '' }) => {
  if (!featured) return null
  
  return (
    <section
      className={`relative h-[600px] overflow-hidden ${className}`}
      aria-label="Featured content"
    >
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        {featured.backdrop ? (
          <img
            src={featured.backdrop}
            alt={featured.title}
            className="w-full h-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-inverse mb-4">
              {featured.title}
            </h1>
            {featured.description && (
              <p className="text-lg md:text-xl text-text-inverse/90 mb-6 line-clamp-3">
                {featured.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              <Link to={featured.type === 'movie' ? `/movie/${featured.id}` : `/series/${featured.id}`}>
                <Button variant="primary" size="lg" className="flex items-center gap-2">
                  <PlayIcon className="w-5 h-5" />
                  Watch Now
                </Button>
              </Link>
              {featured.trailer && (
                <Button variant="outline" size="lg" className="text-text-inverse border-text-inverse hover:bg-text-inverse hover:text-text-primary">
                  Watch Trailer
                </Button>
              )}
            </div>
            {featured.rating && (
              <div className="mt-6 flex items-center gap-4 text-text-inverse">
                <span className="text-lg font-semibold">{featured.rating.toFixed(1)}</span>
                <span className="text-sm">Rating</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

