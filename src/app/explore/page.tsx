"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Layers, Play, CheckCircle, ChevronRight, Clock, RotateCcw } from "lucide-react";
import { PROGRAMS } from "@/lib/programs";
import { ARTICLES, type ArticleCategory } from "@/lib/articles";
import {
  getUserPrograms,
  enrollProgram,
  updateProgramDay,
  completeProgram,
  unenrollProgram,
} from "@/lib/storage";
import type { UserProgram } from "@/types";

type Tab = "programs" | "articles";

const CATEGORIES: ArticleCategory[] = ["Science", "Strategy", "Mindset", "Productivity", "Health"];

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "#10B981",
  Medium:   "#F59E0B",
  Hard:     "#F43F5E",
};

// ── Program Card ─────────────────────────────────────────────────────────────

function ProgramCard({
  program,
  enrollment,
  onStart,
  onContinue,
  onReset,
  featured,
}: {
  program: (typeof PROGRAMS)[number];
  enrollment?: UserProgram;
  onStart: () => void;
  onContinue: () => void;
  onReset: () => void;
  featured?: boolean;
}) {
  const isCompleted = !!enrollment?.completedAt;
  const inProgress  = !!enrollment && !isCompleted;
  const progress    = inProgress ? Math.min((enrollment.currentDay / program.duration) * 100, 100) : 0;

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{
          background: `linear-gradient(135deg, ${program.color}22 0%, ${program.color}08 60%, var(--glass-bg-subtle) 100%)`,
          border: `1px solid ${program.color}30`,
        }}
      >
        {/* Glow */}
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${program.color}30 0%, transparent 70%)`, filter: "blur(32px)" }}
        />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Left */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-3xl">{program.emoji}</span>
              <div className="flex gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${program.color}18`, color: program.color, border: `1px solid ${program.color}30` }}>
                  {program.duration} days
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${DIFFICULTY_COLOR[program.difficulty]}18`, color: DIFFICULTY_COLOR[program.difficulty], border: `1px solid ${DIFFICULTY_COLOR[program.difficulty]}30` }}>
                  {program.difficulty}
                </span>
                {featured && (
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: "rgba(124,58,237,0.15)", color: "var(--color-accent-light)", border: "1px solid rgba(124,58,237,0.25)" }}>
                    Featured
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{program.title}</h3>
            <p className="text-sm leading-relaxed max-w-lg" style={{ color: "var(--text-secondary)" }}>
              {program.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {program.habits.map((h) => (
                <span key={h} className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: "var(--glass-bg-default)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}>
                  {h}
                </span>
              ))}
            </div>
          </div>

          {/* Right: action */}
          <div className="sm:text-right space-y-3 sm:min-w-[160px]">
            {isCompleted ? (
              <>
                <div className="flex items-center gap-2 justify-start sm:justify-end"
                  style={{ color: "#10B981" }}>
                  <CheckCircle size={16} />
                  <span className="text-sm font-semibold">Completed!</span>
                </div>
                <button onClick={onReset}
                  className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl transition-all"
                  style={{ background: "var(--glass-bg-default)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}>
                  <RotateCcw size={12} /> Restart
                </button>
              </>
            ) : inProgress ? (
              <>
                <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                  Day {enrollment.currentDay} of {program.duration}
                </p>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--glass-bg-elevated)" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, background: program.color }} />
                </div>
                <button onClick={onContinue}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: program.color, boxShadow: `0 0 20px ${program.color}40` }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
                  Continue <ChevronRight size={14} />
                </button>
              </>
            ) : (
              <button onClick={onStart}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
                style={{ background: program.color, boxShadow: `0 0 20px ${program.color}40` }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
                <Play size={14} /> Start Program
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Regular card
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col rounded-2xl p-5 h-full transition-all duration-200"
      style={{
        background: "var(--glass-bg-default)",
        border: `1px solid var(--glass-border)`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = `${program.color}35`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)"; }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{program.emoji}</span>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${program.color}18`, color: program.color, border: `1px solid ${program.color}30` }}>
            {program.duration}d
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${DIFFICULTY_COLOR[program.difficulty]}18`, color: DIFFICULTY_COLOR[program.difficulty], border: `1px solid ${DIFFICULTY_COLOR[program.difficulty]}30` }}>
            {program.difficulty}
          </span>
        </div>
      </div>

      <h3 className="text-sm font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>{program.title}</h3>
      <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: "var(--text-muted)" }}>
        {program.description.slice(0, 100)}…
      </p>

      {isCompleted ? (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#10B981" }}>
            <CheckCircle size={13} /> Completed
          </div>
          <button onClick={onReset} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs transition-all"
            style={{ background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}>
            <RotateCcw size={11} /> Restart
          </button>
        </div>
      ) : inProgress ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>Day {enrollment.currentDay} / {program.duration}</span>
            <span className="text-xs font-semibold" style={{ color: program.color }}>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--glass-bg-elevated)" }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: program.color }} />
          </div>
          <button onClick={onContinue}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all"
            style={{ background: program.color }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
            Continue <ChevronRight size={12} />
          </button>
        </div>
      ) : (
        <button onClick={onStart}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all"
          style={{ background: program.color }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}>
          <Play size={12} /> Start Program
        </button>
      )}
    </motion.div>
  );
}

// ── Article Card ─────────────────────────────────────────────────────────────

function ArticleCard({ article, index }: { article: (typeof ARTICLES)[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => setExpanded((v) => !v)}
      className="rounded-2xl p-5 cursor-pointer transition-all duration-200"
      style={{
        background: "var(--glass-bg-default)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = `${article.color}35`;
        (e.currentTarget as HTMLDivElement).style.background = "var(--glass-bg-elevated)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--glass-border)";
        (e.currentTarget as HTMLDivElement).style.background = "var(--glass-bg-default)";
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xl flex-shrink-0">{article.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: `${article.color}18`, color: article.color, border: `1px solid ${article.color}30` }}>
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
              <Clock size={9} /> {article.readTime} min read
            </span>
          </div>
          <h3 className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
            {article.title}
          </h3>
        </div>
      </div>

      <AnimatePresence>
        {expanded ? (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs leading-relaxed overflow-hidden"
            style={{ color: "var(--text-secondary)" }}
          >
            {article.excerpt}
          </motion.p>
        ) : (
          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
            {article.excerpt}
          </p>
        )}
      </AnimatePresence>

      <p className="text-[10px] mt-2 font-medium" style={{ color: article.color }}>
        {expanded ? "Show less ↑" : "Read more ↓"}
      </p>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const [tab, setTab]                     = useState<Tab>("programs");
  const [categoryFilter, setCategoryFilter] = useState<ArticleCategory | "All">("All");
  const [enrolledMap, setEnrolledMap]     = useState<Record<string, UserProgram>>({});
  const [loadingId, setLoadingId]         = useState<string | null>(null);

  useEffect(() => {
    getUserPrograms()
      .then((programs) => {
        const map: Record<string, UserProgram> = {};
        programs.forEach((p) => { map[p.programId] = p; });
        setEnrolledMap(map);
      })
      .catch(() => {});
  }, []);

  async function handleStart(programId: string) {
    setLoadingId(programId);
    try {
      const enrolled = await enrollProgram(programId);
      setEnrolledMap((prev) => ({ ...prev, [programId]: enrolled }));
    } finally {
      setLoadingId(null);
    }
  }

  async function handleContinue(programId: string, duration: number) {
    const current = enrolledMap[programId];
    if (!current) return;
    const nextDay = current.currentDay + 1;
    const optimistic: UserProgram = { ...current, currentDay: nextDay };
    setEnrolledMap((prev) => ({ ...prev, [programId]: optimistic }));
    if (nextDay > duration) {
      await completeProgram(programId);
      setEnrolledMap((prev) => ({ ...prev, [programId]: { ...optimistic, completedAt: new Date().toISOString() } }));
    } else {
      await updateProgramDay(programId, nextDay);
    }
  }

  async function handleReset(programId: string) {
    await unenrollProgram(programId);
    setEnrolledMap((prev) => {
      const next = { ...prev };
      delete next[programId];
      return next;
    });
  }

  const featuredProgram = PROGRAMS.find((p) => p.featured);
  const otherPrograms   = PROGRAMS.filter((p) => !p.featured);

  const filteredArticles = categoryFilter === "All"
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === categoryFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between gap-4 flex-wrap"
      >
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Explore</h2>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Discover programs and articles to level up your habits
          </p>
        </div>

        {/* Tab toggle */}
        <div
          className="flex gap-1 p-1 rounded-xl"
          style={{ background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)" }}
        >
          {([
            { key: "programs" as Tab, icon: <Layers size={13} />, label: "Programs" },
            { key: "articles" as Tab, icon: <BookOpen size={13} />, label: "Articles" },
          ]).map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              style={
                tab === key
                  ? { background: "var(--color-accent)", color: "#fff", boxShadow: "0 0 12px rgba(124,58,237,0.35)" }
                  : { color: "var(--text-muted)" }
              }
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {tab === "programs" ? (
          <motion.div
            key="programs"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Featured hero card */}
            {featuredProgram && (
              <ProgramCard
                program={featuredProgram}
                enrollment={enrolledMap[featuredProgram.id]}
                onStart={() => handleStart(featuredProgram.id)}
                onContinue={() => handleContinue(featuredProgram.id, featuredProgram.duration)}
                onReset={() => handleReset(featuredProgram.id)}
                featured
              />
            )}

            {/* Grid of other programs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherPrograms.map((program, i) => (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                >
                  <ProgramCard
                    program={program}
                    enrollment={enrolledMap[program.id]}
                    onStart={() => handleStart(program.id)}
                    onContinue={() => handleContinue(program.id, program.duration)}
                    onReset={() => handleReset(program.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="articles"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Category filter pills */}
            <div className="flex gap-2 flex-wrap">
              {(["All", ...CATEGORIES] as (ArticleCategory | "All")[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                  style={
                    categoryFilter === cat
                      ? { background: "var(--color-accent)", color: "#fff" }
                      : { background: "var(--glass-bg-default)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Article grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence>
                {filteredArticles.map((article, i) => (
                  <ArticleCard key={article.id} article={article} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No articles in this category yet.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {loadingId && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-sm font-medium text-white"
          style={{ background: "var(--color-accent)", boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}>
          Starting program…
        </div>
      )}
    </div>
  );
}
