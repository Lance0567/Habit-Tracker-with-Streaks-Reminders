"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Layers, CheckCircle, Clock, ChevronRight } from "lucide-react";
import { PROGRAMS } from "@/lib/programs";
import { ARTICLES, type ArticleCategory } from "@/lib/articles";
import { ProgramDetailModal } from "@/components/explore/ProgramDetailModal";
import { ArticleModal } from "@/components/explore/ArticleModal";
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

// ── Program Card (summary trigger — opens detail modal) ──────────────────────

function ProgramCard({
  program,
  enrollment,
  onOpen,
  featured,
}: {
  program: (typeof PROGRAMS)[number];
  enrollment?: UserProgram;
  onOpen: () => void;
  featured?: boolean;
}) {
  const isCompleted = !!enrollment?.completedAt;
  const inProgress  = !!enrollment && !isCompleted;
  const doneDays    = isCompleted ? program.duration : Math.max(0, (enrollment?.currentDay ?? 1) - 1);
  const progress    = enrollment ? Math.round((doneDays / program.duration) * 100) : 0;
  const diffColor   = DIFFICULTY_COLOR[program.difficulty];

  const statusBadge = isCompleted ? (
    <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#10B981" }}>
      <CheckCircle size={12} /> Completed
    </span>
  ) : inProgress ? (
    <span className="text-[11px] font-semibold" style={{ color: program.color }}>
      Day {enrollment.currentDay} of {program.duration}
    </span>
  ) : (
    <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>Not started</span>
  );

  if (featured) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={onOpen}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-left w-full transition-all"
        style={{
          background: `linear-gradient(135deg, ${program.color}22 0%, ${program.color}08 60%, var(--glass-bg-subtle) 100%)`,
          border: `1px solid ${program.color}30`,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${program.color}55`; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${program.color}30`; }}
      >
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${program.color}30 0%, transparent 70%)`, filter: "blur(32px)" }}
        />
        <div className="relative">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span className="text-3xl">{program.emoji}</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: `${program.color}18`, color: program.color, border: `1px solid ${program.color}30` }}>
              {program.duration} days
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: `${diffColor}18`, color: diffColor, border: `1px solid ${diffColor}30` }}>
              {program.difficulty}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(124,58,237,0.15)", color: "var(--color-accent-light)", border: "1px solid rgba(124,58,237,0.25)" }}>
              Featured
            </span>
          </div>

          <h3 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>{program.title}</h3>
          <p className="text-sm leading-relaxed max-w-lg mb-4" style={{ color: "var(--text-secondary)" }}>
            {program.description}
          </p>

          {/* Progress / status */}
          {inProgress && (
            <div className="max-w-xs mb-4">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--glass-bg-elevated)" }}>
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: program.color }} />
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: program.color, boxShadow: `0 0 20px ${program.color}40` }}>
              {isCompleted ? "View Program" : inProgress ? "Continue" : "Start Program"} <ChevronRight size={14} />
            </span>
            {statusBadge}
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onOpen}
      className="flex flex-col rounded-2xl p-5 h-full w-full text-left transition-all duration-200"
      style={{
        background: "var(--glass-bg-default)",
        border: `1px solid var(--glass-border)`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${program.color}35`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--glass-border)"; }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{program.emoji}</span>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${program.color}18`, color: program.color, border: `1px solid ${program.color}30` }}>
            {program.duration}d
          </span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${diffColor}18`, color: diffColor, border: `1px solid ${diffColor}30` }}>
            {program.difficulty}
          </span>
        </div>
      </div>

      <h3 className="text-sm font-bold mb-1.5" style={{ color: "var(--text-primary)" }}>{program.title}</h3>
      <p className="text-xs leading-relaxed flex-1 mb-4" style={{ color: "var(--text-muted)" }}>
        {program.description.slice(0, 100)}…
      </p>

      {/* Progress bar when in progress */}
      {inProgress && (
        <div className="mb-3">
          <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--glass-bg-elevated)" }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: program.color }} />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        {statusBadge}
        <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
      </div>
    </motion.button>
  );
}

// ── Article Card (summary trigger — opens reader modal) ──────────────────────

function ArticleCard({ article, index, onOpen }: { article: (typeof ARTICLES)[number]; index: number; onOpen: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onOpen}
      className="rounded-2xl p-5 text-left w-full transition-all duration-200"
      style={{
        background: "var(--glass-bg-default)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${article.color}35`;
        e.currentTarget.style.background = "var(--glass-bg-elevated)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--glass-border)";
        e.currentTarget.style.background = "var(--glass-bg-default)";
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

      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
        {article.excerpt}
      </p>

      <p className="text-[10px] mt-2 font-medium flex items-center gap-1" style={{ color: article.color }}>
        Read article <ChevronRight size={11} />
      </p>
    </motion.button>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const [tab, setTab]                       = useState<Tab>("programs");
  const [categoryFilter, setCategoryFilter] = useState<ArticleCategory | "All">("All");
  const [enrolledMap, setEnrolledMap]       = useState<Record<string, UserProgram>>({});
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

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
    // optimistic
    const optimistic: UserProgram = {
      id: `temp-${programId}`,
      programId,
      startedAt: new Date().toISOString(),
      currentDay: 1,
      completedAt: null,
    };
    setEnrolledMap((prev) => ({ ...prev, [programId]: optimistic }));
    try {
      const enrolled = await enrollProgram(programId);
      setEnrolledMap((prev) => ({ ...prev, [programId]: enrolled }));
    } catch {
      setEnrolledMap((prev) => { const n = { ...prev }; delete n[programId]; return n; });
    }
  }

  async function handleCompleteDay(programId: string, duration: number) {
    const current = enrolledMap[programId];
    if (!current) return;
    const nextDay = current.currentDay + 1;
    if (nextDay > duration) {
      setEnrolledMap((prev) => ({ ...prev, [programId]: { ...current, completedAt: new Date().toISOString() } }));
      await completeProgram(programId);
    } else {
      setEnrolledMap((prev) => ({ ...prev, [programId]: { ...current, currentDay: nextDay } }));
      await updateProgramDay(programId, nextDay);
    }
  }

  async function handleReset(programId: string) {
    setEnrolledMap((prev) => { const n = { ...prev }; delete n[programId]; return n; });
    await unenrollProgram(programId);
  }

  const featuredProgram = PROGRAMS.find((p) => p.featured);
  const otherPrograms   = PROGRAMS.filter((p) => !p.featured);

  const filteredArticles = categoryFilter === "All"
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === categoryFilter);

  const selectedProgram = PROGRAMS.find((p) => p.id === selectedProgramId) ?? null;
  const selectedArticle = ARTICLES.find((a) => a.id === selectedArticleId) ?? null;

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
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)" }}>
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
            {featuredProgram && (
              <ProgramCard
                program={featuredProgram}
                enrollment={enrolledMap[featuredProgram.id]}
                onOpen={() => setSelectedProgramId(featuredProgram.id)}
                featured
              />
            )}

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
                    onOpen={() => setSelectedProgramId(program.id)}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map((article, i) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  index={i}
                  onOpen={() => setSelectedArticleId(article.id)}
                />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No articles in this category yet.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <ProgramDetailModal
        program={selectedProgram}
        enrollment={selectedProgram ? enrolledMap[selectedProgram.id] : undefined}
        open={!!selectedProgram}
        onClose={() => setSelectedProgramId(null)}
        onStart={() => selectedProgram && handleStart(selectedProgram.id)}
        onCompleteDay={() => selectedProgram && handleCompleteDay(selectedProgram.id, selectedProgram.duration)}
        onReset={() => selectedProgram && handleReset(selectedProgram.id)}
      />

      <ArticleModal
        article={selectedArticle}
        open={!!selectedArticle}
        onClose={() => setSelectedArticleId(null)}
      />
    </div>
  );
}
