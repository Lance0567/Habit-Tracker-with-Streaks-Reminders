"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import { ARTICLES } from "@/lib/articles";

export default function ArticleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const article = ARTICLES.find((a) => a.id === id) ?? null;

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>Article not found.</p>
        <Link href="/explore?tab=articles" className="text-sm font-semibold mt-3 inline-block" style={{ color: "var(--color-accent-light)" }}>
          ← Back to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/explore?tab=articles"
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
        style={{ color: "var(--text-muted)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)"; }}
      >
        <ArrowLeft size={15} /> Explore
      </Link>

      {/* Header */}
      <div
        className="rounded-3xl px-6 py-6"
        style={{ background: `linear-gradient(135deg, ${article.color}22 0%, ${article.color}08 70%, var(--glass-bg-subtle) 100%)`, border: `1px solid ${article.color}26` }}
      >
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="text-3xl">{article.emoji}</span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: `${article.color}18`, color: article.color, border: `1px solid ${article.color}30` }}>
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
            <Clock size={11} /> {article.readTime} min read
          </span>
        </div>
        <h1 className="text-2xl font-bold leading-snug" style={{ color: "var(--text-primary)" }}>{article.title}</h1>
      </div>

      {/* Body */}
      <article className="space-y-5">
        {article.content.map((section, i) => (
          <div key={i} className="space-y-1.5">
            {section.heading && (
              <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{section.heading}</h2>
            )}
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{section.body}</p>
          </div>
        ))}

        {/* Key takeaways */}
        <div className="rounded-2xl p-5" style={{ background: `${article.color}0F`, border: `1px solid ${article.color}30` }}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={15} style={{ color: article.color }} />
            <h2 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>Key Takeaways</h2>
          </div>
          <ul className="space-y-2">
            {article.keyTakeaways.map((t, i) => (
              <li key={i} className="flex gap-2.5 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5"
                  style={{ background: `${article.color}20`, color: article.color }}>
                  {i + 1}
                </span>
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
