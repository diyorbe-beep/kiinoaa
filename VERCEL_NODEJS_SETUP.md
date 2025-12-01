# 🔧 Vercel'da Node.js Versiyasini Sozlash

## 📍 Node.js Versiyasini Sozlash Joylari

### 1. ✅ `package.json` (Eng Oson Usul)

`package.json` faylida `engines` maydoni qo'shildi:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Bu avtomatik ishlaydi!** Vercel `package.json` dagi `engines` maydonini o'qiydi.

---

### 2. Vercel Dashboard (Agar Kerak Bo'lsa)

Agar `package.json` ishlamasa, Vercel Dashboard'da:

1. **Settings** → **General** bo'limiga o'ting
2. **Node.js Version** maydonini toping
3. `18.x` yoki `20.x` tanlang
4. **Save** tugmasini bosing

**Eslatma:** Ba'zi loyihalarda bu maydon bo'lmasligi mumkin. Bu holda `package.json` ishlatiladi.

---

### 3. `vercel.json` (Ixtiyoriy)

Agar kerak bo'lsa, `vercel.json` ga qo'shishingiz mumkin:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}
```

**Lekin runtime konfiguratsiyasi kerak emas!** Vercel avtomatik aniqlaydi.

---

## ✅ Hozirgi Holat

### `package.json` ✅
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### `vercel.json` ✅
```json
{}
```

**Bu yetarli!** Vercel avtomatik ravishda Node.js versiyasini aniqlaydi.

---

## 🔍 Tekshirish

### 1. Deploy Loglarida

Vercel Dashboard → Deployments → Eng so'nggi deployment → Build Logs

Quyidagi log'ni qidiring:
```
Installing dependencies...
Node.js version: 20.x (or 18.x)
```

### 2. Function Loglarida

Vercel Dashboard → Functions → `api/v1/[...path]` → Logs

Function ishlayotganligini tekshiring.

---

## 🚀 Deploy Qilish

### 1. Barcha o'zgarishlarni commit qiling:

```bash
git add .
git commit -m "Add engines to package.json for Vercel Node.js version"
git push
```

### 2. Vercel avtomatik deploy qiladi

### 3. Tekshirish

- Deployments → Build muvaffaqiyatli bo'lishi kerak
- Functions → `api/v1/[...path]` ishlayotganligini tekshiring

---

## ❓ Muammo Bo'lsa

### Agar hali ham runtime xatosi bo'lsa:

1. **`package.json` ni tekshiring:**
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

2. **Vercel Dashboard → Settings → General:**
   - Node.js Version maydonini qidiring
   - Agar bo'lsa, `18.x` yoki `20.x` tanlang

3. **Redeploy qiling:**
   - Deployments → Eng so'nggi deployment → Redeploy

---

## ✅ Yakuniy Natija

- ✅ `package.json` da `engines` maydoni qo'shildi
- ✅ `vercel.json` bo'sh (runtime konfiguratsiyasi yo'q)
- ✅ Vercel avtomatik Node.js versiyasini aniqlaydi

**Endi deploy qiling va tekshiring!**


