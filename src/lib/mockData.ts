import type { Habit, Category, HabitLog, HeatMapDay } from "@/types";
import { subDays, format } from "date-fns";

export const MOCK_CATEGORIES: Category[] = [
  { id: "cat-health", name: "Health", color: "#10B981", icon: "Heart", createdAt: "2025-01-01" },
  { id: "cat-work", name: "Work", color: "#3B82F6", icon: "Briefcase", createdAt: "2025-01-01" },
  { id: "cat-mind", name: "Mindfulness", color: "#8B5CF6", icon: "Brain", createdAt: "2025-01-01" },
  { id: "cat-fitness", name: "Fitness", color: "#F59E0B", icon: "Dumbbell", createdAt: "2025-01-01" },
];

export const MOCK_HABITS: Habit[] = [
  {
    id: "h1", name: "Morning Run", description: "5km before breakfast",
    categoryId: "cat-fitness", icon: "Zap", color: "#F59E0B",
    frequency: "daily", targetCount: 1, unit: "times", reminders: [],
    archived: false, createdAt: "2025-01-01", updatedAt: "2025-01-01",
  },
  {
    id: "h2", name: "Meditate", description: "10 min mindfulness session",
    categoryId: "cat-mind", icon: "Moon", color: "#8B5CF6",
    frequency: "daily", targetCount: 1, unit: "times", reminders: [],
    archived: false, createdAt: "2025-01-01", updatedAt: "2025-01-01",
  },
  {
    id: "h3", name: "Read 30 min", description: "Non-fiction only",
    categoryId: "cat-work", icon: "BookOpen", color: "#3B82F6",
    frequency: "daily", targetCount: 1, unit: "times", reminders: [],
    archived: false, createdAt: "2025-01-01", updatedAt: "2025-01-01",
  },
  {
    id: "h4", name: "Drink Water", description: "8 glasses per day",
    categoryId: "cat-health", icon: "Droplets", color: "#06B6D4",
    frequency: "daily", targetCount: 8, unit: "glasses", reminders: [],
    archived: false, createdAt: "2025-01-01", updatedAt: "2025-01-01",
  },
  {
    id: "h5", name: "Journal", description: "Write daily reflections",
    categoryId: "cat-mind", icon: "Pencil", color: "#EC4899",
    frequency: "daily", targetCount: 1, unit: "times", reminders: [],
    archived: false, createdAt: "2025-01-01", updatedAt: "2025-01-01",
  },
  {
    id: "h6", name: "No Sugar", description: "Avoid processed sugar",
    categoryId: "cat-health", icon: "Apple", color: "#10B981",
    frequency: "daily", targetCount: 1, unit: "times", reminders: [],
    archived: false, createdAt: "2025-01-01", updatedAt: "2025-01-01",
  },
];

export const MOCK_STREAKS: Record<string, number> = {
  h1: 14, h2: 7, h3: 31, h4: 5, h5: 3, h6: 21,
};

export const MOCK_COMPLETED_TODAY: Set<string> = new Set(["h2", "h3"]);

export const MOCK_COMPLETION_RATES: Record<string, number> = {
  h1: 78, h2: 92, h3: 85, h4: 60, h5: 45, h6: 71,
};

// Generate a year of heatmap data
export function generateMockHeatMap(habitId: string): HeatMapDay[] {
  const days: HeatMapDay[] = [];
  const seed = habitId.charCodeAt(1) || 1;
  for (let i = 364; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    const rand = Math.abs(Math.sin(i * seed * 0.3)) ;
    const count = rand > 0.35 ? (rand > 0.7 ? 1 : 1) : 0;
    const level = (count === 0 ? 0 : rand > 0.85 ? 4 : rand > 0.7 ? 3 : rand > 0.55 ? 2 : 1) as 0|1|2|3|4;
    days.push({ date, count, level });
  }
  return days;
}

export function generateMockWeeklyData() {
  return Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    completed: Math.floor(Math.random() * 5) + 2,
    target: 7,
  }));
}

export function generateMockMonthlyData() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.slice(0, 6).map((month) => ({
    month,
    rate: Math.floor(Math.random() * 40) + 55,
    habits: Math.floor(Math.random() * 3) + 3,
  }));
}
