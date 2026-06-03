"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Zap, Tag, X } from "lucide-react";
import { useUIStore } from "@/store/uiStore";
import { useHabitStore } from "@/store/habitStore";

export function MobileFAB() {
  const [open, setOpen] = useState(false);
  const setNewHabitOpen = useUIStore((s) => s.setNewHabitOpen);
  const setNewCategoryOpen = useUIStore((s) => s.setNewCategoryOpen);
  const accentColor = useHabitStore((s) => s.settings?.accentColor) ?? "#7C3AED";

  function handleNewHabit() {
    setOpen(false);
    setNewHabitOpen(true);
  }

  function handleNewCategory() {
    setOpen(false);
    setNewCategoryOpen(true);
  }

  const menuItems = [
    { label: "New Category", icon: Tag,  action: handleNewCategory, color: "#10B981" },
    { label: "New Habit",    icon: Zap,  action: handleNewHabit,    color: accentColor },
  ];

  return (
    <div className="md:hidden">
      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="fab-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(2px)" }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu items */}
      <AnimatePresence>
        {open && menuItems.map(({ label, icon: Icon, action, color }, i) => (
          <motion.button
            key={label}
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 16 }}
            transition={{ duration: 0.2, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            onClick={action}
            className="fixed right-4 z-[61] flex items-center gap-3"
            style={{ bottom: `${130 + (menuItems.length - 1 - i) * 60}px` }}
          >
            {/* Label pill */}
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15, delay: i * 0.05 + 0.05 }}
              className="text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
              style={{
                background: "var(--glass-bg-elevated)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid var(--glass-border)",
                color: "var(--text-primary)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
              }}
            >
              {label}
            </motion.span>

            {/* Icon button */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: `${color}22`,
                border: `1.5px solid ${color}55`,
                boxShadow: `0 4px 16px ${color}30`,
                color,
              }}
            >
              <Icon size={20} />
            </div>
          </motion.button>
        ))}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        className="fixed right-4 z-[62] w-14 h-14 rounded-full flex items-center justify-center shadow-lg focus:outline-none"
        style={{
          bottom: "calc(88px + env(safe-area-inset-bottom, 0px))",
          background: accentColor,
          boxShadow: `0 4px 20px ${accentColor}55, 0 0 0 ${open ? "4px" : "0px"} ${accentColor}30`,
          transition: "box-shadow 0.2s ease",
        }}
        whileTap={{ scale: 0.93 }}
        aria-label={open ? "Close menu" : "Create new"}
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          <Plus size={24} color="#fff" />
        </motion.div>
      </motion.button>
    </div>
  );
}
