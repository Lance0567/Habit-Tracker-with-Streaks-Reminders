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
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? "#7C3AED");
  const [icon, setIcon] = useState(initial?.icon ?? "Tag");
  const [saving, setSaving] = useState(false);

  // Reset fields when modal opens/changes target
  const handleOpen = () => {
    setName(initial?.name ?? "");
    setColor(initial?.color ?? "#7C3AED");
    setIcon(initial?.icon ?? "Tag");
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
          autoFocus
        />

        {/* Color */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Color</p>
          <div className="flex flex-wrap gap-2">
            {HABIT_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-7 h-7 rounded-full border-2 transition-all duration-150 flex-shrink-0"
                style={{
                  backgroundColor: c,
                  borderColor: color === c ? "#fff" : "transparent",
                  boxShadow: color === c ? `0 0 8px ${c}` : "none",
                  transform: color === c ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Icon */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider">Icon</p>
          <div className="grid grid-cols-9 gap-1.5">
            {CATEGORY_ICONS.map((name) => {
              const Icon = getIcon(name);
              const active = icon === name;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setIcon(name)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all border"
                  style={{
                    background: active ? `${color}25` : "rgba(255,255,255,0.04)",
                    borderColor: active ? `${color}60` : "rgba(255,255,255,0.08)",
                    color: active ? color : "rgba(255,255,255,0.35)",
                    boxShadow: active ? `0 0 8px ${color}40` : "none",
                  }}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-md)]"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: `${color}20`,
              border: `1px solid ${color}35`,
              boxShadow: `0 0 12px ${color}25`,
            }}
          >
            {(() => { const I = getIcon(icon); return <I size={18} color={color} />; })()}
          </div>
          <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.75)" }}>
            {name.trim() || <span style={{ color: "rgba(255,255,255,0.2)" }}>Category name</span>}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <GlassButton variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton
            variant="primary"
            className="flex-1"
            disabled={!name.trim() || saving}
            onClick={handleSave}
          >
            {saving ? "Saving…" : initial ? "Save Changes" : "Create"}
          </GlassButton>
        </div>
      </div>
    </GlassModal>
  );
}
