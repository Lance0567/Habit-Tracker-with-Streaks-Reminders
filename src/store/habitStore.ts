import { create } from "zustand";
import { format } from "date-fns";
import type { Habit, HabitLog, Category, AppSettings } from "@/types";
import * as storage from "@/lib/storage";

interface HabitStore {
  habits: Habit[];
  logs: HabitLog[];
  categories: Category[];
  settings: AppSettings | null;
  isLoading: boolean;

  hydrate: () => Promise<void>;

  addHabit: (habit: Habit) => Promise<void>;
  updateHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;

  toggleLog: (habitId: string) => Promise<void>;

  addCategory: (cat: Category) => Promise<void>;
  updateCategory: (cat: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  updateSettings: (settings: AppSettings) => Promise<void>;
  resetData: () => Promise<void>;
}

export const useHabitStore = create<HabitStore>((set) => ({
  habits: [],
  logs: [],
  categories: [],
  settings: null,
  isLoading: true,

  hydrate: async () => {
    await storage.seedIfEmpty();
    const [habits, logs, categories, settings] = await Promise.all([
      storage.getAllHabits(),
      storage.getAllLogs(),
      storage.getAllCategories(),
      storage.getSettings(),
    ]);
    set({ habits, logs, categories, settings, isLoading: false });
  },

  addHabit: async (habit) => {
    await storage.saveHabit(habit);
    set((s) => ({ habits: [...s.habits, habit] }));
  },

  updateHabit: async (habit) => {
    await storage.saveHabit(habit);
    set((s) => ({ habits: s.habits.map((h) => (h.id === habit.id ? habit : h)) }));
  },

  deleteHabit: async (id) => {
    await storage.deleteHabit(id);
    set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }));
  },

  toggleLog: async (habitId) => {
    const today = format(new Date(), "yyyy-MM-dd");
    const result = await storage.toggleLog(habitId, today);
    if (result.action === "removed") {
      set((s) => ({
        logs: s.logs.filter((l) => !(l.habitId === habitId && l.date === today)),
      }));
    } else if (result.log) {
      set((s) => ({ logs: [...s.logs, result.log!] }));
    }
  },

  addCategory: async (cat) => {
    await storage.saveCategory(cat);
    set((s) => ({ categories: [...s.categories, cat] }));
  },

  updateCategory: async (cat) => {
    await storage.saveCategory(cat);
    set((s) => ({
      categories: s.categories.map((c) => (c.id === cat.id ? cat : c)),
    }));
  },

  deleteCategory: async (id) => {
    await storage.deleteCategory(id);
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
  },

  updateSettings: async (settings) => {
    await storage.saveSettings(settings);
    // Mirror theme to localStorage so the blocking <head> script can read it
    // synchronously on next page load and prevent the dark→light flash.
    try {
      if (settings.theme) localStorage.setItem("habitflow-theme", settings.theme);
    } catch (_) {}
    set({ settings });
  },

  resetData: async () => {
    await storage.clearAllData();
    set({ habits: [], logs: [], categories: [], settings: null, isLoading: false });
  },
}));
