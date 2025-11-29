// FILE: /src/pages/MovieDetails.jsx
import React, { useState } from 'react'
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
 * Movie Details page
 */
export const MovieDetails = () => {
  const { id } = useParams() // This will be slug from backend
  const { user } = useAuth()
  const [userRating, setUserRating] = useState(0)
  const [ratingSubmitted, setRatingSubmitted] = useState(false)
  
  // Fetch movie details by slug - use useCallback to prevent infinite loop
  const fetchMovieData = React.useCallback(() => {
    return movieService.getMovieBySlug(id)
  }, [id])
  
  const fetchCommentsData = React.useCallback(() => {
    return commentService.getMovieComments(id)
  }, [id])
  
  const fetchRatingsData = React.useCallback(() => {
    return ratingService.getMovieRatings(id)
  }, [id])
  
  const {
    data: movieData,
    loading: movieLoading,
    error: movieError,
    execute: fetchMovie,
  } = useApi(fetchMovieData, true, [id])
  
  // Fetch comments for movie
  const {
    data: commentsData,
    loading: commentsLoading,
    error: commentsError,
    execute: fetchComments,
  } = useApi(fetchCommentsData, true, [id])
  
  // Fetch ratings for movie
  const {
    data: ratingsData,
    loading: ratingsLoading,
    execute: fetchRatings,
  } = useApi(fetchRatingsData, true, [id])
  
  const movie = movieData
  const comments = commentsData?.results || commentsData || []
  const ratings = ratingsData?.results || ratingsData || []
  
  // Calculate average rating from ratings
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
        movie: movie?.id || movie?.slug,
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
        movie: movie?.id || movie?.slug,
        text: comment.text,
        ...(comment.rating && { rating: comment.rating * 2 }),
      })
      fetchComments()
    } catch (error) {
      console.error('Failed to add comment:', error)
      alert(error.message || 'Failed to add comment. Please try again.')
    }
  }
  
  if (movieLoading) {
    return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <SkeletonDetails />
      </main>
    )
  }

  if (movieError) {
    return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <ErrorMessage error={movieError} onRetry={fetchMovie} />
      </main>
    )
  }

  if (!movie) {
    return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">Movie not found</p>
        </div>
      </main>
    )
  }

  const movieYear = movie?.release_date 
    ? new Date(movie.release_date).getFullYear() 
    : movie?.year || new Date(movie?.created_at).getFullYear()
  const movieRating = averageRating || (movie?.rating ? movie.rating / 2 : null)
  const movieGenres = movie?.genres || []
  const movieCast = movie?.cast || []
  const movieDirector = movie?.director || 'Unknown'

  return (
    <main>
      {/* Hero Section with Backdrop */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          {movie?.backdrop_image || movie?.backdrop ? (
            <img
              src={movie.backdrop_image || movie.backdrop}
              alt={movie?.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-800 to-primary-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background-default via-background-default/50 to-transparent" />
        </div>
      </section>
      
      {/* Movie Details */}
      <section className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            {movie?.poster_image || movie?.poster ? (
              <img
                src={movie.poster_image || movie.poster}
                alt={movie?.title}
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
              {movie?.title} {movieYear && `(${movieYear})`}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {movieRating && <RatingStars rating={movieRating} size="md" />}
              {movie.runtime && (
                <span className="text-text-secondary">{movie.runtime} min</span>
              )}
              {movieGenres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {movieGenres.map((genre) => (
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
            
            {movie.overview || movie.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-text-primary leading-relaxed">
                  {movie.overview || movie.description}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {movieDirector && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Director</h3>
                  <p className="text-text-secondary">{movieDirector}</p>
                </div>
              )}
              {movieCast.length > 0 && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-1">Cast</h3>
                  <p className="text-text-secondary">
                    {movieCast.slice(0, 5).map((actor) => 
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
              {movie.trailer && (
                <Button variant="outline" size="lg">
                  Watch Trailer
                </Button>
              )}
            </div>
            
            {/* User Rating */}
            {user && (
              <div className="border-t border-border-default pt-6">
                <h3 className="font-semibold text-text-primary mb-4">Rate this movie</h3>
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

