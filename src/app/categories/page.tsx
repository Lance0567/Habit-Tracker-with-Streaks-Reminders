"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { getIcon } from "@/lib/icons";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Spinner } from "@/components/ui/Spinner";
import { useCategories } from "@/hooks/useCategories";

export default function CategoriesPage() {
  const { categories, habits, isLoading } = useCategories();

  const habitCountByCategory = habits.reduce<Record<string, number>>((acc, h) => {
    if (h.categoryId) acc[h.categoryId] = (acc[h.categoryId] ?? 0) + 1;
    return acc;
  }, {});

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
          <h2 className="text-2xl font-bold text-white/90">Categories</h2>
          <p className="text-sm text-white/35 mt-0.5">Organize your habits by theme</p>
        </div>
        <GlassButton variant="primary">
          <Plus size={16} />
          New Category
        </GlassButton>
      </motion.div>

      {categories.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-4xl mb-4">✦</p>
          <p className="text-white/40 text-sm">No categories yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat, i) => {
          const IconComponent = getIcon(cat.icon);
          const count = habitCountByCategory[cat.id] ?? 0;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
            >
              <GlassCard hover className="p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${cat.color}20`,
                      border: `1px solid ${cat.color}30`,
                      boxShadow: `0 0 16px ${cat.color}20`,
                    }}
                  >
                    <IconComponent size={22} color={cat.color} />
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                  >
                    {count} habit{count !== 1 ? "s" : ""}
                  </span>
                </div>
                <div>
                  <p className="text-base font-semibold text-white/85">{cat.name}</p>
                  <div
                    className="w-8 h-0.5 rounded-full mt-2"
                    style={{ backgroundColor: cat.color, boxShadow: `0 0 6px ${cat.color}` }}
                  />
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
