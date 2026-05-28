"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Zap, Diamond } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { useUIStore } from "@/store/uiStore";

const MILESTONE_CONFIG: Record<number, {
  icon: React.ReactNode;
  color: string;
  title: string;
  subtitle: string;
}> = {
  7:   { icon: <Flame size={32} />,   color: "#F59E0B", title: "One Week!",          subtitle: "Seven days strong — you're building something real." },
  14:  { icon: <Zap size={32} />,     color: "#7C3AED", title: "Two Weeks!",         subtitle: "Consistency is your superpower. Keep going!" },
  30:  { icon: <Trophy size={32} />,  color: "#10B981", title: "One Month!",         subtitle: "A full month — this habit is part of who you are now." },
  100: { icon: <Diamond size={32} />, color: "#06B6D4", title: "Century Club!",      subtitle: "100 days. You are truly elite. Unstoppable." },
};

export function MilestoneModal() {
  const data = useUIStore((s) => s.milestoneModal);
  const setMilestoneModal = useUIStore((s) => s.setMilestoneModal);
  const close = () => setMilestoneModal(null);

  const config = data ? (MILESTONE_CONFIG[data.milestone] ?? MILESTONE_CONFIG[7]) : null;

  return (
    <AnimatePresence>
      {data && config && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
            onClick={close}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
          >
            <div
              className="pointer-events-auto w-full max-w-sm rounded-[var(--radius-xl)] p-8 flex flex-col items-center gap-6 text-center"
              style={{
                background: "rgba(8,5,22,0.97)",
                border: `1px solid ${config.color}30`,
                boxShadow: `0 0 0 1px ${config.color}15, 0 32px 80px rgba(0,0,0,0.8), 0 0 60px ${config.color}15`,
              }}
            >
              {/* Glow icon */}
              <motion.div
                className="w-20 h-20 rounded-2xl flex items-center justify-center"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  background: `${config.color}15`,
                  border: `1px solid ${config.color}30`,
                  boxShadow: `0 0 32px ${config.color}30`,
                  color: config.color,
                  filter: `drop-shadow(0 0 12px ${config.color})`,
                }}
              >
                {config.icon}
              </motion.div>

              {/* Milestone number */}
              <div>
                <p
                  className="text-7xl font-black tabular-nums leading-none"
                  style={{ color: config.color, filter: `drop-shadow(0 0 16px ${config.color}80)` }}
                >
                  {data.milestone}
                </p>
                <p className="text-sm text-white/40 mt-1 uppercase tracking-widest font-medium">
                  day streak
                </p>
              </div>

              {/* Text */}
              <div>
                <p className="text-xl font-bold text-white/90">{config.title}</p>
                <p className="text-sm text-white/45 mt-1.5 leading-relaxed">
                  <span className="text-white/65 font-medium">{data.habitName}</span>
                  {" — "}{config.subtitle}
                </p>
              </div>

              {/* Color accent bar */}
              <div
                className="w-16 h-1 rounded-full"
                style={{ background: `linear-gradient(90deg, transparent, ${config.color}, transparent)` }}
              />

              <GlassButton variant="primary" onClick={close} className="w-full">
                Keep it up! 🚀
              </GlassButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
