"use client";

import { ErrorPanel } from "@/components/ui/ErrorPanel";

export default function HabitsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorPanel error={error} reset={reset} />;
}
