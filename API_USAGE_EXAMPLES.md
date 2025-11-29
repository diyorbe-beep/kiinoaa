# API Usage Examples

## Frontend API Chaqiruvlari

### 1. MovieService - Filmlarni olish

```javascript
import { movieService } from './services/movieService'

// Barcha filmlarni olish
const movies = await movieService.getMovies({
  ordering: '-created_at',
  limit: 20
})

// Film ma'lumotlarini olish
const movie = await movieService.getMovieBySlug('movie-slug-here')
```

### 2. AuthService - Autentifikatsiya

```javascript
import { authService } from './services/authService'

// Login
const response = await authService.login('username', 'password')
// Response: { access_token, refresh_token, user: {...} }

// Register
const response = await authService.register({
  username: 'john_doe',
  email: 'john@example.com',
  password: 'securepassword',
  password_confirm: 'securepassword',
  first_name: 'John',
  last_name: 'Doe'
})

// Get current user
const user = await authService.getCurrentUser()
```

### 3. CommentService - Kommentariyalar

```javascript
import { commentService } from './services/commentService'

// Film uchun kommentariyalar
const comments = await commentService.getMovieComments('movie-slug')

// Komentariya yaratish
const comment = await commentService.createComment({
  movie_slug: 'movie-slug',
  text: 'Great movie!',
  parent: null  // or parent comment ID for replies
})
```

### 4. RatingService - Reytinglar

```javascript
import { ratingService } from './ratingService'

// Film uchun reytinglar
const ratings = await ratingService.getMovieRatings('movie-slug')

// Reyting yaratish/yangilash
const rating = await ratingService.createOrUpdateRating({
  movie_slug: 'movie-slug',
  rating: 5,  // 1-5
  review: 'Excellent movie!'
})
```

### 5. To'g'ridan-to'g'ri API Service

```javascript
import { apiService } from './services/api'

// GET request
const data = await apiService.get('/movies/')

// POST request
const result = await apiService.post('/movies/', {
  title: 'New Movie',
  description: 'Movie description'
})

// PUT request
const updated = await apiService.put('/movies/slug-here/', {
  title: 'Updated Title'
})

// PATCH request
const patched = await apiService.patch('/movies/slug-here/', {
  title: 'Partially Updated'
})

// DELETE request
await apiService.delete('/movies/slug-here/')
```

## API Base URL

### Development
- Local: `http://localhost:5173/api/v1` (Vite proxy)
- Backend: `http://139.59.137.138/api/v1`

### Production
- Frontend: `https://juathd.vercel.app/api/v1` (Vercel proxy)
- Backend: `http://139.59.137.138/api/v1`

## Error Handling

```javascript
try {
  const data = await movieService.getMovies()
} catch (error) {
  // error.message - user-friendly error message
  // error.status - HTTP status code
  // error.data - full error response from backend
  
  if (error.status === 401) {
    // Unauthorized - redirect to login
  } else if (error.status === 404) {
    // Not found
  } else if (error.status === 500) {
    // Server error
  }
  
  console.error('API Error:', error.message)
}
```

## Authentication Headers

API service avtomatik ravishda `Authorization: Bearer <token>` header'ni qo'shadi:

```javascript
// Token localStorage'da saqlanadi
localStorage.getItem('access_token')  // Access token
localStorage.getItem('refresh_token')  // Refresh token

// API service avtomatik token'ni qo'shadi
const data = await apiService.get('/auth/profile/')
```

