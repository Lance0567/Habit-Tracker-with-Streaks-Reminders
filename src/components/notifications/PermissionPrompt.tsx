"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";
import { requestPermission } from "@/lib/notifications";
import { useHabitStore } from "@/store/habitStore";

export function PermissionPrompt() {
  const settings = useHabitStore((s) => s.settings);
  const updateSettings = useHabitStore((s) => s.updateSettings);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if ("Notification" in window) setPermission(Notification.permission);
  }, []);

  const visible =
    !dismissed &&
    settings?.notificationsEnabled === true &&
    permission === "default";

  async function handleAllow() {
    const perm = await requestPermission();
    setPermission(perm);
    setDismissed(true);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 w-80"
        >
          <div
            className="p-5 rounded-[var(--radius-lg)]"
            style={{
              background: "rgba(10, 7, 28, 0.92)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(124, 58, 237, 0.25)",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.7), 0 0 20px rgba(124,58,237,0.12), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-start gap-3">
              <span
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(124,58,237,0.2)", color: "#7C3AED" }}
              >
                <Bell size={18} />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white/90 mb-1">Enable reminders?</p>
                <p className="text-xs text-white/45 leading-relaxed">
                  Get notified when it&apos;s time to complete your habits.
                </p>
                <div className="flex gap-2 mt-4">
                  <GlassButton
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={handleAllow}
                  >
                    Allow
                  </GlassButton>
                  <GlassButton variant="ghost" size="sm" onClick={() => setDismissed(true)}>
                    Not now
                  </GlassButton>
                </div>
              </div>
              <button
                onClick={() => setDismissed(true)}
                className="text-white/25 hover:text-white/60 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
