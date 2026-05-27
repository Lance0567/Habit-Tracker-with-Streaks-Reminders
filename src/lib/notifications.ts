import type { Habit } from "@/types";
import { isHabitDueOnDate } from "./streaks";

type TimeoutHandle = ReturnType<typeof setTimeout>;
const scheduled = new Map<string, TimeoutHandle>();

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
