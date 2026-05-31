// Cloud storage layer — replaces IndexedDB with Supabase.
// All public function signatures are identical to the previous idb version
// so habitStore.ts requires minimal changes.

import { createClient } from "@/lib/supabase";
import type { Habit, HabitLog, Category, AppSettings, UserProgram } from "@/types";

// ── Row mappers (snake_case DB → camelCase TS) ───────────────────────────────


function rowToCategory(row: any): Category {
  return {
    id:        row.id,
    name:      row.name,
    color:     row.color,
    icon:      row.icon,
    createdAt: row.created_at,
  };
}


function rowToHabit(row: any): Habit {
  return {
    id:          row.id,
    name:        row.name,
    description: row.description,
    categoryId:  row.category_id,
    icon:        row.icon,
    color:       row.color,
    frequency:   row.frequency,
    customDays:  row.custom_days ?? undefined,
    targetCount: row.target_count,
    unit:        row.unit,
    reminders:   row.reminders ?? [],
    archived:    row.archived,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
  };
}


function rowToLog(row: any): HabitLog {
  return {
    id:             row.id,
    habitId:        row.habit_id,
    date:           row.date,
    completedCount: row.completed_count,
    note:           row.note ?? undefined,
    completedAt:    row.completed_at,
  };
}


function rowToSettings(row: any): AppSettings {
  return {
    notificationsEnabled: row.notifications_enabled,
    swRegistered:         row.sw_registered,
    weekStartsOn:         row.week_starts_on,
    defaultView:          row.default_view,
    accentColor:          row.accent_color ?? undefined,
    theme:                row.theme ?? undefined,
    createdAt:            row.created_at,
  };
}

// Helper: returns the current user's UUID. Throws if unauthenticated.
async function getUserId(): Promise<string> {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return user.id;
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getAllCategories(): Promise<Category[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToCategory);
}

export async function saveCategory(cat: Category): Promise<void> {
  const userId = await getUserId();
  const supabase = createClient();
  const { error } = await supabase.from("categories").upsert({
    id:         cat.id,
    user_id:    userId,
    name:       cat.name,
    color:      cat.color,
    icon:       cat.icon,
    created_at: cat.createdAt,
  });
  if (error) throw error;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

// ── Habits ────────────────────────────────────────────────────────────────────

export async function getAllHabits(): Promise<Habit[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToHabit);
}

export async function saveHabit(habit: Habit): Promise<void> {
  const userId = await getUserId();
  const supabase = createClient();
  const { error } = await supabase.from("habits").upsert({
    id:           habit.id,
    user_id:      userId,
    name:         habit.name,
    description:  habit.description,
    category_id:  habit.categoryId,
    icon:         habit.icon,
    color:        habit.color,
    frequency:    habit.frequency,
    custom_days:  habit.customDays ?? null,
    target_count: habit.targetCount,
    unit:         habit.unit,
    reminders:    habit.reminders,
    archived:     habit.archived,
    created_at:   habit.createdAt,
    updated_at:   habit.updatedAt,
  });
  if (error) throw error;
}

export async function deleteHabit(id: string): Promise<void> {
  const supabase = createClient();
  // Remove logs first so orphaned records don't accumulate
  await supabase.from("habit_logs").delete().eq("habit_id", id);
  const { error } = await supabase.from("habits").delete().eq("id", id);
  if (error) throw error;
}

// ── Logs ──────────────────────────────────────────────────────────────────────

export async function getAllLogs(): Promise<HabitLog[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("habit_logs")
    .select("*")
    .order("date", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToLog);
}

export async function toggleLog(
  habitId: string,
  date: string
): Promise<{ action: "added" | "removed"; log?: HabitLog }> {
  const userId = await getUserId();
  const supabase = createClient();

  const { data: existing, error: fetchError } = await supabase
    .from("habit_logs")
    .select("id")
    .eq("habit_id", habitId)
    .eq("date", date)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    const { error } = await supabase
      .from("habit_logs")
      .delete()
      .eq("id", existing.id);
    if (error) throw error;
    return { action: "removed" };
  }

  const newLog: HabitLog = {
    id:             crypto.randomUUID(),
    habitId,
    date,
    completedCount: 1,
    completedAt:    new Date().toISOString(),
  };

  const { error } = await supabase.from("habit_logs").insert({
    id:              newLog.id,
    user_id:         userId,
    habit_id:        newLog.habitId,
    date:            newLog.date,
    completed_count: newLog.completedCount,
    completed_at:    newLog.completedAt,
  });
  if (error) throw error;

  return { action: "added", log: newLog };
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<AppSettings | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_settings")
    .select("*")
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return rowToSettings(data);
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const userId = await getUserId();
  const supabase = createClient();
  const { error } = await supabase.from("user_settings").upsert({
    user_id:               userId,
    notifications_enabled: settings.notificationsEnabled,
    sw_registered:         settings.swRegistered,
    week_starts_on:        settings.weekStartsOn,
    default_view:          settings.defaultView,
    accent_color:          settings.accentColor ?? null,
    theme:                 settings.theme ?? null,
    created_at:            settings.createdAt,
  });
  if (error) throw error;
}

// ── User Programs ─────────────────────────────────────────────────────────────

function rowToUserProgram(row: any): UserProgram {
  return {
    id:          row.id,
    programId:   row.program_id,
    startedAt:   row.started_at,
    currentDay:  row.current_day,
    completedAt: row.completed_at ?? null,
  };
}

export async function getUserPrograms(): Promise<UserProgram[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_programs")
    .select("*")
    .order("started_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(rowToUserProgram);
}

export async function enrollProgram(programId: string): Promise<UserProgram> {
  const userId = await getUserId();
  const supabase = createClient();
  const { data, error } = await supabase
    .from("user_programs")
    .insert({ user_id: userId, program_id: programId, current_day: 1 })
    .select()
    .single();
  if (error) throw error;
  return rowToUserProgram(data);
}

export async function updateProgramDay(programId: string, day: number): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("user_programs")
    .update({ current_day: day })
    .eq("program_id", programId);
  if (error) throw error;
}

export async function completeProgram(programId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("user_programs")
    .update({ completed_at: new Date().toISOString() })
    .eq("program_id", programId);
  if (error) throw error;
}

export async function unenrollProgram(programId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("user_programs")
    .delete()
    .eq("program_id", programId);
  if (error) throw error;
}

// ── Seed (no-op in cloud — kept for interface compatibility) ──────────────────

export async function seedIfEmpty(): Promise<void> {}

// ── Data reset ────────────────────────────────────────────────────────────────

export async function clearAllData(): Promise<void> {
  const supabase = createClient();
  // .neq("id", "") matches every row; RLS limits deletion to current user's rows.
  await Promise.all([
    supabase.from("habits").delete().neq("id", ""),
    supabase.from("habit_logs").delete().neq("id", ""),
    supabase.from("categories").delete().neq("id", ""),
    supabase.from("user_settings").delete().neq("user_id", ""),
  ]);
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
  const userId = await getUserId();
  const supabase = createClient();

  for (const h of habits ?? []) await saveHabit(h);
  for (const c of categories ?? []) await saveCategory(c);

  for (const l of logs ?? []) {
    await supabase.from("habit_logs").upsert({
      id:              l.id,
      user_id:         userId,
      habit_id:        l.habitId,
      date:            l.date,
      completed_count: l.completedCount,
      note:            l.note ?? null,
      completed_at:    l.completedAt,
    });
  }

  if (settings) await saveSettings(settings);
}
