# Team Chat - Οδηγός Χρήσης

## 📱 Επισκόπηση

Το **Team Chat** είναι ένα ολοκληρωμένο σύστημα επικοινωνίας για την ομάδα σας, εμπνευσμένο από τα Discord και Viber. Επιτρέπει την άμεση επικοινωνία μεταξύ των μελών της ομάδας με channels, direct messages, και real-time features.

---

## ✨ Χαρακτηριστικά

### 🎯 Βασικές Λειτουργίες

- **Κανάλια (Channels)**: Ομαδικές συζητήσεις για συγκεκριμένα θέματα
  - Γενικά - Γενική συζήτηση ομάδας
  - AutoClean Premium - Συντονισμός για AutoClean
  - SpeedWash Express - Συντονισμός για SpeedWash
  - Τεχνική Υποστήριξη - Τεχνικά θέματα & λύσεις

- **Direct Messages**: Ιδιωτικές συνομιλίες 1-προς-1

- **Group Messages**: Ομαδικές συνομιλίες με επιλεγμένα μέλη

### 💬 Λειτουργίες Μηνυμάτων

- **Αποστολή Μηνυμάτων**: Γράψτε και πατήστε Enter ή κλικ στο Send
- **Πολυγραμμικά Μηνύματα**: Shift + Enter για νέα γραμμή
- **Reactions**: Emoji reactions σε μηνύματα
- **Επεξεργασία**: Δυνατότητα επεξεργασίας μηνυμάτων (marked ως edited)
- **Timestamps**: Αυτόματες ημερομηνίες και ώρες
- **Typing Indicators**: Δείτε όταν κάποιος γράφει

### 👥 Διαχείριση Χρηστών

- **Online Status**: Πράσινο = Online, Κίτρινο = Away, Γκρι = Offline
- **Avatars**: Αρχικά ονόματος για κάθε χρήστη
- **Ρόλοι**: Admin, Manager, Technician
- **Members Panel**: Δείτε όλα τα μέλη του channel (δεξιά sidebar)

### 🔔 Ειδοποιήσεις

- **Unread Badges**: Κόκκινα badges για αδιάβαστα μηνύματα
- **Channel Badges**: Αριθμός αδιάβαστων ανά κανάλι
- **Notification Badge**: Συνολικός αριθμός στο navigation (6 unread)

### 🔍 Αναζήτηση & Φίλτρα

- **Search Channels**: Αναζήτηση καναλιών και DMs
- **Search Messages**: Αναζήτηση μέσα σε μηνύματα (σύντομα)
- **Pinned Channels**: Pin σημαντικά κανάλια στην κορυφή

---

## 🎨 UI/UX Features

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Sidebar (Channels)  │  Chat Area  │  Members Sidebar       │
│                      │             │  (Optional, XL+)        │
├──────────────────────┼─────────────┼────────────────────────┤
│  - Search            │  - Header   │  - Team Members        │
│  - Channels          │  - Messages │  - Online Status       │
│  - Direct Messages   │  - Input    │  - Roles               │
│  - User Profile      │             │                        │
└──────────────────────┴─────────────┴────────────────────────┘
```

### Responsive Design

- **Mobile**: Single column, swipe για sidebar
- **Tablet**: Δύο columns (sidebar + chat)
- **Desktop**: Τρεις columns (sidebar + chat + members)

### Color Coding

- **Blue**: Ενεργό κανάλι/selected
- **Green**: Online status
- **Yellow**: Away status
- **Gray**: Offline status
- **Red**: Unread notifications

---

## 🚀 Χρήση

### Αποστολή Μηνύματος

1. Επιλέξτε κανάλι ή DM από το sidebar
2. Γράψτε το μήνυμά σας στο input field
3. Πατήστε **Enter** ή κλικ στο **Send** button

### Δημιουργία Direct Message

1. Κλικ στο **+** button δίπλα στο "ΜΗΝΥΜΑΤΑ"
2. Επιλέξτε χρήστη από τη λίστα
3. Ξεκινήστε τη συνομιλία

### Προσθήκη Reaction

1. Hover πάνω από μήνυμα
2. Κλικ στο smile icon
3. Επιλέξτε emoji

### Αναζήτηση

1. Γράψτε στο search field στο sidebar
2. Φιλτράρονται αυτόματα τα channels/DMs

---

## 🔧 Τεχνική Υλοποίηση

### Components

```typescript
/components/TeamChat.tsx - Κύριο component
```

### Types

```typescript
export type TeamUser = {
  id: string;
  name: string;
  avatar?: string;
  role: "admin" | "technician" | "manager";
  status: "online" | "offline" | "away";
  lastSeen?: Date;
};

export type TeamMessage = {
  id: string;
  channelId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  edited?: boolean;
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
};

export type ChatChannel = {
  id: string;
  name: string;
  type: "channel" | "direct" | "group";
  description?: string;
  icon?: string;
  participants: string[];
  unreadCount?: number;
  lastMessage?: TeamMessage;
  isPinned?: boolean;
};
```

### Mock Data

```typescript
// /lib/mockData.ts
export const mockTeamUsers: TeamUser[];
export const mockChatChannels: ChatChannel[];
export const mockTeamMessages: Record<string, TeamMessage[]>;
```

---

## 🔌 Real-time Integration (Production)

Για παραγωγική χρήση, ενσωματώστε ένα real-time backend:

### Επιλογή 1: Supabase Realtime

```typescript
import { supabase } from "./lib/supabase";

