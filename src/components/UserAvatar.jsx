// FILE: /src/components/UserAvatar.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserIcon } from '../assets/icons/UserIcon'
import { ChevronDownIcon } from '../assets/icons/ChevronDownIcon'
import { useAuth } from '../contexts/AuthContext'

/**
 * UserAvatar component with dropdown menu
 */
export const UserAvatar = ({ user: propUser, className = '' }) => {
  const { user: authUser, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  
  const user = propUser || authUser
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])
  
  const handleLogout = async () => {
    await logout()
    setIsOpen(false)
    navigate('/')
  }
  
  // If user is not logged in, show login button
  if (!user) {
    return (
      <div className={className}>
        <Link
          to="/login"
          className="px-4 py-2 text-sm font-medium text-text-primary hover:text-accent-primary transition-colors"
        >
          Sign In
        </Link>
      </div>
    )
  }
  
  const userInitials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user?.username?.[0]?.toUpperCase() || 'U'
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-full hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-accent-primary"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {user?.avatar || user?.avatar_url ? (
          <img
            src={user.avatar || user.avatar_url}
            alt={user.name || user.username || 'User'}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-accent-primary flex items-center justify-center text-text-inverse">
            <span className="text-sm font-medium">{userInitials}</span>
          </div>
        )}
        <ChevronDownIcon className="w-4 h-4 text-text-secondary" />
      </button>
      
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-background-default rounded-md shadow-lg border border-border-default z-dropdown"
          role="menu"
        >
          <div className="py-1">
            <Link
              to={`/profile/${user.id || user._id}`}
              className="block px-4 py-2 text-sm text-text-primary hover:bg-primary-100"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
            <Link
              to={`/profile/${user.id || user._id}`}
              className="block px-4 py-2 text-sm text-text-primary hover:bg-primary-100"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              Watchlist
            </Link>
            <hr className="my-1 border-border-default" />
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary-100"
              role="menuitem"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

