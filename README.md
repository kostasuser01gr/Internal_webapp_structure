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
npm install --legacy-peer-deps

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
