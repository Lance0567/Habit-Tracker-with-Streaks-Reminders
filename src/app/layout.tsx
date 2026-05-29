"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomNav } from "@/components/layout/BottomNav";
import { StoreProvider } from "@/components/layout/StoreProvider";
import { useUIStore } from "@/store/uiStore";
import { clsx } from "clsx";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased bg-[#050510]">
        <MotionConfig reducedMotion="user">
          <StoreProvider>
            <AnimatedBackground />
            <LayoutShell>{children}</LayoutShell>
          </StoreProvider>
        </MotionConfig>
      </body>
    </html>
  );
}

function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const collapsed = useUIStore((s) => s.sidebarCollapsed);

  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/habits") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/categories") ||
    pathname.startsWith("/settings");

  if (!isAppRoute) return <>{children}</>;

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
    </div>
  );
}
