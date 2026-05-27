export type ID = string;

export interface Category {
  id: ID;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Reminder {
  id: ID;
  time: string; // "HH:MM"
  days: number[]; // 0=Sun…6=Sat, empty = every day
  enabled: boolean;
}

export type HabitFrequency = "daily" | "weekdays" | "weekends" | "custom";

export interface Habit {
  id: ID;
  name: string;
  description: string;
  categoryId: ID | null;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  customDays?: number[];
  targetCount: number;
  unit: string;
  reminders: Reminder[];
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitLog {
  id: ID;
  habitId: ID;
  date: string; // "YYYY-MM-DD"
  completedCount: number;
  note?: string;
  completedAt: string;
}

export interface StreakData {
  current: number;
  longest: number;
  lastCheckedIn: string | null;
  isCompletedToday: boolean;
}

export interface WeeklyDataPoint {
  weekStart: string;
  completed: number;
  target: number;
  rate: number;
}

export interface MonthlyDataPoint {
  month: string;
  completed: number;
  target: number;
  rate: number;
}

export interface HabitStats {
  habitId: ID;
  completionRate7d: number;
  completionRate30d: number;
  completionRate90d: number;
  totalCompletions: number;
  streak: StreakData;
  weeklyData: WeeklyDataPoint[];
  monthlyData: MonthlyDataPoint[];
}

export interface HeatMapDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface AppSettings {
  notificationsEnabled: boolean;
  swRegistered: boolean;
  weekStartsOn: 0 | 1;
  defaultView: "grid" | "list";
  createdAt: string;
}
