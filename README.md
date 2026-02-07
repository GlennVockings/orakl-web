# Fake Betting – Dev Setup & Startup Guide

This project is a **fake betting / sports day betting prototype** built with:

- **Backend:** NestJS + Prisma + PostgreSQL
- **Frontend:** Next.js (App Router)
- **Auth:** Email + password → JWT in HttpOnly cookies
- **Realtime:** WebSockets (Socket.IO)
- **Package manager:** pnpm (workspace / monorepo)

---

## ⚠️ Important Rules (Read This First)

- **Always use `pnpm`** (not npm or yarn)
- **Postgres runs in Docker**
- **JWT auth uses cookies**, so `credentials: 'include'` is required on frontend fetches
- Users & demo data are created via **Prisma seed**

---

## Prerequisites

Make sure these are installed:

- Node.js **18+**
- **pnpm**
- **Docker Desktop** (must be running)

Check:
```bash
node -v
pnpm -v
docker --version


fake-betting/
├── apps/
│   ├── api/        # NestJS backend
│   └── web/        # Next.js frontend
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md

pnpm --filter api start:dev

---

## Prerequisites