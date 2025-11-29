# Movie Series Community Website

A production-ready React + Vite + Tailwind CSS front-end codebase for a movie and series community website, built from Figma design specifications.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Backend API server running (or update API URL in `.env`)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure API URL (optional):
```bash
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL to your backend API URL
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

### Backend Integration

The frontend is ready to connect to your backend API. Make sure your backend:

1. Implements the endpoints defined in `src/config/api.js`
2. Returns data in the expected format (see service files for details)
3. Supports JWT authentication (token stored in localStorage)
4. Handles CORS if frontend and backend are on different domains

**Expected Response Formats:**

- Movies/Series: `{ id, title/name, poster_path, backdrop_path, overview, vote_average, release_date/first_air_date, genres, ... }`
- User: `{ id, name, username, avatar, bio, stats: { moviesWatched, seriesWatched, ... }, ... }`
- Comments: `{ id, text, author: { name, avatar }, created_at, likes_count, ... }`
- Posts: `{ id, title, content, author: { name, avatar }, created_at, likes_count, comments_count, ... }`

## 📁 Project Structure

```
kino/
├── public/                 # Static assets
├── src/
│   ├── assets/
│   │   └── icons/         # SVG icon components
│   ├── components/        # Reusable React components
│   │   ├── Button.jsx
│   │   ├── Carousel.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── CommentSection.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   ├── Modal.jsx
│   │   ├── MovieCard.jsx
│   │   ├── RatingStars.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SeriesCard.jsx
│   │   └── UserAvatar.jsx
│   ├── constants/         # Design tokens and constants
│   │   ├── colors.js
│   │   ├── fonts.js
│   │   └── spacing.js
│   ├── pages/            # Page components
│   │   ├── Community.jsx
│   │   ├── Home.jsx
│   │   ├── MovieDetails.jsx
│   │   ├── SearchResults.jsx
│   │   ├── SeriesDetails.jsx
│   │   └── UserProfile.jsx
│   ├── App.jsx            # Main app component with routing
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles and Tailwind imports
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── vite.config.js         # Vite configuration
└── package.json
```

## 🎨 Design Tokens

Design tokens are defined in:
- `/src/constants/colors.js` - Color palette
- `/src/constants/fonts.js` - Typography system
- `/src/constants/spacing.js` - Spacing scale and breakpoints
- `tailwind.config.js` - Extended Tailwind theme

### Colors
- Primary: Gray scale (50-900)
- Accent: Primary blue, secondary purple, success, warning, error
- Background: Default white, secondary gray, dark
- Text: Primary, secondary, tertiary, inverse
- Border: Default and hover states

### Typography
- Font Family: Inter (Google Fonts)
- Headings: h1 (48px) through h6 (18px)
- Body: 16px base
- Caption: 12px

### Breakpoints
- Mobile: ≤425px
- Tablet: 768px
- Desktop: 1024px
- Wide: 1280px

## 📱 Pages

1. **Home** (`/`) - Landing page with featured content, trending movies and series
2. **Movie Details** (`/movie/:id`) - Individual movie page with details, cast, ratings, reviews
3. **Series Details** (`/series/:id`) - Individual series page with seasons, episodes, cast, ratings
4. **Community** (`/community`) - Community hub with discussions, posts, trending topics
5. **User Profile** (`/profile/:id`) - User profile with watchlist, reviews, activity
6. **Search Results** (`/search?q=query`) - Search results with filters

## 🧩 Components

### Layout Components
- `Header` - Main navigation with logo, menu, search, user menu
- `Footer` - Site footer with links, social media, copyright

### Content Components
- `MovieCard` - Movie poster card with title, rating, actions
- `SeriesCard` - Series poster card with seasons, rating, actions
- `HeroSection` - Featured content banner with CTA
- `Carousel` - Content slider with navigation

### Interactive Components
- `Button` - Reusable button with variants (primary, secondary, outline, ghost)
- `SearchBar` - Search input with autocomplete
- `RatingStars` - Star rating display/input
- `CategoryFilter` - Filter chips/buttons
- `CommentSection` - Comment threads with replies
- `UserAvatar` - User avatar with dropdown menu
- `Modal` - Reusable modal overlay

## 🎯 Features

- ✅ Responsive design (Mobile, Tablet, Desktop)
- ✅ Accessibility (ARIA labels, keyboard navigation, focus states)
- ✅ React Router for navigation
- ✅ Tailwind CSS for styling
- ✅ Reusable component architecture
- ✅ Form validation structure
- ✅ Interactive elements (hover, focus, active states)
- ✅ Skip to content link
- ✅ Semantic HTML

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS with custom design tokens. Configuration is in `tailwind.config.js`.

### React Router
Routing is set up in `src/App.jsx` using React Router v6.

### Icons
Icons are SVG components in `/src/assets/icons/`. Replace with actual Figma exports.

## 📝 Notes

### Design Token Updates
**IMPORTANT**: The design tokens in this codebase are based on common patterns. Please verify against your actual Figma design and update:
- Colors in `tailwind.config.js` and `/src/constants/colors.js`
- Typography values in `/src/constants/fonts.js`
- Spacing values in `/src/constants/spacing.js`

### Image Assets
- Export images from Figma at 1x and 2x resolutions
- Place images in `/public/` directory
- Update image paths in components
- Use placeholder images marked with comments until actual assets are available

### Icons
- Export icons as SVGs from Figma
- Place in `/src/assets/icons/`
- Current icons are placeholder components - replace with actual Figma exports

### API Integration
The project is fully integrated with a backend API structure:

**API Configuration:**
- API base URL is configured in `src/config/api.js`
- Set `VITE_API_BASE_URL` in `.env` file (see `.env.example`)
- Default: `http://localhost:3000/api`

