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
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={clsx(
              "w-full glass rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-white/90 placeholder:text-white/25",
              "focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all duration-200",
              "border border-white/10",
              icon && "pl-10",
              error && "border-rose/50",
              className
            )}
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
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={clsx(
          "w-full glass rounded-[var(--radius-md)] px-4 py-2.5 text-sm text-white/90 placeholder:text-white/25 resize-none",
          "focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all duration-200",
          "border border-white/10",
          error && "border-rose/50",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-rose">{error}</p>}
    </div>
  );
});
GlassTextarea.displayName = "GlassTextarea";
