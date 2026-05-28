"use client";

import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return <div className={clsx("skeleton rounded-[var(--radius-md)]", className)} />;
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div
      className={clsx("glass rounded-[var(--radius-lg)] p-5", className)}
    >
      <Skeleton className="h-4 w-1/3 mb-3" />
      <Skeleton className="h-8 w-1/2 mb-2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function SkeletonHabitCard() {
  return (
    <div className="glass rounded-[var(--radius-lg)] p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Skeleton className="h-3.5 w-24 mb-1.5" />
            <Skeleton className="h-2.5 w-32" />
          </div>
        </div>
        <Skeleton className="h-3 w-8 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="w-11 h-11 rounded-full" />
      </div>
    </div>
  );
}
