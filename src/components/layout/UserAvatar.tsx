"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

export function UserAvatar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    setOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
  }

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const displayName =
    (user?.user_metadata?.full_name as string) ||
    (user?.user_metadata?.name as string) ||
    user?.email ||
    "";
  const email = user?.email ?? "";
  const initial = (displayName[0] || email[0] || "U").toUpperCase();

  return (
    <div className="relative">
      {/* Circular avatar button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        style={{
          border: open
            ? "2px solid var(--color-accent-light)"
            : "2px solid var(--glass-border-hover)",
          boxShadow: open ? "var(--glow-sm)" : "none",
        }}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span
            className="w-full h-full flex items-center justify-center text-sm font-bold text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--color-accent) 0%, #9333EA 100%)",
            }}
          >
            {initial}
          </span>
        )}
      </button>

      {/* Popup */}
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-12 right-0 z-50 w-[220px]"
            >
              <div
                className="overflow-hidden rounded-[var(--radius-lg)]"
                style={{
                  background: "var(--popup-bg)",
                  backdropFilter: "blur(32px)",
                  WebkitBackdropFilter: "blur(32px)",
                  border: "1px solid var(--popup-border)",
                  boxShadow:
                    "0 24px 64px rgba(0,0,0,0.40), 0 0 0 1px var(--divider)",
                }}
              >
                {/* User info header */}
                <div
                  className="px-4 py-3.5 flex items-center gap-3"
                  style={{ borderBottom: "1px solid var(--divider)" }}
                >
                  <div
                    className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                    style={{ border: "1px solid var(--glass-border-hover)" }}
                  >
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span
                        className="w-full h-full flex items-center justify-center text-sm font-bold text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--color-accent) 0%, #9333EA 100%)",
                        }}
                      >
                        {initial}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {displayName || "User"}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {email}
                    </p>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--text-primary)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color =
                        "var(--text-secondary)")
                    }
                  >
                    <Settings size={14} />
                    Account Settings
                  </Link>

                  <div
                    className="mx-3 my-1"
                    style={{ height: 1, background: "var(--divider)" }}
                  />

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150"
                    style={{ color: "#F43F5E" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(244,63,94,0.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
