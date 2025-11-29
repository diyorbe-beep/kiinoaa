// FILE: /src/components/Footer.jsx
import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Footer component with links, social media, and copyright
 */
export const Footer = () => {
  const footerLinks = {
    discover: [
      { name: 'Movies', path: '/movies' },
      { name: 'Series', path: '/series' },
      { name: 'Trending', path: '/trending' },
      { name: 'Upcoming', path: '/upcoming' },
    ],
    community: [
      { name: 'Discussions', path: '/community' },
      { name: 'Reviews', path: '/reviews' },
      { name: 'Forums', path: '/forums' },
      { name: 'Events', path: '/events' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Cookie Policy', path: '/cookies' },
      { name: 'DMCA', path: '/dmca' },
    ],
  }
  
  const socialLinks = [
    { name: 'Facebook', url: '#', icon: 'facebook' },
    { name: 'Twitter', url: '#', icon: 'twitter' },
    { name: 'Instagram', url: '#', icon: 'instagram' },
    { name: 'YouTube', url: '#', icon: 'youtube' },
  ]
  
  return (
    <footer className="hidden md:block bg-primary-800 text-text-inverse mt-auto" aria-label="Site footer">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-bold text-accent-primary mb-4 block">
              Kino
            </Link>
            <p className="text-text-inverse/70 text-sm">
              Your ultimate destination for movies, series, and community discussions.
            </p>
          </div>
          
          {/* Discover */}
          <div>
            <h3 className="font-semibold mb-4">Discover</h3>
            <ul className="space-y-2">
              {footerLinks.discover.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-text-inverse/70 hover:text-text-inverse text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-text-inverse/70 hover:text-text-inverse text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-text-inverse/70 hover:text-text-inverse text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Social Media */}
        <div className="border-t border-primary-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-primary-700 rounded-full hover:bg-accent-primary transition-colors"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <span className="sr-only">{social.name}</span>
                  {/* Icon placeholder - replace with actual SVG icons */}
                  <span className="text-sm">{social.icon[0].toUpperCase()}</span>
                </a>
              ))}
            </div>
            <p className="text-text-inverse/70 text-sm">
              © {new Date().getFullYear()} Kino. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

