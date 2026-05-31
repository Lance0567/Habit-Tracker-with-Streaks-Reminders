"use client";

import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { clsx } from "clsx";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { StoreProvider } from "@/components/layout/StoreProvider";
import { ToastContainer } from "@/components/ui/GlassToast";
import { useUIStore } from "@/store/uiStore";

// Inner layout: only mounts when isAppRoute is true (StoreProvider guarantees auth)
function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div
        className={clsx(
          "flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          collapsed ? "md:ml-[72px]" : "md:ml-[240px]"
        )}
      >
        <TopBar />
        <main className="flex-1 p-4 sm:p-6">
          {children}
          {/* Spacer so content clears the bottom nav on mobile */}
          <div className="h-20 md:hidden" aria-hidden />
        </main>
        <BottomNav />
      </div>
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}

// Decides whether to wrap with StoreProvider (which calls hydrate → Supabase).
// On /auth the user is unauthenticated; StoreProvider must not mount there.
function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/habits") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/settings");

  if (!isAppRoute) return <>{children}</>;

  return (
    <StoreProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </StoreProvider>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider />
      <AnimatedBackground />
      <LayoutShell>{children}</LayoutShell>
    </MotionConfig>
  );
}
