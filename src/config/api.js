// FILE: /src/config/api.js
// API configuration and base URL

// Backend API base URL
// In development, use proxy (/api) to avoid CORS issues
// In production, use full URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? '/api/v1' : 'http://139.59.137.138/api/v1')

export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/auth/login/',
    register: '/auth/register/',
    logout: '/auth/logout/',
    refresh: '/auth/token/refresh/',
    profile: '/auth/profile/',
    updateProfile: '/auth/profile/update/',
    changePassword: '/auth/change-password/',
    checkEmail: '/auth/check-email/',
    checkUsername: '/auth/check-username/',
  },
  
  // Movies
  movies: {
    list: '/movies/',
    detail: (slug) => `/movies/${slug}/`,
    watch: (slug) => `/movies/${slug}/watch/`,
    search: '/movies/search/',
    genres: '/movies/genres/',
    // Admin endpoints (POST, PUT, PATCH, DELETE require admin permissions)
    create: '/movies/', // POST - Create new movie (admin only)
    update: (slug) => `/movies/${slug}/`, // PUT/PATCH - Update movie (admin only)
    delete: (slug) => `/movies/${slug}/`, // DELETE - Delete movie (admin only)
  },
  
  // Comments
  comments: {
    list: '/comments/',
    detail: (id) => `/comments/${id}/`,
    create: '/comments/create/',
    update: (id) => `/comments/${id}/`, // PUT/PATCH - Update comment (admin or owner)
    delete: (id) => `/comments/${id}/`, // DELETE - Delete comment (admin or owner)
    reply: (id) => `/comments/${id}/reply/`,
    movieComments: (movieSlug) => `/comments/movie/${movieSlug}/`,
  },
  
  // Ratings
  ratings: {
    list: '/ratings/',
    detail: (id) => `/ratings/${id}/`,
    create: '/ratings/create/',
    update: (id) => `/ratings/${id}/`, // PUT/PATCH - Update rating (admin or owner)
    delete: (id) => `/ratings/${id}/`, // DELETE - Delete rating (admin or owner)
    movieRatings: (movieSlug) => `/ratings/movie/${movieSlug}/`,
  },
  
  // Admin endpoints (all require admin permissions)
  admin: {
    // User management (if backend supports)
    users: {
      list: '/admin/users/', // GET - List all users (admin only)
      detail: (id) => `/admin/users/${id}/`, // GET - User details (admin only)
      update: (id) => `/admin/users/${id}/`, // PUT/PATCH - Update user (admin only)
      delete: (id) => `/admin/users/${id}/`, // DELETE - Delete user (admin only)
    },
    // Statistics/Dashboard (if backend supports)
    stats: '/admin/stats/', // GET - Admin dashboard statistics (admin only)
  },
}


