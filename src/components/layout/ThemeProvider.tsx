"use client";

import { useEffect } from "react";
import { useHabitStore } from "@/store/habitStore";
import { getTheme } from "@/lib/themes";

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function ThemeProvider() {
  const settings    = useHabitStore((s) => s.settings);
  const accentColor = settings?.accentColor;
  const colorMode   = settings?.theme ?? "dark";

  useEffect(() => {
    // settings is null while Supabase is hydrating. The blocking <head> script
    // already applied the correct data-theme from localStorage, so we must not
    // overwrite it here. Skip until real settings arrive.
    if (!settings) return;

    const theme  = getTheme(accentColor);
    const root   = document.documentElement;
    const isDark = colorMode === "dark";

    // Apply dark / light data attribute (triggers CSS variable overrides in globals.css)
    const mode = isDark ? "dark" : "light";
    root.setAttribute("data-theme", mode);
    // Persist to localStorage (legacy fallback) AND a cookie so the server can
    // stamp data-theme on the initial <html> byte — eliminating any flash on refresh.
    try { localStorage.setItem("habitflow-theme", mode); } catch (_) {}
    try {
      document.cookie = `habitflow-theme=${mode}; path=/; max-age=31536000; SameSite=Lax`;
    } catch (_) {}

    // Core accent vars — glow is dimmed in light mode to avoid overwhelming white surfaces
    root.style.setProperty("--color-accent",       theme.accent);
    root.style.setProperty("--color-accent-light",  theme.light);
    root.style.setProperty("--color-accent-glow",   isDark ? theme.glow : hexToRgba(theme.accent, 0.22));

    // Background orb intensity: strong in dark, soft-atmospheric in light
    root.style.setProperty("--accent-orb-strong", hexToRgba(theme.accent, isDark ? 0.22 : 0.10));
    root.style.setProperty("--accent-orb-medium", hexToRgba(theme.accent, isDark ? 0.15 : 0.07));
    root.style.setProperty("--accent-orb-subtle", hexToRgba(theme.accent, isDark ? 0.06 : 0.04));
  }, [settings, accentColor, colorMode]);

  return null;
}
