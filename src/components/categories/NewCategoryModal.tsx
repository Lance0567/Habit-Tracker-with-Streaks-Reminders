"use client";

import { useUIStore } from "@/store/uiStore";
import { useHabitStore } from "@/store/habitStore";
import { CategoryForm } from "@/components/categories/CategoryForm";

export function NewCategoryModal() {
  const open = useUIStore((s) => s.newCategoryOpen);
  const setOpen = useUIStore((s) => s.setNewCategoryOpen);
  const addCategory = useHabitStore((s) => s.addCategory);
  const addToast = useUIStore((s) => s.addToast);

  async function handleSave(data: { name: string; color: string; icon: string }) {
    await addCategory({ id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() });
    addToast(`"${data.name}" category created`, "success");
  }

  return (
    <CategoryForm
      open={open}
      onClose={() => setOpen(false)}
      onSave={handleSave}
    />
  );
}
