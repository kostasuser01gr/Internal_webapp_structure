# 📱 Washer App - Οδηγός Χρήσης

## Τι είναι το Washer App;

Το **Washer App** είναι μια ξεχωριστή, απλοποιημένη εφαρμογή σχεδιασμένη ειδικά για τους **πλύντες** (washers). Επιτρέπει γρήγορη και εύκολη καταχώρηση πλύσεων οχημάτων χωρίς την πολυπλοκότητα του κύριου συστήματος διαχείρισης.

---

## 🎯 Χαρακτηριστικά

### ✨ Απλό & Γρήγορο

- **Minimal Interface**: Μόνο τα απαραίτητα πεδία
- **Μεγάλα Κουμπιά**: Εύκολη χρήση σε κινητά/tablets
- **Auto-fill**: Αυτόματη συμπλήρωση διάρκειας βάσει τύπου

### 🚀 Γρήγορη Καταχώρηση

1. **Αριθμός Κυκλοφορίας** (1 πεδίο)
2. **Εταιρεία** (2 κουμπιά: Goldcar/Europcar)
3. **Τύπος Εργασίας** (6 προεπιλεγμένες επιλογές)
4. **Επιβεβαίωση** και τέλος!

### 📊 Real-time Stats

- Μετρητής πλύσεων ημέρας
- Μέσος χρόνος πλύσης
- Instant feedback

---

## 🔗 Σύνδεση με το Κύριο Σύστημα

### Πώς Λειτουργεί η Σύνδεση

```
Washer App (Mobile)
      ↓
   [API Call]
      ↓
Main Web App (Backend)
      ↓
   Database
      ↓
Management Dashboard
```

### API Endpoints (Για Production)

```typescript
POST /api/work-entries
{
  "licensePlate": "ΑΒΓ-1234",
  "companyId": "1",
  "workType": "exterior-only",
  "duration": 30,
  "technicianName": "Γιώργος",
  "notes": ""
}
```

---

## 📱 Πώς να το Χρησιμοποιήσετε

### Βήμα 1: Άνοιγμα της Εφαρμογής

**Desktop/Laptop:**

```
URL: https://your-app.vercel.app/washer
```

**Mobile/Tablet:**

```
Προσθέστε στην αρχική οθόνη για PWA εμπειρία:
1. Ανοίξτε το link
2. Κλικ "Add to Home Screen"
3. Τώρα είναι εφαρμογή!
```

### Βήμα 2: Καταχώρηση Πλύσης

#### 🚗 Αριθμός Κυκλοφορίας

```
- Πληκτρολογήστε τον αριθμό
- Αυτόματη μετατροπή σε ΚΕΦΑΛΑΙΑ
- Παράδειγμα: ΑΒΓ-1234
```

#### 🏢 Επιλογή Εταιρείας

```
Goldcar (🟠)    Europcar (🟢)
   ↓                ↓
   Ένα κλικ για επιλογή
```

#### 🔧 Τύπος Εργασίας

```
┌─────────────────┬─────────────────┐
│ Premium Πλήρης  │ Εξωτερικό Μόνο  │
│    75 λεπτά     │    30 λεπτά     │
├─────────────────┼─────────────────┤
│ Εσωτερικό Μόνο  │   Απολύμανση    │
│    45 λεπτά     │    20 λεπτά     │
├─────────────────┼─────────────────┤
│      Κερί       │    Detailing    │
│    25 λεπτά     │   120 λεπτά     │
└─────────────────┴─────────────────┘
```

### Βήμα 3: Επιβεβαίωση

```
✓ Έλεγχος στοιχείων
✓ Κλικ "Καταχώρηση"
✓ Επιτυχής καταχώρηση!
```

### Auto-Reset

Η εφαρμογή επιστρέφει αυτόματα στην αρχική οθόνη μετά από 3 δευτερόλεπτα, έτοιμη για την επόμενη πλύση!

---

