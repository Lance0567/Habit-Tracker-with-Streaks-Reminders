"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Plus, Search, LayoutGrid, List } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { HabitGrid } from "@/components/habits/HabitGrid";
import { HabitList } from "@/components/habits/HabitList";
import { CategoryFilter } from "@/components/categories/CategoryFilter";
import { Spinner } from "@/components/ui/Spinner";
import { useHabits } from "@/hooks/useHabits";
import { useCategories } from "@/hooks/useCategories";
import { useUIStore } from "@/store/uiStore";
import { useHabitStore } from "@/store/habitStore";

// Inner component reads URL search params (requires Suspense boundary)
function HabitsContent() {
  const searchParams = useSearchParams();
  const { habits, completedToday, streaks, completionRates, isLoading, toggleLog } = useHabits();
  const { categories } = useCategories();
  const setNewHabitOpen = useUIStore((s) => s.setNewHabitOpen);
  const { settings, updateSettings } = useHabitStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );
  const view = settings?.defaultView ?? "grid";

  const handleSetView = (v: "grid" | "list") => {
    if (settings) updateSettings({ ...settings, defaultView: v });
  };

  const filtered = habits.filter((h) => {
    const matchSearch = h.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory ? h.categoryId === selectedCategory : true;
    return matchSearch && matchCat;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>All Habits</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>{habits.length} habits tracked</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Grid / List toggle */}
          <div className="flex glass rounded-lg overflow-hidden">
            <button
              onClick={() => handleSetView("grid")}
              className={clsx(
                "p-2 transition-colors",
                view === "grid" ? "bg-[var(--color-accent)]/20 text-[var(--color-accent-light)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
              aria-label="Grid view"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => handleSetView("list")}
              className={clsx(
                "p-2 transition-colors",
                view === "list" ? "bg-[var(--color-accent)]/20 text-[var(--color-accent-light)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
              aria-label="List view"
            >
              <List size={15} />
            </button>
          </div>
          <GlassButton variant="primary" onClick={() => setNewHabitOpen(true)}>
            <Plus size={16} />
            New Habit
          </GlassButton>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:max-w-xs">
          <GlassInput
            placeholder="Search habits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={14} />}
          />
        </div>
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {view === "grid" ? (
        <HabitGrid
          habits={filtered}
          completedToday={completedToday}
          streaks={streaks}
          completionRates={completionRates}
          onToggle={toggleLog}
        />
      ) : (
        <HabitList
          habits={filtered}
          completedToday={completedToday}
          streaks={streaks}
          completionRates={completionRates}
          onToggle={toggleLog}
        />
      )}
    </div>
  );
}

export default function HabitsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Spinner size={32} />
      </div>
    }>
      <HabitsContent />
    </Suspense>
  );
}
