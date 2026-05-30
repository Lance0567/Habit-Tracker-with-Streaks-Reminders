"use client";

import { clsx } from "clsx";
import { forwardRef } from "react";

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "var(--text-muted)" }}
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={clsx(
              "w-full glass rounded-[var(--radius-md)] px-4 py-2.5 text-sm transition-all duration-200",
              "focus:outline-none focus:border-[var(--color-accent)]/50 focus:bg-[var(--glass-bg-elevated)]",
              "border border-[var(--glass-border)]",
              "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
              icon && "pl-10",
              error && "border-rose/50",
              className
            )}
            style={{ color: "var(--text-primary)" }}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-rose">{error}</p>}
      </div>
    );
  }
);
GlassInput.displayName = "GlassInput";

interface GlassTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const GlassTextarea = forwardRef<
  HTMLTextAreaElement,
  GlassTextareaProps
>(({ label, error, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={clsx(
          "w-full glass rounded-[var(--radius-md)] px-4 py-2.5 text-sm resize-none transition-all duration-200",
          "focus:outline-none focus:border-[var(--color-accent)]/50 focus:bg-[var(--glass-bg-elevated)]",
          "border border-[var(--glass-border)]",
          "text-[var(--text-primary)] placeholder:text-[var(--text-muted)]",
          error && "border-rose/50",
          className
        )}
        style={{ color: "var(--text-primary)" }}
        {...props}
      />
      {error && <p className="text-xs text-rose">{error}</p>}
    </div>
  );
});
GlassTextarea.displayName = "GlassTextarea";