## ⚡ Shortcuts & Tips

### Keyboard Shortcuts

```
Enter     → Προχώρηση στο επόμενο βήμα
Tab       → Μετακίνηση μεταξύ πεδίων
Esc       → Επιστροφή/Ακύρωση
1-6       → Επιλογή τύπου εργασίας (desktop)
```

### Pro Tips

```
💡 Χρησιμοποιήστε barcode scanner για αριθμούς κυκλοφορίας
💡 Η διάρκεια υπολογίζεται αυτόματα
💡 Μπορείτε να την αλλάξετε χειροκίνητα αν χρειαστεί
💡 Οι σημειώσεις είναι προαιρετικές
```

---

## 🎨 UI Overview

### Mobile View

```
┌─────────────────────────┐
│  🚗 Car Wash App        │
│  Γιώργος | 21/10/2025   │
├─────────────────────────┤
│  Σήμερα: 12  Χρόνος: 45'│
├─────────────────────────┤
│                         │
│  Νέα Πλύση Οχήματος     │
│                         │
│  ┌───────────────────┐  │
│  │   ΑΒΓ-1234        │  │
│  └───────────────────┘  │
│                         │
│  ┌──────┐  ┌──────────┐ │
│  │🟠Gold│  │🟢Europcar│ │
│  │ car  │  │          │ │
│  └──────┘  └──────────┘ │
│                         │
│  [Premium] [Exterior]   │
│  [Interior][Disinfect]  │
│  [Wax]    [Detailing]   │
│                         │
│  ┌───────────────────┐  │
│  │  ✓ Καταχώρηση     │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

### Success Screen

```
┌─────────────────────────┐
│                         │
│       ┌───────┐         │
│       │   ✓   │         │
│       └───────┘         │
│                         │
│  Επιτυχής Καταχώρηση!   │
│                         │
│  Όχημα: ΑΒΓ-1234        │
│  Εταιρεία: Goldcar      │
│                         │
│  ┌───────────────────┐  │
│  │ Πλύσεις Σήμερα: 13│  │
│  └───────────────────┘  │
│                         │
│  Auto-reset σε 3s...    │
└─────────────────────────┘
```

---

## 🔧 Technical Setup

### Standalone Deployment

#### Option 1: Separate URL

```bash
# Deploy washer app separately
vercel --prod --name washer-app

# Access at:
https://washer.your-domain.com
```

#### Option 2: Same App, Different Route

```typescript
// App.tsx or Router
{
  path: '/washer',
  component: WasherApp
}

