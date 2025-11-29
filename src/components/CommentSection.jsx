// FILE: /src/components/CommentSection.jsx
import React, { useState } from 'react'
import { RatingStars } from './RatingStars'
import { UserIcon } from '../assets/icons/UserIcon'

/**
 * CommentSection component - displays comment threads with replies
 */
export const CommentSection = ({ comments = [], onAddComment, className = '' }) => {
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (newComment.trim() && onAddComment) {
      onAddComment({
        text: newComment.trim(),
        replyTo: replyTo,
      })
      setNewComment('')
      setReplyTo(null)
    }
  }
  
  return (
    <section className={className} aria-label="Comments section">
      <h2 className="text-2xl font-semibold mb-6">Comments</h2>
      
      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <label htmlFor="comment-input" className="sr-only">
          Add a comment
        </label>
        <textarea
          id="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={replyTo ? `Reply to ${replyTo.author}...` : 'Write a comment...'}
          rows={4}
          className="w-full px-4 py-2 border border-border-default rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent resize-none"
          required
        />
        <div className="flex justify-end gap-2 mt-2">
          {replyTo && (
            <button
              type="button"
              onClick={() => setReplyTo(null)}
              className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-accent-primary text-text-inverse rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-accent-primary"
          >
            {replyTo ? 'Reply' : 'Post Comment'}
          </button>
        </div>
      </form>
      
      {/* Comments list */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-text-secondary text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="border-b border-border-default pb-6 last:border-0">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  {comment.author.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-200 flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-text-tertiary" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-text-primary">{comment.author.name}</h4>
                    {comment.rating && (
                      <RatingStars rating={comment.rating} size="sm" />
                    )}
                    <span className="text-sm text-text-tertiary">
                      {new Date(comment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-text-primary mb-2">{comment.text}</p>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="text-sm text-text-secondary hover:text-accent-primary"
                      onClick={() => setReplyTo(comment.author)}
                    >
                      Reply
                    </button>
                    <button
                      type="button"
                      className="text-sm text-text-secondary hover:text-accent-primary"
                    >
                      Like ({comment.likes || 0})
                    </button>
                  </div>
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-4 pl-4 border-l-2 border-border-default space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          {reply.author.avatar ? (
                            <img
                              src={reply.author.avatar}
                              alt={reply.author.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center">
                              <UserIcon className="w-4 h-4 text-text-tertiary" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-text-primary text-sm">{reply.author.name}</h5>
                              <span className="text-xs text-text-tertiary">
                                {new Date(reply.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-text-primary text-sm">{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

