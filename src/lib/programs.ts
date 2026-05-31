export interface ProgramDay {
  day: number;
  title: string;
  task: string;
}

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
  overview: string;
  days: ProgramDay[];
  featured?: boolean;
}

// Helper to keep day arrays terse and guarantee sequential day numbers.
function days(entries: [string, string][]): ProgramDay[] {
  return entries.map(([title, task], i) => ({ day: i + 1, title, task }));
}

export const PROGRAMS: Program[] = [
  {
    id: "morning-routine",
    title: "Morning Routine Mastery",
    description:
      "Build a powerful morning ritual that sets the tone for your entire day. Science shows the first 90 minutes after waking shape your focus and energy for everything that follows.",
    overview:
      "Over 14 days you'll assemble a calm, energizing morning — one small piece at a time. Each day layers a new habit onto the last, so by the end the whole routine runs on autopilot.",
    duration: 14,
    category: "Productivity",
    difficulty: "Beginner",
    emoji: "🌅",
    color: "#F59E0B",
    habits: ["Wake up at consistent time", "Drink a glass of water", "10-minute stretch", "No phone for first 30 min"],
    featured: true,
    days: days([
      ["Set your wake time", "Pick one wake-up time and set a single alarm. Place your phone across the room so you have to get up to silence it."],
      ["Hydrate first", "Put a glass of water by your bed tonight. Drink it the moment you wake up, before anything else."],
      ["No phone for 10 minutes", "When you wake, leave your phone untouched for the first 10 minutes. Just breathe and notice the morning."],
      ["Make your bed", "Make your bed within 5 minutes of getting up. It's a tiny win that signals the day has started."],
      ["Two-minute stretch", "Do a gentle 2-minute full-body stretch after making your bed. Loosen your neck, back, and legs."],
      ["Step into light", "Get 5 minutes of natural light — open the curtains or step outside. Light anchors your body clock."],
      ["Week one review", "Reflect: which of the first habits felt easiest? Do all of them today in order, back to back."],
      ["Extend the stretch", "Grow your stretch to 5 minutes. Add a few deep breaths at the end."],
      ["Set one intention", "Write down a single thing you want to accomplish today. Keep it to one sentence."],
      ["Phone-free 30", "Push your no-phone window to 30 minutes. Fill it with your routine instead of scrolling."],
      ["Move your body", "Add 5 minutes of light movement — a short walk or a few squats — after your stretch."],
      ["Nourish", "Eat or prepare something healthy in your first hour instead of skipping or grabbing junk."],
      ["Run it all", "Do the complete routine start to finish: wake, hydrate, no-phone, bed, stretch, light, intention, move, nourish."],
      ["Lock it in", "Do the full routine one more time and write one line on how your mornings feel now versus day 1."],
    ]),
  },
  {
    id: "productivity-reset",
    title: "21-Day Productivity Reset",
    description:
      "Break the cycle of distraction and rebuild deep focus from the ground up. Each day introduces one small shift that compounds into a dramatically more productive life.",
    overview:
      "Three weeks to rewire how you work. Week 1 clears distractions, week 2 builds focus systems, and week 3 turns them into a sustainable rhythm.",
    duration: 21,
    category: "Focus",
    difficulty: "Medium",
    emoji: "⚡",
    color: "#7C3AED",
    habits: ["Time-block your calendar", "Single-task for 25 min", "Weekly review", "End-of-day shutdown ritual"],
    days: days([
      ["Audit your time", "Track where every hour goes today. Just observe — no judgment, no changes yet."],
      ["Kill one distraction", "Identify your single biggest time-waster and remove it for the day (log out, delete the app, block the site)."],
      ["Silence notifications", "Turn off all non-essential notifications on your phone and computer."],
      ["One clear priority", "Write down the ONE task that would make today a win. Do it first."],
      ["Single-task 25 min", "Work on one task for 25 uninterrupted minutes. No tabs, no phone. Then take a 5-minute break."],
      ["Tidy your space", "Clear your physical and digital desktop. A clean workspace lowers cognitive load."],
      ["Week one review", "Review your time audit from day 1. What changed? Write down one win and one struggle."],
      ["Time-block the morning", "Plan your morning in blocks tonight. Assign each block a single task."],
      ["Two focus sessions", "Do two 25-minute single-task sessions today with a real break between them."],
      ["Batch the small stuff", "Group all your small tasks (email, messages, admin) into one 30-minute batch instead of all day."],
      ["Say no once", "Decline one request or meeting that doesn't serve your top priority."],
      ["Protect deep work", "Block one 90-minute window today where you do nothing but your most important work."],
      ["Plan tomorrow tonight", "Before you stop working, write tomorrow's top 3 tasks."],
      ["Week two review", "Which focus system stuck? Note the one you'll keep building on."],
      ["Time-block the full day", "Plan your entire workday in blocks. Follow it as closely as you can."],
      ["Three deep sessions", "Complete three focused work sessions today, each with a clear single goal."],
      ["Shutdown ritual", "Create an end-of-day ritual: review what's done, plan tomorrow, close the laptop. Do it today."],
      ["Weekly review habit", "Do a full weekly review: wins, misses, and next week's priorities."],
      ["Eliminate, don't optimize", "Find one recurring task you can stop doing entirely. Eliminate it."],
      ["Full system day", "Run everything: time-block, deep work, batched small tasks, shutdown ritual."],
      ["Make it yours", "Do the full system again and write down the 3 habits you'll keep permanently."],
    ]),
  },
  {
    id: "mindfulness-kickstart",
    title: "7-Day Mindfulness Kickstart",
    description:
      "Start small with just 5 minutes a day. By day 7 you'll have built a sustainable mindfulness practice that reduces stress and sharpens your awareness.",
    overview:
      "A gentle one-week introduction to mindfulness. No experience needed — each day adds a simple practice you can do in five minutes or less.",
    duration: 7,
    category: "Wellbeing",
    difficulty: "Beginner",
    emoji: "🧘",
    color: "#06B6D4",
    habits: ["5-min morning meditation", "Mindful breathing break", "Gratitude journal"],
    days: days([
      ["Three deep breaths", "Pause three times today and take three slow, deep breaths. Notice how your body feels each time."],
      ["Two-minute sit", "Sit quietly for 2 minutes. Focus only on your breath. When your mind wanders, gently return to it."],
      ["Mindful first sip", "Drink your first coffee, tea, or water of the day with full attention — taste, warmth, no distractions."],
      ["Body scan", "Spend 3 minutes mentally scanning your body head to toe, noticing tension without trying to fix it."],
      ["Gratitude note", "Write down three specific things you're grateful for today."],
      ["Five-minute meditation", "Sit for a full 5 minutes focused on your breath. This is your practice building."],
      ["Put it together", "Do your 5-minute sit, one mindful activity, and your gratitude note. Reflect on how the week felt."],
    ]),
  },
  {
    id: "fitness-foundation",
    title: "30-Day Fitness Foundation",
    description:
      "Build the movement habit that sticks. No gym required — just 20 minutes a day of intentional activity to rewire your body and brain for an active lifestyle.",
    overview:
      "A month of progressive movement that meets you where you are. We start with short walks and gentle mobility, then build strength, consistency, and recovery into a routine your body craves.",
    duration: 30,
    category: "Health",
    difficulty: "Hard",
    emoji: "💪",
    color: "#10B981",
    habits: ["20-min daily movement", "10,000 steps", "Post-workout stretch", "Sleep 7+ hours"],
    days: days([
      ["10-minute walk", "Take a 10-minute walk at an easy pace. The only goal is to start."],
      ["Morning mobility", "Do 5 minutes of gentle joint circles — neck, shoulders, hips, ankles."],
      ["15-minute walk", "Walk for 15 minutes. Notice your breathing and posture."],
      ["Bodyweight basics", "Do 2 rounds: 5 squats, 5 wall push-ups, 10-second plank."],
      ["Stretch & recover", "Spend 8 minutes stretching your legs, back, and chest. Recovery is training too."],
      ["20-minute walk", "Walk for a full 20 minutes. Pick up the pace for the middle 5."],
      ["Week one review", "Rest or gentle stretch. Note how your energy and sleep changed this week."],
      ["Strength round", "Do 3 rounds: 8 squats, 6 push-ups (knees ok), 15-second plank."],
      ["Step goal: 6k", "Aim for 6,000 steps today. Take the stairs, park farther, walk while you call."],
      ["Brisk 20", "Walk briskly for 20 minutes — fast enough that talking gets slightly harder."],
      ["Core focus", "Do 3 rounds: 20-second plank, 10 glute bridges, 10 bird-dogs."],
      ["Active stretch", "10 minutes of dynamic stretching — leg swings, lunges, arm circles."],
      ["Step goal: 8k", "Aim for 8,000 steps today."],
      ["Week two review", "Rest day. Reflect: what's getting easier? Celebrate one improvement."],
      ["Strength + walk", "Do your strength round, then a 15-minute walk to finish."],
      ["Add intensity", "3 rounds: 12 squats, 8 push-ups, 25-second plank, 12 glute bridges."],
      ["Step goal: 10k", "Hit 10,000 steps today. Spread them across the whole day."],
      ["Mobility flow", "Flow through a 10-minute mobility sequence, holding each position for a few breaths."],
      ["Brisk 25", "Walk briskly for 25 minutes."],
      ["Strength push", "4 rounds: 12 squats, 10 push-ups, 30-second plank."],
      ["Week three review", "Rest. Note how your body feels compared to day 1."],
      ["Mix it up", "Combine a 15-minute walk with 2 strength rounds of your choice."],
      ["10k again", "Hit 10,000 steps. By now it should feel routine."],
      ["Endurance walk", "Walk for 30 minutes at a steady pace."],
      ["Full-body strength", "4 rounds: 15 squats, 12 push-ups, 40-second plank, 15 glute bridges."],
      ["Recovery day", "Gentle 10-minute stretch and an early night — aim for 7+ hours of sleep."],
      ["Your choice cardio", "Do 25 minutes of any cardio you enjoy — walk, jog, dance, cycle."],
      ["Strength finale", "Your hardest strength round yet: 4 rounds of your strongest movements."],
      ["Long movement", "Move for a full 30+ minutes however you like. Enjoy what your body can now do."],
      ["Foundation complete", "Do a favorite workout from the month and plan how you'll keep moving from here."],
    ]),
  },
  {
    id: "digital-wellness",
    title: "Digital Wellness Challenge",
    description:
      "Reclaim your attention from the algorithm. Two weeks of intentional screen habits that give your mind space to breathe, create, and connect.",
    overview:
      "Two weeks to take your attention back. Each day adds one boundary between you and the endless scroll, until your phone serves you instead of the other way around.",
    duration: 14,
    category: "Wellbeing",
    difficulty: "Medium",
    emoji: "📵",
    color: "#F43F5E",
    habits: ["Phone-free meals", "App time limits on", "No screens 1hr before bed", "One tech-free hour daily"],
    days: days([
      ["Know your number", "Check your screen-time report. Just look at the real number — that's your starting point."],
      ["Phone-free breakfast", "Eat your first meal today without any screen."],
      ["Kill the badges", "Turn off red notification badges on your three most-distracting apps."],
      ["Grayscale test", "Set your phone to grayscale for the day. Color is what makes apps addictive."],
      ["No phone in bed", "Charge your phone outside the bedroom — or at least across the room — tonight."],
      ["One app limit", "Set a daily time limit on your most-used distracting app."],
      ["Week one review", "Check your screen time. Compare to day 1 and note what surprised you."],
      ["Phone-free meals", "Eat all meals today without screens."],
      ["Morning delay", "Don't open social media or news until after your first hour awake."],
      ["Tech-free hour", "Pick one hour today with zero screens. Read, walk, talk, or just rest."],
      ["Curate your feed", "Unfollow or mute 5 accounts that leave you feeling worse, not better."],
      ["No screens before bed", "No screens for the full hour before sleep tonight."],
      ["Single-screen rule", "When you watch TV, just watch — no second-screen scrolling."],
      ["Design your defaults", "Set the limits and boundaries you want to keep permanently. Reflect on the change."],
    ]),
  },
  {
    id: "deep-work",
    title: "Deep Work Builder",
    description:
      "Train your brain to sustain long, uninterrupted concentration. Three weeks of progressive deep-work sessions that turn distraction into focus — permanently.",
    overview:
      "Concentration is a muscle. Over three weeks you'll progressively extend your focus from short sprints to long, immersive deep-work blocks — and build the rituals that protect them.",
    duration: 21,
    category: "Focus",
    difficulty: "Hard",
    emoji: "🎯",
    color: "#8B5CF6",
    habits: ["90-min deep work block", "Notifications off during work", "Pomodoro sessions", "Reading 30 min daily"],
    days: days([
      ["Define deep work", "Pick one task that requires real thinking. Name it as your deep-work task for the week."],
      ["15-minute sprint", "Work on it for 15 minutes with zero interruptions. Phone in another room."],
      ["Remove the triggers", "Identify what usually breaks your focus and remove it before you start today."],
      ["Two 20-min blocks", "Do two 20-minute focus blocks with a short break between."],
      ["Read 15 minutes", "Read something substantial for 15 minutes — book, long article, no skimming."],
      ["25-minute block", "One clean 25-minute deep-work block on your hardest task."],
      ["Week one review", "How long can you focus before the urge to switch hits? Note it honestly."],
      ["Pre-work ritual", "Create a 2-minute ritual to start focus (clear desk, water, headphones). Use it today."],
      ["Two 30-min blocks", "Two 30-minute deep-work blocks today."],
      ["Read 20 minutes", "Extend your focused reading to 20 minutes."],
      ["45-minute block", "Push to one 45-minute uninterrupted block."],
      ["Distraction list", "Keep a notepad beside you; when a distraction pops up, write it down instead of acting on it."],
      ["Two 45-min blocks", "Two 45-minute deep-work blocks with a proper break between."],
      ["Week two review", "Notice how much further you can focus than week 1. Write the difference down."],
      ["60-minute block", "One full 60-minute deep-work block. Protect it fiercely."],
      ["Read 30 minutes", "Read with full focus for 30 minutes straight."],
      ["Morning deep work", "Do your deep-work block first thing, before email or messages."],
      ["75-minute block", "Push to 75 minutes of sustained focus on one task."],
      ["Two deep blocks", "Two substantial deep-work blocks in one day."],
      ["90-minute block", "The big one: a full 90-minute deep-work session."],
      ["Build your system", "Do a 90-minute block and write the focus ritual you'll keep using forever."],
    ]),
  },
];
