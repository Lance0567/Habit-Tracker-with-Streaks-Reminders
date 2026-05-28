import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-7 w-36 mb-1.5" />
        <Skeleton className="h-3 w-52" />
      </div>

      {/* Headline stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} className="h-24" />
        ))}
      </div>

      {/* Two wide chart cards */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="glass rounded-[var(--radius-lg)] p-5">
          <Skeleton className="h-4 w-40 mb-4" />
          <Skeleton className="h-56 w-full" />
        </div>
      ))}

      {/* Two half-width chart cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="glass rounded-[var(--radius-lg)] p-5">
            <Skeleton className="h-4 w-32 mb-4" />
            <Skeleton className="h-48 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
