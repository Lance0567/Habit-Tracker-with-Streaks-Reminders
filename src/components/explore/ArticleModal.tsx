"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Sparkles } from "lucide-react";
import type { Article } from "@/lib/articles";

interface Props {
  article: Article | null;
  open: boolean;
  onClose: () => void;
}

export function ArticleModal({ article, open, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!article) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <motion.div
            className="relative w-full max-w-2xl rounded-[var(--radius-xl)] overflow-hidden flex flex-col max-h-[88vh]"
            style={{
              background: "var(--popup-bg)",
              backdropFilter: "blur(32px)",
              WebkitBackdropFilter: "blur(32px)",
              border: "1px solid var(--popup-border)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            }}
            initial={{ scale: 0.94, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg transition-all"
              style={{ background: "var(--glass-bg-subtle)", color: "var(--text-muted)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* Header */}
            <div
              className="px-6 pt-6 pb-5 flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${article.color}22 0%, ${article.color}08 70%, transparent 100%)` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{article.emoji}</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${article.color}18`, color: article.color, border: `1px solid ${article.color}30` }}>
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                    <Clock size={11} /> {article.readTime} min read
                  </span>
                </div>
              </div>
              <h2 className="text-xl font-bold pr-8 leading-snug" style={{ color: "var(--text-primary)" }}>
                {article.title}
              </h2>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {article.content.map((section, i) => (
                <div key={i} className="space-y-1.5">
                  {section.heading && (
                    <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{section.heading}</h3>
                  )}
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{section.body}</p>
                </div>
              ))}

              {/* Key takeaways */}
              <div
                className="rounded-2xl p-5 mt-2"
                style={{ background: `${article.color}0F`, border: `1px solid ${article.color}30` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={15} style={{ color: article.color }} />
                  <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Key Takeaways</h3>
                </div>
                <ul className="space-y-2">
                  {article.keyTakeaways.map((t, i) => (
                    <li key={i} className="flex gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <span
                        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
                        style={{ background: `${article.color}20`, color: article.color }}
                      >
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
