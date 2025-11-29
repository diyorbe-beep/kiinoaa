// FILE: /src/components/Header.jsx
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SearchBar } from './SearchBar'
import { UserAvatar } from './UserAvatar'
import { MenuIcon } from '../assets/icons/MenuIcon'
import { CloseIcon } from '../assets/icons/CloseIcon'
import { useAuth } from '../contexts/AuthContext'

/**
 * Header component with navigation, search, and user menu
 */
export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  
  const { user } = useAuth()
  const isAdmin = user?.is_admin || user?.is_staff || user?.role === 'admin' || localStorage.getItem('is_admin') === 'true'
  
  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'Series', path: '/series' },
    { name: 'Community', path: '/community' },
  ]
  
  const isActive = (path) => location.pathname === path
  
  return (
    <header className="sticky top-0 z-sticky backdrop-blur bg-background-default/90 border-b border-border-default shadow-[0_2px_20px_rgba(26,32,44,0.08)]">
      {/* Announcement bar */}
      <div className="hidden md:block bg-gradient-to-r from-accent-primary/15 via-accent-primary/5 to-transparent text-xs text-text-secondary">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-2 flex items-center justify-between">
          <p className="flex items-center gap-2">
            <span role="img" aria-hidden="true">🎬</span>
            Fresh premieres landing this week
          </p>
          <Link to="/movies" className="text-accent-primary font-medium hover:underline">
            Explore now →
          </Link>
        </div>
      </div>

      <nav className="container mx-auto px-4 md:px-6 lg:px-8 py-3" aria-label="Main navigation">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="Home">
            <span className="text-2xl font-black tracking-tight text-text-primary">Kino</span>
            <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider rounded-full bg-accent-primary/10 text-accent-primary">
              Prime
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2 rounded-full bg-background-secondary px-2 py-1 border border-border-default">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  isActive(item.path)
                    ? 'bg-accent-primary text-text-inverse shadow-sm shadow-accent-primary/40'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-default'
                }`}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                  isActive('/admin')
                    ? 'bg-accent-primary text-text-inverse shadow-sm shadow-accent-primary/40'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-default'
                }`}
                aria-current={isActive('/admin') ? 'page' : undefined}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Search + CTA + User */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <div className="w-60 xl:w-80">
              <SearchBar className="w-full shadow-sm" />
            </div>
            <Link
              to="/community"
              className="hidden lg:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-text-inverse px-4 py-2 text-sm font-semibold shadow-md shadow-accent-primary/40 hover:opacity-90 transition"
            >
              + Create Post
            </Link>
            <UserAvatar />
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-text-primary hover:bg-primary-100 rounded-full focus:outline-none focus:ring-2 focus:ring-accent-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-4 border border-border-default rounded-2xl p-4 bg-background-default shadow-lg">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium ${
                    isActive(item.path)
                      ? 'bg-accent-primary text-text-inverse shadow-sm shadow-accent-primary/40'
                      : 'text-text-secondary border border-border-default hover:bg-primary-50 hover:text-text-primary'
                  }`}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-medium ${
                    isActive('/admin')
                      ? 'bg-accent-primary text-text-inverse shadow-sm shadow-accent-primary/40'
                      : 'text-text-secondary border border-border-default hover:bg-primary-50 hover:text-text-primary'
                  }`}
                  aria-current={isActive('/admin') ? 'page' : undefined}
                >
                  Admin
                </Link>
              )}
            </div>
            <SearchBar />
            <Link
              to="/community"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-accent-primary to-accent-secondary text-text-inverse font-semibold shadow"
            >
              + Create Post
            </Link>
            <div className="pt-4 border-t border-border-default">
              <UserAvatar />
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

