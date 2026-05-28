import { Skeleton } from "@/components/ui/Skeleton";

export default function CategoriesLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-7 w-36 mb-1.5" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-8 w-36 rounded-[var(--radius-md)]" />
      </div>

      {/* Category card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="glass rounded-[var(--radius-lg)] p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <Skeleton className="w-12 h-12 rounded-xl" />
              <div className="flex gap-1">
                <Skeleton className="w-7 h-7 rounded-lg" />
                <Skeleton className="w-7 h-7 rounded-lg" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-0.5 w-8 rounded-full" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
