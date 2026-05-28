"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassInput } from "@/components/ui/GlassInput";
import { HabitGrid } from "@/components/habits/HabitGrid";
import { CategoryFilter } from "@/components/categories/CategoryFilter";
import { Spinner } from "@/components/ui/Spinner";
import { useHabits } from "@/hooks/useHabits";
import { useCategories } from "@/hooks/useCategories";

// Inner component reads URL search params (requires Suspense boundary)
function HabitsContent() {
  const searchParams = useSearchParams();
  const { habits, completedToday, streaks, completionRates, isLoading, toggleLog } = useHabits();
  const { categories } = useCategories();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get("category")
  );

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
          <h2 className="text-2xl font-bold text-white/90">All Habits</h2>
          <p className="text-sm text-white/35 mt-0.5">{habits.length} habits tracked</p>
        </div>
        <Link href="/habits/new">
          <GlassButton variant="primary">
            <Plus size={16} />
            New Habit
          </GlassButton>
        </Link>
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

      <HabitGrid
        habits={filtered}
        completedToday={completedToday}
        streaks={streaks}
        completionRates={completionRates}
        onToggle={toggleLog}
      />
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
