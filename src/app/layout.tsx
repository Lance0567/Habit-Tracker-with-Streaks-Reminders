import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "HabitFlow",
  description: "Build habits that stick.",
};

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
  // Read the theme cookie server-side so the very first byte of HTML already
  // carries the correct data-theme attribute — zero flash, even before JS loads.
  const cookieStore = cookies();
  const themeCookie = cookieStore.get("habitflow-theme")?.value;
  const theme: "dark" | "light" =
    themeCookie === "light" ? "light" : "dark";

  return (
    // suppressHydrationWarning: React sees data-theme on <html> added by server
    // but the client may render a different default before hydration — suppress
    // the mismatch warning since the cookie ensures they always match.
    <html lang="en" className={inter.variable} data-theme={theme} suppressHydrationWarning>
      <head />
      <body className="min-h-screen antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
