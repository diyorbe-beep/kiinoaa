// FILE: /src/components/AdminLayout.jsx
// Admin panel layout with sidebar navigation

import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../services/authService'

export const AdminLayout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    localStorage.removeItem('is_admin')
    navigate('/admin/login')
  }

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/movies', label: 'Movies', icon: '🎬' },
    { path: '/admin/movies/add', label: 'Add Movie', icon: '➕' },
    { path: '/admin/comments', label: 'Comments', icon: '💬' },
    { path: '/admin/ratings', label: 'Ratings', icon: '⭐' },
  ]

  return (
    <div className="min-h-screen bg-background-secondary flex">
      {/* Sidebar */}
      <aside className="w-64 bg-background-default border-r border-border-default flex flex-col">
        <div className="p-6 border-b border-border-default">
          <h2 className="text-2xl font-bold text-text-primary">Admin Panel</h2>
          <p className="text-sm text-text-secondary mt-1">JustHD Platform</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/admin' && location.pathname.startsWith(item.path))
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-accent-primary text-text-inverse'
                    : 'text-text-primary hover:bg-background-secondary'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border-default">
          <div className="mb-4 p-3 bg-background-secondary rounded-lg">
            <p className="text-sm text-text-secondary">Logged in as</p>
            <p className="font-semibold text-text-primary truncate">
              {user?.username || user?.email || 'Admin'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-error text-text-inverse rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}




