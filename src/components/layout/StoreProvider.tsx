"use client";

import { useEffect } from "react";
import { useHabitStore } from "@/store/habitStore";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useHabitStore((s) => s.hydrate);

  useEffect(() => {
    hydrate().catch((err) => console.error("[StoreProvider] hydration failed:", err));
  }, [hydrate]);

  return <>{children}</>;
}
