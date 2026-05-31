"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Compass,
  Tag,
  Settings,
  Zap,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { createPortal } from "react-dom";
import { useUIStore } from "@/store/uiStore";
import { useHabitStore } from "@/store/habitStore";
import { useState, useEffect } from "react";

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  color: string;
  group: "MAIN" | "SYSTEM";
};

type TooltipState = { label: string; color: string; y: number } | null;

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const accentColor = useHabitStore((s) => s.settings?.accentColor) ?? "#7C3AED";
  const isDark = (useHabitStore((s) => s.settings?.theme) ?? "dark") === "dark";
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setPendingHref(null); }, [pathname]);

  const navItems: NavItem[] = [
    { href: "/dashboard",  icon: LayoutDashboard, label: "Dashboard",  color: "#06B6D4",   group: "MAIN"   },
    { href: "/habits",     icon: CheckSquare,      label: "Habits",     color: accentColor, group: "MAIN"   },
    { href: "/analytics",  icon: BarChart3,        label: "Analytics",  color: "#F59E0B",   group: "MAIN"   },
    { href: "/explore",    icon: Compass,          label: "Explore",    color: "#EC4899",   group: "MAIN"   },
    { href: "/categories", icon: Tag,              label: "Categories", color: "#10B981",   group: "SYSTEM" },
    { href: "/settings",   icon: Settings,         label: "Settings",   color: "#94A3B8",   group: "SYSTEM" },
  ];

  const mainItems   = navItems.filter((n) => n.group === "MAIN");
  const systemItems = navItems.filter((n) => n.group === "SYSTEM");

  const renderItem = (item: NavItem) => {
    const { href, icon: Icon, label, color } = item;
    const isActive = pathname.startsWith(href) || pendingHref === href;

    return (
      <Link key={href} href={href} onClick={() => setPendingHref(href)}>
        <div
          className={clsx(
            "relative flex items-center py-2.5 rounded-r-[var(--radius-md)] cursor-pointer transition-colors duration-200 group",
            collapsed ? "justify-center" : "pl-5 pr-3 gap-3"
          )}
          style={{ backgroundColor: isActive ? `${color}0D` : undefined }}
          onMouseEnter={(e) => {
            if (!isActive) (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--glass-bg-subtle)";
            if (collapsed) {
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              setTooltip({ label, color, y: rect.top + rect.height / 2 });
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive) (e.currentTarget as HTMLDivElement).style.backgroundColor = "";
            setTooltip(null);
          }}
        >
          {/* Left accent bar */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-8 rounded-r-full transition-all duration-200"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 10px ${color}80`,
              opacity: isActive ? 1 : 0,
            }}
          />

          {/* Icon */}
          {collapsed ? (
            <div
              className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center flex-shrink-0 transition-all duration-200"
              style={isActive ? { backgroundColor: `${color}20`, border: `1px solid ${color}40` } : undefined}
            >
              <Icon
                size={18}
                className={clsx(
                  "transition-colors duration-200",
                  !isActive && "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                )}
                style={isActive ? { color, filter: `drop-shadow(0 0 6px ${color})` } : undefined}
              />
            </div>
          ) : (
            <Icon
              size={18}
              className={clsx(
                "flex-shrink-0 transition-colors duration-200",
                !isActive && "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
              )}
              style={isActive ? { color, filter: `drop-shadow(0 0 6px ${color})` } : undefined}
            />
          )}

          {/* Label + active dot (expanded only) */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-between flex-1 min-w-0"
              >
                <span
                  className={clsx(
                    "text-sm whitespace-nowrap transition-colors duration-200",
                    isActive
                      ? "font-semibold text-[var(--text-primary)]"
                      : "font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                  )}
                >
                  {label}
                </span>
                {isActive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Link>
    );
  };

  return (
    <>
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col overflow-hidden"
        style={{
          background: "var(--nav-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRight: "1px solid var(--nav-border)",
          transition: "background 0.3s ease, border-color 0.3s ease",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 py-5 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--divider)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={
              isDark
                ? {
                    background: "rgba(124,58,237,0.18)",
                    border: "1px solid rgba(124,58,237,0.35)",
                    boxShadow: "0 0 16px rgba(124,58,237,0.18)",
                  }
                : {
                    background: "linear-gradient(135deg, var(--color-accent) 0%, #9333EA 100%)",
                    border: "1px solid rgba(124,58,237,0.30)",
                    boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
                  }
            }
          >
            <Zap
              size={18}
              style={{
                color: isDark ? "var(--color-accent-light)" : "#ffffff",
                filter: isDark ? "drop-shadow(0 0 8px var(--color-accent))" : "none",
              }}
            />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="whitespace-nowrap overflow-hidden"
              >
                <span className="text-sm font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>Habit</span>
                <span
                  className="text-sm font-bold tracking-tight"
                  style={{ color: isDark ? "var(--color-accent-light)" : "var(--color-accent)" }}
                >
                  Flow
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          <AnimatePresence>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="pl-5 pt-1 pb-1.5 text-[10px] font-bold tracking-[0.12em] uppercase select-none"
                style={{ color: "var(--text-muted)", opacity: 0.6 }}
              >
                Main
              </motion.p>
            )}
          </AnimatePresence>

          {mainItems.map(renderItem)}

          <div className="pt-2">
            <div className="h-px mb-2" style={{ background: "var(--divider)" }} />
            <AnimatePresence>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="pl-5 pb-1.5 text-[10px] font-bold tracking-[0.12em] uppercase select-none"
                  style={{ color: "var(--text-muted)", opacity: 0.6 }}
                >
                  System
                </motion.p>
              )}
            </AnimatePresence>
            {systemItems.map(renderItem)}
          </div>
        </nav>

        {/* Collapse toggle */}
        <div
          className="p-3 flex-shrink-0"
          style={{ borderTop: "1px solid var(--divider)" }}
        >
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 rounded-[var(--radius-md)] transition-all duration-200 focus:outline-none"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <motion.div
              animate={{ rotate: collapsed ? 0 : 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <ChevronRight size={15} />
            </motion.div>
          </button>
        </div>
      </motion.aside>

      {/* Collapse-mode tooltip — portal to escape overflow:hidden on the aside */}
      {mounted && createPortal(
        <AnimatePresence>
          {collapsed && tooltip && (
            <motion.div
              key={tooltip.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.13, ease: "easeOut" }}
              className="fixed z-[9999] pointer-events-none flex items-center gap-1.5"
              style={{ left: 80, top: tooltip.y, transform: "translateY(-50%)" }}
            >
              {/* Arrow nub pointing left */}
              <div
                className="w-[6px] h-[6px] rotate-45"
                style={{
                  backgroundColor: "var(--glass-bg-elevated)",
                  border: `1px solid ${tooltip.color}30`,
                  borderRight: "none",
                  borderTop: "none",
                  marginRight: -3,
                }}
              />
              {/* Label pill */}
              <div
                className="px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap"
                style={{
                  background: "var(--glass-bg-elevated)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: `1px solid ${tooltip.color}30`,
                  color: tooltip.color,
                  boxShadow: `0 4px 20px rgba(0,0,0,0.2), 0 0 0 1px ${tooltip.color}10`,
                }}
              >
                {tooltip.label}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
