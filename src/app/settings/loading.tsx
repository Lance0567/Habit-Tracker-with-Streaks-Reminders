import { Skeleton } from "@/components/ui/Skeleton";

function SettingsSectionSkeleton() {
  return (
    <div className="glass rounded-[var(--radius-lg)] overflow-hidden">
      <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Skeleton className="h-3.5 w-28" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-5 py-4 gap-4"
          style={i > 0 ? { borderTop: "1px solid rgba(255,255,255,0.04)" } : {}}
        >
          <div>
            <Skeleton className="h-3.5 w-36 mb-1.5" />
            <Skeleton className="h-2.5 w-52" />
          </div>
          <Skeleton className="h-8 w-20 rounded-[var(--radius-md)] flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default function SettingsLoading() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Skeleton className="h-7 w-28 mb-1.5" />
        <Skeleton className="h-3 w-60" />
      </div>
      {Array.from({ length: 4 }).map((_, i) => (
        <SettingsSectionSkeleton key={i} />
      ))}
    </div>
  );
}
