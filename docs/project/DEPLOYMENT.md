# FirinEmek — Dağıtım Kılavuzu

## Demo Hesap

- **E-posta:** demo@kadikoyfirin.com
- **Şifre:** demo123456

## Ortam Değişkenleri

### Backend
- `DATABASE_URL` — PostgreSQL bağlantı dizesi
- `JWT_SECRET` — JWT imzalama anahtarı
- `FRONTEND_URL` — https://firinemek.vercel.app
- `PORT` — 8080 (Railway production)

### Frontend
- `NEXT_PUBLIC_API_URL` — https://firinemek-backend-production.up.railway.app/api

## Demo URL'leri

- **Frontend:** https://firinemek.vercel.app ✅ (Vercel deploy aktif)
- **Backend API:** https://firinemek-backend-production.up.railway.app/api ⏳ (Railway günlük 25 servis limiti — provision bekliyor)
- **Health Check:** https://firinemek-backend-production.up.railway.app/api/health

## Dağıtım Durumu (2026-06-19)

| Bileşen | Durum | Not |
|---------|-------|-----|
| CI Backend + Integration | ✅ 14/14 geçti | Run #27838711061 |
| CI Frontend Build | ✅ | |
| Vercel Frontend | ✅ | https://firinemek.vercel.app |
| Railway Backend + PG | ⏳ Bekliyor | Günlük 25 servis oluşturma limiti |

Railway limiti sıfırlandığında `main` branch'e boş commit veya workflow_dispatch ile provision job yeniden çalıştırılabilir.

## Bulut Canlı Önizleme Linki

- **Google IDX Import:** https://idx.google.com/import?url=https://github.com/gorkemkyolai0666/firinemek

## Yerel Geliştirme

```bash
# Backend
cd backend && npm install --legacy-peer-deps
npx prisma migrate deploy && npx prisma db seed
npm run start:prod

# Frontend
cd frontend && npm install && npm run dev
```

Portlar: Backend 4540, Frontend 3540
