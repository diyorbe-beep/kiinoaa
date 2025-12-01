# 🚀 Setup Instructions - To'liq Qo'llanma

## ✅ Barcha O'zgarishlar Qilingan

Quyidagi fayllar to'g'ri sozlangan va tayyor:

### 1. Frontend Konfiguratsiyasi ✅

#### `src/config/api.js`
- API base URL: `/api/v1`
- Development va Production uchun bir xil format
- Vercel proxy orqali ishlaydi

#### `vite.config.js`
- Development proxy: `/api/v1` → `http://139.59.137.138`
- CORS muammosini hal qiladi

### 2. Vercel Proxy ✅

#### `api/v1.js`
- Production'da API so'rovlarni proxy qiladi
- Mixed Content muammosini hal qiladi (HTTPS → HTTP)
- Backend: `http://139.59.137.138/api/v1`

#### `vercel.json`
- Rewrite qoidasi: `/api/v1/:path*` → `/api/v1`
- Node.js 18.x runtime

### 3. Django Backend CORS ✅

#### `django_cors_config.py`
- Barcha kerakli CORS sozlamalari
- `settings.py` ga qo'shish uchun tayyor kod

---

## 📋 Keyingi Qadamlar

### 1. Django Backend'ga CORS Qo'shish

Backend papkasida quyidagilarni bajaring:

```bash
# 1. django-cors-headers o'rnatish
pip install django-cors-headers

# 2. settings.py faylini oching
```

Keyin `django_cors_config.py` faylidagi kodlarni `settings.py` ga qo'shing:

```python
# INSTALLED_APPS ga qo'shing
INSTALLED_APPS = [
    # ... existing apps
    'corsheaders',
]

# MIDDLEWARE ga qo'shing (BIRINCHI O'RINDA!)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ← Bu birinchi bo'lishi kerak!
    'django.middleware.security.SecurityMiddleware',
    # ... other middleware
]

# CORS sozlamalari (settings.py oxiriga qo'shing)
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

### 2. Vercel'ga Deploy Qilish

```bash
# 1. Barcha o'zgarishlarni commit qiling
git add .
git commit -m "Fix API proxy configuration for production"

# 2. Push qiling
git push

# 3. Vercel avtomatik deploy qiladi
```

### 3. Tekshirish

#### Local Development:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- API so'rovlar: `/api/v1/movies/` → Vite proxy → `http://139.59.137.138/api/v1/movies/`

#### Production (Vercel):
1. Vercel Dashboard → Project → Functions
2. `api/v1.js` function deploy qilinganligini tekshiring
3. Browser Console → Network tab
4. API so'rovlar: `https://juathd.vercel.app/api/v1/movies/` → Vercel proxy → `http://139.59.137.138/api/v1/movies/`

---

## 🔍 Muammolarni Hal Qilish

### 404 Error

**Sabab:** Vercel proxy ishlamayapti

**Yechim:**
1. Vercel Dashboard → Functions → `api/v1.js` tekshiring
2. Function loglarini ko'ring
3. `vercel.json` da rewrite qoidasi to'g'rimi?

### CORS Error

**Sabab:** Django backend'da CORS sozlanmagan

**Yechim:**
1. `django-cors-headers` o'rnatilganligini tekshiring
2. `CorsMiddleware` birinchi o'rinda bormi?
3. `CORS_ALLOWED_ORIGINS` to'g'ri sozlanganmi?

### Mixed Content Error

**Sabab:** HTTPS frontend HTTP backend'ga so'rov yubormoqda

**Yechim:**
- Vercel proxy (`api/v1.js`) bu muammoni hal qiladi
- Proxy ishlayotganligini tekshiring

---

## 📁 Fayl Strukturasi

```
kiino/
├── api/
│   └── v1.js              # Vercel proxy function ✅
├── src/
│   ├── config/
│   │   └── api.js         # API konfiguratsiyasi ✅
│   └── services/
│       └── api.js         # API service ✅
├── vite.config.js         # Vite proxy ✅
├── vercel.json           # Vercel konfiguratsiyasi ✅
├── django_cors_config.py  # Django CORS sozlamalari ✅
├── DEPLOYMENT_GUIDE.md    # To'liq qo'llanma
├── API_USAGE_EXAMPLES.md  # API misollari
└── SETUP_INSTRUCTIONS.md  # Bu fayl
```

---

## ✅ Checklist

- [x] Frontend API konfiguratsiyasi to'g'rilandi
- [x] Vite proxy sozlandi
- [x] Vercel proxy yaratildi va sozlandi
- [x] vercel.json rewrite qoidasi qo'shildi
- [x] Django CORS konfiguratsiyasi tayyorlandi
- [ ] Django backend'ga CORS qo'shildi (siz qilishingiz kerak)
- [ ] Vercel'ga deploy qilindi
- [ ] API so'rovlar ishlayapti

---

## 🎯 Yakuniy Natija

Barcha frontend kodlari tayyor va ishlaydi. Faqat Django backend'ga CORS qo'shish va deploy qilish qoldi!

**Savollar bo'lsa:** `DEPLOYMENT_GUIDE.md` va `API_USAGE_EXAMPLES.md` fayllarini ko'ring.





