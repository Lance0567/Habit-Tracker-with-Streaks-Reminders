"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, Clock, X, ArrowRight } from "lucide-react";
import { useHabitStore } from "@/store/habitStore";
import { getIcon } from "@/lib/icons";
import { format } from "date-fns";
import Link from "next/link";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PANEL_STYLE = {
  background: "rgba(8, 5, 22, 0.96)",
  backdropFilter: "blur(32px)",
  WebkitBackdropFilter: "blur(32px)",
  border: "1px solid rgba(124, 58, 237, 0.25)",
  boxShadow:
    "0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(124,58,237,0.07), inset 0 1px 0 rgba(255,255,255,0.05)",
};

export function NotificationPanel({ open, onClose }: Props) {
  const habits = useHabitStore((s) => s.habits);
  const settings = useHabitStore((s) => s.settings);
  const updateSettings = useHabitStore((s) => s.updateSettings);

  const todayDow = new Date().getDay();
  const notificationsOn = settings?.notificationsEnabled ?? false;

  const upcoming = habits
    .filter((h) => !h.archived)
    .flatMap((habit) =>
      habit.reminders
        .filter((r) => r.enabled && (r.days.length === 0 || r.days.includes(todayDow)))
        .map((r) => ({ habit, reminder: r }))
    )
    .sort((a, b) => a.reminder.time.localeCompare(b.reminder.time));

  async function toggleNotifications() {
    if (!settings) return;
    await updateSettings({ ...settings, notificationsEnabled: !notificationsOn });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-12 right-0 z-50 w-[300px]"
          >
            <div className="overflow-hidden rounded-[var(--radius-lg)]" style={PANEL_STYLE}>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3.5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(124,58,237,0.18)", color: "#A78BFA" }}>
                    <Bell size={12} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>
                    Reminders
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* On/Off pill toggle */}
                  <button
                    onClick={toggleNotifications}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
                    style={{
                      background: notificationsOn ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.06)",
                      border: `1px solid ${notificationsOn ? "rgba(124,58,237,0.4)" : "rgba(255,255,255,0.1)"}`,
                      color: notificationsOn ? "#A78BFA" : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {notificationsOn ? <Bell size={10} /> : <BellOff size={10} />}
                    {notificationsOn ? "On" : "Off"}
                  </button>

                  <button
                    onClick={onClose}
                    className="w-6 h-6 flex items-center justify-center rounded-md transition-colors hover:bg-white/10"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Body */}
              {upcoming.length === 0 ? (
                /* ── Empty state ── */
                <div className="px-4 py-7 flex flex-col items-center gap-3">
                  {/* Icon with glow ring */}
                  <div className="relative">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: "rgba(124,58,237,0.12)",
                        border: "1px solid rgba(124,58,237,0.2)",
                        boxShadow: "0 0 20px rgba(124,58,237,0.15)",
                      }}>
                      <Bell size={20} style={{ color: "rgba(167,139,250,0.6)" }} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{ background: "rgba(124,58,237,0.25)", border: "1px solid rgba(124,58,237,0.4)" }}>
                      <span style={{ fontSize: 8, color: "#A78BFA", fontWeight: 700 }}>0</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
                      No reminders for today
                    </p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                      Add a reminder by editing any habit
                    </p>
                  </div>

                  <Link
                    href="/habits"
                    onClick={onClose}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                    style={{
                      background: "rgba(124,58,237,0.15)",
                      border: "1px solid rgba(124,58,237,0.25)",
                      color: "#A78BFA",
                    }}
                  >
                    Go to Habits <ArrowRight size={11} />
                  </Link>
                </div>
              ) : (
                /* ── Reminder list ── */
                <ul className="py-1.5 max-h-64 overflow-y-auto">
                  {upcoming.map(({ habit, reminder }) => {
                    const Icon = getIcon(habit.icon);
                    const [hh, mm] = reminder.time.split(":").map(Number);
                    const fireDate = new Date();
                    fireDate.setHours(hh, mm, 0, 0);
                    const isPast = fireDate < new Date();

                    return (
                      <li
                        key={`${habit.id}:${reminder.id}`}
                        className="flex items-center gap-3 px-4 py-2.5 transition-colors"
                        style={{
                          opacity: isPast ? 0.4 : 1,
                          borderBottom: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <span
                          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${habit.color}18`, border: `1px solid ${habit.color}30`, color: habit.color }}
                        >
                          <Icon size={15} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate" style={{ color: "rgba(255,255,255,0.85)" }}>
                            {habit.name}
                          </p>
                          <p className="flex items-center gap-1 mt-0.5" style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>
                            <Clock size={9} />
                            {format(fireDate, "h:mm a")}
                          </p>
                        </div>
                        {/* Status badge */}
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{
                            background: isPast ? "rgba(255,255,255,0.06)" : "rgba(16,185,129,0.15)",
                            color: isPast ? "rgba(255,255,255,0.25)" : "#10B981",
                            border: `1px solid ${isPast ? "rgba(255,255,255,0.08)" : "rgba(16,185,129,0.25)"}`,
                          }}
                        >
                          {isPast ? "done" : "upcoming"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
