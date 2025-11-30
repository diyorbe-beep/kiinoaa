# Deployment Guide - Frontend va Backend Bog'lanish

## Muammo
Frontend Vercel'da deploy qilingandan keyin "404 NOT_FOUND" xatosi chiqmoqda, chunki API noto'g'ri URLga ketmoqda.

## Yechim

### 1. Frontend API Konfiguratsiyasi

#### `.env` fayl yaratish (loyiha ildizida)

```env
# Production: Vercel proxy orqali
VITE_API_BASE_URL=/api/v1
```

Yoki to'g'ridan-to'g'ri backend URL (agar backend HTTPS bo'lsa):

```env
VITE_API_BASE_URL=http://139.59.137.138/api/v1
```

#### `src/config/api.js` - To'g'ri sozlangan ✅

API base URL avtomatik ravishda:
- Development: `/api/v1` (Vite proxy)
- Production: `/api/v1` (Vercel proxy)

### 2. Vercel Proxy Konfiguratsiyasi

#### `vercel.json` - To'g'ri sozlangan ✅

```json
{
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/v1/:path*",
      "destination": "/api/v1"
    }
  ]
}
```

#### `api/v1.js` - Proxy Function ✅

Bu function:
- `/api/v1/movies/` → `http://139.59.137.138/api/v1/movies/` ga proxy qiladi
- Mixed Content muammosini hal qiladi (HTTPS → HTTP)

### 3. Django Backend CORS Konfiguratsiyasi

`django_cors_config.py` faylida barcha kerakli sozlamalar bor.

**Qadamlar:**

1. **django-cors-headers o'rnatish:**
```bash
pip install django-cors-headers
```

2. **settings.py ga qo'shish:**

```python
# INSTALLED_APPS ga qo'shing
INSTALLED_APPS = [
    # ... other apps
    'corsheaders',
]

# MIDDLEWARE ga qo'shing (birinchi o'rinda)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be first!
    'django.middleware.security.SecurityMiddleware',
    # ... other middleware
]

# CORS sozlamalari
CORS_ALLOW_ALL_ORIGINS = True  # Development uchun
# Yoki production uchun:
# CORS_ALLOWED_ORIGINS = [
#     "https://juathd.vercel.app",
#     "http://localhost:5173",
# ]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']
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
```

### 4. API Chaqiruvlari Format

#### Fetch API (Hozirgi kod)

```javascript
import { apiService } from './services/api'

// GET
const movies = await apiService.get('/movies/')

// POST
const newMovie = await apiService.post('/movies/', {
  title: 'Movie Title',
  description: 'Description'
})

// PUT
const updated = await apiService.put('/movies/slug/', {
  title: 'Updated Title'
})

// DELETE
await apiService.delete('/movies/slug/')
```

#### Axios (Agar o'zgartirmoqchi bo'lsangiz)

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - token qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error)
  }
)

// Usage
const movies = await api.get('/movies/')
```

### 5. Test Qilish

#### Local Development

```bash
npm run dev
```

Frontend: `http://localhost:5173`
- API so'rovlar: `/api/v1/movies/` → Vite proxy → `http://139.59.137.138/api/v1/movies/`

#### Production (Vercel)

1. **Deploy:**
```bash
git add .
git commit -m "Fix API proxy configuration"
git push
```

2. **Tekshirish:**
- Vercel Dashboard → Functions tab → `api/v1.js` function'ni ko'ring
- Browser Console'da Network tab'ni oching
- API so'rovlar: `https://juathd.vercel.app/api/v1/movies/` → Vercel proxy → `http://139.59.137.138/api/v1/movies/`

### 6. Muammolarni Hal Qilish

#### 404 Error

1. **Vercel Dashboard'da tekshiring:**
   - Project → Functions → `api/v1.js` deploy qilinganmi?
   - Function loglarini ko'ring

2. **Browser Console'da tekshiring:**
   - Network tab → Failed request'ni ko'ring
   - Request URL to'g'rimi?
   - Response nima?

3. **Backend'ni tekshiring:**
   - `http://139.59.137.138/api/v1/movies/` to'g'ridan-to'g'ri ishlaydimi?
   - CORS sozlamalari to'g'rimi?

#### CORS Error

1. **Django CORS sozlamalarini tekshiring:**
   - `corsheaders` o'rnatilganmi?
   - `CorsMiddleware` birinchi o'rinda bormi?
   - `CORS_ALLOWED_ORIGINS` to'g'ri sozlanganmi?

2. **Browser Console'da:**
   - CORS error xabari nima?
   - Preflight (OPTIONS) request muvaffaqiyatlimi?

#### Mixed Content Error

- Vercel proxy ishlatilmoqda (`api/v1.js`)
- Frontend HTTPS → Vercel proxy → Backend HTTP
- Bu muammo hal qilinishi kerak

### 7. Yakuniy Checklist

- [x] `.env` fayl yaratildi
- [x] `src/config/api.js` to'g'ri sozlangan
- [x] `api/v1.js` proxy function yaratildi
- [x] `vercel.json` rewrite qoidasi qo'shildi
- [x] Django CORS konfiguratsiyasi tayyorlandi
- [ ] Django backend'ga CORS sozlamalari qo'shildi
- [ ] Vercel'ga deploy qilindi
- [ ] API so'rovlar ishlayapti

## Qo'shimcha Ma'lumot

- `API_USAGE_EXAMPLES.md` - API chaqiruvlari misollari
- `django_cors_config.py` - Django CORS konfiguratsiyasi



