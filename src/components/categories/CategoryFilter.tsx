"use client";

import { clsx } from "clsx";
import type { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => onSelect(null)}
        className={clsx(
          "px-4 py-1.5 text-xs font-medium rounded-full border transition-all duration-200",
          selected === null
            ? "bg-accent/20 border-accent/40 text-accent-light"
            : "glass border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
        )}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={clsx(
            "px-4 py-1.5 text-xs font-medium rounded-full border transition-all duration-200",
            selected === cat.id
              ? "border-opacity-50"
              : "glass border-white/10 text-white/40 hover:text-white/70 hover:border-white/20"
          )}
          style={
            selected === cat.id
              ? {
                  backgroundColor: `${cat.color}22`,
                  borderColor: `${cat.color}55`,
                  color: cat.color,
                }
              : {}
          }
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
