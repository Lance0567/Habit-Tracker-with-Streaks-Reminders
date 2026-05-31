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

function SectionDivider({ collapsed, label }: { collapsed: boolean; label: string }) {
  if (collapsed) {
    return <div className="mx-3 my-2 h-px" style={{ background: "var(--divider)" }} />;
  }
  return (
    <div className="flex items-center gap-2.5 pl-5 pr-3 pt-3 pb-1.5">
      <span
        className="text-[9px] font-bold tracking-[0.22em] uppercase whitespace-nowrap flex-shrink-0"
        style={{ color: "var(--text-muted)", opacity: 0.5 }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--divider)", opacity: 0.7 }} />
    </div>
  );
}

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
        <motion.div
          whileHover={!collapsed ? { x: 2 } : {}}
          transition={{ duration: 0.12, ease: "easeOut" }}
          className={clsx(
            "relative flex items-center cursor-pointer transition-colors duration-200 group",
            collapsed
              ? "justify-center py-1.5 mx-2"
              : "mx-2 px-2.5 py-2 rounded-xl gap-2.5"
          )}
          style={
            !collapsed
              ? {
                  borderRadius: 12,
                  backgroundColor: isActive ? `${color}0E` : undefined,
                  boxShadow: isActive ? `inset 3px 0 0 ${color}` : undefined,
                }
              : undefined
          }
          onMouseEnter={(e) => {
            if (!isActive && !collapsed) {
              (e.currentTarget as HTMLElement).style.backgroundColor = "var(--glass-bg-subtle)";
            }
            if (collapsed) {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              setTooltip({ label, color, y: rect.top + rect.height / 2 });
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive && !collapsed) {
              (e.currentTarget as HTMLElement).style.backgroundColor = "";
            }
            setTooltip(null);
          }}
        >
          {/* Icon badge — always contained, scales between collapsed/expanded */}
          <div
            className="flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              width: collapsed ? 40 : 32,
              height: collapsed ? 40 : 32,
              borderRadius: collapsed ? 12 : 8,
              backgroundColor: isActive ? `${color}1C` : "transparent",
              border: `1px solid ${isActive ? `${color}35` : "transparent"}`,
              boxShadow: isActive && collapsed ? `0 0 14px ${color}28` : undefined,
            }}
          >
            <Icon
              size={collapsed ? 18 : 16}
              style={
                isActive
                  ? { color, filter: `drop-shadow(0 0 5px ${color}90)` }
                  : { color: "var(--text-muted)" }
              }
              className={!isActive ? "group-hover:text-[var(--text-secondary)] transition-colors duration-200" : ""}
            />
          </div>

          {/* Label + active dot (expanded only) */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center justify-between flex-1 min-w-0"
              >
                <span
                  className={clsx(
                    "text-[13px] whitespace-nowrap transition-colors duration-200",
                    isActive
                      ? "font-semibold text-[var(--text-primary)]"
                      : "font-medium text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                  )}
                >
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
        }}
      >
        {/* Top accent glow — "lit from above" atmosphere */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% -10%, ${accentColor}18 0%, transparent 72%)`,
          }}
        />

        {/* Logo */}
        <div
          className={clsx(
            "relative flex items-center flex-shrink-0",
            collapsed ? "justify-center py-5" : "px-4 py-5 gap-3"
          )}
          style={{ borderBottom: "1px solid var(--divider)" }}
        >
          {/* App icon */}
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: isDark
                ? `linear-gradient(135deg, ${accentColor}2C 0%, ${accentColor}0F 100%)`
                : `linear-gradient(135deg, ${accentColor} 0%, #9333EA 100%)`,
              border: `1px solid ${accentColor}${isDark ? "3A" : "28"}`,
              boxShadow: isDark
                ? `0 0 20px ${accentColor}18`
                : `0 3px 12px ${accentColor}32`,
            }}
          >
            <Zap
              size={16}
              style={{
                color: isDark ? accentColor : "#fff",
                filter: isDark ? `drop-shadow(0 0 8px ${accentColor})` : "none",
              }}
            />
          </div>

          {/* Brand name */}
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="whitespace-nowrap overflow-hidden"
              >
                <span
                  className="text-sm font-semibold tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  Habit
                </span>
                <span
                  className="text-sm font-bold tracking-tight"
                  style={{ color: accentColor }}
                >
                  Flow
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex flex-col flex-1 py-2 overflow-y-auto overflow-x-hidden">
          {/* Main group */}
          <SectionDivider collapsed={collapsed} label="Main" />
          <div className="flex flex-col gap-0.5">
            {mainItems.map(renderItem)}
          </div>

          {/* System group */}
          <SectionDivider collapsed={collapsed} label="System" />
          <div className="flex flex-col gap-0.5">
            {systemItems.map(renderItem)}
          </div>
        </nav>
      </motion.aside>

      {/* ── Floating collapse toggle (portal, clears overflow:hidden) ────────── */}
      {mounted && createPortal(
        <motion.button
          onClick={toggleSidebar}
          animate={{ left: collapsed ? 58 : 226 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="fixed z-[9998] top-[68px] flex items-center justify-center focus:outline-none"
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--nav-bg)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1.5px solid var(--nav-border)",
            boxShadow: isDark
              ? "0 2px 12px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05)"
              : "0 2px 10px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.8)",
            color: "var(--text-muted)",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.borderColor = `${accentColor}80`;
            b.style.color = accentColor;
            b.style.boxShadow = `0 2px 16px ${accentColor}30`;
          }}
          onMouseLeave={(e) => {
            const b = e.currentTarget as HTMLButtonElement;
            b.style.borderColor = "";
            b.style.color = "var(--text-muted)";
            b.style.boxShadow = isDark
              ? "0 2px 12px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.05)"
              : "0 2px 10px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.8)";
          }}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <motion.div
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            <ChevronRight size={13} />
          </motion.div>
        </motion.button>,
        document.body
      )}

      {/* ── Collapsed-mode tooltip (portal, escapes overflow:hidden) ─────────── */}
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
              {/* Arrow nub */}
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
