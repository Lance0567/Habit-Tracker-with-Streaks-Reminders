"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput, GlassTextarea } from "@/components/ui/GlassInput";
import { Spinner } from "@/components/ui/Spinner";
import { FrequencySelector } from "@/components/habits/FrequencySelector";
import { CategoryFilter } from "@/components/categories/CategoryFilter";
import { ReminderForm } from "@/components/notifications/ReminderForm";
import { useHabitStore } from "@/store/habitStore";
import { useCategories } from "@/hooks/useCategories";
import { HABIT_COLORS } from "@/lib/constants";
import type { Habit, HabitFrequency, Reminder } from "@/types";

export default function EditHabitPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { habits, isLoading } = useHabitStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={32} />
      </div>
    );
  }

  const habit = habits.find((h) => h.id === id);

  if (!habit) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p style={{ color: "var(--text-muted)" }}>Habit not found.</p>
        <GlassButton variant="secondary" onClick={() => window.history.back()}>
          Go Back
        </GlassButton>
      </div>
    );
  }

  return <EditForm habit={habit} />;
}

function EditForm({ habit }: { habit: Habit }) {
  const router = useRouter();
  const { categories } = useCategories();
  const { updateHabit, deleteHabit } = useHabitStore();

  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description);
  const [color, setColor] = useState(habit.color);
  const [categoryId, setCategoryId] = useState<string | null>(habit.categoryId);
  const [frequency, setFrequency] = useState<HabitFrequency>(habit.frequency);
  const [customDays, setCustomDays] = useState(habit.customDays ?? []);
  const [reminders, setReminders] = useState<Reminder[]>(habit.reminders);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateHabit({
      ...habit,
      name: name.trim(),
      description: description.trim(),
      color,
      categoryId,
      frequency,
      customDays: frequency === "custom" ? customDays : undefined,
      reminders,
      updatedAt: new Date().toISOString(),
    });
    router.push(`/habits/${habit.id}`);
  };

  const handleDelete = async () => {
    await deleteHabit(habit.id);
    router.push("/habits");
  };

  return (
    <div className="max-w-xl space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <button
          onClick={() => router.back()}
          className="p-2 glass rounded-[var(--radius-md)] transition-all"
          style={{ color: "var(--text-muted)", border: "1px solid var(--glass-border)" }}
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Edit Habit</h2>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{habit.name}</p>
        </div>
      </motion.div>

      <GlassCard className="p-5 space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Basic Info</h3>
        <GlassInput label="Habit Name" value={name} onChange={(e) => setName(e.target.value)} maxLength={50} />
        <GlassTextarea label="Description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </GlassCard>

      <GlassCard className="p-5 space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Color</h3>
        <div className="flex flex-wrap gap-2">
          {HABIT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className="w-8 h-8 rounded-full border-2 transition-all duration-200"
              style={{
                backgroundColor: c,
                borderColor: color === c ? "#fff" : "transparent",
                boxShadow: color === c ? `0 0 10px ${c}` : "none",
                transform: color === c ? "scale(1.15)" : "scale(1)",
              }}
            />
          ))}
        </div>
      </GlassCard>

      <GlassCard className="p-5 space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Category</h3>
        <CategoryFilter categories={categories} selected={categoryId} onSelect={setCategoryId} />
      </GlassCard>

      <GlassCard className="p-5 space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Frequency</h3>
        <FrequencySelector value={frequency} onChange={setFrequency} customDays={customDays} onCustomDaysChange={setCustomDays} />
      </GlassCard>

      <GlassCard className="p-5">
        <ReminderForm reminders={reminders} onChange={setReminders} />
      </GlassCard>

      <div className="flex gap-3">
        <GlassButton variant="danger" className="flex-none" onClick={() => setConfirmDelete(true)} disabled={saving}>
          Delete
        </GlassButton>
        <GlassButton variant="secondary" onClick={() => router.back()} className="flex-1">
          Cancel
        </GlassButton>
        <GlassButton variant="primary" className="flex-1" onClick={handleSave} disabled={saving || !name.trim()}>
          {saving ? "Saving…" : "Save Changes"}
        </GlassButton>
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div
              key="delete-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
              onClick={() => setConfirmDelete(false)}
            />
            <motion.div
              key="delete-modal"
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div
                className="w-full max-w-sm rounded-2xl p-6 pointer-events-auto space-y-4"
                style={{
                  background: "var(--glass-bg-elevated)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(244,63,94,0.25)",
                  boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(244,63,94,0.12)" }}>
                    <AlertTriangle size={18} className="text-rose-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Delete &ldquo;{habit.name}&rdquo;?</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>This will permanently remove all logs and data.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <GlassButton variant="secondary" size="sm" className="flex-1" onClick={() => setConfirmDelete(false)}>
                    Keep it
                  </GlassButton>
                  <GlassButton variant="danger" size="sm" className="flex-1" onClick={handleDelete}>
                    Yes, delete
                  </GlassButton>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
