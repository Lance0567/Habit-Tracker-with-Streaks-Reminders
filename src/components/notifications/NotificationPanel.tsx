"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, Clock, X, ArrowRight, Compass } from "lucide-react";
import { useHabitStore } from "@/store/habitStore";
import { getIcon } from "@/lib/icons";
import { format } from "date-fns";
import Link from "next/link";
import { PROGRAMS } from "@/lib/programs";
import { getUserPrograms } from "@/lib/storage";
import { getProgramReminderTime, setProgramReminderTime } from "@/lib/notifications";
import type { UserProgram } from "@/types";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function NotificationPanel({ open, onClose }: Props) {
  const habits        = useHabitStore((s) => s.habits);
  const settings      = useHabitStore((s) => s.settings);
  const updateSettings = useHabitStore((s) => s.updateSettings);

  const todayDow      = new Date().getDay();
  const notificationsOn = settings?.notificationsEnabled ?? false;

  // Program reminders state
  const [programReminders, setProgramReminders] = useState<
    Array<{ enrollment: UserProgram; programTitle: string; programEmoji: string; time: string }>
  >([]);

  useEffect(() => {
    if (!open) return;
    getUserPrograms()
      .then((enrollments) => {
        const items = enrollments
          .filter((e) => !e.completedAt)
          .flatMap((e) => {
            const t = getProgramReminderTime(e.programId);
            if (!t) return [];
            const prog = PROGRAMS.find((p) => p.id === e.programId);
            if (!prog) return [];
            return [{ enrollment: e, programTitle: prog.title, programEmoji: prog.emoji, time: t }];
          });
        setProgramReminders(items);
      })
      .catch(() => {});
  }, [open]);

  function removeProgReminder(programId: string) {
    setProgramReminderTime(programId, null);
    setProgramReminders((prev) => prev.filter((r) => r.enrollment.programId !== programId));
  }

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
            <div
              className="overflow-hidden rounded-[var(--radius-lg)]"
              style={{
                background: "var(--popup-bg)",
                backdropFilter: "blur(32px)",
                WebkitBackdropFilter: "blur(32px)",
                border: "1px solid var(--popup-border)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.40), 0 0 0 1px var(--divider)",
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-4 py-3.5"
                style={{ borderBottom: "1px solid var(--divider)" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center"
                    style={{ background: "rgba(124,58,237,0.18)", color: "var(--color-accent-light)" }}
                  >
                    <Bell size={12} style={{ color: "var(--color-accent-light)" }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Reminders
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {/* On/Off pill toggle */}
                  <button
                    onClick={toggleNotifications}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all"
                    style={
                      notificationsOn
                        ? {
                            background: "rgba(124,58,237,0.15)",
                            border: "1px solid rgba(124,58,237,0.35)",
                            color: "var(--color-accent-light)",
                          }
                        : {
                            background: "var(--glass-bg-subtle)",
                            border: "1px solid var(--glass-border)",
                            color: "var(--text-muted)",
                          }
                    }
                  >
                    {notificationsOn ? <Bell size={10} /> : <BellOff size={10} />}
                    {notificationsOn ? "On" : "Off"}
                  </button>

                  <button
                    onClick={onClose}
                    className="w-6 h-6 flex items-center justify-center rounded-md transition-colors"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {/* Body */}
              {upcoming.length === 0 ? (
                /* Empty state */
                <div className="px-4 py-7 flex flex-col items-center gap-3">
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center"
                      style={{
                        background: "var(--glass-bg-subtle)",
                        border: "1px solid var(--glass-border)",
                      }}
                    >
                      <Bell size={20} style={{ color: "var(--color-accent-light)", opacity: 0.7 }} />
                    </div>
                    <div
                      className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{
                        background: "var(--color-accent)",
                        border: "2px solid var(--glass-bg-elevated)",
                      }}
                    >
                      <span style={{ fontSize: 7, color: "#fff", fontWeight: 700 }}>0</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      No reminders for today
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                      Add a reminder by editing any habit
                    </p>
                  </div>

                  <Link
                    href="/habits"
                    onClick={onClose}
                    className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-80"
                    style={{
                      background: "var(--color-accent)",
                      color: "#fff",
                    }}
                  >
                    Go to Habits <ArrowRight size={11} />
                  </Link>
                </div>
              ) : (
                /* Reminder list */
                <div className="max-h-72 overflow-y-auto">
                  <ul className="py-1.5">
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
                            opacity: isPast ? 0.5 : 1,
                            borderBottom: "1px solid var(--divider)",
                          }}
                        >
                          <span
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                              background: `${habit.color}18`,
                              border: `1px solid ${habit.color}30`,
                              color: habit.color,
                            }}
                          >
                            <Icon size={15} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-medium truncate"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {habit.name}
                            </p>
                            <p
                              className="flex items-center gap-1 mt-0.5"
                              style={{ fontSize: 10, color: "var(--text-muted)" }}
                            >
                              <Clock size={9} />
                              {format(fireDate, "h:mm a")}
                            </p>
                          </div>
                          {/* Status badge */}
                          <span
                            className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                            style={
                              isPast
                                ? {
                                    background: "var(--glass-bg-subtle)",
                                    color: "var(--text-muted)",
                                    border: "1px solid var(--divider)",
                                  }
                                : {
                                    background: "rgba(16,185,129,0.15)",
                                    color: "#10B981",
                                    border: "1px solid rgba(16,185,129,0.25)",
                                  }
                            }
                          >
                            {isPast ? "done" : "upcoming"}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Program reminders section */}
                  {programReminders.length > 0 && (
                    <>
                      <div
                        className="flex items-center gap-1.5 px-4 py-2"
                        style={{ borderTop: "1px solid var(--divider)", background: "var(--glass-bg-subtle)" }}
                      >
                        <Compass size={10} style={{ color: "var(--text-muted)" }} />
                        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                          Plans
                        </p>
                      </div>
                      {programReminders.map((r) => {
                        const [hh, mm] = r.time.split(":").map(Number);
                        const fireDate = new Date();
                        fireDate.setHours(hh, mm, 0, 0);
                        const isPast = fireDate < new Date();
                        return (
                          <div
                            key={r.enrollment.programId}
                            className="flex items-center gap-3 px-4 py-2.5"
                            style={{ opacity: isPast ? 0.5 : 1, borderBottom: "1px solid var(--divider)" }}
                          >
                            <span className="text-lg flex-shrink-0">{r.programEmoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate" style={{ color: "var(--text-primary)" }}>
                                {r.programTitle}
                              </p>
                              <p className="flex items-center gap-1 mt-0.5" style={{ fontSize: 10, color: "var(--text-muted)" }}>
                                <Clock size={9} /> {format(fireDate, "h:mm a")}
                              </p>
                            </div>
                            <button
                              onClick={() => removeProgReminder(r.enrollment.programId)}
                              className="w-5 h-5 flex items-center justify-center rounded-md flex-shrink-0 transition-colors"
                              style={{ color: "var(--text-muted)" }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                              title="Remove reminder"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
