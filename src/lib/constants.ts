import type { Category } from "@/types";

export const DEFAULT_CATEGORIES: Omit<Category, "createdAt">[] = [
  { id: "cat-health", name: "Health", color: "#10B981", icon: "Heart" },
  { id: "cat-work", name: "Work", color: "#3B82F6", icon: "Briefcase" },
  { id: "cat-mind", name: "Mindfulness", color: "#8B5CF6", icon: "Brain" },
  { id: "cat-fitness", name: "Fitness", color: "#F59E0B", icon: "Dumbbell" },
  { id: "cat-social", name: "Social", color: "#EC4899", icon: "Users" },
  { id: "cat-learning", name: "Learning", color: "#06B6D4", icon: "BookOpen" },
  { id: "cat-creative", name: "Creative", color: "#F97316", icon: "Palette" },
];

export const HABIT_COLORS = [
  "#7C3AED", "#06B6D4", "#10B981", "#F59E0B",
  "#F43F5E", "#EC4899", "#3B82F6", "#F97316",
  "#8B5CF6", "#14B8A6", "#84CC16", "#EF4444",
];

export const HABIT_ICONS = [
  "Heart", "Star", "Zap", "Target", "Trophy",
  "Flame", "Leaf", "Moon", "Sun", "Coffee",
  "Dumbbell", "Running", "Book", "Music", "Pencil",
  "Code", "Globe", "Smile", "Shield", "Clock",
  "Water", "Apple", "Bike", "Meditation", "Yoga",
];

export const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const STREAK_MILESTONES = [7, 14, 21, 30, 66, 100];
