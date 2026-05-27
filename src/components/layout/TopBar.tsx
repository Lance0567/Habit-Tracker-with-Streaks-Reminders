"use client";

import { Bell, Plus } from "lucide-react";
import { format } from "date-fns";
import { GlassButton } from "@/components/ui/GlassButton";
import Link from "next/link";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function TopBar() {
  const today = new Date();

  return (
    <header className="h-16 flex items-center justify-between px-6 glass border-b border-white/8 sticky top-0 z-30">
      <div>
        <p className="text-xs text-white/40 font-medium">
          {format(today, "EEEE, MMMM d")}
        </p>
        <h1 className="text-sm font-semibold text-white/85">
          {getGreeting()}, Habit Architect
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/habits/new">
          <GlassButton variant="primary" size="sm">
            <Plus size={14} />
            New Habit
          </GlassButton>
        </Link>
        <button className="relative w-9 h-9 glass rounded-[var(--radius-md)] flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all border border-white/8">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent shadow-glow-sm" />
        </button>
      </div>
    </header>
  );
}
