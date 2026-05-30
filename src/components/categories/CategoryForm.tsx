"use client";

import { useState } from "react";
import { GlassModal } from "@/components/ui/GlassModal";
import { GlassInput } from "@/components/ui/GlassInput";
import { GlassButton } from "@/components/ui/GlassButton";
import { getIcon } from "@/lib/icons";
import { HABIT_COLORS } from "@/lib/constants";
import type { Category } from "@/types";

const CATEGORY_ICONS = [
  "Heart", "Star", "Zap", "Target", "Trophy", "Flame",
  "Leaf", "Moon", "Sun", "Coffee", "Dumbbell", "BookOpen",
  "Music", "Pencil", "Code", "Globe", "Smile", "Shield",
  "Clock", "Apple", "Bike", "Briefcase", "Brain", "Users",
  "Palette", "Tag", "Droplets",
];

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: Category;
  onSave: (data: { name: string; color: string; icon: string }) => Promise<void>;
}

export function CategoryForm({ open, onClose, initial, onSave }: Props) {
  const [name, setName]     = useState(initial?.name  ?? "");
  const [color, setColor]   = useState(initial?.color ?? "#7C3AED");
  const [icon, setIcon]     = useState(initial?.icon  ?? "Tag");
  const [saving, setSaving] = useState(false);

  const handleOpen = () => {
    setName(initial?.name  ?? "");
    setColor(initial?.color ?? "#7C3AED");
    setIcon(initial?.icon  ?? "Tag");
    setSaving(false);
  };

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({ name: name.trim(), color, icon });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const hasName = name.trim().length > 0;

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title={initial ? "Edit Category" : "New Category"}
      size="sm"
    >
      <div className="space-y-5" onFocus={open ? undefined : handleOpen}>
        {/* Name */}
        <GlassInput
          label="Category Name"
          placeholder="e.g. Health, Work, Creative…"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && hasName && handleSave()}
          autoFocus
        />

        {/* Color */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            Color
          </p>
          <div className="flex flex-wrap gap-2">
            {HABIT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                aria-label={c}
                aria-pressed={color === c}
                className="w-7 h-7 rounded-full transition-all duration-150 flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1"
                style={{
                  backgroundColor: c,
                  outline: color === c ? `3px solid ${c}` : "2px solid transparent",
                  outlineOffset: color === c ? "2px" : "0px",
                  boxShadow: color === c ? `0 0 10px ${c}60` : "none",
                  transform: color === c ? "scale(1.18)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Icon */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
            Icon
          </p>
          <div className="grid grid-cols-9 gap-1.5">
            {CATEGORY_ICONS.map((iconName) => {
              const Icon = getIcon(iconName);
              const active = icon === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setIcon(iconName)}
                  aria-label={iconName}
                  aria-pressed={active}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-1"
                  style={{
                    background: active ? `${color}18` : "var(--glass-bg-subtle)",
                    border: `1px solid ${active ? `${color}50` : "var(--glass-border)"}`,
                    color: active ? color : "var(--text-muted)",
                    boxShadow: active ? `0 0 8px ${color}30` : "none",
                  }}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview */}
        <div
          className="flex items-center gap-3 p-3 rounded-[var(--radius-md)]"
          style={{
            background: "var(--glass-bg-subtle)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${color}20`,
              border: `1px solid ${color}35`,
              boxShadow: `0 0 12px ${color}20`,
            }}
          >
            {(() => { const I = getIcon(icon); return <I size={18} color={color} />; })()}
          </div>
          <p className="text-sm font-medium" style={{ color: hasName ? "var(--text-primary)" : "var(--text-muted)" }}>
            {name.trim() || "Category name"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <GlassButton variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </GlassButton>
          <button
            type="button"
            disabled={!hasName || saving}
            onClick={handleSave}
            className="flex-1 py-2 px-4 rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed"
            style={
              hasName
                ? {
                    background: color,
                    color: "#ffffff",
                    boxShadow: `0 4px 14px ${color}45`,
                    border: "1px solid transparent",
                    opacity: saving ? 0.65 : 1,
                  }
                : {
                    background: "var(--glass-bg-default)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--glass-border-hover)",
                    boxShadow: "none",
                  }
            }
          >
            {saving ? "Saving…" : initial ? "Save Changes" : "Create"}
          </button>
        </div>
      </div>
    </GlassModal>
  );
}
