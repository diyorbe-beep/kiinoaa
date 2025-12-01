# 🔧 Vercel Runtime Xatosi - Yechim

## ❌ Muammo

Deploy qilganda xato:
```
Error: Function Runtimes must have a valid version, for example `now-php@1.0.0`
```

## ✅ Yechim

### 1. `vercel.json` - Runtime konfiguratsiyasini olib tashlash

Vercel avtomatik ravishda Node.js versiyasini aniqlaydi, shuning uchun runtime konfiguratsiyasi kerak emas.

**✅ To'g'ri format:**
```json
{}
```

Yoki butunlay bo'sh qoldirish mumkin.

**❌ Noto'g'ri format:**
```json
{
  "functions": {
    "api/**/*.js": {
      "runtime": "nodejs18.x"  // ❌ Bu format ishlamaydi
    }
  }
}
```

### 2. `package.json` - Engines qo'shildi

`package.json` ga `engines` maydoni qo'shildi:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

Bu Vercel'ga loyiha uchun kerakli Node.js versiyasini bildiradi.

---

## 📋 Deploy Qadamlar

### 1. Barcha o'zgarishlarni commit qiling:

```bash
git add .
git commit -m "Fix Vercel runtime error: Remove runtime config, add engines to package.json"
git push
```

### 2. Vercel avtomatik deploy qiladi

Yoki manual:
- Vercel Dashboard → Deployments → Redeploy

### 3. Tekshirish

#### Vercel Dashboard:
1. **Deployments** → Eng so'nggi deployment muvaffaqiyatli bo'lishi kerak
2. **Functions** → `api/v1/[...path]` function mavjudligini tekshiring
3. **Logs** → Xatolar bo'lmasligi kerak

---

## 🔍 Muammo Hal Qilish

### Agar hali ham runtime xatosi bo'lsa:

1. **Vercel Dashboard'da Node.js versiyasini tekshiring:**
   - Settings → Build & Development Settings
   - Node.js Version: `20.x` yoki `18.x` tanlang

2. **`package.json` da `engines` maydonini tekshiring:**
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

3. **`vercel.json` ni butunlay bo'sh qoldiring:**
   ```json
   {}
   ```

---

## ✅ Yakuniy Natija

Barcha o'zgarishlar qilingan:
- ✅ `vercel.json` - Runtime konfiguratsiyasi olib tashlandi
- ✅ `package.json` - `engines` maydoni qo'shildi

**Endi deploy qiling va tekshiring!**


