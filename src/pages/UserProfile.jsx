// FILE: /src/pages/UserProfile.jsx
import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { MovieCard } from '../components/MovieCard'
import { SeriesCard } from '../components/SeriesCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { SkeletonCard } from '../components/Skeleton'
import { UserIcon } from '../assets/icons/UserIcon'
import { authService } from '../services/authService'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../contexts/AuthContext'

/**
 * User Profile page
 */
export const UserProfile = () => {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState('watchlist')
  
  // Fetch user profile (using auth profile endpoint)
  // If viewing own profile or id matches current user, use auth profile
  const isOwnProfile = !id || id === currentUser?.id?.toString() || id === currentUser?.username
  
  // Use useMemo to prevent function recreation
  const fetchUserProfile = React.useCallback(async () => {
    if (isOwnProfile && currentUser) {
      return Promise.resolve(currentUser)
    }
    // For other users, we'd need a user endpoint which doesn't exist
    // So we'll show current user's profile or placeholder
    return authService.getCurrentUser().catch(() => currentUser || null)
  }, [isOwnProfile, currentUser])
  
  const {
    data: userData,
    loading: userLoading,
    error: userError,
    execute: fetchUser,
  } = useApi(
    fetchUserProfile,
    true,
    [id, currentUser?.id]
  )
  
  // Watchlist, reviews, activity - backend doesn't have these endpoints
  // Using placeholder data for now
  const watchlistData = { data: [] }
  const reviewsData = { data: [] }
  const activityData = { data: [] }
  
  const watchlistLoading = false
  const reviewsLoading = false
  const activityLoading = false
  const watchlistError = null
  const reviewsError = null
  const activityError = null
  
  const fetchWatchlist = () => {}
  const fetchReviews = () => {}
  const fetchActivity = () => {}
  
  const user = userData?.data || userData
  const watchlist = watchlistData?.data || watchlistData || []
  const reviews = reviewsData?.data || reviewsData || []
  const activity = activityData?.data || activityData || []
  
  const tabs = [
    { id: 'watchlist', label: 'Watchlist' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'activity', label: 'Activity' },
  ]
  
  if (userLoading) {
    return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <LoadingSpinner />
      </main>
    )
  }

  if (userError) {
    return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <ErrorMessage error={userError} onRetry={fetchUser} />
      </main>
    )
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-text-secondary text-lg">User not found</p>
        </div>
      </main>
    )
  }

  const stats = user.stats || {
    moviesWatched: user.movies_watched || 0,
    seriesWatched: user.series_watched || 0,
    reviews: user.reviews_count || 0,
    followers: user.followers_count || 0,
    following: user.following_count || 0,
  }

  return (
    <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <section className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {user.avatar || user.avatar_url ? (
            <img
              src={user.avatar || user.avatar_url}
              alt={user.name || user.username}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary-200 flex items-center justify-center">
              <UserIcon className="w-12 h-12 text-text-tertiary" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              {user.name || user.username}
            </h1>
            {user.username && (
              <p className="text-text-secondary mb-2">@{user.username}</p>
            )}
            {user.bio && <p className="text-text-primary mb-4">{user.bio}</p>}
            <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
              {user.created_at && (
                <span>
                  Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
          <div className="text-center p-4 bg-background-secondary rounded-lg">
            <div className="text-2xl font-bold text-text-primary">{stats.moviesWatched}</div>
            <div className="text-sm text-text-secondary">Movies</div>
          </div>
          <div className="text-center p-4 bg-background-secondary rounded-lg">
            <div className="text-2xl font-bold text-text-primary">{stats.seriesWatched}</div>
            <div className="text-sm text-text-secondary">Series</div>
          </div>
          <div className="text-center p-4 bg-background-secondary rounded-lg">
            <div className="text-2xl font-bold text-text-primary">{stats.reviews}</div>
            <div className="text-sm text-text-secondary">Reviews</div>
          </div>
          <div className="text-center p-4 bg-background-secondary rounded-lg">
            <div className="text-2xl font-bold text-text-primary">{stats.followers}</div>
            <div className="text-sm text-text-secondary">Followers</div>
          </div>
          <div className="text-center p-4 bg-background-secondary rounded-lg">
            <div className="text-2xl font-bold text-text-primary">{stats.following}</div>
            <div className="text-sm text-text-secondary">Following</div>
          </div>
        </div>
      </section>
      
      {/* Tabs */}
      <section>
        <div className="border-b border-border-default mb-6">
          <nav className="flex gap-4" aria-label="Profile tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-accent-primary text-accent-primary'
                    : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div>
          {activeTab === 'watchlist' && (
            <>
              {watchlistLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {[...Array(5)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : watchlistError ? (
                <ErrorMessage error={watchlistError} onRetry={fetchWatchlist} />
              ) : watchlist.length === 0 ? (
                <p className="text-text-secondary text-center py-8">No items in watchlist</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                  {watchlist.map((item) => {
                    const isSeries = item.seasons || item.number_of_seasons || item.first_air_date
                    return isSeries ? (
                      <SeriesCard 
                        key={item.id} 
                        series={{
                          id: item.id,
                          title: item.name || item.title,
                          year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : item.year,
                          seasons: item.number_of_seasons || item.seasons,
                          rating: item.vote_average ? item.vote_average / 2 : item.rating,
                          poster: item.poster_path || item.poster,
                        }} 
                      />
                    ) : (
                      <MovieCard 
                        key={item.id} 
                        movie={{
                          id: item.id,
                          title: item.title,
                          year: item.release_date ? new Date(item.release_date).getFullYear() : item.year,
                          rating: item.vote_average ? item.vote_average / 2 : item.rating,
                          poster: item.poster_path || item.poster,
                        }} 
                      />
                    )
                  })}
                </div>
              )}
            </>
          )}
          
          {activeTab === 'reviews' && (
            <>
              {reviewsLoading ? (
                <LoadingSpinner />
              ) : reviewsError ? (
                <ErrorMessage error={reviewsError} onRetry={fetchReviews} />
              ) : reviews.length === 0 ? (
                <p className="text-text-secondary text-center py-8">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border border-border-default rounded-lg p-4">
                      <h3 className="font-semibold text-text-primary mb-2">
                        {review.movie?.title || review.series?.name || 'Unknown'}
                      </h3>
                      <p className="text-text-primary mb-2">{review.comment || review.text}</p>
                      <div className="text-sm text-text-secondary">
                        {new Date(review.created_at || review.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          
          {activeTab === 'activity' && (
            <>
              {activityLoading ? (
                <LoadingSpinner />
              ) : activityError ? (
                <ErrorMessage error={activityError} onRetry={fetchActivity} />
              ) : activity.length === 0 ? (
                <p className="text-text-secondary text-center py-8">No recent activity</p>
              ) : (
                <div className="space-y-4">
                  {activity.map((item) => (
                    <div key={item.id} className="border border-border-default rounded-lg p-4">
                      <p className="text-text-primary">{item.description || item.action}</p>
                      <div className="text-sm text-text-secondary mt-2">
                        {new Date(item.created_at || item.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}

