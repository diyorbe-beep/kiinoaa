# 🔍 404 Xatosi - To'liq Tekshirish Qo'llanmasi

## 📋 Tekshirish Ro'yxati

### 1. Environment Variable (.env fayli) ✅

**Joy:** Frontend root papkada `.env` fayl

**Tekshirish:**
```bash
# .env fayl mavjudligini tekshiring
cat .env
# Yoki Windows'da:
type .env
```

**To'g'ri format:**
```env
VITE_API_BASE_URL=/api/v1
```

**Muammo bo'lsa:**
- `.env` fayl yo'q → `.env.example` dan nusxa oling
- `VITE_` prefiksi yo'q → Vite o'qiydi, lekin prefiks kerak
- Qiymat noto'g'ri → `/api/v1` bo'lishi kerak (trailing slash bilan)

**Vercel'da:**
- Settings → Environment Variables → `VITE_API_BASE_URL` = `/api/v1`

---

### 2. API Client Konfiguratsiyasi ✅

**Joy:** `src/config/api.js` va `src/services/api.js`

**Tekshirish:**
```javascript
// src/config/api.js
console.log('API_BASE_URL:', API_BASE_URL)
// Kutilgan natija: '/api/v1'

// src/services/api.js
console.log('apiService.baseURL:', apiService.baseURL)
// Kutilgan natija: '/api/v1'
```

**To'g'ri kod:**
```javascript
// ✅ src/config/api.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// ✅ src/services/api.js
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL  // Environment variable'dan
  }
}
```

**Muammo bo'lsa:**
- Hardcoded URL → Environment variable ishlatish kerak
- `undefined` → `.env` fayl yoki Vercel environment variable sozlanmagan

---

### 3. API Request Qilayotgan Joylar ✅

**Joy:** `src/services/*.js` va componentlarda

**Tekshirish:**
```javascript
// Browser Console'da
const url = apiService.buildURL('/movies/')
console.log('Built URL:', url)
// Kutilgan natija: '/api/v1/movies/'
```

**To'g'ri format:**
```javascript
// ✅ Endpoint slash bilan boshlanadi
apiService.get('/movies/')
apiService.get(API_ENDPOINTS.movies.list)  // '/movies/'

// ✅ Query params
apiService.get(`${API_ENDPOINTS.movies.list}?page=1`)
```

**❌ NOTO'G'RI:**
```javascript
// ❌ Ikki marta slash
apiService.get('//movies/')  // /api/v1//movies/

// ❌ Slash yo'q
apiService.get('movies')  // /api/v1movies
```

**Muammo bo'lsa:**
- `buildURL` funksiyasini tekshiring (`src/services/api.js`)
- Endpoint slash bilan boshlanishini tekshiring

---

### 4. Route/Endpoint Path ✅

**Joy:** `src/config/api.js` - `API_ENDPOINTS`

**Tekshirish:**
```javascript
// Browser Console'da
import { API_ENDPOINTS } from './config/api'
console.log('Movies list:', API_ENDPOINTS.movies.list)
// Kutilgan natija: '/movies/'
```

**To'g'ri endpointlar:**
```javascript
// ✅ To'g'ri
movies: {
  list: '/movies/',           // Ko'plik, trailing slash
  detail: (slug) => `/movies/${slug}/`,  // Trailing slash
  create: '/movies/',          // POST uchun
}

// ❌ NOTO'G'RI
movies: {
  list: '/movie',      // Ko'plik emas
  list: 'movies',      // Slash yo'q
  list: '/movies',     // Trailing slash yo'q
}
```

**Muammo bo'lsa:**
- Endpoint nomi noto'g'ri → Backend API spec'ga moslashtiring
- Trailing slash yo'q → Qo'shing

---

### 5. Deployment Platform Environment Variables ✅

**Joy:** Vercel Dashboard → Settings → Environment Variables

**Tekshirish:**
1. Vercel Dashboard → Your Project → Settings
2. Environment Variables tab'ni oching
3. `VITE_API_BASE_URL` mavjudligini tekshiring
4. Qiymati `/api/v1` ekanligini tekshiring

