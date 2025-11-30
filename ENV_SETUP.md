# 🔧 Environment Variables Setup

## 📋 404 Xatosi uchun Tekshirish Ro'yxati

### 1. ✅ Environment Variable (.env fayli)

**Joy:** Frontend root papkada `.env` fayl yaratish kerak

**Muammo:** API base URL noto'g'ri yoki yo'q

**Yechim:**

#### Local Development (.env fayl yaratish)

Frontend root papkasida (package.json yonida) `.env` fayl yarating:

```env
# .env (local development uchun)
VITE_API_BASE_URL=/api/v1
```

**Eslatma:** Vite faqat `VITE_` bilan boshlanadigan o'zgaruvchilarni o'qiydi!

#### Vercel Deployment (Environment Variables)

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Qo'shing:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `/api/v1`
   - **Environment:** Production, Preview, Development (hamma uchun)

**⚠️ MUHIM:** 
- Agar `.env` fayl yo'q bo'lsa, `src/config/api.js` da default qiymat `/api/v1` ishlatiladi
- Bu Vercel proxy orqali ishlaydi

---

### 2. ✅ API Client Konfiguratsiyasi

**Joy:** `src/services/api.js` va `src/config/api.js`

**Muammo:** Base URL hardcoded yoki noto'g'ri o'qilgan

**✅ TO'G'RI KOD:**

```javascript
// src/config/api.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// src/services/api.js
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL  // ✅ Environment variable'dan o'qiladi
  }
  
  buildURL(endpoint) {
    // ✅ To'g'ri slash handling
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint
    }
    const base = this.baseURL.endsWith('/') && this.baseURL !== '/' 
      ? this.baseURL.slice(0, -1) 
      : this.baseURL
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return `${base}${path}`
  }
}
```

**❌ NOTO'G'RI:**

```javascript
// ❌ Hardcoded URL
const API_BASE_URL = 'http://localhost:8000/api/v1'

// ❌ Environment variable o'qilmayapti
const API_BASE_URL = '/api/v1'  // Hardcoded
```

---

### 3. ✅ API Request Qilayotgan Joylar

**Joy:** `src/services/*.js` va componentlarda

**Muammo:** Endpoint path noto'g'ri (ikki marta slash)

**✅ TO'G'RI:**

```javascript
// src/services/movieService.js
import { API_ENDPOINTS } from '../config/api'
import { apiService } from './api'

// ✅ Endpoint slash bilan boshlanadi
getMovies() {
  return apiService.get(API_ENDPOINTS.movies.list)  // '/movies/'
}

// ✅ Query params bilan
getMovies(params) {
  const queryString = new URLSearchParams(params).toString()
  return apiService.get(`${API_ENDPOINTS.movies.list}?${queryString}`)
}
```

**❌ NOTO'G'RI:**

```javascript
// ❌ Ikki marta slash
await fetch(`${API_BASE_URL}/movies/`)  // /api/v1//movies/

// ❌ Endpoint slash bilan boshlanmayapti
await fetch(`${API_BASE_URL}movies`)  // /api/v1movies (slash yo'q)
```

**✅ Hozirgi Kod:**

Barcha endpointlar `API_ENDPOINTS` dan olinadi va slash bilan boshlanadi:
- `/movies/`
- `/auth/login/`
- `/comments/create/`

---

### 4. ✅ Route/Endpoint Path

**Muammo:** Endpoint nomi noto'g'ri

**✅ TO'G'RI:**

```javascript
// src/config/api.js
export const API_ENDPOINTS = {
  movies: {
    list: '/movies/',        // ✅ To'g'ri
    detail: (slug) => `/movies/${slug}/`,  // ✅ To'g'ri
    create: '/movies/',       // ✅ To'g'ri (POST)
  }
}
```

**❌ NOTO'G'RI:**

```javascript
// ❌ Endpoint nomi noto'g'ri
api.get('/movie')      // 'movies' emas
api.get('/movie/')      // 'movies' emas
api.get('movies')       // Slash yo'q
```

**✅ Hozirgi Kod:**

Barcha endpointlar to'g'ri:
- `/movies/` (ko'plik)
- `/auth/login/` (trailing slash)
- `/comments/create/` (trailing slash)

---

### 5. ✅ Deployment Platform Environment Variables

**Joy:** Vercel/Netlify → Settings → Environment Variables

**Muammo:** Environment variable platformada sozlanmagan

**Yechim:**

#### Vercel uchun:

1. **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. **Add New:**
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `/api/v1`
   - **Environment:** 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
3. **Save**
4. **Redeploy** (agar kerak bo'lsa)

#### Tekshirish:

```bash
# Vercel CLI orqali
vercel env ls

# Yoki Dashboard orqali
# Settings → Environment Variables
```

---

## 🔍 Debug Qilish

### 1. Browser Console'da Tekshirish

```javascript
// Browser Console'da
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
console.log('API Base URL (default):', import.meta.env.VITE_API_BASE_URL || '/api/v1')
```

### 2. Network Tab'da Tekshirish

1. Browser DevTools → Network tab
2. API so'rovni toping
3. **Request URL** ni tekshiring:
   - ✅ To'g'ri: `https://juathd.vercel.app/api/v1/movies/`
   - ❌ Noto'g'ri: `https://juathd.vercel.app/api/v1//movies/` (ikki slash)
   - ❌ Noto'g'ri: `http://139.59.137.138/api/v1/movies/` (to'g'ridan-to'g'ri backend)

### 3. Vercel Function Logs

1. Vercel Dashboard → Your Project → **Functions**
2. `api/v1.js` ni tanlang
3. **Logs** tab'ni oching
4. API so'rovlar loglanganligini tekshiring:
   ```
   🔵 Vercel Proxy Request: {
     originalUrl: '/api/v1/movies/',
     apiPath: 'movies',
     backendUrl: 'http://139.59.137.138/api/v1/movies',
     fullUrl: 'http://139.59.137.138/api/v1/movies/?ordering=-created_at&limit=20',
     method: 'GET'
   }
   ```

---

## ✅ Checklist

- [x] `.env` fayl yaratildi (yoki Vercel'da environment variable sozlandi)
- [x] `VITE_API_BASE_URL=/api/v1` to'g'ri sozlangan
- [x] `src/config/api.js` da environment variable o'qilmoqda
- [x] `src/services/api.js` da `buildURL` funksiyasi to'g'ri ishlayapti
- [x] Barcha endpointlar slash bilan boshlanmoqda
- [x] Vercel'da environment variable sozlangan
- [x] Vercel proxy (`api/v1.js`) ishlayapti
- [x] Network tab'da so'rovlar to'g'ri URL'ga ketmoqda

---

## 🎯 Yakuniy Natija

Agar barcha checklist bajarilgan bo'lsa, 404 xatosi bo'lmasligi kerak!

**Muammo bo'lsa:**
1. Browser Console'da xatolarni tekshiring
2. Network tab'da so'rov URL'ini tekshiring
3. Vercel Function logs'ni tekshiring
4. Django backend loglarini tekshiring

