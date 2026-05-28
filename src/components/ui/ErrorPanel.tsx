"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { GlassButton } from "@/components/ui/GlassButton";

interface ErrorPanelProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorPanel({ error, reset }: ErrorPanelProps) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div
        className="flex flex-col items-center gap-5 p-8 rounded-[var(--radius-lg)] max-w-sm w-full text-center"
        style={{
          background: "rgba(244,63,94,0.06)",
          border: "1px solid rgba(244,63,94,0.20)",
          boxShadow: "0 0 32px rgba(244,63,94,0.08)",
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{
            background: "rgba(244,63,94,0.12)",
            border: "1px solid rgba(244,63,94,0.25)",
          }}
        >
          <AlertTriangle size={24} style={{ color: "#F43F5E" }} />
        </div>

        <div>
          <p className="text-base font-semibold text-white/85">Something went wrong</p>
          <p className="text-sm text-white/40 mt-1">
            {error.message || "An unexpected error occurred."}
          </p>
        </div>

        <GlassButton variant="secondary" size="sm" onClick={reset}>
          <RotateCcw size={14} />
          Try again
        </GlassButton>
      </div>
    </div>
  );
}
