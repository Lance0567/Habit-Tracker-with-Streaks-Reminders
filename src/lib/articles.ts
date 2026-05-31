export type ArticleCategory = "Science" | "Strategy" | "Mindset" | "Productivity" | "Health";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  readTime: number;
  emoji: string;
  color: string;
}

export const ARTICLES: Article[] = [
  {
    id: "science-habit-formation",
    title: "The Science Behind Habit Formation",
    excerpt:
      "Habits form through a neurological loop: cue, routine, reward. Each time you complete the loop, the neural pathway strengthens — until the behavior becomes automatic. Understanding this loop is the first step to building habits that stick.",
    category: "Science",
    readTime: 5,
    emoji: "🔬",
    color: "#06B6D4",
  },
  {
    id: "small-habits-big-goals",
    title: "Why Small Habits Beat Big Goals",
    excerpt:
      "Setting a goal gives you a destination. Building a system of small habits gives you a vehicle. Goals are good for direction; habits are good for making progress. The research is clear: process-focused people consistently outperform outcome-focused people.",
    category: "Strategy",
    readTime: 4,
    emoji: "📈",
    color: "#10B981",
  },
  {
    id: "two-minute-rule",
    title: "The Two-Minute Rule That Changes Everything",
    excerpt:
      "If a new habit takes less than two minutes to start, do it now. This isn't just a productivity hack — it's a way to master the art of showing up. The two-minute version of your habit is not the goal; it's the gateway.",
    category: "Strategy",
    readTime: 3,
    emoji: "⏱️",
    color: "#F59E0B",
  },
  {
    id: "habit-stacking",
    title: "How to Stack Habits Like a Pro",
    excerpt:
      "Habit stacking links a new behavior to an existing one: 'After I pour my morning coffee, I will write for 10 minutes.' By anchoring new habits to established triggers, you remove the need for motivation — the old habit does the work.",
    category: "Strategy",
    readTime: 4,
    emoji: "🔗",
    color: "#7C3AED",
  },
  {
    id: "morning-routine-power",
    title: "The Power of a Morning Routine",
    excerpt:
      "Your first hour sets the tone for the next 23. Studies show that people who follow a structured morning routine report significantly higher productivity, better mood, and lower stress throughout the day. The secret isn't waking up at 5am — it's intentionality.",
    category: "Productivity",
    readTime: 6,
    emoji: "🌅",
    color: "#F59E0B",
  },
  {
    id: "breaking-bad-habits",
    title: "Breaking Bad Habits: A Simple Framework",
    excerpt:
      "Bad habits are never truly erased — they are overwritten. The most effective strategy isn't willpower; it's making the cue invisible, the routine difficult, and the reward unsatisfying. Reduce friction for good habits. Increase it for bad ones.",
    category: "Mindset",
    readTime: 5,
    emoji: "🔓",
    color: "#F43F5E",
  },
  {
    id: "habit-tracking-works",
    title: "Does Habit Tracking Actually Work?",
    excerpt:
      "Tracking creates a visual cue that motivates you to continue. It provides immediate satisfaction when you mark off a completed habit. Research shows that tracking doubles your likelihood of success — but only when you track consistently. One missed day is recoverable. Two is a new habit.",
    category: "Science",
    readTime: 4,
    emoji: "📊",
    color: "#06B6D4",
  },
  {
    id: "identity-based-habits",
    title: "Identity-Based Habits: Become the Person",
    excerpt:
      "The most lasting behavior change comes from a shift in identity, not outcomes. Instead of 'I want to run a marathon,' try 'I am a runner.' Every habit you build is a vote for the type of person you believe you are. Cast enough votes and you become that person.",
    category: "Mindset",
    readTime: 5,
    emoji: "🪞",
    color: "#8B5CF6",
  },
];
