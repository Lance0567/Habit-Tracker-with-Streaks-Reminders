import { Skeleton, SkeletonHabitCard } from "@/components/ui/Skeleton";

export default function HabitsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-36 mb-1.5" />
          <Skeleton className="h-3 w-28" />
        </div>
        <Skeleton className="h-8 w-28 rounded-[var(--radius-md)]" />
      </div>

      {/* Search + filter row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Skeleton className="h-9 w-full sm:max-w-xs rounded-[var(--radius-md)]" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-[var(--radius-md)]" />
          ))}
        </div>
      </div>

      {/* Habit grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonHabitCard key={i} />
        ))}
      </div>
    </div>
  );
}
