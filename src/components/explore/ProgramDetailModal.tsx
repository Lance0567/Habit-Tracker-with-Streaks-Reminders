"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Lock, Play, Trophy, RotateCcw, ChevronDown } from "lucide-react";
import { totalTasks, type Program } from "@/lib/programs";
import type { UserProgram } from "@/types";

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "#10B981",
  Medium:   "#F59E0B",
  Hard:     "#F43F5E",
};

interface Props {
  program: Program | null;
  enrollment?: UserProgram;
  open: boolean;
  onClose: () => void;
  onStart: () => void;
  onToggleTask: (day: number, taskId: string) => void;
  onReset: () => void;
}

export function ProgramDetailModal({
  program,
  enrollment,
  open,
  onClose,
  onStart,
  onToggleTask,
  onReset,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const prevActive = useRef(1);

  // ── Derived progress ──────────────────────────────────────────────────────
  const completedSet = new Set(enrollment?.completedTasks ?? []);
  const key = (d: number, t: string) => `${d}:${t}`;
  const isDayDone = (d: number) =>
    !!program && program.days[d - 1].tasks.every((t) => completedSet.has(key(d, t.id)));

  let activeDay = program?.duration ?? 1;
  if (program) {
    for (let d = 1; d <= program.duration; d++) {
      if (!isDayDone(d)) { activeDay = d; break; }
    }
  }
  const allDone = !!program && enrollment != null && program.days.every((d) => isDayDone(d.day));
  const doneCount = enrollment?.completedTasks.length ?? 0;
  const total = program ? totalTasks(program) : 0;
  const progress = total ? Math.min(Math.round((doneCount / total) * 100), 100) : 0;

  // Reset selected day when opening or switching programs
  useEffect(() => {
    if (open) {
      setSelectedDay(activeDay);
      setExpandedTask(null);
      prevActive.current = activeDay;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, program?.id]);

  // Auto-advance to the next day when the active day gets completed
  useEffect(() => {
    if (activeDay > prevActive.current && selectedDay === prevActive.current) {
      setSelectedDay(activeDay);
      setExpandedTask(null);
    }
    prevActive.current = activeDay;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDay]);

  // Esc + scroll lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!program) return null;

  const diffColor = DIFFICULTY_COLOR[program.difficulty];
  const selectedDayData = program.days[selectedDay - 1];
  const selectedDayUnlocked = selectedDay <= activeDay;
  const selectedDoneCount = selectedDayData
    ? selectedDayData.tasks.filter((t) => completedSet.has(key(selectedDay, t.id))).length
    : 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            className="relative w-full max-w-2xl rounded-[var(--radius-xl)] overflow-hidden flex flex-col max-h-[88vh]"
            style={{
              background: "var(--popup-bg)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              border: "1px solid var(--popup-border)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            }}
            initial={{ scale: 0.94, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg transition-all"
              style={{ background: "var(--glass-bg-subtle)", color: "var(--text-muted)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div
              className="relative px-6 pt-6 pb-5 flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${program.color}26 0%, ${program.color}0A 70%, transparent 100%)` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{program.emoji}</span>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${program.color}18`, color: program.color, border: `1px solid ${program.color}30` }}>
                    {program.duration} days
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${diffColor}18`, color: diffColor, border: `1px solid ${diffColor}30` }}>
                    {program.difficulty}
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold pr-8" style={{ color: "var(--text-primary)" }}>{program.title}</h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
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
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      {allDone ? "Completed" : `${doneCount} of ${total} tasks done`}
                    </span>
                    <span className="text-xs font-bold" style={{ color: program.color }}>{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--glass-bg-elevated)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: program.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Not enrolled */}
              {!enrollment && (
                <div className="flex flex-col items-center text-center gap-4 py-6">
                  <p className="text-sm max-w-sm" style={{ color: "var(--text-secondary)" }}>
                    This is a {program.duration}-day guided plan. Each day unlocks a few concrete tasks — complete them all to unlock the next day.
                  </p>
                  <div className="w-full rounded-2xl p-4 text-left"
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
                  <button onClick={onStart}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: program.color, boxShadow: `0 0 24px ${program.color}50` }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
                    <Play size={15} /> Start Program
                  </button>
                </div>
              )}

              {/* Enrolled */}
              {enrollment && (
                <div className="space-y-5">
                  {/* Completion banner */}
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
                      <button onClick={onReset}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium mt-1 transition-all"
                        style={{ background: "var(--glass-bg-default)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}>
                        <RotateCcw size={12} /> Restart Program
                      </button>
                    </div>
                  )}

                  {/* Day selector */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
                      Days
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
                      {program.days.map((d) => {
                        const done     = isDayDone(d.day);
                        const locked   = d.day > activeDay;
                        const selected = d.day === selectedDay;
                        return (
                          <button
                            key={d.day}
                            disabled={locked}
                            onClick={() => { setSelectedDay(d.day); setExpandedTask(null); }}
                            className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all"
                            style={
                              done
                                ? { background: program.color, color: "#fff", outline: selected ? `2px solid ${program.color}` : "none", outlineOffset: 2 }
                                : selected
                                ? { background: `${program.color}1A`, color: program.color, border: `1.5px solid ${program.color}` }
                                : locked
                                ? { background: "var(--glass-bg-subtle)", color: "var(--text-muted)", opacity: 0.5, cursor: "not-allowed" }
                                : { background: "var(--glass-bg-default)", color: "var(--text-secondary)", border: "1px solid var(--glass-border)" }
                            }
                            aria-label={`Day ${d.day}${locked ? " (locked)" : done ? " (completed)" : ""}`}
                          >
                            {done ? <Check size={15} /> : locked ? <Lock size={12} /> : d.day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Selected day panel */}
                  {selectedDayData && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: program.color }}>
                            Day {selectedDay}
                          </p>
                          <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{selectedDayData.title}</h3>
                        </div>
                        <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                          {selectedDoneCount} of {selectedDayData.tasks.length} done
                        </span>
                      </div>

                      <div className="space-y-2">
                        {selectedDayData.tasks.map((t) => {
                          const checked  = completedSet.has(key(selectedDay, t.id));
                          const expanded = expandedTask === t.id;
                          return (
                            <div
                              key={t.id}
                              className="rounded-xl overflow-hidden transition-all"
                              style={{
                                background: checked ? `${program.color}0D` : "var(--glass-bg-default)",
                                border: `1px solid ${checked ? `${program.color}30` : "var(--glass-border)"}`,
                              }}
                            >
                              <div className="flex items-center gap-3 p-3">
                                {/* Check circle */}
                                <button
                                  onClick={() => selectedDayUnlocked && onToggleTask(selectedDay, t.id)}
                                  disabled={!selectedDayUnlocked}
                                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                                  style={
                                    checked
                                      ? { background: program.color, color: "#fff" }
                                      : { background: "transparent", border: "2px solid var(--glass-border-hover)", cursor: selectedDayUnlocked ? "pointer" : "not-allowed" }
                                  }
                                  aria-label={checked ? "Mark task incomplete" : "Mark task complete"}
                                >
                                  {checked && <Check size={13} />}
                                </button>

                                {/* Title — clicking expands */}
                                <button
                                  onClick={() => setExpandedTask(expanded ? null : t.id)}
                                  className="flex-1 flex items-center justify-between gap-2 text-left"
                                >
                                  <span
                                    className="text-sm font-medium"
                                    style={{ color: "var(--text-primary)", opacity: checked ? 0.6 : 1, textDecoration: checked ? "line-through" : "none" }}
                                  >
                                    {t.title}
                                  </span>
                                  <ChevronDown
                                    size={15}
                                    style={{ color: "var(--text-muted)", transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}
                                  />
                                </button>
                              </div>

                              <AnimatePresence>
                                {expanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                  >
                                    <p className="px-3 pb-3 pl-12 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                                      {t.detail}
                                    </p>
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
