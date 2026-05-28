"use client";

import { useEffect } from "react";
import { useHabitStore } from "@/store/habitStore";
import { useNotifications } from "@/hooks/useNotifications";
import { useMilestoneDetector } from "@/hooks/useMilestoneDetector";
import { PermissionPrompt } from "@/components/notifications/PermissionPrompt";
import { MilestoneModal } from "@/components/habits/MilestoneModal";
import { NewHabitModal } from "@/components/habits/NewHabitModal";

function NotificationManager() {
  useNotifications();
  return <PermissionPrompt />;
}

function MilestoneManager() {
  useMilestoneDetector();
  return <MilestoneModal />;
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
      <MilestoneManager />
      <NewHabitModal />
    </>
  );
}
