// FILE: /src/services/ratingService.js
// Rating service for API calls

import { apiService } from './api'
import { API_ENDPOINTS } from '../config/api'

export const ratingService = {
  // Get all ratings
  async getRatings(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const endpoint = queryParams 
      ? `${API_ENDPOINTS.ratings.list}?${queryParams}`
      : API_ENDPOINTS.ratings.list
    return apiService.get(endpoint)
  },

  // Get ratings for a movie
  async getMovieRatings(movieSlug) {
    return apiService.get(API_ENDPOINTS.ratings.movieRatings(movieSlug))
  },

  // Get rating by ID
  async getRatingById(id) {
    return apiService.get(API_ENDPOINTS.ratings.detail(id))
  },

  // Create rating
  async createRating(ratingData) {
    return apiService.post(API_ENDPOINTS.ratings.create, ratingData)
  },

  // Update rating
  async updateRating(id, ratingData) {
    return apiService.put(API_ENDPOINTS.ratings.update(id), ratingData)
  },

  // Delete rating
  async deleteRating(id) {
    return apiService.delete(API_ENDPOINTS.ratings.delete(id))
  },
}




