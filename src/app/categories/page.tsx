"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getIcon } from "@/lib/icons";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Spinner } from "@/components/ui/Spinner";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { useCategories } from "@/hooks/useCategories";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const { categories, habits, isLoading, addCategory, updateCategory, deleteCategory } =
    useCategories();
  const router = useRouter();

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  const habitCountByCategory = habits.reduce<Record<string, number>>((acc, h) => {
    if (h.categoryId) acc[h.categoryId] = (acc[h.categoryId] ?? 0) + 1;
    return acc;
  }, {});

  function openCreate() {
    setEditTarget(null);
    setFormOpen(true);
  }

  function openEdit(cat: Category) {
    setEditTarget(cat);
    setFormOpen(true);
  }

  async function handleSave(data: { name: string; color: string; icon: string }) {
    const now = new Date().toISOString();
    if (editTarget) {
      await updateCategory({ ...editTarget, ...data });
    } else {
      await addCategory({ id: crypto.randomUUID(), ...data, createdAt: now });
    }
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`Delete "${cat.name}"? Habits in this category will become uncategorized.`)) return;
    await deleteCategory(cat.id);
  }

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
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Categories</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Organize your habits by theme</p>
        </div>
        <GlassButton variant="primary" onClick={openCreate}>
          <Plus size={16} />
          New Category
        </GlassButton>
      </motion.div>

      {/* Empty state */}
      {categories.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center gap-4"
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.2)",
              boxShadow: "0 0 24px rgba(124,58,237,0.15)",
            }}
          >
            <Plus size={22} style={{ color: "rgba(167,139,250,0.7)" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>No categories yet</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Create one to group your habits</p>
          </div>
          <GlassButton variant="primary" size="sm" onClick={openCreate}>
            Create first category
          </GlassButton>
        </motion.div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {categories.map((cat, i) => {
            const IconComponent = getIcon(cat.icon);
            const count = habitCountByCategory[cat.id] ?? 0;

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <GlassCard
                  hover
                  className="p-5 flex flex-col gap-4 group relative overflow-hidden cursor-pointer"
                  onClick={() => router.push(`/habits?category=${cat.id}`)}
                >
                  {/* Color accent bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, ${cat.color}, transparent)`,
                      boxShadow: `0 0 8px ${cat.color}`,
                    }}
                  />

                  {/* Header row */}
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${cat.color}20`,
                        border: `1px solid ${cat.color}35`,
                        boxShadow: `0 0 16px ${cat.color}20`,
                      }}
                    >
                      <IconComponent size={22} color={cat.color} />
                    </div>

                    {/* Action buttons — visible on hover, stop propagation so they don't navigate */}
                    <div
                      className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => openEdit(cat)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-[var(--glass-bg-subtle)]"
                        style={{ color: "var(--text-muted)" }}
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:bg-rose-500/15"
                        style={{ color: "rgba(244,63,94,0.5)" }}
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Name + habit count */}
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>{cat.name}</p>
                      <div
                        className="w-8 h-0.5 rounded-full mt-1.5"
                        style={{ backgroundColor: cat.color, boxShadow: `0 0 6px ${cat.color}` }}
                      />
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full self-start"
                      style={{ backgroundColor: `${cat.color}18`, color: cat.color }}
                    >
                      {count} habit{count !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* View habits affordance */}
                  <div
                    className="flex items-center gap-1 text-[11px] font-medium transition-opacity opacity-0 group-hover:opacity-100"
                    style={{ color: cat.color }}
                  >
                    <ArrowRight size={11} />
                    View habits
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Create / Edit modal */}
      <CategoryForm
        key={editTarget?.id ?? "new"}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editTarget ?? undefined}
        onSave={handleSave}
      />
    </div>
  );
}