// Subscribe to new messages
const channel = supabase
  .channel("team-chat")
  .on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "messages",
      filter: `channel_id=eq.${channelId}`,
    },
    (payload) => {
      setMessages((prev) => [...prev, payload.new]);
    }
  )
  .subscribe();

// Send message
const { data, error } = await supabase.from("messages").insert({
  channel_id: channelId,
  sender_id: userId,
  content: message,
});
```

### Επιλογή 2: Socket.io

```typescript
import io from "socket.io-client";

const socket = io("https://your-backend.com");

// Listen for messages
socket.on("message", (message) => {
  setMessages((prev) => [...prev, message]);
});

// Send message
socket.emit("send-message", {
  channelId,
  content,
  senderId,
});

// Typing indicator
socket.emit("typing", { channelId, userId, userName });
```

### Επιλογή 3: Firebase Realtime Database

```typescript
import { ref, onValue, push } from "firebase/database";

// Listen for messages
const messagesRef = ref(db, `channels/${channelId}/messages`);
onValue(messagesRef, (snapshot) => {
  const data = snapshot.val();
  setMessages(Object.values(data));
});

// Send message
await push(ref(db, `channels/${channelId}/messages`), {
  content,
  senderId,
  timestamp: Date.now(),
});
```

---

## 📊 Database Schema (Production)

### PostgreSQL (Supabase)

```sql
-- Users/Staff table (already exists)
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT,
  avatar_url TEXT,
  status TEXT DEFAULT 'offline',
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Channels table
CREATE TABLE chat_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('channel', 'direct', 'group')),
  description TEXT,
  icon TEXT,
  is_pinned BOOLEAN DEFAULT false,
  created_by UUID REFERENCES staff(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Channel participants (many-to-many)
CREATE TABLE channel_participants (
  channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unread_count INTEGER DEFAULT 0,
  PRIMARY KEY (channel_id, user_id)
);

-- Messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES staff(id),
  content TEXT NOT NULL,
  edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message reactions
CREATE TABLE message_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES staff(id),
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- Message attachments
CREATE TABLE message_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('image', 'file')),
  url TEXT NOT NULL,
  name TEXT,
  size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Typing indicators (ephemeral, can use Redis instead)
CREATE TABLE typing_indicators (
  channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (channel_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_messages_channel ON chat_messages(channel_id, created_at DESC);
CREATE INDEX idx_messages_sender ON chat_messages(sender_id);
CREATE INDEX idx_reactions_message ON message_reactions(message_id);
CREATE INDEX idx_participants_user ON channel_participants(user_id);
```

---

## 🎯 Επόμενα Βήματα

### Άμεσες Βελτιώσεις

- [ ] **File Upload**: Drag & drop για αρχεία και εικόνες
- [ ] **Voice Messages**: Ηχογραφήσεις
- [ ] **Message Search**: Full-text search σε μηνύματα
- [ ] **Mentions**: @username για mentions
- [ ] **Threads**: Απαντήσεις σε συγκεκριμένα μηνύματα

### Advanced Features

- [ ] **Video/Voice Calls**: WebRTC integration
- [ ] **Screen Sharing**: Για technical support
- [ ] **Message Forwarding**: Προώθηση μηνυμάτων
- [ ] **Pinned Messages**: Pin σημαντικά μηνύματα
- [ ] **Read Receipts**: Δείτε ποιος διάβασε
- [ ] **Message Scheduling**: Προγραμματισμός αποστολής
- [ ] **Rich Text Editor**: Bold, italic, links, code blocks
- [ ] **GIF Support**: Giphy integration
- [ ] **Custom Emojis**: Company-specific emojis

### Notifications

- [ ] **Push Notifications**: Browser push
- [ ] **Email Digests**: Daily/weekly summaries
- [ ] **Sound Notifications**: Custom sounds
- [ ] **Desktop Notifications**: OS-level notifications
- [ ] **Do Not Disturb**: Mute notifications

### Administration

- [ ] **Channel Permissions**: Role-based access
- [ ] **Message Moderation**: Delete/edit by admins
- [ ] **User Management**: Ban, mute, assign roles
- [ ] **Audit Logs**: Track all activities
- [ ] **Analytics**: Usage statistics

---

## 🔒 Ασφάλεια & Privacy

### Best Practices

1. **Authentication**: Μόνο εξουσιοδοτημένο προσωπικό
2. **Encryption**: End-to-end για sensitive channels
3. **Data Retention**: Πολιτική διαγραφής παλιών μηνυμάτων
4. **Rate Limiting**: Προστασία από spam
5. **Content Filtering**: Auto-moderation για inappropriate content

### GDPR Compliance

- Right to access data
- Right to delete data
- Data export functionality
- Consent management
- Privacy policy integration

---

## 📱 Mobile App

Για native mobile experience, δημιουργήστε React Native app:

```bash
# Create React Native app
npx react-native init CarWashTeamChat

# Reuse components από web
# Share business logic
# Add mobile-specific features:
# - Push notifications
# - Camera integration
# - Voice messages
# - Location sharing
```

---

## 🎨 Customization

### Themes

```typescript
// Light/Dark mode toggle
const [theme, setTheme] = useState("light");

// Custom colors per company
const companyTheme = {
  "AutoClean Premium": "#3B82F6",
  "SpeedWash Express": "#10B981",
};
```

### Branding

- Custom logo στο sidebar
- Company colors για channels
- Custom avatars
- Branded emojis

---

## 📞 Support

Για υποστήριξη ή ερωτήσεις:

- **Email**: support@carwashpro.com
- **Docs**: https://docs.carwashpro.com/team-chat
- **Community**: Discord server (coming soon)

---

**Enjoy seamless team communication! 💬✨**
