"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Lock, Play, Trophy, RotateCcw, ChevronRight } from "lucide-react";
import type { Program } from "@/lib/programs";
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
  onCompleteDay: () => void;
  onReset: () => void;
}

export function ProgramDetailModal({
  program,
  enrollment,
  open,
  onClose,
  onStart,
  onCompleteDay,
  onReset,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);

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

  // Scroll the active day into view when the modal opens
  useEffect(() => {
    if (open && activeRef.current) {
      setTimeout(() => activeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" }), 250);
    }
  }, [open, enrollment?.currentDay]);

  if (!program) return null;

  const isCompleted = !!enrollment?.completedAt;
  const inProgress  = !!enrollment && !isCompleted;
  const currentDay  = enrollment?.currentDay ?? 0;
  const doneDays    = isCompleted ? program.duration : Math.max(0, currentDay - 1);
  const progress    = Math.round((doneDays / program.duration) * 100);
  const diffColor   = DIFFICULTY_COLOR[program.difficulty];

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
            {/* Close button */}
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

            {/* Header band */}
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

              {/* Suggested habits */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {program.habits.map((h) => (
                  <span key={h} className="text-[11px] px-2 py-0.5 rounded-full"
                    style={{ background: "var(--glass-bg-default)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}>
                    {h}
                  </span>
                ))}
              </div>

              {/* Progress bar (only when enrolled) */}
              {enrollment && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      {isCompleted ? "Completed" : `Day ${currentDay} of ${program.duration}`}
                    </span>
                    <span className="text-xs font-bold" style={{ color: program.color }}>{progress}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--glass-bg-elevated)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: program.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
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
                    This is a {program.duration}-day guided program. Each day unlocks one concrete task — complete it to unlock the next.
                  </p>
                  <div
                    className="w-full rounded-2xl p-4 text-left"
                    style={{ background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)" }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                      Day 1 preview
                    </p>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{program.days[0]?.title}</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{program.days[0]?.task}</p>
                  </div>
                  <button
                    onClick={onStart}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: program.color, boxShadow: `0 0 24px ${program.color}50` }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  >
                    <Play size={15} /> Start Program
                  </button>
                </div>
              )}

              {/* Completed celebration */}
              {isCompleted && (
                <div className="flex flex-col items-center text-center gap-3 py-6">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: `${program.color}1A`, border: `2px solid ${program.color}50`, boxShadow: `0 0 32px ${program.color}40` }}
                  >
                    <Trophy size={30} style={{ color: program.color }} />
                  </div>
                  <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>Program Complete! 🎉</h3>
                  <p className="text-sm max-w-sm" style={{ color: "var(--text-secondary)" }}>
                    You finished all {program.duration} days of {program.title}. That consistency is exactly how lasting habits are built.
                  </p>
                  <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium mt-1 transition-all"
                    style={{ background: "var(--glass-bg-default)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${program.color}40`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--glass-border)"; }}
                  >
                    <RotateCcw size={13} /> Restart Program
                  </button>
                </div>
              )}

              {/* In-progress timeline */}
              {inProgress && (
                <div className="space-y-2">
                  {program.days.map((d) => {
                    const done    = d.day < currentDay;
                    const active  = d.day === currentDay;
                    const locked  = d.day > currentDay;

                    return (
                      <div
                        key={d.day}
                        ref={active ? activeRef : undefined}
                        className="flex gap-3 rounded-xl p-3 transition-all"
                        style={
                          active
                            ? { background: `${program.color}12`, border: `1px solid ${program.color}40` }
                            : { background: "transparent", border: "1px solid transparent" }
                        }
                      >
                        {/* Status dot */}
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={
                            done
                              ? { background: `${program.color}20`, color: program.color }
                              : active
                              ? { background: program.color, color: "#fff", boxShadow: `0 0 12px ${program.color}60` }
                              : { background: "var(--glass-bg-subtle)", color: "var(--text-muted)" }
                          }
                        >
                          {done ? <Check size={14} /> : locked ? <Lock size={12} /> : <span className="text-xs font-bold">{d.day}</span>}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: active ? program.color : "var(--text-muted)" }}>
                              Day {d.day}
                            </span>
                          </div>
                          <p
                            className="text-sm font-semibold"
                            style={{ color: locked ? "var(--text-muted)" : "var(--text-primary)", opacity: done ? 0.6 : 1 }}
                          >
                            {d.title}
                          </p>

                          {active && (
                            <>
                              <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-secondary)" }}>{d.task}</p>
                              <button
                                onClick={onCompleteDay}
                                className="flex items-center gap-1.5 mt-3 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                                style={{ background: program.color, boxShadow: `0 0 16px ${program.color}40` }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                              >
                                {d.day === program.duration ? "Finish Program" : `Complete Day ${d.day}`}
                                <ChevronRight size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
