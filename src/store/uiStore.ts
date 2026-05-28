import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export interface MilestoneData {
  habitId: string;
  habitName: string;
  milestone: number;
  currentStreak: number;
}

interface UIStore {
  sidebarCollapsed: boolean;
  toasts: Toast[];
  milestoneModal: MilestoneData | null;
  newHabitOpen: boolean;
  toggleSidebar: () => void;
  addToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
  setMilestoneModal: (data: MilestoneData | null) => void;
  setNewHabitOpen: (open: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarCollapsed: false,
  toasts: [],
  milestoneModal: null,
  newHabitOpen: false,

  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  addToast: (message, type = "success") => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  setMilestoneModal: (data) => set({ milestoneModal: data }),
  setNewHabitOpen: (open) => set({ newHabitOpen: open }),
}));
