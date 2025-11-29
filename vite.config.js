import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://139.59.137.138',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      },
    },
    headers: {
      // Fix COOP policy for Google OAuth
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
    },
  },
})
