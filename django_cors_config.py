# Django CORS Configuration
# Add this to your Django settings.py file

# 1. Install django-cors-headers if not already installed:
# pip install django-cors-headers

# 2. Add to INSTALLED_APPS in settings.py:
INSTALLED_APPS = [
    # ... other apps
    'corsheaders',
    # ... rest of apps
]

# 3. Add to MIDDLEWARE in settings.py (must be at the top):
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be first
    'django.middleware.security.SecurityMiddleware',
    # ... other middleware
]

# 4. Add CORS settings at the end of settings.py:

# Option A: Allow all origins (for development/testing)
# WARNING: Only use in development, not recommended for production
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Option B: Allow specific origins (RECOMMENDED for production)
# CORS_ALLOW_ALL_ORIGINS = False
# CORS_ALLOWED_ORIGINS = [
#     "https://juathd.vercel.app",  # Production frontend
#     "http://localhost:5173",      # Local development
#     "http://localhost:5174",      # Alternative local port
#     "http://127.0.0.1:5173",
#     "http://127.0.0.1:5174",
# ]

# Allow all HTTP methods
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

# Allow all headers
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# Allow credentials (cookies, authorization headers)
CORS_ALLOW_CREDENTIALS = True

# Preflight cache duration (in seconds)
CORS_PREFLIGHT_MAX_AGE = 86400  # 24 hours





