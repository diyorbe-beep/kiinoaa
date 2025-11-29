// FILE: /src/components/Carousel.jsx
import React, { useState, useEffect } from 'react'

/**
 * Carousel component for content sliders
 */
export const Carousel = ({ items = [], autoPlay = false, interval = 5000, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    if (autoPlay && items.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length)
      }, interval)
      return () => clearInterval(timer)
    }
  }, [autoPlay, interval, items.length])
  
  const goToSlide = (index) => {
    setCurrentIndex(index)
  }
  
  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }
  
  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }
  
  if (items.length === 0) return null
  
  return (
    <div className={`relative ${className}`} aria-label="Carousel">
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="min-w-full flex-shrink-0">
              {item}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation buttons */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-text-inverse p-2 rounded-full hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-accent-primary"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-text-inverse p-2 rounded-full hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-accent-primary"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
      
      {/* Indicators */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2 mt-4" role="tablist" aria-label="Carousel indicators">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-accent-primary ${
                index === currentIndex ? 'w-8 bg-accent-primary' : 'w-2 bg-primary-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
            />
          ))}
        </div>
      )}
    </div>
  )
}

