// FILE: /src/services/commentService.js
// Comment service for API calls

import { apiService } from './api'
import { API_ENDPOINTS } from '../config/api'

export const commentService = {
  // Get all comments
  async getComments(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const endpoint = queryParams 
      ? `${API_ENDPOINTS.comments.list}?${queryParams}`
      : API_ENDPOINTS.comments.list
    return apiService.get(endpoint)
  },

  // Get comments for a movie
  async getMovieComments(movieSlug) {
    return apiService.get(API_ENDPOINTS.comments.movieComments(movieSlug))
  },

  // Get comment by ID
  async getCommentById(id) {
    return apiService.get(API_ENDPOINTS.comments.detail(id))
  },

  // Create comment
  async createComment(commentData) {
    return apiService.post(API_ENDPOINTS.comments.create, commentData)
  },

  // Update comment
  async updateComment(id, commentData) {
    return apiService.put(API_ENDPOINTS.comments.update(id), commentData)
  },

  // Delete comment
  async deleteComment(id) {
    return apiService.delete(API_ENDPOINTS.comments.delete(id))
  },

  // Reply to comment
  async replyToComment(id, replyData) {
    return apiService.post(API_ENDPOINTS.comments.reply(id), replyData)
  },
}
