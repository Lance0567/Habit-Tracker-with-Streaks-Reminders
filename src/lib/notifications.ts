import type { Habit, UserProgram } from "@/types";
import type { Program } from "@/lib/programs";
import { isHabitDueOnDate } from "./streaks";

type TimeoutHandle = ReturnType<typeof setTimeout>;
const scheduled = new Map<string, TimeoutHandle>();

// ── Program reminder localStorage helpers ────────────────────────────────────

export function getProgramReminderTime(programId: string): string | null {
  try {
    const stored = JSON.parse(localStorage.getItem("program-reminders") ?? "{}");
    return stored[programId] ?? null;
  } catch { return null; }
}

export function setProgramReminderTime(programId: string, time: string | null): void {
  try {
    const stored = JSON.parse(localStorage.getItem("program-reminders") ?? "{}");
    if (time === null) delete stored[programId]; else stored[programId] = time;
    localStorage.setItem("program-reminders", JSON.stringify(stored));
  } catch {}
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  return Notification.requestPermission();
}

export async function registerServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register("/sw.js");
  } catch (err) {
    console.error("[SW] registration failed:", err);
  }
}

function getNextFireTime(timeStr: string, days: number[]): Date | null {
  const [hh, mm] = timeStr.split(":").map(Number);
  const now = new Date();

  for (let offset = 0; offset < 7; offset++) {
    const candidate = new Date(now);
    candidate.setDate(now.getDate() + offset);
    candidate.setHours(hh, mm, 0, 0);

    const dow = candidate.getDay();
    const dayMatch = days.length === 0 || days.includes(dow);
    if (!dayMatch) continue;
    if (candidate > now) return candidate;
  }
  return null;
}

function fireNotification(habitName: string, habitId: string): void {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  new Notification(`Time for: ${habitName}`, {
    body: "Tap to mark it complete.",
    icon: "/icon-192.png",
    tag: `habit-${habitId}`,
    data: { url: "/dashboard" },
  });
}

export function scheduleReminders(habits: Habit[]): void {
  clearAllReminders();

  for (const habit of habits) {
    if (habit.archived) continue;
    for (const reminder of habit.reminders) {
      if (!reminder.enabled) continue;

      const fireAt = getNextFireTime(reminder.time, reminder.days);
      if (!fireAt) continue;
      if (!isHabitDueOnDate(habit, fireAt)) continue;

      const key = `${habit.id}:${reminder.id}`;
      const delay = fireAt.getTime() - Date.now();

      const handle = setTimeout(() => {
        fireNotification(habit.name, habit.id);
        scheduleReminders(habits);
      }, delay);

      scheduled.set(key, handle);
    }
  }
}

export function clearAllReminders(): void {
  Array.from(scheduled.values()).forEach((handle) => clearTimeout(handle));
  scheduled.clear();
}

// ── Program reminder scheduler ────────────────────────────────────────────────

export function scheduleProgramReminders(
  userPrograms: UserProgram[],
  programs: Program[]
): void {
  for (const up of userPrograms) {
    if (up.completedAt) continue;
    const reminderTime = getProgramReminderTime(up.programId);
    if (!reminderTime) continue;
    const program = programs.find((p) => p.id === up.programId);
    if (!program) continue;

    const [h, m] = reminderTime.split(":").map(Number);
    const fireAt = new Date();
    fireAt.setHours(h, m, 0, 0);
    if (fireAt <= new Date()) fireAt.setDate(fireAt.getDate() + 1);

    const key = `prog-${up.programId}`;
    const existing = scheduled.get(key);
    if (existing) clearTimeout(existing);

    scheduled.set(key, setTimeout(() => {
      if (!("Notification" in window) || Notification.permission !== "granted") return;
      new Notification(`📋 ${program.title}`, {
        body: `Day ${up.currentDay} of ${program.duration} — keep your streak going!`,
        icon: "/icon-192.png",
        tag: key,
        data: { url: `/explore/programs/${up.programId}` },
      });
    }, fireAt.getTime() - Date.now()));
  }
}
