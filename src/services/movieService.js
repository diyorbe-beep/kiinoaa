// FILE: /src/services/movieService.js
// Movie service for API calls

import { apiService } from './api'
import { API_ENDPOINTS } from '../config/api'

export const movieService = {
  // Get all movies with filters
  async getMovies(params = {}) {
    const queryParams = new URLSearchParams(params).toString()
    const endpoint = queryParams 
      ? `${API_ENDPOINTS.movies.list}?${queryParams}`
      : API_ENDPOINTS.movies.list
    return apiService.get(endpoint)
  },

  // Get movie by slug
  async getMovieBySlug(slug) {
    return apiService.get(API_ENDPOINTS.movies.detail(slug))
  },

  // Search movies
  async searchMovies(query, params = {}) {
    const searchParams = new URLSearchParams({ q: query, ...params }).toString()
    return apiService.get(`${API_ENDPOINTS.movies.search}?${searchParams}`)
  },

  // Get movie genres
  async getGenres() {
    return apiService.get(API_ENDPOINTS.movies.genres)
  },

  // Get movie watch URL
  async getWatchUrl(slug) {
    return apiService.get(API_ENDPOINTS.movies.watch(slug))
  },

  // Get trending movies (using search or list with ordering)
  async getTrendingMovies() {
    return apiService.get(`${API_ENDPOINTS.movies.list}?ordering=-created_at&limit=20`)
  },

  // Admin methods
  async createMovie(movieData) {
    return apiService.post(API_ENDPOINTS.movies.create, movieData)
  },

  async updateMovie(slug, movieData) {
    return apiService.put(API_ENDPOINTS.movies.update(slug), movieData)
  },

  async deleteMovie(slug) {
    return apiService.delete(API_ENDPOINTS.movies.delete(slug))
  },
}
