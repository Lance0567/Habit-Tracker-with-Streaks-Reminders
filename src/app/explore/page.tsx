"use client";

import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Layers, CheckCircle, Clock, ChevronRight, Calendar, Bell, BellOff } from "lucide-react";
import { PROGRAMS, totalTasks } from "@/lib/programs";
import { ARTICLES, type ArticleCategory } from "@/lib/articles";
import { getUserPrograms, getSavedPrograms } from "@/lib/storage";
import { getProgramReminderTime, setProgramReminderTime, scheduleProgramReminders } from "@/lib/notifications";
import type { UserProgram } from "@/types";

type Tab = "programs" | "articles";
type ProgramSubTab = "my" | "find" | "saved" | "completed";

const SUB_TABS: { key: ProgramSubTab; label: string }[] = [
  { key: "my",        label: "My Programs" },
  { key: "find",      label: "Find Programs" },
  { key: "saved",     label: "Saved" },
  { key: "completed", label: "Completed" },
];

const CATEGORIES: ArticleCategory[] = ["Science", "Strategy", "Mindset", "Productivity", "Health"];

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "#10B981",
  Medium:   "#F59E0B",
  Hard:     "#F43F5E",
};

// Mix a hex colour toward black (amount 0–1). Used to make tinted pill text
// read crisply on light backgrounds, where full-saturation brand colours wash out.
function darken(hex: string, amount: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const f = (c: number) => Math.round(c * (1 - amount)).toString(16).padStart(2, "0");
  return `#${f(r)}${f(g)}${f(b)}`;
}

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

  // Reminder state — only relevant on My Plans cards
  const [reminderTime, setReminderTime] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerValue, setPickerValue] = useState("09:00");

  useEffect(() => {
    if (from === "my") setReminderTime(getProgramReminderTime(program.id));
  }, [from, program.id]);

  function handleBellClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (reminderTime) {
      setProgramReminderTime(program.id, null);
      setReminderTime(null);
    } else {
      setShowPicker(true);
    }
  }

  function handleSetReminder(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setProgramReminderTime(program.id, pickerValue);
    setReminderTime(pickerValue);
    setShowPicker(false);
    if (enrollment) {
      getUserPrograms()
        .then((ups) => scheduleProgramReminders(ups, PROGRAMS))
        .catch(() => {});
    }
  }
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

  // Detect theme for the featured card so gradients look vivid in both modes
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    const read = () => setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  if (featured) {
    const bgFrom = isLight ? `${program.color}38` : `${program.color}40`;
    const bgMid  = isLight ? `${program.color}18` : `${program.color}20`;
    const bgTo   = isLight ? `${program.color}08` : "transparent";
    const borderCol = isLight ? `${program.color}55` : `${program.color}40`;
    const textColor  = isLight ? "#1a1a2e"  : "#ffffff";
    const textMuted  = isLight ? "#3d3d5c"  : "rgba(255,255,255,0.65)";
    const trackBg    = isLight ? `${program.color}20` : "rgba(255,255,255,0.1)";
    // Pill text: darken on light bg so each tag stays high-contrast; keep vivid on dark.
    const ACCENT     = "#7C3AED";
    const dayText      = isLight ? darken(program.color, 0.34) : program.color;
    const diffText     = isLight ? darken(diffColor, 0.34)     : diffColor;
    const featuredText = isLight ? darken(ACCENT, 0.28)        : "var(--color-accent)";
    const labelColor   = isLight ? darken(program.color, 0.34) : program.color;

    return (
      <Link
        href={href}
        className="relative overflow-hidden rounded-3xl text-left block w-full group transition-all duration-300"
        style={{
          background: `linear-gradient(130deg, ${bgFrom} 0%, ${bgMid} 45%, ${bgTo} 100%)`,
          border: `1px solid ${borderCol}`,
          boxShadow: isLight
            ? `0 4px 32px ${program.color}20, inset 0 1px 0 rgba(255,255,255,0.6)`
            : `0 4px 32px ${program.color}25, inset 0 1px 0 rgba(255,255,255,0.08)`,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 8px 48px ${program.color}35, inset 0 1px 0 rgba(255,255,255,0.12)`; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = isLight ? `0 4px 32px ${program.color}20, inset 0 1px 0 rgba(255,255,255,0.6)` : `0 4px 32px ${program.color}25, inset 0 1px 0 rgba(255,255,255,0.08)`; }}
      >
        {/* Ambient glow blobs */}
        <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${program.color}${isLight ? "28" : "35"} 0%, transparent 70%)`, filter: "blur(40px)" }} />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${program.color}15 0%, transparent 70%)`, filter: "blur(32px)" }} />

        {/* Dot-grid decoration on the right half */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: isLight ? 0.18 : 0.12 }}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id={`dots-${program.id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill={program.color} />
              </pattern>
            </defs>
            <rect x="45%" width="55%" height="100%" fill={`url(#dots-${program.id})`} />
          </svg>
        </div>

        <div className="relative flex flex-col sm:flex-row gap-6 p-6 sm:p-8">
          {/* ── Left: content ── */}
          <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: `${program.color}${isLight ? "1f" : "25"}`, color: dayText, border: `1px solid ${program.color}${isLight ? "40" : "45"}` }}>
                <Calendar size={10} /> {program.duration} days
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: `${diffColor}${isLight ? "1f" : "25"}`, color: diffText, border: `1px solid ${diffColor}${isLight ? "40" : "50"}` }}>
                {program.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: isLight ? "rgba(124,58,237,0.12)" : "rgba(124,58,237,0.22)", color: featuredText, border: `1px solid rgba(124,58,237,${isLight ? "0.38" : "0.5"})` }}>
                ★ Featured
              </span>
            </div>

            {/* Title + description */}
            <div>
              <h3 className="text-2xl font-black tracking-tight mb-2 leading-tight" style={{ color: textColor }}>
                {program.title}
              </h3>
              <p className="text-sm leading-relaxed max-w-sm" style={{ color: textMuted }}>
                {program.description}
              </p>
            </div>

            {/* Progress */}
            {inProgress && (
              <div className="max-w-xs">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[11px] font-semibold" style={{ color: labelColor }}>
                    Day {activeDay} of {program.duration}
                  </span>
                  <span className="text-[11px] font-bold tabular-nums" style={{ color: labelColor }}>
                    {progress}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden relative" style={{ background: trackBg }}>
                  <div
                    className="h-full rounded-full transition-all duration-700 relative"
                    style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${program.color}cc, ${program.color})` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-white"
                      style={{ background: program.color, boxShadow: `0 0 6px ${program.color}` }} />
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="flex items-center gap-3">
              <span
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 group-hover:scale-[1.02]"
                style={{
                  background: `linear-gradient(135deg, ${program.color}, ${program.color}cc)`,
                  boxShadow: `0 4px 16px ${program.color}50`,
                }}
              >
                {isCompleted ? "View Program" : inProgress ? "Continue" : "Start Program"}
                <ChevronRight size={15} />
              </span>
              {!inProgress && !isCompleted && (
                <span className="text-[11px] font-medium" style={{ color: textMuted }}>Free · No commitment</span>
              )}
            </div>
          </div>

          {/* ── Right: decorative emoji orb ── */}
          <div className="hidden sm:flex flex-shrink-0 items-center justify-center w-44 relative">
            {/* Outer ring */}
            <div className="absolute w-36 h-36 rounded-full"
              style={{ border: `1px solid ${program.color}35`, animation: "spin 18s linear infinite" }} />
            {/* Inner ring */}
            <div className="absolute w-24 h-24 rounded-full"
              style={{ border: `1px dashed ${program.color}50` }} />
            {/* Glow base */}
            <div className="absolute w-28 h-28 rounded-full"
              style={{ background: `radial-gradient(circle, ${program.color}40 0%, transparent 70%)`, filter: "blur(16px)" }} />
            {/* Emoji */}
            <span
              className="relative text-6xl select-none"
              style={{ filter: `drop-shadow(0 0 20px ${program.color}80)` }}
            >
              {program.emoji}
            </span>
            {/* Orbiting dot */}
            <div className="absolute w-36 h-36"
              style={{ animation: "spin 8s linear infinite" }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                style={{ background: program.color, boxShadow: `0 0 8px ${program.color}` }} />
            </div>
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
        <div className="flex items-center gap-1.5">
          {from === "my" && (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={handleBellClick}
                title={reminderTime ? `Reminder at ${reminderTime} — click to remove` : "Set daily reminder"}
                className="w-6 h-6 flex items-center justify-center rounded-lg transition-all"
                style={{
                  background: reminderTime ? "rgba(124,58,237,0.15)" : "var(--glass-bg-subtle)",
                  border: `1px solid ${reminderTime ? "rgba(124,58,237,0.35)" : "var(--glass-border)"}`,
                  color: reminderTime ? "var(--color-accent)" : "var(--text-muted)",
                }}
              >
                {reminderTime ? <Bell size={11} /> : <BellOff size={11} />}
              </button>
              {showPicker && (
                <div
                  className="absolute bottom-8 right-0 z-20 rounded-xl p-3 flex flex-col gap-2"
                  style={{
                    background: "var(--popup-bg)",
                    border: "1px solid var(--popup-border)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                    minWidth: 160,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                    Daily reminder time
                  </p>
                  <input
                    type="time"
                    value={pickerValue}
                    onChange={(e) => setPickerValue(e.target.value)}
                    className="w-full rounded-lg px-2 py-1 text-xs font-mono outline-none"
                    style={{
                      background: "var(--glass-bg-subtle)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <div className="flex gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowPicker(false); }}
                      className="flex-1 text-[11px] py-1 rounded-lg"
                      style={{ background: "var(--glass-bg-subtle)", border: "1px solid var(--glass-border)", color: "var(--text-muted)" }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSetReminder}
                      className="flex-1 text-[11px] py-1 rounded-lg font-semibold"
                      style={{ background: "var(--color-accent)", color: "#fff" }}
                    >
                      Set
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <ChevronRight size={14} style={{ color: "var(--text-muted)" }} />
        </div>
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
  const router = useRouter();
  const initialTab: Tab = searchParams.get("tab") === "articles" ? "articles" : "programs";
  const plansParam = searchParams.get("plans");
  const initialSubTab: ProgramSubTab =
    plansParam === "my" || plansParam === "saved" || plansParam === "completed" || plansParam === "find"
      ? plansParam
      : "find";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [subTab, setSubTab] = useState<ProgramSubTab>(initialSubTab);

  function switchTab(next: Tab) {
    setTab(next);
    router.replace(`/explore?tab=${next}`, { scroll: false });
  }

  function switchSubTab(next: ProgramSubTab) {
    setSubTab(next);
    router.replace(`/explore?tab=programs&plans=${next}`, { scroll: false });
  }
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
              onClick={() => switchTab(key)}
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
                    onClick={() => switchSubTab(key)}
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
                  <button onClick={() => switchSubTab("find")}
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
