// FILE: /src/pages/SeriesDetails.jsx
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { RatingStars } from '../components/RatingStars'
import { CommentSection } from '../components/CommentSection'
import { Button } from '../components/Button'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { SkeletonDetails } from '../components/Skeleton'
import { PlayIcon } from '../assets/icons/PlayIcon'
import { movieService } from '../services/movieService'
import { commentService } from '../services/commentService'
import { ratingService } from '../services/ratingService'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../contexts/AuthContext'

/**
 * Series Details page
 */
export const SeriesDetails = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [userRating, setUserRating] = useState(0)
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [ratingSubmitted, setRatingSubmitted] = useState(false)
  const [seasonsData, setSeasonsData] = useState([])
  
  // Fetch movie details (using movie API since backend doesn't have series) - use useCallback
  const fetchSeriesData = React.useCallback(() => {
    return movieService.getMovieBySlug(id)
  }, [id])
  
  const fetchCommentsData = React.useCallback(() => {
    return commentService.getMovieComments(id)
  }, [id])
  
  const fetchRatingsData = React.useCallback(() => {
    return ratingService.getMovieRatings(id)
  }, [id])
  
  const {
    data: seriesData,
    loading: seriesLoading,
    error: seriesError,
    execute: fetchSeries,
  } = useApi(fetchSeriesData, true, [id])
  
  // Fetch comments
  const {
    data: commentsData,
    loading: commentsLoading,
    error: commentsError,
    execute: fetchComments,
  } = useApi(fetchCommentsData, true, [id])
  
  // Fetch ratings
  const {
    data: ratingsData,
    loading: ratingsLoading,
    execute: fetchRatings,
  } = useApi(fetchRatingsData, true, [id])
  
  const series = seriesData
  const comments = commentsData?.results || commentsData || []
  const ratings = ratingsData?.results || ratingsData || []
  
  // Calculate average rating
  const averageRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
    : null
  
  // Handle rating submission
  const handleRatingSubmit = async (rating) => {
    if (!user) {
      alert('Please login to rate this movie')
      return
    }
    
    try {
      await ratingService.createRating({
        movie: series?.id || series?.slug,
        rating: rating * 2, // Backend expects 0-10, we use 0-5
      })
      setUserRating(rating)
      setRatingSubmitted(true)
      fetchRatings()
    } catch (error) {
      console.error('Failed to submit rating:', error)
      alert(error.message || 'Failed to submit rating. Please try again.')
    }
  }
  
  // Handle comment submission
  const handleAddComment = async (comment) => {
    if (!user) {
      alert('Please login to comment')
      return
    }
    
    try {
      await commentService.createComment({
        movie: series?.id || series?.slug,
        text: comment.text,
        ...(comment.rating && { rating: comment.rating * 2 }),
      })
      fetchComments()
    } catch (error) {
      console.error('Failed to add comment:', error)
      alert(error.message || 'Failed to add comment. Please try again.')
    }
  }
  
  if (seriesLoading) {
    return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <SkeletonDetails />
      </main>
    )
  }

  if (seriesError) {
    return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <ErrorMessage error={seriesError} onRetry={fetchSeries} />
      </main>
    )
  }

  if (!series) {
    return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">Series not found</p>
        </div>
      </main>
    )
  }

  const seriesYear = series?.release_date 
    ? new Date(series.release_date).getFullYear() 
    : series?.year || (series?.created_at ? new Date(series.created_at).getFullYear() : null)
  const seriesRating = averageRating || (series?.rating ? series.rating / 2 : null)
  const seriesGenres = series?.genres || []
  const seriesCast = series?.cast || []
  const seriesDirector = series?.director || 'Unknown'

  return (
    <main>
      {/* Hero Section with Backdrop */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          {series.backdrop_path || series.backdrop ? (
            <img
              src={series.backdrop_path || series.backdrop}
              alt={series.name || series.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background-default via-background-default/50 to-transparent" />
        </div>
      </section>
      
      {/* Series Details */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            {series.poster_path || series.poster ? (
              <img
                src={series.poster_path || series.poster}
                alt={series.name || series.title}
                className="w-full rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-primary-200 rounded-lg flex items-center justify-center text-text-tertiary">
                No Image
              </div>
            )}
          </div>
          
          {/* Details */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              {series?.title} {seriesYear && `(${seriesYear})`}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {seriesRating && <RatingStars rating={seriesRating} size="md" />}
              {series?.duration && (
                <span className="text-text-secondary">{series.duration} min</span>
              )}
              {seriesGenres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {seriesGenres.map((genre) => (
                    <span
                      key={typeof genre === 'object' ? genre.id : genre}
                      className="px-3 py-1 bg-primary-100 text-text-primary rounded-full text-sm"
                    >
                      {typeof genre === 'object' ? genre.name : genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {(series.overview || series.description) && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-text-primary leading-relaxed">
                  {series.overview || series.description}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {seriesDirector && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Director</h3>
                  <p className="text-text-secondary">{seriesDirector}</p>
                </div>
              )}
              {seriesCast.length > 0 && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Cast</h3>
                  <p className="text-text-secondary">
                    {seriesCast.slice(0, 5).map((actor) => 
                      typeof actor === 'object' ? actor.name : actor
                    ).join(', ')}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <Button variant="primary" size="lg" className="flex items-center gap-2">
                <PlayIcon className="w-5 h-5" />
                Watch Now
              </Button>
              {series.trailer && (
                <Button variant="outline" size="lg">
                  Watch Trailer
                </Button>
              )}
            </div>
            
            {/* User Rating */}
            {user && (
              <div className="border-t border-border-default pt-6">
                <h3 className="font-semibold text-text-primary mb-4">Rate this series</h3>
                {ratingSubmitted ? (
                  <p className="text-accent-primary">Thank you for your rating!</p>
                ) : (
                  <RatingStars
                    rating={userRating}
                    interactive={true}
                    onRatingChange={handleRatingSubmit}
                    size="lg"
                  />
                )}
              </div>
            )}
          </div>
        </div>
        
      </section>
      
      {/* Comments Section */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        {commentsLoading ? (
          <LoadingSpinner />
        ) : commentsError ? (
          <ErrorMessage error={commentsError} onRetry={fetchComments} />
        ) : (
          <CommentSection comments={comments} onAddComment={handleAddComment} />
        )}
      </section>
    </main>
  )
}

