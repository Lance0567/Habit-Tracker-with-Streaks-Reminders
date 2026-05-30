"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, BarChart3, Tag, Settings } from "lucide-react";
import { clsx } from "clsx";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/habits", icon: CheckSquare, label: "Habits" },
  { href: "/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/categories", icon: Tag, label: "Categories" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => { setPendingHref(null); }, [pathname]);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden"
      style={{
        background: "var(--nav-bg)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid var(--nav-border)",
        transition: "background 0.3s ease, border-color 0.3s ease",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname.startsWith(href) || pendingHref === href;
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setPendingHref(href)}
            className={clsx(
              "flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors duration-200",
              isActive ? "text-[var(--color-accent-light)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            )}
          >
            <div
              className={clsx(
                "flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200",
                isActive && "bg-[rgba(124,58,237,0.15)]"
              )}
            >
              <Icon
                size={20}
                style={isActive ? { filter: "drop-shadow(0 0 6px rgba(124,58,237,0.85))" } : {}}
              />
            </div>
            <span className="text-[9px] font-semibold tracking-wider uppercase leading-none">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
