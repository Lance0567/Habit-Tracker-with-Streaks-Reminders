"use client";

import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Layers, CheckCircle, Clock, ChevronRight, Calendar } from "lucide-react";
import { PROGRAMS, totalTasks } from "@/lib/programs";
import { ARTICLES, type ArticleCategory } from "@/lib/articles";
import { getUserPrograms, getSavedPrograms } from "@/lib/storage";
import type { UserProgram } from "@/types";

type Tab = "programs" | "articles";
type ProgramSubTab = "my" | "find" | "saved" | "completed";

const SUB_TABS: { key: ProgramSubTab; label: string }[] = [
  { key: "my",        label: "My Plans" },
  { key: "find",      label: "Find Plans" },
  { key: "saved",     label: "Saved" },
  { key: "completed", label: "Completed" },
];

const CATEGORIES: ArticleCategory[] = ["Science", "Strategy", "Mindset", "Productivity", "Health"];

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "#10B981",
  Medium:   "#F59E0B",
  Hard:     "#F43F5E",
};

// ── Program Card (links to detail page) ──────────────────────────────────────

function ProgramCard({
  program,
  enrollment,
  featured,
  from,
}: {
  program: (typeof PROGRAMS)[number];
  enrollment?: UserProgram;
  featured?: boolean;
  from?: ProgramSubTab;
}) {
  const href = `/explore/programs/${program.id}${from ? `?from=${from}` : ""}`;
  const isCompleted = !!enrollment?.completedAt;
  const inProgress  = !!enrollment && !isCompleted;
  const completedSet = new Set(enrollment?.completedTasks ?? []);
  const isDayDone = (d: number) => program.days[d - 1].tasks.every((t) => completedSet.has(`${d}:${t.id}`));
  let activeDay = program.duration;
  for (let d = 1; d <= program.duration; d++) { if (!isDayDone(d)) { activeDay = d; break; } }
  const doneTasks = enrollment?.completedTasks.length ?? 0;
  const progress  = enrollment ? Math.round((doneTasks / totalTasks(program)) * 100) : 0;
  const diffColor = DIFFICULTY_COLOR[program.difficulty];

  const statusBadge = isCompleted ? (
    <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "#10B981" }}>
      <CheckCircle size={12} /> Completed
    </span>
  ) : inProgress ? (
    <span className="text-[11px] font-semibold" style={{ color: program.color }}>
      Day {activeDay} of {program.duration}
    </span>
  ) : (
    <span className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>Not started</span>
  );

  if (featured) {
    return (
      <Link
        href={href}
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8 text-left block w-full transition-all"
        style={{
          background: `linear-gradient(135deg, ${program.color}22 0%, ${program.color}08 60%, var(--glass-bg-subtle) 100%)`,
          border: `1px solid ${program.color}30`,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${program.color}55`; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${program.color}30`; }}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${program.color}30 0%, transparent 70%)`, filter: "blur(32px)" }} />
        <div className="relative">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <span className="text-3xl">{program.emoji}</span>
            <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ background: `${program.color}18`, color: program.color, border: `1px solid ${program.color}30` }}>
              <Calendar size={11} /> {program.duration} days
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
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="flex flex-col rounded-2xl p-5 h-full w-full text-left transition-all duration-200"
      style={{
        background: "var(--glass-bg-default)",
        border: `1px solid var(--glass-border)`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = `${program.color}35`; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)"; }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{program.emoji}</span>
        <div className="flex flex-col items-end gap-1.5">
          <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: `${program.color}18`, color: program.color, border: `1px solid ${program.color}30` }}>
            <Calendar size={10} /> {program.duration} days
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
    </Link>
  );
}

// ── Article Card (links to detail page) ──────────────────────────────────────

function ArticleCard({ article }: { article: (typeof ARTICLES)[number] }) {
  return (
    <Link
      href={`/explore/articles/${article.id}`}
      className="rounded-2xl p-5 text-left block w-full transition-all duration-200"
      style={{
        background: "var(--glass-bg-default)",
        border: "1px solid var(--glass-border)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = `${article.color}35`;
        (e.currentTarget as HTMLAnchorElement).style.background = "var(--glass-bg-elevated)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)";
        (e.currentTarget as HTMLAnchorElement).style.background = "var(--glass-bg-default)";
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
    </Link>
  );
}

// ── Content ───────────────────────────────────────────────────────────────────

function ExploreContent() {
  const searchParams = useSearchParams();
  const initialTab: Tab = searchParams.get("tab") === "articles" ? "articles" : "programs";
  const plansParam = searchParams.get("plans");
  const initialSubTab: ProgramSubTab =
    plansParam === "my" || plansParam === "saved" || plansParam === "completed" || plansParam === "find"
      ? plansParam
      : "find";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [subTab, setSubTab] = useState<ProgramSubTab>(initialSubTab);
  const [categoryFilter, setCategoryFilter] = useState<ArticleCategory | "All">("All");
  const [enrolledMap, setEnrolledMap] = useState<Record<string, UserProgram>>({});
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    getUserPrograms()
      .then((programs) => {
        const map: Record<string, UserProgram> = {};
        programs.forEach((p) => { map[p.programId] = p; });
        setEnrolledMap(map);
      })
      .catch(() => {});
    getSavedPrograms().then(setSavedIds).catch(() => {});
  }, []);

  const featuredProgram = PROGRAMS.find((p) => p.featured);
  const filteredArticles = categoryFilter === "All"
    ? ARTICLES
    : ARTICLES.filter((a) => a.category === categoryFilter);

  // Programs shown for the active sub-tab
  const subTabPrograms = PROGRAMS.filter((p) => {
    const e = enrolledMap[p.id];
    if (subTab === "my")        return !!e && !e.completedAt;
    if (subTab === "completed") return !!e?.completedAt;
    if (subTab === "saved")     return savedIds.includes(p.id);
    return true; // find → full catalog
  });
  const findGridPrograms = subTab === "find" ? subTabPrograms.filter((p) => !p.featured) : subTabPrograms;

  const EMPTY_MESSAGE: Record<ProgramSubTab, string> = {
    my:        "You haven't started any plans yet — browse Find Plans to begin.",
    find:      "No plans available.",
    saved:     "No saved plans yet — open a plan and tap the bookmark to save it.",
    completed: "No completed plans yet — finishing a plan will list it here.",
  };

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
          <motion.div key="programs" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.2 }} className="space-y-5">
            {/* Sub-tabs */}
            <div className="flex gap-2 flex-wrap">
              {SUB_TABS.map(({ key, label }) => {
                const count =
                  key === "my"        ? PROGRAMS.filter((p) => enrolledMap[p.id] && !enrolledMap[p.id]?.completedAt).length
                  : key === "completed" ? PROGRAMS.filter((p) => enrolledMap[p.id]?.completedAt).length
                  : key === "saved"     ? savedIds.length
                  : PROGRAMS.length;
                return (
                  <button
                    key={key}
                    onClick={() => setSubTab(key)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                    style={
                      subTab === key
                        ? { background: "var(--color-accent)", color: "#fff" }
                        : { background: "var(--glass-bg-default)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }
                    }
                  >
                    {label}
                    <span className="text-[10px] font-bold opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Featured only on Find Plans */}
            {subTab === "find" && featuredProgram && (
              <ProgramCard program={featuredProgram} enrollment={enrolledMap[featuredProgram.id]} featured from={subTab} />
            )}

            {findGridPrograms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {findGridPrograms.map((program, i) => (
                  <motion.div key={program.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.06 }}>
                    <ProgramCard program={program} enrollment={enrolledMap[program.id]} from={subTab} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{EMPTY_MESSAGE[subTab]}</p>
                {(subTab === "my" || subTab === "saved") && (
                  <button onClick={() => setSubTab("find")}
                    className="mt-3 text-sm font-semibold" style={{ color: "var(--color-accent-light)" }}>
                    Browse Find Plans →
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="articles" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="space-y-5">
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
                <motion.div key={article.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <ArticleCard article={article} />
                </motion.div>
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
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreContent />
    </Suspense>
  );
}