// Access at:
https://your-domain.com/washer
```

### Progressive Web App (PWA)

Create `manifest.json`:

```json
{
  "name": "CarWash Washer App",
  "short_name": "Washer",
  "description": "Quick vehicle wash logging",
  "start_url": "/washer",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 🔐 Security & Permissions

### User Authentication

```typescript
// Simple token-based auth
const washerToken = localStorage.getItem('washer-token');

// Include in API calls
headers: {
  'Authorization': `Bearer ${washerToken}`
}
```

### Permissions Required

```
✓ Internet access (για sync)
✗ Camera (optional - για barcode)
✗ Location (optional - για check-in)
```

---

## 📊 Data Sync

### Online Mode

```
Καταχώρηση → Instant API Call → Database Update
```

### Offline Mode (Future Feature)

```
Καταχώρηση → Local Storage → Sync όταν online
```

### Sync Status Indicator

```
🟢 Online  - Instant sync
🟡 Syncing - Uploading...
🔴 Offline - Will sync later
```

---

## 🎓 Training for Washers

### Quick Start Guide (5 λεπτά)

#### 1️⃣ Πρώτη Φορά

```
1. Άνοιξε το link
2. Add to Home Screen (mobile)
3. Δοκιμαστική καταχώρηση
4. Έτοιμος!
```

#### 2️⃣ Καθημερινή Χρήση

```
Start of Day:
  ✓ Open app
  ✓ Check συνδεσιμότητα
  ✓ Ready!

During Work:
  ✓ Πλύση οχήματος
  ✓ Άμεση καταχώρηση
  ✓ Επόμενο όχημα

End of Day:
  ✓ Check μετρητή
  ✓ Close app
```

#### 3️⃣ Troubleshooting

```
Πρόβλημα: Δεν καταχωρείται
  → Έλεγξε σύνδεση internet
  → Reload app
  → Επικοινωνία με manager

Πρόβλημα: Λάθος στοιχεία
  → Πάτα "Πίσω"
  → Διόρθωση
  → Ξανά καταχώρηση
```

---

## 📈 Performance Metrics

### Target Speed

```
Καταχώρηση πλύσης: < 30 δευτερόλεπτα
  - Αριθμός: 5s
  - Εταιρεία: 2s
  - Τύπος: 3s
  - Επιβεβαίωση: 5s
  - Submit: 2s
  = 17s total ✓
```

### Daily Capacity

```
1 washer × 8 hours × 12 washes/hour = 96 washes/day
```

---

## 🆚 Washer App vs Main App

| Feature        | Washer App    | Main App         |
| -------------- | ------------- | ---------------- |
| **Purpose**    | Quick logging | Full management  |
| **Users**      | Washers only  | Managers, Admins |
| **Fields**     | 4 essential   | 20+ detailed     |
| **Speed**      | < 30 seconds  | 2-3 minutes      |
| **Complexity** | Simple        | Complex          |
| **Device**     | Mobile-first  | Desktop-first    |
| **Offline**    | Planned       | Not needed       |
| **Features**   | Logging only  | Everything       |

---

## 🔄 Integration Flow

```
┌─────────────────┐
│   Washer App    │
│  (Mobile/Tab)   │
└────────┬────────┘
         │
         │ POST /api/work-entries
         ↓
┌─────────────────┐
│  Backend API    │
│   (Vercel)      │
└────────┬────────┘
         │
         ├→ Save to Supabase
         ├→ Update stats
         ├→ Notify managers
         └→ Generate invoice data

┌─────────────────┐
│   Main App      │
│   (Desktop)     │
└─────────────────┘
    ↑
    │ Real-time updates
    │
┌─────────────────┐
│    Supabase     │
│   (Database)    │
└─────────────────┘
```

---

## 🚀 Future Enhancements

### Phase 1 (Current)

- ✅ Basic logging
- ✅ Company selection
- ✅ Work type selection
- ✅ Auto duration

### Phase 2 (Next)

- ⏳ Offline support
- ⏳ Barcode scanning
- ⏳ Photo upload
- ⏳ Voice notes

### Phase 3 (Future)

- 🔮 GPS check-in
- 🔮 Quality ratings
- 🔮 Customer signatures
- 🔮 Inventory tracking

---

## 💬 Support

### For Washers

```
Πρόβλημα με την εφαρμογή;
1. Ρωτήστε τον manager
2. Team Chat → Τεχνική Υποστήριξη
3. Call: +30 210 123 4567
```

### For Managers

```
Setup νέου washer:
1. Create user account
2. Send app link
3. Quick training (5 min)
4. Monitor first day
```

---

## ✅ Checklist για Go-Live

### Before Launch

- [ ] Deploy Washer App
- [ ] Test σε mobile devices
- [ ] Train 1 washer (pilot)
- [ ] Test API integration
- [ ] Verify data sync
- [ ] Create backup process

### Launch Day

- [ ] Deploy για όλους
- [ ] Training session
- [ ] Monitor closely
- [ ] Collect feedback
- [ ] Quick fixes

### Post-Launch

- [ ] Daily check-ins (week 1)
- [ ] Gather improvements
- [ ] Update documentation
- [ ] Celebrate success! 🎉

---

**Ready to wash some cars! 🚗💦✨**

_Questions? Check the Main App docs or contact support._
