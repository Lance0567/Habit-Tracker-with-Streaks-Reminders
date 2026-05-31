export interface Program {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  difficulty: "Beginner" | "Medium" | "Hard";
  emoji: string;
  color: string;
  habits: string[];
  featured?: boolean;
}

export const PROGRAMS: Program[] = [
  {
    id: "morning-routine",
    title: "Morning Routine Mastery",
    description:
      "Build a powerful morning ritual that sets the tone for your entire day. Science shows the first 90 minutes after waking shape your focus and energy for everything that follows.",
    duration: 14,
    category: "Productivity",
    difficulty: "Beginner",
    emoji: "🌅",
    color: "#F59E0B",
    habits: ["Wake up at consistent time", "Drink a glass of water", "10-minute stretch", "No phone for first 30 min"],
    featured: true,
  },
  {
    id: "productivity-reset",
    title: "21-Day Productivity Reset",
    description:
      "Break the cycle of distraction and rebuild deep focus from the ground up. Each day introduces one small shift that compounds into a dramatically more productive life.",
    duration: 21,
    category: "Focus",
    difficulty: "Medium",
    emoji: "⚡",
    color: "#7C3AED",
    habits: ["Time-block your calendar", "Single-task for 25 min", "Weekly review", "End-of-day shutdown ritual"],
  },
  {
    id: "mindfulness-kickstart",
    title: "7-Day Mindfulness Kickstart",
    description:
      "Start small with just 5 minutes a day. By day 7 you'll have built a sustainable mindfulness practice that reduces stress and sharpens your awareness.",
    duration: 7,
    category: "Wellbeing",
    difficulty: "Beginner",
    emoji: "🧘",
    color: "#06B6D4",
    habits: ["5-min morning meditation", "Mindful breathing break", "Gratitude journal"],
  },
  {
    id: "fitness-foundation",
    title: "30-Day Fitness Foundation",
    description:
      "Build the movement habit that sticks. No gym required — just 20 minutes a day of intentional activity to rewire your body and brain for an active lifestyle.",
    duration: 30,
    category: "Health",
    difficulty: "Hard",
    emoji: "💪",
    color: "#10B981",
    habits: ["20-min daily movement", "10,000 steps", "Post-workout stretch", "Sleep 7+ hours"],
  },
  {
    id: "digital-wellness",
    title: "Digital Wellness Challenge",
    description:
      "Reclaim your attention from the algorithm. Two weeks of intentional screen habits that give your mind space to breathe, create, and connect.",
    duration: 14,
    category: "Wellbeing",
    difficulty: "Medium",
    emoji: "📵",
    color: "#F43F5E",
    habits: ["Phone-free meals", "App time limits on", "No screens 1hr before bed", "One tech-free hour daily"],
  },
  {
    id: "deep-work",
    title: "Deep Work Builder",
    description:
      "Train your brain to sustain long, uninterrupted concentration. Three weeks of progressive deep-work sessions that turn distraction into focus — permanently.",
    duration: 21,
    category: "Focus",
    difficulty: "Hard",
    emoji: "🎯",
    color: "#8B5CF6",
    habits: ["90-min deep work block", "Notifications off during work", "Pomodoro sessions", "Reading 30 min daily"],
  },
];
