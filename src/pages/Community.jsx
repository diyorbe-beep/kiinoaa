// FILE: /src/pages/Community.jsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CategoryFilter } from '../components/CategoryFilter'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ErrorMessage } from '../components/ErrorMessage'
import { UserIcon } from '../assets/icons/UserIcon'
import { commentService } from '../services/commentService'
import { useApi } from '../hooks/useApi'
import { useAuth } from '../contexts/AuthContext'

/**
 * Community page - discussions, posts, trending topics
 */
export const Community = () => {
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('All')
  
  const categories = ['All', 'Movies', 'Series', 'Reviews', 'General', 'News']
  
  // Fetch comments as community posts (since backend doesn't have community endpoint) - use useCallback
  const fetchPostsData = React.useCallback(() => {
    return commentService.getComments()
  }, [])
  
  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
    execute: fetchPosts,
  } = useApi(fetchPostsData, true, [selectedCategory])
  
  // Normalize API response
  const normalizeResults = (data) => {
    if (!data) return []
    if (Array.isArray(data)) return data
    if (data.results) return data.results
    if (data.data) return Array.isArray(data.data) ? data.data : []
    return []
  }
  
  const posts = normalizeResults(postsData)
  const trending = ['NewRelease', 'BestOf2024', 'SeriesDiscussion'] // Placeholder trending topics
  
  return (
    <main className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-text-primary mb-4">Community</h1>
        <p className="text-text-secondary">
          Join discussions, share your thoughts, and connect with other movie and series enthusiasts.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            className="mb-6"
          />
          
          {postsLoading ? (
            <LoadingSpinner />
          ) : postsError ? (
            <ErrorMessage error={postsError} onRetry={fetchPosts} />
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">No posts found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-background-default border border-border-default rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-4">
                    {post.author?.avatar ? (
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-text-tertiary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-text-primary">
                          {post.author?.name || post.author?.username || 'Anonymous'}
                        </h3>
                        <span className="text-sm text-text-tertiary">
                          {new Date(post.created_at || post.date).toLocaleDateString()}
                        </span>
                        {post.category && (
                          <span className="px-2 py-1 bg-primary-100 text-text-primary rounded text-xs">
                            {post.category}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-text-primary mb-2">
                        {post.title}
                      </h2>
                      <p className="text-text-primary mb-4">{post.content || post.body}</p>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          className="flex items-center gap-2 text-text-secondary hover:text-accent-primary"
                        onClick={async () => {
                          // Like functionality - can be implemented later
                          console.log('Like post:', post.id)
                        }}
                        >
                          <span>👍</span>
                          <span>{post.likes_count || post.likes || 0}</span>
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-2 text-text-secondary hover:text-accent-primary"
                        >
                          <span>💬</span>
                          <span>{post.comments_count || post.comments || 0}</span>
                        </button>
                        <Link
                          to={`/community/posts/${post.id}`}
                          className="ml-auto text-accent-primary hover:underline text-sm font-medium"
                        >
                          Read more →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-background-default border border-border-default rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-text-primary mb-4">Trending Topics</h3>
            <ul className="space-y-2">
              {trending.map((topic, index) => (
                <li key={index}>
                  <a href="#" className="text-accent-primary hover:underline text-sm">
                    #{topic}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {user && (
            <div className="bg-background-default border border-border-default rounded-lg p-6">
              <h3 className="font-semibold text-text-primary mb-4">Create Post</h3>
              <button
                type="button"
                className="w-full px-4 py-2 bg-accent-primary text-text-inverse rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                onClick={() => {
                  // TODO: Open create post modal
                  alert('Create post feature coming soon!')
                }}
              >
                New Discussion
              </button>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}

