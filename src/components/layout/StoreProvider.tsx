"use client";

import { useEffect } from "react";
import { useHabitStore } from "@/store/habitStore";
import { useNotifications } from "@/hooks/useNotifications";
import { PermissionPrompt } from "@/components/notifications/PermissionPrompt";

function NotificationManager() {
  useNotifications();
  return <PermissionPrompt />;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useHabitStore((s) => s.hydrate);

  useEffect(() => {
    hydrate().catch((err) => console.error("[StoreProvider] hydration failed:", err));
  }, [hydrate]);

  return (
    <>
      {children}
      <NotificationManager />
    </>
  );
}
