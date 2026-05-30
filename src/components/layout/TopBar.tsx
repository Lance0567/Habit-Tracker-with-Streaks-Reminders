"use client";

import { Plus, Sun, Moon } from "lucide-react";
import { format } from "date-fns";
import { usePathname } from "next/navigation";
import { GlassButton } from "@/components/ui/GlassButton";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useUIStore } from "@/store/uiStore";
import { useHabitStore } from "@/store/habitStore";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function TopBar() {
  const today = new Date();
  const pathname = usePathname();
  const setNewHabitOpen = useUIStore((s) => s.setNewHabitOpen);
  const settings = useHabitStore((s) => s.settings);
  const updateSettings = useHabitStore((s) => s.updateSettings);

  const isDark = (settings?.theme ?? "dark") === "dark";

  async function toggleTheme() {
    if (!settings) return;
    await updateSettings({ ...settings, theme: isDark ? "light" : "dark" });
  }

  return (
    <header
      className="h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30"
      style={{
        background: "var(--nav-bg)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--nav-border)",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div>
        <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
          {format(today, "EEEE, MMMM d")}
        </p>
        <h1 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {getGreeting()}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {!pathname.startsWith("/habits") && (
          <GlassButton variant="primary" size="sm" onClick={() => setNewHabitOpen(true)}>
            <Plus size={14} />
            New Habit
          </GlassButton>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-[var(--radius-md)] transition-all duration-200"
          style={{
            background: "var(--glass-bg-default)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid var(--glass-border-hover)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-primary)";
            e.currentTarget.style.background = "var(--glass-bg-elevated)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.background = "var(--glass-bg-default)";
          }}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <NotificationBell />
      </div>
    </header>
  );
}
