import { format, subDays } from "date-fns";
import { getDB } from "./db";
import { MOCK_HABITS, MOCK_CATEGORIES } from "./mockData";
import type { Habit, HabitLog, Category, AppSettings } from "@/types";

// ── Categories ────────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  return (await getDB()).getAll("categories");
}

export async function saveCategory(cat: Category): Promise<void> {
  await (await getDB()).put("categories", cat);
}

export async function deleteCategory(id: string): Promise<void> {
  await (await getDB()).delete("categories", id);
}

// ── Habits ────────────────────────────────────────────────────────────────────

export async function getAllHabits(): Promise<Habit[]> {
  return (await getDB()).getAll("habits");
}

export async function saveHabit(habit: Habit): Promise<void> {
  await (await getDB()).put("habits", habit);
}

export async function deleteHabit(id: string): Promise<void> {
  await (await getDB()).delete("habits", id);
}

// ── Logs ──────────────────────────────────────────────────────────────────────

export async function getAllLogs(): Promise<HabitLog[]> {
  return (await getDB()).getAll("logs");
}

export async function toggleLog(
  habitId: string,
  date: string
): Promise<{ action: "added" | "removed"; log?: HabitLog }> {
  const db = await getDB();
  const existing = await db.getAllFromIndex(
    "logs",
    "by-habit-date",
    IDBKeyRange.only([habitId, date])
  );
  if (existing.length > 0) {
    await db.delete("logs", existing[0].id);
    return { action: "removed" };
  }
  const newLog: HabitLog = {
    id: crypto.randomUUID(),
    habitId,
    date,
    completedCount: 1,
    completedAt: new Date().toISOString(),
  };
  await db.put("logs", newLog);
  return { action: "added", log: newLog };
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<AppSettings | null> {
  const db = await getDB();
  const s = await db.get("settings", "app");
  if (!s) return null;
  const { id: _id, ...settings } = s;
  return settings as AppSettings;
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await (await getDB()).put("settings", { ...settings, id: "app" });
}

// ── Seed ──────────────────────────────────────────────────────────────────────

export async function seedIfEmpty(): Promise<void> {
  const db = await getDB();
  if ((await db.count("habits")) > 0) return;

  for (const cat of MOCK_CATEGORIES) await db.put("categories", cat);
  for (const habit of MOCK_HABITS) await db.put("habits", habit);

  const rates: Record<string, number> = {
    h1: 0.78, h2: 0.92, h3: 0.85, h4: 0.6, h5: 0.45, h6: 0.71,
  };
  for (const habit of MOCK_HABITS) {
    const rate = rates[habit.id] ?? 0.7;
    for (let i = 1; i <= 90; i++) {
      if (Math.random() < rate) {
        const date = format(subDays(new Date(), i), "yyyy-MM-dd");
        await db.put("logs", {
          id: crypto.randomUUID(),
          habitId: habit.id,
          date,
          completedCount: 1,
          completedAt: new Date().toISOString(),
        });
      }
    }
  }

  await db.put("settings", {
    id: "app",
    notificationsEnabled: false,
    swRegistered: false,
    weekStartsOn: 0,
    defaultView: "grid",
    createdAt: new Date().toISOString(),
  });
}

// ── Data reset ────────────────────────────────────────────────────────────────

export async function clearAllData(): Promise<void> {
  const db = await getDB();
  await db.clear("habits");
  await db.clear("logs");
  await db.clear("categories");
  await db.clear("settings");
}

// ── Export / Import ───────────────────────────────────────────────────────────

export async function exportData(): Promise<string> {
  const [habits, logs, categories, settings] = await Promise.all([
    getAllHabits(),
    getAllLogs(),
    getAllCategories(),
    getSettings(),
  ]);
  return JSON.stringify({ habits, logs, categories, settings }, null, 2);
}

export async function importData(json: string): Promise<void> {
  const { habits, logs, categories, settings } = JSON.parse(json);
  await clearAllData();
  const db = await getDB();
  for (const h of habits ?? []) await db.put("habits", h);
  for (const l of logs ?? []) await db.put("logs", l);
  for (const c of categories ?? []) await db.put("categories", c);
  if (settings) await db.put("settings", { ...settings, id: "app" });
}
