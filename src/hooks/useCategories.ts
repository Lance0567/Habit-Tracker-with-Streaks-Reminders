import { useHabitStore } from "@/store/habitStore";

export function useCategories() {
  const { categories, habits, isLoading, addCategory, updateCategory, deleteCategory } =
    useHabitStore();
  return { categories, habits, isLoading, addCategory, updateCategory, deleteCategory };
}
