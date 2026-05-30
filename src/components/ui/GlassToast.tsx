"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { clsx } from "clsx";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const toastConfig: Record<ToastType, { icon: React.ReactNode; color: string }> = {
  success: { icon: <CheckCircle size={16} />, color: "#10B981" },
  error: { icon: <AlertCircle size={16} />, color: "#F43F5E" },
  info: { icon: <Info size={16} />, color: "#06B6D4" },
};

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const config = toastConfig[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className="flex items-center gap-3 px-4 py-3 glass-elevated rounded-[var(--radius-md)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] min-w-[280px] max-w-sm"
      style={{ borderColor: `${config.color}30` }}
    >
      <span style={{ color: config.color }}>{config.icon}</span>
      <p className="flex-1 text-sm" style={{ color: "var(--text-primary)" }}>{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="transition-colors"
        style={{ color: "var(--text-muted)" }}
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}
