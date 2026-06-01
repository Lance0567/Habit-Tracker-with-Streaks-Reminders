"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { addDays, format, startOfDay, isBefore } from "date-fns";
import { ArrowLeft, Check, Lock, Play, Trophy, RotateCcw, ChevronDown, Calendar, Bookmark, AlertTriangle, Bell, BellOff } from "lucide-react";
import { PROGRAMS, totalTasks } from "@/lib/programs";
import {
  getUserProgram,
  getUserPrograms,
  enrollProgram,
  updateProgramProgress,
  unenrollProgram,
  getSavedPrograms,
  saveProgram,
  unsaveProgram,
} from "@/lib/storage";
import { getProgramReminderTime, setProgramReminderTime, scheduleProgramReminders } from "@/lib/notifications";
import { Spinner } from "@/components/ui/Spinner";
import type { UserProgram } from "@/types";

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "#10B981",
  Medium:   "#F59E0B",
  Hard:     "#F43F5E",
};

function ProgramDetailContent() {
  const params = useParams();
  const id = params.id as string;
  const fromParam = useSearchParams().get("from");
  const backHref = `/explore?tab=programs${fromParam ? `&plans=${fromParam}` : ""}`;
  const program = PROGRAMS.find((p) => p.id === id) ?? null;

  const [enrollment, setEnrollment] = useState<UserProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(1);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [reminderTime, setReminderTime] = useState<string | null>(null);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [pickerValue, setPickerValue] = useState("09:00");
  const prevActive = useRef(1);

  useEffect(() => {
    if (!program) { setLoading(false); return; }
    getUserProgram(program.id)
      .then((e) => setEnrollment(e))
      .catch(() => {})
      .finally(() => setLoading(false));
    getSavedPrograms().then((ids) => setSaved(ids.includes(program.id))).catch(() => {});
    setReminderTime(getProgramReminderTime(program.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program?.id]);

  async function toggleSaved() {
    if (!program) return;
    const next = !saved;
    setSaved(next);
    try {
      if (next) await saveProgram(program.id);
      else await unsaveProgram(program.id);
    } catch {
      setSaved(!next); // revert on failure
    }
  }

  // ── Derived progress ──────────────────────────────────────────────────────
  const completedSet = new Set(enrollment?.completedTasks ?? []);
  const key = (d: number, t: string) => `${d}:${t}`;
  const isDayDone = (d: number) =>
    !!program && program.days[d - 1].tasks.every((t) => completedSet.has(key(d, t.id)));

  // activeDay = first incomplete day whose scheduled date has arrived.
  // Falls back to the last unlocked day when all unlocked days are done.
  let activeDay = 1;
  if (program && enrollment) {
    let found = false;
    for (let d = 1; d <= program.duration; d++) {
      if (!isDayDone(d) && dayIsUnlocked(d)) { activeDay = d; found = true; break; }
    }
    if (!found) {
      for (let d = program.duration; d >= 1; d--) {
        if (dayIsUnlocked(d)) { activeDay = d; break; }
      }
    }
  }
  const allDone = !!program && enrollment != null && program.days.every((d) => isDayDone(d.day));
  const doneCount = enrollment?.completedTasks.length ?? 0;
  const total = program ? totalTasks(program) : 0;
  const progress = total ? Math.min(Math.round((doneCount / total) * 100), 100) : 0;

  // Scheduled date for a given day (day 1 = start date)
  const scheduledDate = (d: number) =>
    enrollment ? addDays(new Date(enrollment.startedAt), d - 1) : null;

  // A day is unlocked when its scheduled date has arrived (today >= that date)
  const dayIsUnlocked = (d: number) => {
    const sd = scheduledDate(d);
    if (!sd) return false;
    return !isBefore(startOfDay(new Date()), startOfDay(sd));
  };

  // Days whose scheduled date has passed but aren't completed = behind schedule
  const missed = (enrollment && program && !allDone)
    ? program.days.filter((d) => {
        const sd = scheduledDate(d.day);
        return sd != null && !isDayDone(d.day) && isBefore(startOfDay(sd), startOfDay(new Date()));
      }).length
    : 0;

  // Align selected day with active day on first load
  useEffect(() => {
    if (!loading && enrollment) { setSelectedDay(activeDay); prevActive.current = activeDay; }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Auto-advance when the active day completes
  useEffect(() => {
    if (activeDay > prevActive.current && selectedDay === prevActive.current) {
      setSelectedDay(activeDay);
      setExpandedTask(null);
    }
    prevActive.current = activeDay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  async function handleStart() {
    if (!program) return;
    const optimistic: UserProgram = {
      id: `temp-${program.id}`, programId: program.id,
      startedAt: new Date().toISOString(), currentDay: 1, completedTasks: [], completedAt: null,
    };
    setEnrollment(optimistic);
    setSelectedDay(1);
    try {
      const enrolled = await enrollProgram(program.id);
      setEnrollment(enrolled);
    } catch {
      setEnrollment(null);
    }
  }

  async function handleToggleTask(day: number, taskId: string) {
    if (!program || !enrollment) return;
    const k = key(day, taskId);
    const set = new Set(enrollment.completedTasks);
    if (set.has(k)) set.delete(k); else set.add(k);
    const completedTasks = Array.from(set);

    const dayDone = (d: number) => program.days[d - 1].tasks.every((t) => set.has(key(d, t.id)));
    let nextActive = program.duration;
    for (let d = 1; d <= program.duration; d++) { if (!dayDone(d)) { nextActive = d; break; } }
    const done = program.days.every((d) => dayDone(d.day));
    const completedAt = done ? (enrollment.completedAt ?? new Date().toISOString()) : null;

    setEnrollment({ ...enrollment, completedTasks, currentDay: nextActive, completedAt });
    await updateProgramProgress(program.id, completedTasks, nextActive, completedAt);
  }

  async function handleReset() {
    if (!program) return;
    setEnrollment(null);
    setSelectedDay(1);
    await unenrollProgram(program.id);
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!program) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Program not found.</p>
        <Link href={backHref} className="text-sm font-semibold mt-3 inline-block" style={{ color: "var(--color-accent-light)" }}>
          ← Back to Explore
        </Link>
      </div>
    );
  }

  const diffColor = DIFFICULTY_COLOR[program.difficulty];
  const selectedDayData = program.days[selectedDay - 1];
  const selectedDayUnlocked = enrollment != null && dayIsUnlocked(selectedDay);
  const selectedDoneCount = selectedDayData
    ? selectedDayData.tasks.filter((t) => completedSet.has(key(selectedDay, t.id))).length
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
      >
        <ArrowLeft size={15} /> Explore
      </Link>

      {/* Header */}
      <div
        className="relative overflow-hidden rounded-3xl px-6 py-6"
        style={{ background: `linear-gradient(135deg, ${program.color}26 0%, ${program.color}0A 70%, var(--glass-bg-subtle) 100%)`, border: `1px solid ${program.color}26` }}
      >
        {/* Header action buttons — bell + bookmark */}
        <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
          {/* Reminder bell */}
          <div className="relative">
            <button
              onClick={() => {
                if (reminderTime) {
                  setProgramReminderTime(program.id, null);
                  setReminderTime(null);
                } else {
                  setShowReminderPicker(true);
                }
              }}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={
                reminderTime
                  ? { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.40)", color: "var(--color-accent)", backdropFilter: "blur(12px)" }
                  : { background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)", color: "var(--text-muted)", backdropFilter: "blur(12px)" }
              }
              aria-label={reminderTime ? `Reminder set at ${reminderTime} — click to remove` : "Set daily reminder"}
              title={reminderTime ? `Reminder at ${reminderTime} — click to remove` : "Set daily reminder"}
            >
              {reminderTime ? <Bell size={15} /> : <BellOff size={15} />}
            </button>

            {showReminderPicker && (
              <div
                className="absolute top-11 right-0 z-20 rounded-xl p-3 flex flex-col gap-2"
                style={{ background: "var(--popup-bg)", border: "1px solid var(--popup-border)", boxShadow: "0 8px 32px rgba(0,0,0,0.35)", minWidth: 168 }}
              >
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>Daily reminder time</p>
                <input
                  type="time"
                  value={pickerValue}
                  onChange={(e) => setPickerValue(e.target.value)}
                  className="w-full rounded-lg px-2 py-1 text-xs font-mono outline-none"
                  style={{ background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }}
                />
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setShowReminderPicker(false)}
                    className="flex-1 text-[11px] py-1 rounded-lg"
                    style={{ background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}
                  >Cancel</button>
                  <button
                    onClick={() => {
                      setProgramReminderTime(program.id, pickerValue);
                      setReminderTime(pickerValue);
                      setShowReminderPicker(false);
                      getUserPrograms()
                        .then((ups) => scheduleProgramReminders(ups, PROGRAMS))
                        .catch(() => {});
                    }}
                    className="flex-1 text-[11px] py-1 rounded-lg font-semibold"
                    style={{ background: "var(--color-accent)", color: "#fff" }}
                  >Set</button>
                </div>
              </div>
            )}
          </div>

          {/* Bookmark toggle */}
          <button
            onClick={toggleSaved}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={
              saved
                ? { background: `${program.color}1A`, border: `1px solid ${program.color}40`, color: program.color }
                : { background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }
            }
            aria-label={saved ? "Remove from saved" : "Save plan"}
            title={saved ? "Saved" : "Save for later"}
          >
            <Bookmark size={16} fill={saved ? program.color : "none"} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-3 flex-wrap pr-24">
          <span className="text-3xl">{program.emoji}</span>
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: `${program.color}18`, color: program.color, border: `1px solid ${program.color}30` }}>
            <Calendar size={11} /> {program.duration} days
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: `${diffColor}18`, color: diffColor, border: `1px solid ${diffColor}30` }}>
            {program.difficulty}
          </span>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{program.title}</h1>
        <p className="text-sm mt-2 leading-relaxed max-w-xl" style={{ color: "var(--text-secondary)" }}>
          {program.overview}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {program.habits.map((h) => (
            <span key={h} className="text-[11px] px-2 py-0.5 rounded-full"
              style={{ background: "var(--glass-bg-default)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}>
              {h}
            </span>
          ))}
        </div>

        {enrollment && (
          <div className="mt-4 max-w-md">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                {allDone ? "Completed" : `${doneCount} of ${total} tasks done`}
              </span>
              <span className="text-xs font-bold" style={{ color: program.color }}>{progress}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--glass-bg-elevated)" }}>
              <motion.div className="h-full rounded-full" style={{ background: program.color }}
                initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} />
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-10"><Spinner size={28} /></div>
      )}

      {/* Not enrolled */}
      {!loading && !enrollment && (
        <div className="flex flex-col items-center text-center gap-4 py-6">
          <p className="text-sm max-w-sm" style={{ color: "var(--text-secondary)" }}>
            This is a {program.duration}-day guided plan. Each day unlocks a few concrete tasks — complete them all to unlock the next day.
          </p>
          <div className="w-full max-w-md rounded-2xl p-4 text-left"
            style={{ background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
              Day 1 · {program.days[0]?.title}
            </p>
            <ul className="space-y-1.5">
              {program.days[0]?.tasks.map((t) => (
                <li key={t.id} className="text-sm flex gap-2" style={{ color: "var(--text-secondary)" }}>
                  <span style={{ color: program.color }}>•</span> {t.title}
                </li>
              ))}
            </ul>
          </div>
          <button onClick={handleStart}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: program.color, boxShadow: `0 0 24px ${program.color}50` }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
            <Play size={15} /> Start Program
          </button>
        </div>
      )}

      {/* Enrolled */}
      {!loading && enrollment && (
        <div className="space-y-5">
          {allDone && (
            <div className="flex flex-col items-center text-center gap-2 py-2">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: `${program.color}1A`, border: `2px solid ${program.color}50`, boxShadow: `0 0 28px ${program.color}40` }}>
                <Trophy size={26} style={{ color: program.color }} />
              </div>
              <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Program Complete! 🎉</h3>
              <p className="text-xs max-w-sm" style={{ color: "var(--text-secondary)" }}>
                You finished all {program.duration} days. That consistency is exactly how lasting habits are built.
              </p>
              <button onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium mt-1 transition-all"
                style={{ background: "var(--glass-bg-default)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}>
                <RotateCcw size={12} /> Restart Program
              </button>
            </div>
          )}

          {/* Missed-days counter (only when behind schedule) */}
          {missed > 0 && (
            <div className="rounded-2xl p-3" style={{ background: "rgba(244,63,94,0.06)" }}>
              <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3"
                style={{ border: "3px solid #F43F5E", background: "var(--glass-bg-subtle)" }}
              >
                <AlertTriangle size={18} style={{ color: "#F43F5E", flexShrink: 0 }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: "#F43F5E" }}>
                    {missed} day{missed > 1 ? "s" : ""} behind schedule
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                    Catch up on missed days to get back on track.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Day selector */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
              <Calendar size={12} /> Days
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
              {program.days.map((d) => {
                const done = isDayDone(d.day);
                const locked = !dayIsUnlocked(d.day);
                const selected = d.day === selectedDay;
                const sd = scheduledDate(d.day);
                const isMissed = sd != null && !done && isBefore(startOfDay(sd), startOfDay(new Date()));
                return (
                  <div key={d.day} className="flex flex-col items-center gap-1 flex-shrink-0">
                    <button
                      disabled={locked}
                      onClick={() => { setSelectedDay(d.day); setExpandedTask(null); }}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
                      style={
                        done
                          ? { background: program.color, color: "#fff", outline: selected ? "2px solid rgba(255,255,255,0.85)" : "none", outlineOffset: 2 }
                          : selected
                          ? { background: `${program.color}1A`, color: program.color, border: `1.5px solid ${program.color}` }
                          : isMissed
                          ? { background: "rgba(244,63,94,0.10)", color: "#F43F5E", border: "1.5px solid rgba(244,63,94,0.45)" }
                          : locked
                          ? { background: "var(--glass-bg-subtle)", color: "var(--text-muted)", opacity: 0.5, cursor: "not-allowed" }
                          : { background: "var(--glass-bg-default)", color: "var(--text-secondary)", border: "1px solid var(--glass-border)" }
                      }
                      aria-label={`Day ${d.day}${locked ? " (locked)" : done ? " (completed)" : ""}`}
                    >
                      {done ? <Check size={15} /> : locked ? <Lock size={12} /> : d.day}
                    </button>
                    {sd && (
                      <span className="text-[9px] font-medium whitespace-nowrap" style={{ color: isMissed ? "#F43F5E" : "var(--text-muted)" }}>
                        {format(sd, "MMM d")}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected day */}
          {selectedDayData && (
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--glass-bg-default)", border: "1px solid var(--glass-border)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: program.color }}>Day {selectedDay}</p>
                  <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{selectedDayData.title}</h3>
                </div>
                <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                  {selectedDoneCount} of {selectedDayData.tasks.length} done
                </span>
              </div>

              <div className="space-y-2">
                {selectedDayData.tasks.map((t) => {
                  const checked = completedSet.has(key(selectedDay, t.id));
                  const expanded = expandedTask === t.id;
                  return (
                    <div key={t.id} className="rounded-xl overflow-hidden transition-all"
                      style={{ background: checked ? `${program.color}0D` : "var(--glass-bg-subtle)", border: `1px solid ${checked ? `${program.color}30` : "var(--glass-border)"}` }}>
                      <div className="flex items-center gap-3 p-3">
                        <button
                          onClick={() => selectedDayUnlocked && handleToggleTask(selectedDay, t.id)}
                          disabled={!selectedDayUnlocked}
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                          style={checked
                            ? { background: program.color, color: "#fff" }
                            : { background: "transparent", border: "2px solid var(--glass-border-hover)", cursor: selectedDayUnlocked ? "pointer" : "not-allowed" }}
                          aria-label={checked ? "Mark task incomplete" : "Mark task complete"}
                        >
                          {checked && <Check size={13} />}
                        </button>
                        <button onClick={() => setExpandedTask(expanded ? null : t.id)} className="flex-1 flex items-center justify-between gap-2 text-left">
                          <span className="text-sm font-medium"
                            style={{ color: "var(--text-primary)", opacity: checked ? 0.6 : 1, textDecoration: checked ? "line-through" : "none" }}>
                            {t.title}
                          </span>
                          <ChevronDown size={15} style={{ color: "var(--text-muted)", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }} />
                        </button>
                      </div>
                      <AnimatePresence>
                        {expanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                            <p className="px-3 pb-3 pl-12 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{t.detail}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {!selectedDayUnlocked && (
                <p className="text-xs text-center mt-3 flex items-center justify-center gap-1.5" style={{ color: "var(--text-muted)" }}>
                  <Lock size={11} /> Finish the earlier days to unlock this one
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProgramDetailPage() {
  return (
    <Suspense>
      <ProgramDetailContent />
    </Suspense>
  );
}
