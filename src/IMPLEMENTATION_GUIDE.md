# Οδηγός Υλοποίησης - CarWash Pro Management System

## 📋 Περιεχόμενα

1. [Αρχιτεκτονική Εφαρμογής](#αρχιτεκτονική-εφαρμογής)
2. [Ενσωμάτωση AI Chatbot](#ενσωμάτωση-ai-chatbot)
3. [Backend & Database](#backend--database)
4. [Deployment στο Vercel](#deployment-στο-vercel)
5. [Επόμενα Βήματα](#επόμενα-βήματα)

---

## Αρχιτεκτονική Εφαρμογής

### Δομή Σελίδων & Components

```
/App.tsx                    # Main application με routing και state management
/components/
  ├── DashboardStats.tsx    # Κάρτες στατιστικών
  ├── VehicleTable.tsx      # Πίνακας οχημάτων με φίλτρα
  ├── VehicleForm.tsx       # Φόρμα καταχώρησης/επεξεργασίας
  ├── VehicleHistory.tsx    # Ιστορικό εργασιών οχήματος
  ├── ChatBot.tsx           # AI chatbot interface
  ├── BulkOperations.tsx    # Μαζικές λειτουργίες
  ├── ReportsAnalytics.tsx  # Αναφορές & charts
  └── WorkEntryForm.tsx     # Φόρμα εργασίας πλυσίματος
```

### Views (Οθόνες)

1. **Dashboard** - Επισκόπηση με stats cards και πρόσφατα οχήματα
2. **Vehicles** - Πλήρης λίστα οχημάτων με φίλτρα και αναζήτηση
3. **Add/Edit Vehicle** - Φόρμα καταχώρησης με photo upload
4. **Vehicle Detail** - Ιστορικό εργασιών και προσθήκη νέας εργασίας
5. **Bulk Operations** - Import/Export/Edit/Delete μαζικά
6. **Reports & Analytics** - Γραφήματα και αναλύσεις

### Ροές Εργασίας (Workflows)

**Ροή 1: Καταχώρηση Νέου Οχήματος**
```
1. Κλικ "Νέο Όχημα" → 2. Εισαγωγή αριθμού κυκλοφορίας
3. Επιλογή εταιρείας → 4. Φωτογράφηση (mobile)
5. Προσθήκη σημειώσεων → 6. Αποθήκευση
```

**Ροή 2: Καταχώρηση Εργασίας**
```
1. Επιλογή οχήματος από λίστα → 2. Προβολή ιστορικού
3. "Νέα Εργασία" → 4. Επιλογή τύπου εργασίας (auto-calculate χρόνο/κόστος)
5. Εισαγωγή τεχνικού → 6. Αποθήκευση
```

**Ροή 3: Χρήση AI Chatbot**
```
1. Κλικ floating bot button → 2. Ερώτημα (π.χ. "πόσα οχήματα σήμερα;")
3. AI response με data και suggestions → 4. Προαιρετικά: εκτέλεση action buttons
```

**Ροή 4: Μαζική Εισαγωγή**
```
1. "Μαζικές Λειτουργίες" → 2. Tab "Εισαγωγή"
3. Upload CSV/Excel → 4. Validation & preview
5. Import confirmation → 6. Αποθήκευση όλων των εγγραφών
```

---

## Ενσωμάτωση AI Chatbot

### Προτεινόμενη Λύση: OpenAI API

#### 1. Setup OpenAI

```bash
npm install openai
```

#### 2. Δημιουργία API Service

```typescript
// /lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Για development - σε production χρησιμοποιήστε API route
});

export async function getChatbotResponse(
  message: string,
  context: {
    vehicles: Vehicle[];
    stats: DashboardStats;
    workEntries: WorkEntry[];
  }
) {
  const systemPrompt = `
Είσαι ένας AI βοηθός για σύστημα διαχείρισης πλυντηρίου οχημάτων.
Έχεις πρόσβαση σε δεδομένα για οχήματα, εργασίες και στατιστικά.

Μπορείς να:
- Αναλύεις δεδομένα και δίνεις insights
- Προτείνεις εργασίες βάσει ιστορικού
- Υπολογίζεις χρόνους και κόστη
- Βοηθάς σε μαζικές λειτουργίες
- Δημιουργείς αναφορές

Τρέχοντα δεδομένα:
- Συνολικά οχήματα: ${context.stats.totalVehicles}
- Καταχωρήσεις σήμερα: ${context.stats.todayEntries}
- Εκκρεμείς εργασίες: ${context.stats.pendingWork}
- Μέσος χρόνος: ${context.stats.avgDuration} λεπτά

Απάντησε στα ελληνικά, με σαφήνεια και χρησιμότητα.
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return completion.choices[0].message.content;
}
```

#### 3. Ενσωμάτωση στο ChatBot Component

```typescript
// Στο /components/ChatBot.tsx
import { getChatbotResponse } from '../lib/openai';

const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content: input,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput('');
  setIsTyping(true);

  try {
    // Κλήση OpenAI API με context
    const aiResponse = await getChatbotResponse(input, {
      vehicles: mockVehicles,
      stats: mockDashboardStats,
      workEntries: mockWorkEntries,
    });

    const assistantMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content: aiResponse || 'Συγνώμη, δεν μπόρεσα να επεξεργαστώ το αίτημα.',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
  } catch (error) {
    console.error('AI Error:', error);
    // Fallback σε mock responses
  } finally {
    setIsTyping(false);
  }
};
```

### Εναλλακτικές Λύσεις AI

**1. Anthropic Claude API**
- Παρόμοια με OpenAI
- Εξαιρετικό για πολύπλοκες αναλύσεις
- `npm install @anthropic-ai/sdk`

**2. Local LLM (Ollama)**
- Πλήρης έλεγχος και privacy
- Δωρεάν
- Απαιτεί server infrastructure

**3. Google Gemini**
- Καλή τιμή/απόδοση
- `npm install @google/generative-ai`

---

## Backend & Database

### Προτεινόμενη Λύση: Supabase

#### Γιατί Supabase;
- ✅ PostgreSQL database (έως 5,000+ εγγραφές)
- ✅ Real-time subscriptions
- ✅ Authentication built-in
- ✅ File storage για φωτογραφίες
- ✅ Row Level Security για ασφάλεια
- ✅ REST & GraphQL APIs
- ✅ Δωρεάν tier για development

#### 1. Setup Supabase Project

```bash
npm install @supabase/supabase-js
```

#### 2. Database Schema

```sql
-- Πίνακας Εταιρειών
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Πίνακας Οχημάτων
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  license_plate TEXT NOT NULL UNIQUE,
  company_id UUID REFERENCES companies(id),
  status TEXT CHECK (status IN ('active', 'pending', 'completed', 'maintenance')),
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index για γρήγορη αναζήτηση
CREATE INDEX idx_vehicles_license_plate ON vehicles(license_plate);
CREATE INDEX idx_vehicles_company ON vehicles(company_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);

-- Πίνακας Εργασιών
CREATE TABLE work_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id),
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  technician_name TEXT NOT NULL,
  work_type TEXT NOT NULL,
  duration INTEGER, -- λεπτά
  cost DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index για queries
CREATE INDEX idx_work_entries_vehicle ON work_entries(vehicle_id);
CREATE INDEX idx_work_entries_date ON work_entries(date DESC);

-- Πίνακας Χρηστών (προσωπικό)
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role TEXT CHECK (role IN ('admin', 'technician', 'manager')),
  company_id UUID REFERENCES companies(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Μόνο authenticated users
CREATE POLICY "Allow authenticated access" ON vehicles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated access" ON work_entries
  FOR ALL USING (auth.role() = 'authenticated');
```

#### 3. Supabase Client Setup

```typescript
// /lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helpers
export const vehiclesDB = {
  async getAll(companyId?: string) {
    let query = supabase
      .from('vehicles')
      .select('*, companies(name, color)')
      .order('created_at', { ascending: false });
    
    if (companyId) {
      query = query.eq('company_id', companyId);
    }
    
    const { data, error } = await query;
    return { data, error };
  },

  async create(vehicle: Partial<Vehicle>) {
    const { data, error } = await supabase
      .from('vehicles')
      .insert(vehicle)
      .select()
      .single();
    return { data, error };
  },

  async update(id: string, updates: Partial<Vehicle>) {
    const { data, error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', id);
    return { error };
  },
};

export const workEntriesDB = {
  async getByVehicle(vehicleId: string) {
    const { data, error } = await supabase
      .from('work_entries')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('date', { ascending: false });
    return { data, error };
  },

  async create(entry: Partial<WorkEntry>) {
    const { data, error } = await supabase
      .from('work_entries')
      .insert(entry)
      .select()
      .single();
    return { data, error };
  },
};
```

#### 4. File Upload για Φωτογραφίες

```typescript
// /lib/storage.ts
import { supabase } from './supabase';

export async function uploadVehicleImage(file: File, vehicleId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${vehicleId}-${Date.now()}.${fileExt}`;
  const filePath = `vehicles/${fileName}`;

  const { data, error } = await supabase.storage
    .from('vehicle-images')
    .upload(filePath, file);

  if (error) throw error;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('vehicle-images')
    .getPublicUrl(filePath);

  return publicUrl;
}
```

### Εναλλακτική: Firebase / MongoDB Atlas

Και οι δύο είναι εξαιρετικές επιλογές με παρόμοια χαρακτηριστικά.

---

## Deployment στο Vercel

### 1. Προετοιμασία Project

```bash
# Δημιουργία Vercel project
npm install -g vercel
vercel login
```

### 2. Environment Variables

Δημιουργήστε `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# App Config
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

Στο Vercel Dashboard:
1. Project Settings → Environment Variables
2. Προσθέστε όλα τα variables για Production, Preview, Development

### 3. Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "NEXT_PUBLIC_OPENAI_API_KEY": "@openai-api-key"
  }
}
```

### 4. CI/CD Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 5. Deployment Environments

**Development**
```bash
vercel dev
```

**Preview (για testing)**
```bash
git push origin feature-branch
# Αυτόματο preview deployment από Vercel
```

**Production**
```bash
git push origin main
# Αυτόματο production deployment
```

### 6. Custom Domain

Στο Vercel Dashboard:
1. Settings → Domains
2. Add domain: `carwash.yourcompany.com`
3. Configure DNS records (Vercel θα δώσει οδηγίες)

---

## Επόμενα Βήματα

### Immediate (Week 1-2)

1. **Backend Setup**
   - [ ] Δημιουργία Supabase project
   - [ ] Setup database schema
   - [ ] Configure authentication
   - [ ] Test CRUD operations

2. **AI Integration**
   - [ ] OpenAI API key setup
   - [ ] Implement chatbot backend
   - [ ] Test with real data context
   - [ ] Fine-tune prompts

3. **File Upload**
   - [ ] Setup Supabase Storage
   - [ ] Implement image upload
   - [ ] Add image optimization
   - [ ] Test on mobile devices

### Short-term (Week 3-4)

4. **Authentication**
   - [ ] Email/password login
   - [ ] Role-based access (admin, technician)
   - [ ] Protected routes
   - [ ] Session management

5. **Testing & QA**
   - [ ] Unit tests για critical functions
   - [ ] E2E tests για main workflows
   - [ ] Mobile testing (iOS/Android)
   - [ ] Performance optimization

6. **Deployment**
   - [ ] Vercel project setup
   - [ ] Environment variables configuration
   - [ ] Production deployment
   - [ ] Custom domain setup

### Medium-term (Month 2)

7. **Advanced Features**
   - [ ] Real-time updates (Supabase subscriptions)
   - [ ] Push notifications
   - [ ] Advanced analytics
   - [ ] Export/Import improvements

8. **Optimizations**
   - [ ] Image compression & lazy loading
   - [ ] Database indexing optimization
   - [ ] Caching strategy
   - [ ] PWA capabilities

### Long-term (Month 3+)

9. **Επεκτάσεις**
   - [ ] Προγραμματισμός εργασιών (calendar)
   - [ ] Inventory management (υλικά, εξοπλισμός)
   - [ ] Customer portal (για πελάτες)
   - [ ] Mobile app (React Native)
   - [ ] SMS/Email notifications
   - [ ] Payment integration
   - [ ] Multi-language support

---

## Τεχνικές Σημειώσεις

### Performance Considerations

- **Database**: Χρήση indexes για γρήγορα queries
- **Images**: Compression & CDN (Vercel Edge)
- **API**: Caching με SWR ή React Query
- **Bundle**: Code splitting για μικρότερα bundles

### Security Best Practices

- ✅ Environment variables για sensitive data
- ✅ Row Level Security στο Supabase
- ✅ Input validation (frontend & backend)
- ✅ Rate limiting για API calls
- ✅ HTTPS only (Vercel default)
- ✅ CORS configuration

### Scalability

Το σύστημα σχεδιάστηκε για:
- **5,000 οχήματα** στη βάση
- **5,000 καταχωρήσεις/ημέρα**
- **Πολλαπλούς concurrent users**

Αν χρειαστεί περισσότερη χωρητικότητα:
- Upgrade Supabase tier
- Database sharding
- Read replicas
- CDN για static assets

---

## Υποστήριξη & Documentation

### Χρήσιμα Links

- **Supabase Docs**: https://supabase.com/docs
- **OpenAI API**: https://platform.openai.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

### Contact & Support

Για ερωτήσεις ή βοήθεια, επικοινωνήστε:
- Email: support@carwashpro.com
- Docs: https://docs.carwashpro.com

---

**Καλή επιτυχία με την υλοποίηση! 🚀**