**Muammo bo'lsa:**
- Environment variable yo'q → Qo'shing
- Qiymat noto'g'ri → `/api/v1` ga o'zgartiring
- Redeploy qiling

---

## 🔧 Debug Qilish

### Browser Console'da

```javascript
// 1. Environment variable tekshirish
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)

// 2. API base URL tekshirish
import { API_BASE_URL } from './config/api'
console.log('API_BASE_URL:', API_BASE_URL)

// 3. Build URL tekshirish
import { apiService } from './services/api'
console.log('Test URL:', apiService.buildURL('/movies/'))
```

### Network Tab'da

1. **Browser DevTools** → **Network** tab
2. API so'rovni toping
3. **Request URL** ni tekshiring:

**✅ To'g'ri:**
```
https://juathd.vercel.app/api/v1/movies/?ordering=-created_at&limit=20
```

**❌ Noto'g'ri (ikki slash):**
```
https://juathd.vercel.app/api/v1//movies/
```

**❌ Noto'g'ri (to'g'ridan-to'g'ri backend):**
```
http://139.59.137.138/api/v1/movies/
```

### Vercel Function Logs

1. Vercel Dashboard → Your Project → **Functions**
2. `api/v1.js` ni tanlang
3. **Logs** tab'ni oching
4. Quyidagi log'ni qidiring:

```
🔵 Vercel Proxy Request: {
  originalUrl: '/api/v1/movies/',
  apiPath: 'movies',
  backendUrl: 'http://139.59.137.138/api/v1/movies',
  fullUrl: 'http://139.59.137.138/api/v1/movies/?ordering=-created_at&limit=20',
  method: 'GET'
}
```

**Muammo bo'lsa:**
- `apiPath` bo'sh → Vercel rewrite qoidasi ishlamayapti
- `backendUrl` noto'g'ri → `api/v1.js` da `BACKEND_BASE_URL` ni tekshiring

---

## ✅ Tekshirish Scripti

Browser Console'da quyidagi kodni ishga tushiring:

```javascript
// To'liq tekshirish
(async () => {
  console.log('=== API Configuration Check ===')
  
  // 1. Environment variable
  console.log('1. VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
  
  // 2. API base URL
  const { API_BASE_URL } = await import('./src/config/api.js')
  console.log('2. API_BASE_URL:', API_BASE_URL)
  
  // 3. API service base URL
  const { apiService } = await import('./src/services/api.js')
  console.log('3. apiService.baseURL:', apiService.baseURL)
  
  // 4. Build URL test
  const testUrl = apiService.buildURL('/movies/')
  console.log('4. buildURL("/movies/"):', testUrl)
  
  // 5. Endpoint test
  const { API_ENDPOINTS } = await import('./src/config/api.js')
  console.log('5. API_ENDPOINTS.movies.list:', API_ENDPOINTS.movies.list)
  
  // 6. Full URL test
  const fullUrl = apiService.buildURL(API_ENDPOINTS.movies.list)
  console.log('6. Full URL:', fullUrl)
  
  console.log('=== Check Complete ===')
})()
```

---

## 🎯 Muammo Hal Qilish

### Muammo: 404 Not Found

**Sabablar:**
1. Environment variable yo'q yoki noto'g'ri
2. Vercel proxy ishlamayapti
3. Endpoint path noto'g'ri
4. Backend'da endpoint yo'q

**Yechim:**
1. `.env` fayl yoki Vercel environment variable'ni tekshiring
2. Vercel Function logs'ni tekshiring
3. Network tab'da so'rov URL'ini tekshiring
4. Backend API spec'ni tekshiring

### Muammo: CORS Error

**Sabab:** Django backend'da CORS sozlanmagan

**Yechim:** `django_cors_config.py` dagi kodlarni `settings.py` ga qo'shing

### Muammo: Mixed Content Error

**Sabab:** HTTPS frontend HTTP backend'ga so'rov yubormoqda

**Yechim:** Vercel proxy (`api/v1.js`) bu muammoni hal qiladi

---

## 📞 Yordam

Agar muammo hal bo'lmasa:
1. Browser Console'dagi xatolarni yuboring
2. Network tab'dagi so'rov URL'ini yuboring
3. Vercel Function logs'ni yuboring
4. Django backend loglarini yuboring

