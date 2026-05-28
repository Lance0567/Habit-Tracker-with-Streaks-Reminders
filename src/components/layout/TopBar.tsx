"use client";

import { Plus } from "lucide-react";
import { format } from "date-fns";
import { GlassButton } from "@/components/ui/GlassButton";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useUIStore } from "@/store/uiStore";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function TopBar() {
  const today = new Date();
  const setNewHabitOpen = useUIStore((s) => s.setNewHabitOpen);

  return (
    <header
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-30"
      style={{
        background: "rgba(8, 5, 22, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      <div>
        <p className="text-xs text-white/40 font-medium">
          {format(today, "EEEE, MMMM d")}
        </p>
        <h1 className="text-sm font-semibold text-white/85">
          {getGreeting()}, Habit Architect
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <GlassButton variant="primary" size="sm" onClick={() => setNewHabitOpen(true)}>
          <Plus size={14} />
          New Habit
        </GlassButton>
        <NotificationBell />
      </div>
    </header>
  );
}
