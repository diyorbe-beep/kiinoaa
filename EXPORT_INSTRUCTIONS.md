# Figma Export Instructions

## Image Assets

### Posters and Cards
1. **Format**: PNG or JPG
2. **Resolution**: 
   - 1x: Standard resolution (e.g., 300x450px for movie posters)
   - 2x: Retina resolution (e.g., 600x900px for movie posters)
3. **Export Location**: `/public/images/`
4. **Naming Convention**: `movie-{id}.jpg`, `series-{id}.jpg`, `poster-{id}.jpg`

### Background Images
1. **Format**: JPG (for photos) or PNG (for graphics with transparency)
2. **Resolution**: 
   - Desktop: 1920x1080px (1x) and 3840x2160px (2x)
   - Mobile: 768x1024px (1x) and 1536x2048px (2x)
3. **Export Location**: `/public/images/backgrounds/`
4. **Optimization**: Compress images before adding to reduce file size

### User Avatars
1. **Format**: PNG or JPG
2. **Size**: 200x200px (1x) and 400x400px (2x)
3. **Export Location**: `/public/images/avatars/`
4. **Shape**: Square (will be rounded in CSS)

## Icons

### SVG Icons
1. **Format**: SVG
2. **Export Method**: 
   - Right-click icon → Copy as SVG
   - Or: Right-click → Export → SVG
3. **Optimization**:
   - Remove unnecessary attributes
   - Remove fill/stroke if using currentColor
   - Optimize paths
4. **Export Location**: `/src/assets/icons/`
5. **Naming Convention**: `{IconName}Icon.jsx` (PascalCase)
6. **Component Structure**: Convert to React component with props

### Icon Sizes
- Small: 16x16px
- Medium: 24x24px
- Large: 32x32px
- Extra Large: 48x48px

## Logo

1. **Format**: SVG (preferred) or PNG
2. **Export Location**: `/public/logo.svg` or `/public/logo.png`
3. **Variants**: 
   - Full logo (horizontal)
   - Icon only (square)
   - Dark mode variant (if applicable)

## Frames to Export

Based on the Figma design, export the following frames:

### Home Page
- [ ] Hero section background image
- [ ] Featured movie/series poster
- [ ] Trending movie posters (5-10 items)
- [ ] Trending series posters (5-10 items)

### Movie/Series Details Pages
- [ ] Movie/Series poster (portrait)
- [ ] Backdrop image (landscape)
- [ ] Cast member photos (if included in design)

### Community Page
- [ ] Default user avatars (if custom)
- [ ] Post placeholder images (if any)

### User Profile
- [ ] Default avatar placeholder
- [ ] Profile background (if any)

## Export Settings

### From Figma
1. Select the frame or component
2. In the right sidebar, find the "Export" section
3. Click the "+" button to add export settings
4. Configure:
   - **Format**: PNG, JPG, or SVG
   - **Size**: 1x, 2x, or custom
   - **Naming**: Use descriptive names

### Batch Export
For multiple assets:
1. Select multiple frames/components
2. Use Figma's batch export feature
3. Organize exports into folders matching project structure

## Image Optimization

After exporting:
1. **Compress images**: Use tools like:
   - TinyPNG (for PNG/JPG)
   - SVGOMG (for SVG)
   - ImageOptim (Mac)
2. **Convert to WebP** (optional, for better performance):
   - Use tools like Squoosh or ImageMagick
   - Provide fallback formats

## Placeholder Images

Until actual images are exported:
- Use placeholder services or create placeholder components
- Mark placeholders with comments in code
- Maintain aspect ratios from Figma design

## Checklist

- [ ] All movie/series posters exported
- [ ] All background images exported
- [ ] All icons exported as SVG
- [ ] Logo exported
- [ ] Images optimized and compressed
- [ ] Images placed in correct directories
- [ ] Image paths updated in components
- [ ] 2x versions created for retina displays
- [ ] Alt text added for all images in components

