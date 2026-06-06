# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Next.js, usually http://localhost:3000)
npm run build      # Production build — runs TypeScript checks
npm run lint       # ESLint
```

There are no automated tests beyond Playwright scripts (`debug_app.mjs`, `screenshot_*.mjs`) in the root — these are ad-hoc scripts, not a test suite.

## Architecture

**Next.js 14 App Router** with all routes under `src/app/`. Every interactive component uses `"use client"`. The app is deployed on Vercel; authentication is required for all routes except `/auth` and `/auth/signup`.

### Auth & Middleware

`src/middleware.ts` guards `/dashboard`, `/habits`, `/analytics`, `/categories`, `/settings` — redirects unauthenticated users to `/auth?next=<path>`. Authenticated users visiting `/auth` or `/` are redirected to `/dashboard`.

Auth uses **Supabase SSR** (`@supabase/ssr`):
- Browser client: `src/lib/supabase.ts` → `createClient()` (uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)
- Middleware client: `src/lib/supabase-server.ts` → `createMiddlewareClient(request, response)`

### Data Layer

All data lives in **Supabase** (no local IndexedDB for production — `src/lib/db.ts` is a legacy artifact). The storage API is in `src/lib/storage.ts`, which maps snake_case DB columns ↔ camelCase TypeScript types. All mutations call `getUserId()` to stamp `user_id` on rows; Supabase RLS handles row isolation.

DB tables: `habits`, `habit_logs`, `categories`, `user_settings`, `user_programs`, `saved_programs`.

### State Management

**Zustand** stores in `src/store/`:
- `habitStore` — habits, logs, categories, settings + all CRUD actions. `hydrate()` loads everything from Supabase on mount. `toggleLog` increments `completedCount` up to `targetCount`, then deletes the log on the next tap (toggle-cycle).
- `uiStore` — sidebar collapse, toasts, milestone modal state, new-habit modal state.

### Bootstrap Sequence

`AppShell` → `LayoutShell` conditionally wraps app routes with `StoreProvider`. `StoreProvider.useEffect` calls `hydrate()`, which populates both stores from Supabase. It also mounts `NotificationManager` (push notifications) and `MilestoneManager` (streak milestone modal).

### Hydration Pattern

Never use `new Date()` at render time in components — it causes React hydration mismatches (server UTC vs client local time). Use the `useLocalTime` hook (`src/hooks/useLocalTime.ts`), or pattern: `const [d, setD] = useState<Date | null>(null); useEffect(() => setD(new Date()), [])`.

### Key Lib Files

- `src/lib/streaks.ts` — `calculateCurrentStreak`, `getLongestStreak`, `isHabitDueOnDate`. Streak logic respects `habit.frequency` (daily / weekdays / weekends / custom).
- `src/lib/analytics.ts` — `getAggregateHeatMapData`, `getHeatMapData`, `getCompletionRate`, and chart data helpers used by the analytics page.
- `src/lib/programs.ts` — Static `PROGRAMS` array (curated multi-week challenges). Programs are static data; user progress is stored in `user_programs` via Supabase.
- `src/lib/themes.ts` — Theme token helpers.

### Milestone Modal

`src/hooks/useMilestoneDetector.ts` fires once per calendar day per (habit × milestone) threshold (7/14/30/100 days). Uses date-keyed localStorage (`"habitId:milestone:YYYY-MM-DD"`). Entries older than 7 days are pruned on each write.

### Design System

CSS custom properties in `src/app/globals.css` — tokens prefixed `--glass-*`, `--text-*`, `--heatmap-*`, `--color-accent`. Two themes (dark default, light) toggled via `data-theme` on `<html>`. Theme is read server-side from the `habitflow-theme` cookie to avoid flash-of-wrong-theme.

Components use Tailwind for layout/spacing and inline `style` for design-token colors. Framer Motion (`motion.*`) is used for all animations; wrap root in `<MotionConfig reducedMotion="user">` (already in `AppShell`).

### TypeScript Notes

- `tsconfig.json` targets ES2017 — `Set` is not iterable via spread. Use `Array.from(set)` instead of `[...set]`.
- Path alias `@/` maps to `src/`.
