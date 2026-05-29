"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  Tag,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { useUIStore } from "@/store/uiStore";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/habits", icon: CheckSquare, label: "Habits" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/categories", icon: Tag, label: "Categories" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => { setPendingHref(null); }, [pathname]);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="hidden md:flex fixed left-0 top-0 bottom-0 z-40 flex-col overflow-hidden"
      style={{
        background: "rgba(8, 5, 22, 0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(124, 58, 237, 0.15)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
          <Zap size={18} className="text-accent-light" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="font-semibold text-white/90 whitespace-nowrap"
            >
              HabitFlow
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname.startsWith(href) || pendingHref === href;
          return (
            <Link key={href} href={href} onClick={() => setPendingHref(href)}>
              <motion.div
                whileHover={{ x: 2 }}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-accent/15 border border-accent/25 text-accent-light shadow-glow-sm"
                    : "text-white/40 hover:text-white/75 hover:bg-white/5 border border-transparent"
                )}
              >
                <Icon
                  size={18}
                  className="flex-shrink-0"
                  style={isActive ? { filter: "drop-shadow(0 0 6px #7C3AED)" } : {}}
                />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && !collapsed && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-light"
                    style={{ filter: "drop-shadow(0 0 4px #A78BFA)" }}
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-[var(--radius-md)] text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </motion.aside>
  );
}
