# HabitFlow

A modern, offline-first habit tracking web app built with Next.js 14. Track daily habits, visualize streaks, analyze completion trends, and stay consistent — all without a backend. Every byte of data lives in your browser's IndexedDB.

---

## Features

- **Habit management** — Create habits with custom frequency (daily, weekdays, weekends, or specific days), icon, color, category, and description
- **One-tap check-in** — Animated check-in button with per-habit color theming and card-hover encouragement glow
- **Streaks & milestones** — Current and longest streak tracking with celebration modals on milestone achievements
- **Activity heatmap** — GitHub-style 52-week heatmap per habit with hover tooltips showing daily completion count
- **Analytics dashboard** — Completion rate charts (7d / 30d / 90d), streak history, category breakdown, and trend lines powered by Recharts
- **Reminders** — Per-habit push notification reminders at custom times and days via the Web Push / Service Worker API
- **Categories** — Color-coded categories for grouping and filtering habits
- **Grid / List view** — Switch between card grid and compact list layout; preference persists via settings
- **Responsive layout** — Collapsible sidebar on desktop, fixed bottom nav on mobile
- **Offline-first** — All data persisted in IndexedDB (no account, no server, no network required)
- **Data portability** — Export all data as JSON and re-import at any time
- **PWA-ready** — Service worker included for offline access

---

## Tech Stack

| Layer | Library |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18, Tailwind CSS 3, Framer Motion 12 |
| Icons | Lucide React |
| Charts | Recharts 2 |
| State | Zustand 5 |
| Storage | IndexedDB via `idb` |
| Date logic | date-fns 4 |
| Language | TypeScript 5 |
| Testing | Playwright |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/Lance0567/Habit-Tracker-with-Streaks-Reminders.git
cd Habit-Tracker-with-Streaks-Reminders

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app seeds 6 sample habits with 90 days of mock logs on first load so you can explore every feature immediately.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── dashboard/              # Today's overview + week bar
│   ├── habits/
│   │   ├── page.tsx            # Habit list (grid or list view)
│   │   ├── new/                # Create habit form
│   │   └── [id]/
│   │       ├── page.tsx        # Habit detail + heatmap
│   │       └── edit/           # Edit habit form
│   ├── analytics/              # Charts and trend analysis
│   ├── categories/             # Category CRUD
│   ├── settings/               # App preferences
│   └── layout.tsx              # Root shell (Sidebar, TopBar, BottomNav)
│
├── components/
│   ├── layout/                 # Sidebar, TopBar, BottomNav, AnimatedBackground
│   ├── habits/                 # HabitCard, HabitListItem, CheckInButton, StreakBadge …
│   ├── categories/             # CategoryFilter, CategoryForm
│   ├── calendar/               # HeatMap, HeatMapCell
│   ├── charts/                 # CompletionRateChart, StreakHistoryChart, TrendLineChart …
│   ├── notifications/          # NotificationBell, ReminderForm, PermissionPrompt
│   └── ui/                     # GlassCard, GlassButton, GlassInput, ProgressRing, Spinner …
│
├── store/
│   ├── habitStore.ts           # Zustand store (habits, logs, categories, settings)
│   └── uiStore.ts              # UI state (sidebar, toasts, modals)
│
├── hooks/                      # useHabits, useAnalytics, useCategories, useNotifications …
├── lib/                        # analytics, streaks, storage (IndexedDB), notifications
└── types/                      # TypeScript interfaces
```

---

## Data Models

### Habit
```ts
{
  id: string
  name: string
  description?: string
  categoryId?: string
  icon: string               // lucide icon name
  color: string              // hex color
  frequency: "daily" | "weekdays" | "weekends" | "custom"
  customDays?: number[]      // 0 = Sun … 6 = Sat
  targetCount: number
  unit: string               // "times", "minutes", etc.
  reminders: Reminder[]
  archived: boolean
  createdAt: string
  updatedAt: string
}
```

### HabitLog
```ts
{
  id: string
  habitId: string
  date: string               // "YYYY-MM-DD" local time
  completedCount: number
  note?: string
  completedAt: string        // ISO timestamp
}
```

### AppSettings
```ts
{
  notificationsEnabled: boolean
  weekStartsOn: 0 | 1        // 0 = Sunday, 1 = Monday
  defaultView: "grid" | "list"
  createdAt: string
}
```

---

## Design System

The UI is built on a **glass morphism** design language:

- **Background:** deep space dark (`#050510`)
- **Surfaces:** frosted glass layers (`rgba(255,255,255,0.06)` with `backdrop-filter: blur`)
- **Accent:** violet (`#7C3AED`) with glow effects
- **Secondary accents:** cyan (`#06B6D4`), emerald (`#10B981`), amber (`#F59E0B`), rose (`#F43F5E`)
- **Animations:** Framer Motion for page transitions, check-in pulse, milestone modals, and sidebar collapse

---

## Storage

All data is stored **client-side only** in IndexedDB under the database name `habitflow-db` with four object stores: `habits`, `logs`, `categories`, and `settings`. No data is ever sent to a server.

You can export a full JSON backup or reset all data from **Settings → Data Management**.

---

## License

MIT
