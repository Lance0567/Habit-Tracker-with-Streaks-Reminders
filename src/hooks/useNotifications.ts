"use client";

import { useEffect, useRef } from "react";
import { useHabitStore } from "@/store/habitStore";
import {
  scheduleReminders,
  scheduleProgramReminders,
  clearAllReminders,
  registerServiceWorker,
} from "@/lib/notifications";
import { getUserPrograms } from "@/lib/storage";
import { PROGRAMS } from "@/lib/programs";

export function useNotifications() {
  const habits = useHabitStore((s) => s.habits);
  const settings = useHabitStore((s) => s.settings);
  const isLoading = useHabitStore((s) => s.isLoading);
  const swRegistered = useRef(false);

  useEffect(() => {
    if (!swRegistered.current) {
      registerServiceWorker();
      swRegistered.current = true;
    }
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!settings?.notificationsEnabled) {
      clearAllReminders();
      return;
    }
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    scheduleReminders(habits);
    getUserPrograms()
      .then((ups) => scheduleProgramReminders(ups, PROGRAMS))
      .catch(() => {});
    return () => clearAllReminders();
  }, [habits, settings?.notificationsEnabled, isLoading]);
}
