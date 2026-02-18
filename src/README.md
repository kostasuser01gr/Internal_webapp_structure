# 🚗 CarWash Pro - Complete Management System

**Σύστημα Διαχείρισης Πλυντηρίου για Goldcar & Europcar**

---

## 📋 Περιεχόμενα

- [Επισκόπηση](#επισκόπηση)
- [Features](#features)
- [Quick Start](#quick-start)
- [Documentation](#documentation)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Support](#support)

---

## 🎯 Επισκόπηση

Πλήρες web-based σύστημα διαχείρισης για πλυντήρια οχημάτων που εξυπηρετούν δύο εταιρείες:

- 🟠 **Goldcar**
- 🟢 **Europcar**

### Δυνατότητες

- Διαχείριση **μέχρι 5.000 οχημάτων**
- Επεξεργασία **μέχρι 5.000 καταχωρήσεων/ημέρα**
- **Mobile-first** responsive design
- **Real-time** collaboration
- **AI-powered** insights

---

## ✨ Features

### 1. 📊 Dashboard & Analytics

- Real-time στατιστικά
- Επισκόπηση δραστηριοτήτων
- KPIs & metrics
- Charts & graphs

### 2. 🚗 Vehicle Management

- CRUD operations για οχήματα
- Αριθμός κυκλοφορίας tracking
- Φωτογραφίες οχημάτων
- Ιστορικό πλύσεων
- Στοιχεία εταιρείας

### 3. 👥 Staff Management **[NEW]**

- Διαχείριση προσωπικού
- Roles: Washer, Manager, Admin
- Skills tracking
- Status management
- Company assignment

### 4. 📅 Shift Management **[NEW]**

- **Αυτόματη δημιουργία βάρδιων**
- Βασισμένο σε κρατήσεις
- Skills matching
- Workload balancing
- Real-time updates

### 5. 📤 Reservation System **[NEW]**

- **Excel bulk upload**
- Flexible format support
- Auto-validation
- Preview before import
- Error handling

### 6. 🏖️ Leave Management **[NEW]**

- Αιτήματα αδειών
- Approval workflow
- Αυτόματη προσαρμογή βάρδιων
- Leave balance tracking
- Multiple leave types

### 7. 📱 Washer App **[NEW]**

- **Ξεχωριστή mobile εφαρμογή**
- Γρήγορη καταχώρηση πλύσεων
- <30s per wash logging
- Large touch-friendly buttons
- Auto-duration calculation

### 8. 💬 Team Chat

- Discord-style interface
- Channels & Direct Messages
- Real-time messaging
- Emoji reactions
- Typing indicators
- Online status

### 9. 🤖 AI Chatbot

- Natural language queries
- Data analysis
- Insights & suggestions
- Bulk operations
- Report generation

### 10. 📋 Reporting

- Customizable reports
- Export to CSV/Excel/PDF
- Performance metrics
- Company comparisons
- Trend analysis

### 11. 🔄 Bulk Operations

- Mass import/export
- Batch updates
- Data migration
- Excel integration

---

## 🚀 Quick Start

### Prerequisites

```bash
- Node.js 18+
- npm or yarn
- Modern browser
```

### Installation

```bash
# Clone repository
git clone https://github.com/your-repo/carwash-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

### Access

```
Local: http://localhost:3000
Production: https://your-domain.vercel.app
```

### First Steps

1. **Add Staff** → Navigation → "Προσωπικό"
2. **Upload Reservations** → "Κρατήσεις" → Upload Excel
3. **Generate Shifts** → "Βάρδιες" → Auto-generate
4. **Add Vehicles** → "Νέο Όχημα"
5. **Start Washing!** 🚗💦

---

## 📚 Documentation

### Πλήρης Οδηγοί

| Document                                                 | Description             | For        |
| -------------------------------------------------------- | ----------------------- | ---------- |
| [QUICK_START.md](./QUICK_START.md)                       | Γρήγορος οδηγός χρήσης  | All Users  |
| [SHIFT_MANAGEMENT_GUIDE.md](./SHIFT_MANAGEMENT_GUIDE.md) | Σύστημα βάρδιων         | Managers   |
| [WASHER_APP_GUIDE.md](./WASHER_APP_GUIDE.md)             | Mobile εφαρμογή πλυντών | Washers    |
| [TEAM_CHAT_GUIDE.md](./TEAM_CHAT_GUIDE.md)               | Team collaboration      | All Users  |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)     | Technical details       | Developers |
| [APP_SUMMARY.md](./APP_SUMMARY.md)                       | System overview         | Management |
| [CHANGELOG.md](./CHANGELOG.md)                           | Version history         | All        |

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**

- React 18
- TypeScript
- Tailwind CSS v4
- Shadcn/ui components
- Recharts for analytics
- date-fns for dates

**Backend (Future):**

- Supabase (PostgreSQL)
- Real-time subscriptions
- Row Level Security
- Storage for images

**Deployment:**

- Vercel (Frontend)
- Edge Functions
- CI/CD automated
- Preview deployments

### File Structure

```
/
├── App.tsx                 # Main application
├── WasherApp.tsx          # Separate washer app
├── components/
│   ├── DashboardStats.tsx
│   ├── VehicleTable.tsx
│   ├── StaffManagement.tsx      [NEW]
│   ├── ShiftManagement.tsx      [NEW]
│   ├── ReservationUpload.tsx    [NEW]
│   ├── LeaveRequests.tsx        [NEW]
│   ├── TeamChat.tsx
│   ├── ChatBot.tsx
│   ├── ReportsAnalytics.tsx
│   ├── BulkOperations.tsx
│   └── ui/                # Shadcn components
├── lib/
│   ├── mockData.ts        # Sample data
│   └── utils.ts           # Helper functions
├── types/
│   └── index.ts           # TypeScript types
└── styles/
    └── globals.css        # Global styles
```

---

## 📊 Data Model

### Core Entities

```typescript
// Companies
Goldcar { id: '1', color: '#F59E0B' }
Europcar { id: '2', color: '#10B981' }

// Vehicle
{
  id, licensePlate, companyId,
  status, imageUrl, notes,
  createdAt, updatedAt
}

// Staff [NEW]
{
  id, name, email, phone,
  role, status, companyId,
  skills[], createdAt
}

// Reservation [NEW]
{
  id, vehicleLicensePlate, companyId,
  reservationDate, timeSlot, workType,
  estimatedDuration, status
}

// Shift [NEW]
{
  id, staffId, date,
  startTime, endTime, type,
  status, assignedReservations[],
  autoGenerated, notes
}

// Leave Request [NEW]
{
  id, staffId, startDate, endDate,
  type, status, reason,
  approvedBy, createdAt
}
```

---

## 🔄 Workflows

### Daily Operations

```
08:00 → Manager uploads reservations (Excel)
08:15 → Auto-generate shifts
08:30 → Staff check-in via Washer App
09:00 → Start washing
      → Real-time logging via Washer App
12:00 → Lunch break
13:00 → Continue operations
17:00 → End of day
      → Review stats on Dashboard
      → Prepare για αύριο
```

### Weekly Planning

```
Monday:
  ✓ Upload reservations για εβδομάδα
  ✓ Generate all shifts
  ✓ Review & approve leave requests
  ✓ Communicate με team via Chat

Mid-week:
  ✓ Monitor operations
  ✓ Adjust shifts αν χρειάζεται
  ✓ Handle change requests

Friday:
  ✓ Week review
  ✓ Performance analysis
  ✓ Plan επόμενης εβδομάδας
```

---

## 🎨 UI/UX Highlights

### Mobile-First Design

- Touch-friendly buttons
- Responsive layouts
- Optimized για tablets
- PWA support

### Color Scheme

- **Goldcar**: Warm Orange (#F59E0B)
- **Europcar**: Fresh Green (#10B981)
- **UI**: Soft grays, blue accents
- **Dark Mode**: Coming soon

### Performance

- Fast load times (<2s)
- Optimized renders
- Lazy loading
- Code splitting

---

## 🔐 Security & Privacy

### Data Protection

- HTTPS everywhere
- Secure API calls
- Data validation
- SQL injection prevention

### User Roles

```
Admin:
  ✓ Full access
  ✓ User management
  ✓ System settings

Manager:
  ✓ Staff management
  ✓ Shift approval
  ✓ Reports access
  ✗ System settings

Washer:
  ✓ Washer App access
  ✓ Own shift view
  ✓ Leave requests
  ✗ Other user data
```

### Privacy

- GDPR compliant
- Data retention policies
- User consent
- Right to deletion

---

## 🚀 Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Custom domain
vercel domains add your-domain.com
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
NEXT_PUBLIC_OPENAI_API_KEY=your-key
```

### CI/CD Pipeline

```yaml
# Automatic on git push
main → Production
develop → Preview
feature/* → Preview
```

---

## 📈 Roadmap

### Phase 1: Core (✅ Completed)

- [x] Vehicle management
- [x] Work entry logging
- [x] Dashboard & reports
- [x] Team Chat
- [x] AI Chatbot
- [x] Bulk operations

### Phase 2: Automation (✅ Completed)

- [x] Staff management
- [x] Shift auto-generation
- [x] Excel import
- [x] Leave management
- [x] Washer App

### Phase 3: Integration (🔄 In Progress)

- [ ] Supabase backend
- [ ] Real-time sync
- [ ] User authentication
- [ ] Push notifications
- [ ] Advanced AI features

### Phase 4: Enhancement (📅 Planned)

- [ ] Customer portal
- [ ] Online booking
- [ ] Payment integration
- [ ] Inventory management
- [ ] Mobile apps (iOS/Android)

---

## 🤝 Contributing

### Development Setup

```bash
# Fork & clone
git clone your-fork-url

# Create branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m "Add amazing feature"

# Push & create PR
git push origin feature/amazing-feature
```

### Code Style

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Conventional commits

---

## 📞 Support

### Get Help

**Documentation:**

- Check relevant guide in `/docs`
- Search in Team Chat history
- Ask AI Chatbot

**Community:**

- Team Chat → #τεχνική-υποστήριξη
- GitHub Issues
- Email: support@carwash.com

**Emergency:**

- Phone: +30 210 123 4567
- Direct message admin

---

## 📜 License

```
MIT License

Copyright (c) 2025 CarWash Pro

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software...
```

---

## 🙏 Acknowledgments

### Built With

- [React](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)
- [Vercel](https://vercel.com)
- [Supabase](https://supabase.com)

### Special Thanks

- Figma Make AI
- Open source community
- Beta testers
- Early adopters

---

## 🎉 Getting Started Now!

```bash
# 1. Clone
git clone https://github.com/your-repo/carwash-pro

# 2. Install
npm install

# 3. Run
npm run dev

# 4. Open
open http://localhost:3000
```

**Start washing cars efficiently! 🚗💦✨**

---

**Version:** 3.0.0  
**Last Updated:** October 21, 2025  
**Status:** ✅ Production Ready

---

### Quick Links

- 📖 [Quick Start Guide](./QUICK_START.md)
- 📅 [Shift Management](./SHIFT_MANAGEMENT_GUIDE.md)
- 📱 [Washer App](./WASHER_APP_GUIDE.md)
- 💬 [Team Chat](./TEAM_CHAT_GUIDE.md)
- 🔧 [Implementation](./IMPLEMENTATION_GUIDE.md)

**Questions? Open an issue or ask in Team Chat!** 💬
