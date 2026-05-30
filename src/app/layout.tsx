import "./globals.css";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * This script runs synchronously in <head> BEFORE React hydrates.
 * It reads the persisted theme from localStorage and applies data-theme
 * to <html> immediately, eliminating the dark→light flash on refresh.
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem('habitflow-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Blocking theme initializer — must be first to prevent flash */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-screen antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
