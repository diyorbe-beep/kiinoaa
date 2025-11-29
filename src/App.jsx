// FILE: /src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Movies } from './pages/Movies'
import { Series } from './pages/Series'
import { MovieDetails } from './pages/MovieDetails'
import { SeriesDetails } from './pages/SeriesDetails'
import { Community } from './pages/Community'
import { UserProfile } from './pages/UserProfile'
import { SearchResults } from './pages/SearchResults'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AdminLogin } from './pages/AdminLogin'
import { AdminDashboard } from './pages/AdminDashboard'
import { AdminAddMovie } from './pages/AdminAddMovie'
import { AdminMovies } from './pages/AdminMovies'
import { AdminEditMovie } from './pages/AdminEditMovie'
import { AdminComments } from './pages/AdminComments'
import { AdminRatings } from './pages/AdminRatings'
import { ProtectedRoute } from './components/ProtectedRoute'

function AppContent() {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/admin/login'

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && (
        <>
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <Header />
        </>
      )}
      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/series/:id" element={<SeriesDetails />} />
          <Route path="/community" element={<Community />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/movies" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminMovies />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/movies/add" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminAddMovie />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/movies/:slug/edit" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminEditMovie />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/comments" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminComments />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/ratings" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminRatings />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-text-secondary mb-8">The page you're looking for doesn't exist.</p>
            <a href="/" className="text-accent-primary hover:underline">Return to Home</a>
          </div>} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
