"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { StoreProvider } from "@/components/layout/StoreProvider";
import { useUIStore } from "@/store/uiStore";

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
        <StoreProvider>
          <AnimatedBackground />
          <LayoutShell>{children}</LayoutShell>
        </StoreProvider>
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
      <motion.div
        className="flex-1 flex flex-col min-h-screen"
        animate={{ marginLeft: collapsed ? 72 : 240 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <TopBar />
        <main className="flex-1 p-6">{children}</main>
      </motion.div>
    </div>
  );
}
