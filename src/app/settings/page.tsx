"use client";

import { motion } from "framer-motion";
import { Bell, Download, Trash2, Globe, Palette, Check, Moon, Sun } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { Spinner } from "@/components/ui/Spinner";
import { useHabitStore } from "@/store/habitStore";
import { THEME_PRESETS, getTheme } from "@/lib/themes";
import * as storage from "@/lib/storage";

export default function SettingsPage() {
  const { settings, isLoading, updateSettings, resetData } = useHabitStore();

  const handleExport = async () => {
    const json = await storage.exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `habitflow-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      await storage.importData(text);
      window.location.reload();
    };
    input.click();
  };

  const handleReset = async () => {
    if (!confirm("This will permanently delete all your habits, logs, and settings. Are you sure?")) return;
    await resetData();
  };

  const handleNotifications = async () => {
    if (!settings) return;
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      await updateSettings({ ...settings, notificationsEnabled: true });
    }
  };

  const handleWeekStart = async (day: 0 | 1) => {
    if (!settings) return;
    await updateSettings({ ...settings, weekStartsOn: day });
  };

  const handleDefaultView = async (view: "grid" | "list") => {
    if (!settings) return;
    await updateSettings({ ...settings, defaultView: view });
  };

  const handleAccentColor = async (accent: string) => {
    if (!settings) return;
    await updateSettings({ ...settings, accentColor: accent });
  };

  const handleColorMode = async (mode: "dark" | "light") => {
    if (!settings) return;
    await updateSettings({ ...settings, theme: mode });
  };

  const activeTheme = getTheme(settings?.accentColor);
  const activeMode  = settings?.theme ?? "dark";
  const isDark      = activeMode === "dark";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size={32} />
      </div>
    );
  }

  const sections = [
    {
      title: "Notifications",
      icon: <Bell size={16} />,
      color: "var(--color-accent)",
      items: [
        {
          label: "Browser Notifications",
          desc: settings?.notificationsEnabled
            ? "Notifications are enabled"
            : "Get reminded when it's time to check in",
          action: (
            <GlassButton
              variant={settings?.notificationsEnabled ? "secondary" : "primary"}
              size="sm"
              onClick={handleNotifications}
              disabled={settings?.notificationsEnabled}
            >
              {settings?.notificationsEnabled ? "Enabled" : "Enable"}
            </GlassButton>
          ),
        },
      ],
    },
    {
      title: "Preferences",
      icon: <Globe size={16} />,
      color: "#06B6D4",
      items: [
        {
          label: "Week Starts On",
          desc: "Sunday or Monday",
          action: (
            <div className="flex gap-2">
              <GlassButton
                variant={settings?.weekStartsOn === 0 ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleWeekStart(0)}
              >
                Sun
              </GlassButton>
              <GlassButton
                variant={settings?.weekStartsOn === 1 ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleWeekStart(1)}
              >
                Mon
              </GlassButton>
            </div>
          ),
        },
        {
          label: "Default View",
          desc: "Grid or list layout",
          action: (
            <div className="flex gap-2">
              <GlassButton
                variant={settings?.defaultView === "grid" ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleDefaultView("grid")}
              >
                Grid
              </GlassButton>
              <GlassButton
                variant={settings?.defaultView === "list" ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleDefaultView("list")}
              >
                List
              </GlassButton>
            </div>
          ),
        },
      ],
    },
    {
      title: "Appearance",
      icon: <Palette size={16} />,
      color: "var(--color-accent)",
      items: [
        {
          label: "Accent Color",
          desc: "Choose a color theme for the interface",
          action: (
            <div className="flex flex-wrap gap-2.5">
              {THEME_PRESETS.map((preset) => {
                const isSelected = activeTheme.id === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleAccentColor(preset.accent)}
                    title={preset.name}
                    className="relative w-8 h-8 rounded-full transition-transform duration-150 hover:scale-110 focus:outline-none"
                    style={{
                      backgroundColor: preset.accent,
                      boxShadow: isSelected
                        ? `0 0 0 2px rgba(255,255,255,0.9), 0 0 14px ${preset.accent}`
                        : `0 0 0 1px rgba(255,255,255,0.12)`,
                    }}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <Check size={13} color="#fff" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ),
        },
        {
          label: "Color Mode",
          desc: "Switch between dark and light interface",
          action: (
            <div className="flex gap-2">
              <GlassButton
                variant={activeMode === "dark" ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleColorMode("dark")}
              >
                <Moon size={13} /> Dark
              </GlassButton>
              <GlassButton
                variant={activeMode === "light" ? "primary" : "secondary"}
                size="sm"
                onClick={() => handleColorMode("light")}
              >
                <Sun size={13} /> Light
              </GlassButton>
            </div>
          ),
        },
      ],
    },
    {
      title: "Data",
      icon: <Download size={16} />,
      color: "#10B981",
      items: [
        {
          label: "Export Data",
          desc: "Download all your habits and logs as JSON",
          action: (
            <GlassButton variant="secondary" size="sm" onClick={handleExport}>
              <Download size={14} /> Export
            </GlassButton>
          ),
        },
        {
          label: "Import Data",
          desc: "Restore from a previous export",
          action: (
            <GlassButton variant="secondary" size="sm" onClick={handleImport}>
              Import
            </GlassButton>
          ),
        },
      ],
    },
    {
      title: "Danger Zone",
      icon: <Trash2 size={16} />,
      color: "#F43F5E",
      items: [
        {
          label: "Reset All Data",
          desc: "Permanently delete all habits, logs, and settings",
          action: (
            <GlassButton variant="danger" size="sm" onClick={handleReset}>
              <Trash2 size={14} /> Reset
            </GlassButton>
          ),
        },
      ],
    },
  ];

  return (
    <div className="max-w-2xl space-y-6">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Settings</h2>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>Manage your app preferences and data</p>
      </motion.div>

      {sections.map((section, si) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: si * 0.08 }}
        >
          <GlassCard className="overflow-hidden">
            <div
              className="flex items-center gap-2.5 px-5 py-3"
              style={{
                backgroundColor: `${section.color}${isDark ? "0D" : "12"}`,
                borderBottom: "1px solid var(--divider)",
              }}
            >
              <span style={{ color: section.color }}>{section.icon}</span>
              <h3 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>{section.title}</h3>
            </div>
            <div>
              {section.items.map((item, idx) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-5 py-4 gap-4"
                  style={idx > 0 ? { borderTop: "1px solid var(--divider)" } : {}}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                  </div>
                  {item.action}
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      ))}

      <p className="text-center text-xs" style={{ color: "var(--text-muted)", opacity: 0.6 }}>HabitFlow v0.1.0 · Built with care</p>
    </div>
  );
}
