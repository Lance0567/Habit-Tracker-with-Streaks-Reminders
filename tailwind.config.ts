import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#050510",
          surface: "#0d0d1a",
          elevated: "#111125",
        },
        accent: {
          DEFAULT: "#7C3AED",
          light: "#A78BFA",
          glow: "rgba(124,58,237,0.5)",
        },
        cyan: {
          DEFAULT: "#06B6D4",
          glow: "rgba(6,182,212,0.4)",
        },
        emerald: { DEFAULT: "#10B981" },
        rose: { DEFAULT: "#F43F5E" },
        amber: { DEFAULT: "#F59E0B" },
      },
      backdropBlur: {
        glass: "20px",
        "glass-lg": "32px",
        "glass-sm": "10px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(124,58,237,0.5)",
        "glow-sm": "0 0 8px rgba(124,58,237,0.4)",
        "glow-lg": "0 0 40px rgba(124,58,237,0.5)",
        "glow-cyan": "0 0 20px rgba(6,182,212,0.4)",
        "glow-emerald": "0 0 20px rgba(16,185,129,0.4)",
        "glow-amber": "0 0 20px rgba(245,158,11,0.5)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 24px rgba(0,0,0,0.4)",
      },
      animation: {
        "float-slow": "float 10s ease-in-out infinite",
        "float-medium": "float 7s ease-in-out infinite alternate",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "check-in": "checkIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards",
        "fade-in": "fadeIn 0.3s ease forwards",
        "slide-up": "slideUp 0.3s ease forwards",
        "bounce-in": "bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px) translateX(0px)" },
          "33%": { transform: "translateY(-20px) translateX(10px)" },
          "66%": { transform: "translateY(10px) translateX(-10px)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.6", filter: "blur(0px)" },
          "50%": { opacity: "1", filter: "blur(1px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        checkIn: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
          "100%": { transform: "scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        bounceIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