**Services:**
- `src/services/api.js` - Base API service with authentication
- `src/services/movieService.js` - Movie-related API calls
- `src/services/seriesService.js` - Series-related API calls
- `src/services/authService.js` - Authentication API calls
- `src/services/userService.js` - User profile API calls
- `src/services/communityService.js` - Community posts API calls
- `src/services/searchService.js` - Search API calls
- `src/services/commentService.js` - Comments/reviews API calls

**State Management:**
- `src/contexts/AuthContext.jsx` - Authentication context
- `src/hooks/useApi.js` - Custom hook for API calls with loading/error states

**Backend API Endpoints Expected:**
- `GET /api/movies` - List movies
- `GET /api/movies/:id` - Movie details
- `GET /api/movies/trending` - Trending movies
- `GET /api/series` - List series
- `GET /api/series/:id` - Series details
- `GET /api/series/:id/seasons` - Series seasons
- `GET /api/search?q=query` - Search all
- `GET /api/auth/me` - Current user
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/movies/:id/rate` - Rate movie
- `POST /api/series/:id/rate` - Rate series
- `GET /api/users/:id` - User profile
- `GET /api/users/:id/watchlist` - User watchlist
- `GET /api/community/posts` - Community posts
- `POST /api/community/posts` - Create post
- `GET /api/movies/:id/comments` - Movie comments
- `POST /api/movies/:id/comments` - Add comment

See `src/config/api.js` for complete endpoint list.

## 🧪 Testing

### Manual Testing Checklist
See QA Checklist section below.

### Automated Testing (Optional)
To add testing:
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

## 📦 Build & Deploy

1. Build for production:
```bash
npm run build
```

2. Output will be in `/dist` directory

3. Deploy `/dist` to your hosting service (Vercel, Netlify, etc.)

## 🔍 QA Checklist

### Visual/Design
- [ ] Verify all colors match Figma design exactly
- [ ] Check typography (font sizes, weights, line heights)
- [ ] Verify spacing matches design (margins, padding, gaps)
- [ ] Check border-radius values
- [ ] Verify shadows match design
- [ ] Check all images display correctly (aspect ratios, sizing)
- [ ] Verify icons match Figma exports

### Responsiveness
- [ ] Test on Mobile (≤425px)
  - [ ] Navigation menu works correctly
  - [ ] Cards stack properly
  - [ ] Text is readable
  - [ ] Touch targets are adequate (min 44x44px)
- [ ] Test on Tablet (768px)
  - [ ] Layout adapts correctly
  - [ ] Grid columns adjust
  - [ ] Navigation displays properly
- [ ] Test on Desktop (1024px+)
  - [ ] Full layout displays correctly
  - [ ] Hover states work
  - [ ] All interactive elements accessible

### Functionality
- [ ] All links navigate correctly
- [ ] Search functionality works
- [ ] Forms validate properly
- [ ] Buttons have proper states (hover, active, disabled)
- [ ] Modals open/close correctly
- [ ] Carousels navigate properly
- [ ] Dropdowns work (user menu, filters)
- [ ] Rating stars are interactive where needed

### Accessibility
- [ ] All images have alt text
- [ ] All buttons have aria-labels where needed
- [ ] Navigation has proper ARIA landmarks
- [ ] Forms have proper labels
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus states are visible
- [ ] Skip to content link works
- [ ] Color contrast meets WCAG AA standards
- [ ] Screen reader testing (if possible)

### Performance
- [ ] Images are optimized
- [ ] No console errors
- [ ] Fast initial load
- [ ] Smooth animations/transitions
- [ ] Lazy loading for images below fold

### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Code Quality
- [ ] No linting errors (`npm run lint`)
- [ ] Components are reusable
- [ ] No inline styles (except when necessary)
- [ ] Constants are used for design tokens
- [ ] Code is well-commented

## 📋 Export Instructions

### Images from Figma
1. Select frame/component
2. Right-click → Export
3. Choose format:
   - **Posters/Cards**: PNG or JPG
   - **Icons**: SVG
   - **Backgrounds**: PNG or JPG
4. Export at:
   - **1x** resolution for standard displays
   - **2x** resolution for retina displays
5. Save to `/public/` directory

### Icons from Figma
1. Select icon
2. Right-click → Copy as SVG or Export as SVG
3. Create component file in `/src/assets/icons/`
4. Optimize SVG (remove unnecessary attributes)
5. Convert to React component

### Frames to Export
Based on manifest:
- Home page hero image
- Movie/Series posters (various sizes)
- User avatars
- Background images
- Logo (SVG preferred)

## ✅ Completed Features

- ✅ API service layer with full backend integration
- ✅ Authentication context and state management
- ✅ Loading states and skeleton loaders
- ✅ Error handling and error boundaries
- ✅ All pages integrated with API calls
- ✅ Search functionality
- ✅ User profiles with watchlist, reviews, activity
- ✅ Community posts and discussions
- ✅ Movie and series details with ratings and comments
- ✅ Responsive design
- ✅ Accessibility features

## 🐛 Known Issues / TODO

- [ ] Replace placeholder images with actual Figma exports
- [ ] Replace placeholder icons with Figma SVG exports
- [ ] Verify and update design tokens to match Figma exactly
- [ ] Add login/register modals/pages
- [ ] Add analytics (if needed)
- [ ] Optimize images (WebP format, lazy loading)
- [ ] Add pagination for lists
- [ ] Add infinite scroll (optional)

## 📄 License

[Add your license here]

## 👥 Contributors

[Add contributors here]

---

**Note**: This codebase was generated from Figma design specifications. Please review all design tokens, colors, spacing, and typography against the original Figma file to ensure pixel-perfect accuracy.
