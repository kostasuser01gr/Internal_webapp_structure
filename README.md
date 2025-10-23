# 🚗 Internal Web App Structure - CarWash Pro

Modern, responsive, and installable **Progressive Web App (PWA)** for vehicle washing management, supporting Goldcar and Europcar fleets.

## ✨ Features

- ✅ **Next.js 16** with App Router (React 19)
- ✅ **Progressive Web App** - Installable on mobile, tablet, and desktop
- ✅ **TypeScript** with strict mode
- ✅ **Tailwind CSS v4** for styling
- ✅ **Offline Support** with service worker
- ✅ **Responsive Design** (320px → 1920px)
- ✅ **Accessibility** optimized (semantic HTML, ARIA, skip links)
- ✅ **SEO** ready (sitemap, robots.txt, meta tags)
- ✅ **CI/CD** with GitHub Actions
- ✅ **ESLint & Prettier** for code quality

## 📦 Tech Stack

- **Framework**: Next.js 16.0.0 (App Router)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **PWA**: @ducanh2912/next-pwa
- **Code Quality**: ESLint (flat config) + Prettier

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📜 Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript check
npm run format       # Format with Prettier
```

## 🌐 Deployment to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login and deploy
vercel login
vercel link
vercel --prod
```

## 📱 PWA Installation

### Mobile
1. Open in Safari/Chrome
2. Tap Share → "Add to Home Screen"

### Desktop
1. Click install icon in address bar
2. Click "Install"

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

---

## 📝 Recent Upgrades

### React 19 & DayPicker v9 Migration (October 2025)

**Πρόβλημα (Problem):**
- Το Vercel αποτυγχάνει στο `npm install` λόγω peer dependency conflict
- Το `react-day-picker@8.x` δεν υποστήριζε React 19

**Λύση (Solution):**
- ✅ Αναβάθμιση σε `react-day-picker@9.11.1` (υποστηρίζει React 19)
- ✅ Αναβάθμιση `date-fns` σε `^4.1.0`
- ✅ Αφαίρεση `--legacy-peer-deps` από CI και local development
- ✅ Ενημέρωση Calendar component API για v9

**Αλλαγές (Changes):**
- Το `npm install` τώρα λειτουργεί χωρίς flags
- Το Vercel deployment δουλεύει χωρίς peer conflicts
- Τα date pickers λειτουργούν όπως πριν

**Deployment στο Vercel:**
```bash
# Χωρίς --legacy-peer-deps πλέον!
npm install
npm run build

# Deploy preview
vercel

# Deploy production
vercel --prod
```
