export type ArticleCategory = "Science" | "Strategy" | "Mindset" | "Productivity" | "Health";

export interface ArticleSection {
  heading?: string;
  body: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  readTime: number;
  emoji: string;
  color: string;
  content: ArticleSection[];
  keyTakeaways: string[];
}

export const ARTICLES: Article[] = [
  {
    id: "science-habit-formation",
    title: "The Science Behind Habit Formation",
    excerpt:
      "Habits form through a neurological loop: cue, routine, reward. Each time you complete the loop, the neural pathway strengthens — until the behavior becomes automatic.",
    category: "Science",
    readTime: 5,
    emoji: "🔬",
    color: "#06B6D4",
    content: [
      {
        body: "Every habit you have — good or bad — runs on the same three-part loop your brain built to save energy. Understanding that loop is the difference between fighting your habits and engineering them.",
      },
      {
        heading: "The habit loop",
        body: "A cue triggers your brain to start a behavior. The routine is the behavior itself. The reward tells your brain whether this loop is worth remembering. Repeat it enough and the cue alone fires off a craving for the reward — the behavior becomes automatic.",
      },
      {
        heading: "Why repetition rewires you",
        body: "Each time you run the loop, the neural pathway connecting cue to routine gets a little stronger — like a footpath worn into grass. This is why willpower fades but habits last: a true habit barely involves the conscious brain at all. The behavior has moved to the basal ganglia, the brain's autopilot center.",
      },
      {
        heading: "How to use it",
        body: "To build a habit, make the cue obvious and the reward immediate. To break one, keep the cue and reward but swap the routine, or remove the cue entirely. You can't delete a habit loop — but you can redirect it.",
      },
    ],
    keyTakeaways: [
      "Every habit follows a cue → routine → reward loop.",
      "Repetition physically strengthens the neural pathway until the behavior is automatic.",
      "To change a habit, change the routine while keeping the cue and reward.",
    ],
  },
  {
    id: "small-habits-big-goals",
    title: "Why Small Habits Beat Big Goals",
    excerpt:
      "Setting a goal gives you a destination. Building a system of small habits gives you a vehicle. The research is clear: process-focused people consistently outperform outcome-focused people.",
    category: "Strategy",
    readTime: 4,
    emoji: "📈",
    color: "#10B981",
    content: [
      {
        body: "Goals are everywhere in January and forgotten by February. The problem isn't ambition — it's that goals describe a destination without building the vehicle to get there.",
      },
      {
        heading: "Goals vs systems",
        body: "A goal is the result you want. A system is the set of daily actions that produce it. 'Lose 20 pounds' is a goal; 'walk after lunch and cook at home' is a system. You don't rise to the level of your goals — you fall to the level of your systems.",
      },
      {
        heading: "The 1% rule",
        body: "Improving just 1% a day compounds to nearly 38x over a year. Small habits feel insignificant in the moment, which is exactly why people abandon them. But consistency, not intensity, is what compounds.",
      },
      {
        heading: "The trap of big goals",
        body: "Big goals create a 'finish line' mindset — you're either succeeding or failing, and motivation collapses the moment progress stalls. Systems remove the all-or-nothing pressure: you just run the process today, then again tomorrow.",
      },
    ],
    keyTakeaways: [
      "Goals set direction; systems create progress.",
      "1% daily improvement compounds dramatically over time.",
      "Focus on running the process today, not hitting the outcome someday.",
    ],
  },
  {
    id: "two-minute-rule",
    title: "The Two-Minute Rule That Changes Everything",
    excerpt:
      "If a new habit takes less than two minutes to start, do it now. The two-minute version of your habit is not the goal; it's the gateway.",
    category: "Strategy",
    readTime: 3,
    emoji: "⏱️",
    color: "#F59E0B",
    content: [
      {
        body: "Most habits fail before they start because the first step feels too big. The two-minute rule fixes this by shrinking the habit until starting is effortless.",
      },
      {
        heading: "Scale it down",
        body: "'Read 30 minutes' becomes 'read one page.' 'Do yoga' becomes 'roll out the mat.' 'Study' becomes 'open my notes.' The point isn't to do less forever — it's to master the art of showing up.",
      },
      {
        heading: "Why it works",
        body: "Starting is the hardest part of any behavior. Once you're two minutes in, momentum takes over and continuing feels natural. But even if you stop at two minutes, you've reinforced the identity of someone who does the habit.",
      },
      {
        heading: "Standardize before you optimize",
        body: "You can't improve a habit that doesn't exist. Lock in the two-minute version until it's automatic, then gradually extend it. Consistency first, intensity later.",
      },
    ],
    keyTakeaways: [
      "Shrink any new habit to a version you can start in two minutes.",
      "Starting is the hardest part — make it trivially easy.",
      "Master showing up first; scale the habit up only once it's automatic.",
    ],
  },
  {
    id: "habit-stacking",
    title: "How to Stack Habits Like a Pro",
    excerpt:
      "Habit stacking links a new behavior to an existing one. By anchoring new habits to established triggers, you remove the need for motivation — the old habit does the work.",
    category: "Strategy",
    readTime: 4,
    emoji: "🔗",
    color: "#7C3AED",
    content: [
      {
        body: "The hardest part of a new habit is remembering to do it. Habit stacking solves that by attaching the new behavior to something you already do without thinking.",
      },
      {
        heading: "The formula",
        body: "'After [current habit], I will [new habit].' For example: 'After I pour my morning coffee, I will write down one priority.' The existing habit becomes the cue for the new one.",
      },
      {
        heading: "Why anchors beat willpower",
        body: "Your established habits already have strong neural pathways and built-in cues. By stacking onto them, the new habit inherits that reliability instead of depending on motivation, which is unreliable by nature.",
      },
      {
        heading: "Stack smart",
        body: "Pick an anchor with the same frequency as your target habit (don't stack a daily habit on a weekly one), and make the timing and location specific. Vague stacks fail; precise ones stick.",
      },
    ],
    keyTakeaways: [
      "Use the formula: 'After [current habit], I will [new habit].'",
      "Anchoring to an existing routine removes reliance on motivation.",
      "Match the frequency of the anchor to the new habit and be specific.",
    ],
  },
  {
    id: "morning-routine-power",
    title: "The Power of a Morning Routine",
    excerpt:
      "Your first hour sets the tone for the next 23. The secret isn't waking up at 5am — it's intentionality.",
    category: "Productivity",
    readTime: 6,
    emoji: "🌅",
    color: "#F59E0B",
    content: [
      {
        body: "How you start your morning quietly shapes your entire day. A reactive morning — grabbing your phone, rushing out the door — primes you to spend the day reacting. An intentional morning does the opposite.",
      },
      {
        heading: "Why the first hour matters",
        body: "In the first hour after waking, your brain transitions from sleep to full alertness. What you feed it during this window — calm and focus, or noise and stress — sets your baseline state for hours.",
      },
      {
        heading: "It's not about 5am",
        body: "The benefit of a morning routine has nothing to do with how early you wake. A consistent, intentional routine at 8am beats a chaotic one at 5am. Consistency of structure matters more than the hour on the clock.",
      },
      {
        heading: "Build yours in layers",
        body: "Start with one keystone habit — hydration, movement, or a moment of quiet. Add pieces only once the previous one is automatic. A routine you actually keep beats an ambitious one you abandon in a week.",
      },
      {
        heading: "Protect it",
        body: "The fastest way to wreck a morning routine is to check your phone first. Notifications hijack your attention and hand your morning to other people's priorities. Delay the phone, and the routine protects itself.",
      },
    ],
    keyTakeaways: [
      "Your first hour sets your baseline state for the whole day.",
      "Consistency matters far more than waking up early.",
      "Build the routine one keystone habit at a time, and delay your phone.",
    ],
  },
  {
    id: "breaking-bad-habits",
    title: "Breaking Bad Habits: A Simple Framework",
    excerpt:
      "Bad habits are never truly erased — they are overwritten. Reduce friction for good habits. Increase it for bad ones.",
    category: "Mindset",
    readTime: 5,
    emoji: "🔓",
    color: "#F43F5E",
    content: [
      {
        body: "Willpower is a terrible long-term strategy for breaking bad habits. The people who succeed don't have more discipline — they design their environment so the bad habit becomes inconvenient.",
      },
      {
        heading: "Make the cue invisible",
        body: "Most bad habits are triggered by what we see. Remove the cue and the craving rarely fires. If you snack on chips while watching TV, don't keep chips in the house. Out of sight is genuinely out of mind.",
      },
      {
        heading: "Make the routine difficult",
        body: "Add friction. Log out of the app. Unplug the console and store the controller in a drawer. Every extra step between you and the habit gives your rational brain a chance to intervene.",
      },
      {
        heading: "Make the reward unsatisfying",
        body: "Pair the bad habit with an immediate cost — tell a friend who'll hold you accountable, or track every slip visibly. When the loop stops feeling rewarding, your brain stops craving it.",
      },
      {
        heading: "Replace, don't just remove",
        body: "A habit fills a need. If you only remove it, the need remains and pulls you back. Swap in a healthier routine that delivers a similar reward — that's what makes the change stick.",
      },
    ],
    keyTakeaways: [
      "Don't rely on willpower — redesign your environment.",
      "Make bad-habit cues invisible and the routine harder to do.",
      "Replace the habit with one that meets the same underlying need.",
    ],
  },
  {
    id: "habit-tracking-works",
    title: "Does Habit Tracking Actually Work?",
    excerpt:
      "Tracking creates a visual cue, provides immediate satisfaction, and doubles your likelihood of success — but only when you track consistently.",
    category: "Science",
    readTime: 4,
    emoji: "📊",
    color: "#06B6D4",
    content: [
      {
        body: "Habit tracking sounds almost too simple to matter — yet studies consistently show that people who track a behavior are far more likely to stick with it. Here's why a simple checkmark is so powerful.",
      },
      {
        heading: "It makes progress visible",
        body: "A tracker turns an invisible effort into a visible streak. Seeing your chain of completed days creates a satisfying record of progress — and a growing reluctance to break it.",
      },
      {
        heading: "It's its own reward",
        body: "Marking a habit done delivers a small hit of satisfaction immediately, even when the habit's real payoff is far off. That instant reward helps bridge the gap until the habit becomes intrinsically rewarding.",
      },
      {
        heading: "The two-day rule",
        body: "Missing one day is normal and recoverable. Missing two in a row is how habits die. The goal of tracking isn't perfection — it's to never miss twice. One slip is an accident; two is the start of a new pattern.",
      },
      {
        heading: "Keep it frictionless",
        body: "Tracking only works if the tracking itself is effortless. If logging takes more than a few seconds, you'll stop. The best tracker is the one you'll actually use every day.",
      },
    ],
    keyTakeaways: [
      "Tracking makes invisible progress visible and motivating.",
      "The checkmark is an immediate reward that bridges to long-term payoff.",
      "Never miss twice — one slip is fine, two starts a new habit.",
    ],
  },
  {
    id: "identity-based-habits",
    title: "Identity-Based Habits: Become the Person",
    excerpt:
      "The most lasting behavior change comes from a shift in identity, not outcomes. Every habit you build is a vote for the type of person you believe you are.",
    category: "Mindset",
    readTime: 5,
    emoji: "🪞",
    color: "#8B5CF6",
    content: [
      {
        body: "Most people try to change what they want to achieve. The people who change permanently focus on who they want to become. It's a subtle shift with enormous consequences.",
      },
      {
        heading: "Three layers of change",
        body: "Behavior change happens at three levels: outcomes (what you get), processes (what you do), and identity (what you believe about yourself). Most people start with outcomes. Lasting change starts with identity.",
      },
      {
        heading: "Every action is a vote",
        body: "Each time you perform a habit, you cast a vote for the kind of person you are. Write one sentence and you've voted for 'I am a writer.' You don't need a unanimous result — just a majority. Build enough votes and the identity becomes who you are.",
      },
      {
        heading: "Flip the script",
        body: "Instead of 'I want to run a marathon,' try 'I am a runner.' Instead of 'I'm trying to quit smoking,' try 'I'm not a smoker.' When the behavior aligns with your sense of self, you no longer have to force it — you're simply being yourself.",
      },
      {
        heading: "Start tiny, prove it",
        body: "You build a new identity by repeatedly proving it to yourself with small wins. The habit is the evidence. Start so small you can't say no, and let each rep reinforce the story of who you're becoming.",
      },
    ],
    keyTakeaways: [
      "Lasting change starts with identity, not outcomes.",
      "Every habit is a vote for the person you want to become.",
      "Reframe goals as identity ('I am a runner') and prove it with small, repeatable wins.",
    ],
  },
];
