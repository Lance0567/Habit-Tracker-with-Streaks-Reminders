export interface ProgramTask {
  id: string;
  title: string;
  detail: string;
}

export interface ProgramDay {
  day: number;
  title: string;
  tasks: ProgramTask[];
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

// Build a day from a theme + a list of [taskTitle, taskDetail] tuples.
function day(n: number, title: string, tasks: [string, string][]): ProgramDay {
  return {
    day: n,
    title,
    tasks: tasks.map(([t, detail], i) => ({ id: `t${i + 1}`, title: t, detail })),
  };
}

export function totalTasks(program: Program): number {
  return program.days.reduce((sum, d) => sum + d.tasks.length, 0);
}

export const PROGRAMS: Program[] = [
  {
    id: "morning-routine",
    title: "Morning Routine Mastery",
    description:
      "Build a powerful morning ritual that sets the tone for your entire day. Science shows the first 90 minutes after waking shape your focus and energy for everything that follows.",
    overview:
      "Over 14 days you'll assemble a calm, energizing morning — one small piece at a time. Each day layers a few small actions onto the last, so by the end the whole routine runs on autopilot.",
    duration: 14,
    category: "Productivity",
    difficulty: "Beginner",
    emoji: "🌅",
    color: "#F59E0B",
    habits: ["Wake up at consistent time", "Drink a glass of water", "10-minute stretch", "No phone for first 30 min"],
    featured: true,
    days: [
      day(1, "Set your foundation", [
        ["Choose one wake time", "Pick a single wake-up time you can keep every day, weekends included. Consistency matters far more than how early it is."],
        ["Move your alarm across the room", "Place your phone or alarm where you have to stand up to silence it. No snooze button within arm's reach."],
        ["Decide your first action", "Write down the very first thing you'll do when the alarm sounds, so you don't lie there negotiating with yourself."],
      ]),
      day(2, "Hydrate first", [
        ["Set water by your bed tonight", "Fill a glass and leave it on your nightstand before you sleep so it's ready the moment you wake."],
        ["Drink it before anything else", "First thing on waking, drink the full glass — before your phone, before coffee. Rehydrate after a night's sleep."],
        ["Notice how you feel", "Take ten seconds to notice your body waking up. This tiny pause builds the habit of a mindful start."],
      ]),
      day(3, "Protect the first minutes", [
        ["Leave your phone untouched 10 min", "When you wake, don't pick up your phone for the first 10 minutes. The world can wait."],
        ["Open the curtains", "Let natural light in immediately — it tells your body clock the day has begun."],
        ["Take three deep breaths", "Three slow breaths to shift from sleep to awake, calmly and on your own terms."],
      ]),
      day(4, "Make your bed", [
        ["Make your bed within 5 minutes", "Straighten the sheets and pillows right after getting up. A made bed is the day's first completed task."],
        ["Tidy one nearby surface", "Clear one small surface — nightstand or dresser. A calm space supports a calm mind."],
        ["Repeat yesterday's wins", "Do your hydration and phone-free minutes again. You're now stacking habits."],
      ]),
      day(5, "Add gentle movement", [
        ["Stretch for two minutes", "Loosen your neck, shoulders, back, and legs. Keep it gentle — the point is to wake the body."],
        ["Roll your shoulders and neck", "Five slow circles each direction to release overnight stiffness."],
        ["Stand tall and reach up", "Reach for the ceiling, take a breath, and exhale as you lower. A simple energizing finish."],
      ]),
      day(6, "Step into light", [
        ["Get 5 minutes of daylight", "Step outside or sit by a bright window. Morning light anchors your sleep-wake cycle."],
        ["Breathe the morning air", "Take a few deep breaths of fresh air to feel more alert."],
        ["Run your routine in order", "Do wake, hydrate, phone-free, bed, stretch, light — back to back. Notice the flow."],
      ]),
      day(7, "Week one review", [
        ["Note your easiest habit", "Which piece felt most natural? That's your anchor — keep it rock solid."],
        ["Note your hardest habit", "Which one slips? Plan one small tweak to make it easier tomorrow."],
        ["Run the full sequence", "Do everything you've built so far, in order, to lock the rhythm in."],
      ]),
      day(8, "Deepen the stretch", [
        ["Stretch for five minutes", "Extend your stretch and hold each position a little longer, breathing into it."],
        ["Add one mobility move", "Try cat-cow, a standing forward fold, or hip circles — whatever your body wants."],
        ["End with two calm breaths", "Finish the stretch with two slow breaths to carry calm into the day."],
      ]),
      day(9, "Set an intention", [
        ["Write one intention", "Name a single thing that would make today good. Keep it to one clear sentence."],
        ["Say it out loud", "Speaking it makes it real and sharpens your focus for the day ahead."],
        ["Place it where you'll see it", "Leave the note somewhere visible as a gentle reminder."],
      ]),
      day(10, "Phone-free thirty", [
        ["Extend phone-free to 30 min", "Push your no-phone window to a full 30 minutes after waking."],
        ["Fill it with your routine", "Use the time for your existing habits instead of scrolling."],
        ["Keep notifications off", "Leave do-not-disturb on until your routine is done."],
      ]),
      day(11, "Energize the body", [
        ["Add 5 minutes of movement", "A short walk, a few squats, or light cardio after your stretch."],
        ["Get your heart rate up gently", "Just enough to feel awake and warm — no workout required."],
        ["Notice your energy", "Compare how you feel now to a groggy morning. That's the payoff."],
      ]),
      day(12, "Nourish", [
        ["Prepare something healthy", "Make or set out a simple, nourishing breakfast in your first hour."],
        ["Eat without screens", "Eat mindfully, tasting your food, with no phone or TV."],
        ["Plan tomorrow's breakfast", "Decide tonight what you'll eat so mornings stay smooth."],
      ]),
      day(13, "Run it all", [
        ["Complete the full routine", "Wake, hydrate, phone-free, bed, stretch, light, intention, move, nourish — all of it."],
        ["Time how long it takes", "Knowing the duration helps you protect the window each morning."],
        ["Adjust the order if needed", "Rearrange steps so the sequence feels natural to you."],
      ]),
      day(14, "Lock it in", [
        ["Do the full routine once more", "Run your complete morning ritual start to finish."],
        ["Write how mornings feel now", "One line comparing today to day 1. Notice how far you've come."],
        ["Pick your keepers", "Choose the 3-4 habits you'll keep forever and commit to them."],
      ]),
    ],
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
    days: [
      day(1, "Audit your time", [
        ["Track every hour today", "Log what you actually do, hour by hour. No judgment — just data."],
        ["Total your distraction time", "At day's end, add up the time lost to scrolling, switching, and noise."],
        ["Pick your worst offender", "Identify the single biggest time-waster to target first."],
      ]),
      day(2, "Kill one distraction", [
        ["Remove your top offender", "Log out, delete the app, or block the site for the whole day."],
        ["Replace it with a cue", "Decide what you'll do instead when the urge hits (stand, breathe, sip water)."],
        ["Note the urges", "Tally how many times you reached for it. Awareness weakens the pull."],
      ]),
      day(3, "Silence notifications", [
        ["Turn off non-essential alerts", "Disable notifications for everything except calls and truly urgent apps."],
        ["Remove badge counts", "Kill the red dots that pull your attention all day."],
        ["Set phone to do-not-disturb", "Schedule DND during your core work hours."],
      ]),
      day(4, "One clear priority", [
        ["Name today's one task", "Write the single task that would make today a win."],
        ["Do it first", "Tackle it before email or meetings, while your focus is freshest."],
        ["Protect 30 minutes for it", "Block half an hour where nothing else is allowed."],
      ]),
      day(5, "Single-task sprint", [
        ["Work 25 minutes, one task", "No tabs, no phone. One task for 25 uninterrupted minutes."],
        ["Take a 5-minute break", "Step away fully — stretch, walk, look out a window."],
        ["Run a second round", "Repeat the 25/5 cycle once more and notice the momentum."],
      ]),
      day(6, "Clear your space", [
        ["Tidy your physical desk", "Clear everything not needed for your current task."],
        ["Clean your digital desktop", "Close stray tabs and file loose documents."],
        ["Set up tomorrow's workspace", "Leave it ready so you start clean."],
      ]),
      day(7, "Week one review", [
        ["Compare to your day-1 audit", "What changed in how you spend your time?"],
        ["Write one win", "Name the improvement you're proudest of this week."],
        ["Write one struggle", "Name what's still hard and one idea to fix it."],
      ]),
      day(8, "Time-block the morning", [
        ["Plan your morning in blocks", "Tonight, assign each morning hour a single task."],
        ["Give each block one goal", "One clear outcome per block — no multitasking."],
        ["Follow the plan", "Work the blocks as written and adjust tomorrow."],
      ]),
      day(9, "Two focus sessions", [
        ["Complete two 25-min sessions", "Two single-task blocks with a real break between."],
        ["Log what you finished", "Write down what each session produced."],
        ["Protect them from interruptions", "Tell others you're heads-down during these windows."],
      ]),
      day(10, "Batch the small stuff", [
        ["Group your small tasks", "Collect email, messages, and admin into one list."],
        ["Do them in one 30-min batch", "Handle them all at once instead of all day long."],
        ["Close the inbox after", "Resist checking again until the next batch."],
      ]),
      day(11, "Say no once", [
        ["Decline one low-value ask", "Turn down a meeting or request that doesn't serve your priorities."],
        ["Offer an alternative", "Suggest async, a shorter version, or a later time."],
        ["Notice the freed time", "Use the reclaimed slot for focused work."],
      ]),
      day(12, "Protect deep work", [
        ["Block a 90-minute window", "Reserve one uninterrupted block for your most important work."],
        ["Remove all distractions first", "Phone away, notifications off, door closed."],
        ["Work one hard task only", "Spend the whole block on something that requires real thinking."],
      ]),
      day(13, "Plan tomorrow tonight", [
        ["Write tomorrow's top 3", "Before stopping, list the three tasks that matter most."],
        ["Rank them by importance", "Order them so you know what to do first."],
        ["Set your first block", "Decide when and where you'll start task one."],
      ]),
      day(14, "Week two review", [
        ["Note your best system", "Which focus method stuck the most?"],
        ["Cut what didn't work", "Drop one tactic that added friction without payoff."],
        ["Commit to next week's focus", "Pick the one habit to deepen in week three."],
      ]),
      day(15, "Time-block the full day", [
        ["Plan the entire workday", "Block every hour with a single intended task."],
        ["Include breaks and buffer", "Schedule rest and slack so the plan survives reality."],
        ["Follow it as closely as you can", "Adjust live, but keep the structure."],
      ]),
      day(16, "Three deep sessions", [
        ["Complete three focus blocks", "Three single-task sessions across the day."],
        ["Give each a clear goal", "Define the outcome before each block starts."],
        ["Rest fully between them", "Real breaks keep focus sharp across all three."],
      ]),
      day(17, "Shutdown ritual", [
        ["Review what you finished", "At day's end, scan what got done."],
        ["Plan tomorrow's top tasks", "Write tomorrow's priorities before closing."],
        ["Close the laptop and say done", "A clear endpoint protects your evening and your focus."],
      ]),
      day(18, "Weekly review habit", [
        ["List this week's wins", "Capture what went well."],
        ["List this week's misses", "Note what slipped and why."],
        ["Set next week's priorities", "Choose the few things that matter most."],
      ]),
      day(19, "Eliminate, don't optimize", [
        ["Find a recurring time sink", "Spot a task you do regularly that adds little value."],
        ["Stop doing it entirely", "Eliminate it rather than trying to do it faster."],
        ["Redirect the saved time", "Put it toward deep work or rest."],
      ]),
      day(20, "Full system day", [
        ["Run time-blocking all day", "Use your full planned-block schedule."],
        ["Do your deep-work block", "Protect one long focused session."],
        ["End with your shutdown ritual", "Close the day deliberately."],
      ]),
      day(21, "Make it yours", [
        ["Run the full system once more", "Time-block, deep work, batching, shutdown."],
        ["Pick three habits to keep", "Choose the practices you'll carry forward permanently."],
        ["Schedule your weekly review", "Set a recurring time so the system sustains itself."],
      ]),
    ],
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
    days: [
      day(1, "Notice your breath", [
        ["Take three deep breaths, thrice", "Three times today, pause and take three slow, deep breaths."],
        ["Feel the air move", "Notice the sensation of breathing in and out — cool in, warm out."],
        ["Name how you feel after", "One word for your state after each pause. Just observe."],
      ]),
      day(2, "Sit in stillness", [
        ["Sit quietly for two minutes", "Set a timer and simply sit, eyes closed or soft."],
        ["Follow your breath", "Rest your attention on the breath as your anchor."],
        ["Return gently when you drift", "When your mind wanders, kindly bring it back. That's the practice."],
      ]),
      day(3, "Mindful first sip", [
        ["Drink your first cup with attention", "Coffee, tea, or water — taste it fully, no distractions."],
        ["Notice temperature and flavor", "Slow down enough to actually experience it."],
        ["Pause before the next task", "Take one breath before moving on with your day."],
      ]),
      day(4, "Scan your body", [
        ["Do a 3-minute body scan", "Mentally move from head to toe, noticing each area."],
        ["Notice tension without fixing", "Just observe where you hold tightness."],
        ["Soften one tight spot", "Let one tense area relax with an exhale."],
      ]),
      day(5, "Practice gratitude", [
        ["Write three specific things", "Name three things you're grateful for today — be specific."],
        ["Feel one of them fully", "Pick one and sit with the appreciation for a moment."],
        ["Thank one person", "Tell someone, in person or by message, that you appreciate them."],
      ]),
      day(6, "Five-minute sit", [
        ["Meditate for five minutes", "Sit and focus on your breath for a full five minutes."],
        ["Label thoughts as 'thinking'", "When thoughts arise, note 'thinking' and return to the breath."],
        ["End with one slow breath", "Close the session with a single intentional breath."],
      ]),
      day(7, "Put it together", [
        ["Do your 5-minute sit", "Complete your now-established meditation."],
        ["Add one mindful activity", "Bring full attention to one routine action today."],
        ["Reflect on the week", "Write one line on how mindfulness changed your week."],
      ]),
    ],
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
    days: [
      day(1, "Just start", [
        ["Take a 10-minute walk", "Easy pace. The only goal today is to begin."],
        ["Drink water after", "Rehydrate when you finish."],
        ["Note how you feel", "One line on your energy after moving."],
      ]),
      day(2, "Wake the joints", [
        ["Do 5 minutes of joint circles", "Neck, shoulders, hips, ankles — gentle rotations."],
        ["Move slowly and breathe", "No bouncing; smooth, controlled circles."],
        ["Stand tall afterward", "Reset your posture and take a deep breath."],
      ]),
      day(3, "Walk a little longer", [
        ["Walk for 15 minutes", "Slightly longer than day 1, steady pace."],
        ["Focus on posture", "Shoulders back, eyes forward, relaxed arms."],
        ["Notice your breathing", "Keep it conversational — you should be able to talk."],
      ]),
      day(4, "Bodyweight basics", [
        ["Do 5 squats", "Slow and controlled, sitting back into the heels."],
        ["Do 5 wall push-ups", "Hands on a wall, lower your chest, press back."],
        ["Hold a 10-second plank", "Straight line from head to heels, brace your core."],
      ]),
      day(5, "Stretch and recover", [
        ["Stretch legs for 4 minutes", "Hamstrings, quads, and calves, holding each gently."],
        ["Stretch back and chest", "Open the chest and lengthen the spine."],
        ["Breathe into each hold", "Recovery is training too — relax into it."],
      ]),
      day(6, "Pick up the pace", [
        ["Walk for 20 minutes", "A full 20-minute walk today."],
        ["Speed up the middle 5", "Walk briskly for five minutes in the middle."],
        ["Cool down slowly", "Ease back to a relaxed pace to finish."],
      ]),
      day(7, "Recover and reflect", [
        ["Rest or stretch gently", "Light movement only — let your body absorb the week."],
        ["Note your energy change", "How do you feel versus day 1?"],
        ["Plan next week's times", "Decide when you'll move each day."],
      ]),
      day(8, "First strength round", [
        ["3 rounds of 8 squats", "Rest as needed between rounds."],
        ["3 rounds of 6 push-ups", "Knees down is fine; full range matters more than count."],
        ["3 rounds of 15-sec plank", "Hold steady, breathing throughout."],
      ]),
      day(9, "Move more", [
        ["Hit 6,000 steps", "Take the stairs, park farther, walk while you call."],
        ["Add a short evening walk", "A few minutes after dinner to top up steps."],
        ["Stretch before bed", "Gentle stretching to wind down."],
      ]),
      day(10, "Brisk walking", [
        ["Walk briskly for 20 minutes", "Fast enough that talking gets slightly harder."],
        ["Swing your arms", "Drive with the arms to lift your pace."],
        ["Track the distance", "Note how far you got for next time."],
      ]),
      day(11, "Build the core", [
        ["3 rounds of 20-sec plank", "Keep hips level, core braced."],
        ["3 rounds of 10 glute bridges", "Squeeze at the top, lower slowly."],
        ["3 rounds of 10 bird-dogs", "Extend opposite arm and leg, stay steady."],
      ]),
      day(12, "Active stretching", [
        ["Do leg swings", "Forward-back and side-to-side, controlled."],
        ["Do walking lunges", "10 steps, focusing on balance."],
        ["Do arm circles", "Loosen the shoulders both directions."],
      ]),
      day(13, "Step it up", [
        ["Hit 8,000 steps", "Push your daily step count higher."],
        ["Take a longer midday walk", "Break up the day with movement."],
        ["Hydrate through the day", "Keep water handy as you move more."],
      ]),
      day(14, "Week two review", [
        ["Rest day", "Let your body recover fully."],
        ["Celebrate one improvement", "Name something that's easier than two weeks ago."],
        ["Set week-three intentions", "Decide where you want to push next."],
      ]),
      day(15, "Strength plus walk", [
        ["Do your strength round", "Squats, push-ups, plank — your now-familiar set."],
        ["Walk 15 minutes after", "Finish with a steady walk."],
        ["Stretch the worked muscles", "Target whatever feels tight."],
      ]),
      day(16, "Add intensity", [
        ["3 rounds of 12 squats", "More reps, same good form."],
        ["3 rounds of 8 push-ups", "Push for full range each rep."],
        ["3 rounds of 25-sec plank", "Hold a little longer than before."],
      ]),
      day(17, "Ten thousand", [
        ["Hit 10,000 steps", "Spread them across the whole day."],
        ["Walk after each meal", "Three short walks make 10k easy."],
        ["Notice it feels routine", "Movement is becoming your default."],
      ]),
      day(18, "Mobility flow", [
        ["Flow through 10 minutes", "Move smoothly between mobility positions."],
        ["Hold each for a few breaths", "Don't rush — breathe into each shape."],
        ["End relaxed", "Finish lying down with slow breathing."],
      ]),
      day(19, "Brisk 25", [
        ["Walk briskly for 25 minutes", "Sustained brisk pace today."],
        ["Find a route you enjoy", "Pleasant scenery makes it stick."],
        ["Cool down and stretch", "Ease off and stretch the legs."],
      ]),
      day(20, "Strength push", [
        ["4 rounds of 12 squats", "Add a fourth round today."],
        ["4 rounds of 10 push-ups", "Steady form across all rounds."],
        ["4 rounds of 30-sec plank", "Longer holds, controlled breathing."],
      ]),
      day(21, "Week three review", [
        ["Rest", "Recovery keeps progress sustainable."],
        ["Compare to day 1", "Note how your body feels now."],
        ["Plan the final push", "Set your intentions for the last week."],
      ]),
      day(22, "Mix it up", [
        ["Walk 15 minutes", "Easy start to the session."],
        ["Do 2 strength rounds", "Pick your favorite movements."],
        ["Stretch to finish", "Full-body stretch to close."],
      ]),
      day(23, "10k again", [
        ["Hit 10,000 steps", "By now this should feel normal."],
        ["Take the active option", "Stairs, walking meetings, the long way round."],
        ["Log your streak", "Note the consistency you've built."],
      ]),
      day(24, "Endurance walk", [
        ["Walk for 30 minutes", "A steady, sustained 30-minute walk."],
        ["Keep an even pace", "Find a rhythm you can hold the whole way."],
        ["Hydrate after", "Replace fluids when you finish."],
      ]),
      day(25, "Full-body strength", [
        ["4 rounds of 15 squats", "Higher reps, strong form."],
        ["4 rounds of 12 push-ups", "Challenge yourself on range and count."],
        ["4 rounds of 40-sec plank + 15 bridges", "Core and glutes to finish."],
      ]),
      day(26, "Recovery day", [
        ["Stretch gently for 10 minutes", "Slow, full-body stretching."],
        ["Get to bed early", "Aim for 7+ hours of sleep tonight."],
        ["Hydrate well", "Support recovery with water through the day."],
      ]),
      day(27, "Cardio you enjoy", [
        ["Do 25 minutes of any cardio", "Walk, jog, dance, or cycle — your choice."],
        ["Pick something fun", "Enjoyment is what makes it last."],
        ["Cool down and stretch", "Bring the heart rate down gradually."],
      ]),
      day(28, "Strength finale", [
        ["4 rounds of your hardest squats", "Your strongest squat variation and count."],
        ["4 rounds of your hardest push-ups", "Push your limit with good form."],
        ["4 rounds of your longest plank", "Hold as long as you can, controlled."],
      ]),
      day(29, "Long movement", [
        ["Move for 30+ minutes", "However you like — enjoy what your body can now do."],
        ["Reflect mid-session", "Notice your stamina compared to day 1."],
        ["Stretch thoroughly after", "Reward your muscles with a full stretch."],
      ]),
      day(30, "Foundation complete", [
        ["Do a favorite workout", "Pick the session you enjoyed most this month."],
        ["Write your month's wins", "List what's changed in your body and energy."],
        ["Plan how you'll keep moving", "Decide your ongoing weekly movement plan."],
      ]),
    ],
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
    days: [
      day(1, "Know your number", [
        ["Check your screen-time report", "Look at the real daily total — that's your baseline."],
        ["Find your most-used app", "Identify where most of the time goes."],
        ["Write the number down", "Record it so you can compare at the end."],
      ]),
      day(2, "Phone-free breakfast", [
        ["Eat your first meal screen-free", "No phone, no TV — just your food."],
        ["Leave the phone in another room", "Distance removes the temptation."],
        ["Notice the calm", "See how a quieter start feels."],
      ]),
      day(3, "Kill the badges", [
        ["Turn off badges on 3 apps", "Remove the red dots from your most-distracting apps."],
        ["Disable their banners too", "Stop interruptions before they start."],
        ["Keep only essential alerts", "Calls and truly urgent apps only."],
      ]),
      day(4, "Grayscale test", [
        ["Set your phone to grayscale", "Color is what makes apps addictive — drain it for the day."],
        ["Notice reduced pull", "See how much less tempting the screen becomes."],
        ["Reflect tonight", "Decide whether to keep grayscale on a schedule."],
      ]),
      day(5, "Phone out of the bedroom", [
        ["Charge it outside the bedroom", "Or at least across the room, out of reach."],
        ["Use a real alarm clock", "Remove the excuse to keep the phone close."],
        ["Read instead of scroll", "Wind down with a book or quiet, not a feed."],
      ]),
      day(6, "Set an app limit", [
        ["Add a daily limit to one app", "Set a time cap on your biggest time sink."],
        ["Pick a realistic number", "Tight enough to matter, loose enough to keep."],
        ["Honor the limit today", "When it's reached, close the app."],
      ]),
      day(7, "Week one review", [
        ["Check your screen time", "Compare to day 1 — note the change."],
        ["Name your biggest win", "Which boundary helped most?"],
        ["Pick one to keep forever", "Lock in your favorite new habit."],
      ]),
      day(8, "Phone-free meals", [
        ["Eat all meals screen-free", "Extend the breakfast rule to every meal."],
        ["Be present with others", "If eating with people, focus on them."],
        ["Taste your food", "Eat slowly and actually notice it."],
      ]),
      day(9, "Delay the morning scroll", [
        ["No social/news for the first hour", "Protect your first hour from the feed."],
        ["Do something real first", "Move, eat, or plan before going online."],
        ["Notice your mood", "See how a slower start affects your day."],
      ]),
      day(10, "Tech-free hour", [
        ["Take one screen-free hour", "Pick an hour with zero screens."],
        ["Fill it intentionally", "Read, walk, talk, create, or rest."],
        ["Notice the boredom pass", "The urge fades — and something better replaces it."],
      ]),
      day(11, "Curate your feed", [
        ["Unfollow or mute 5 accounts", "Cut accounts that leave you feeling worse."],
        ["Follow one uplifting source", "Add something that genuinely helps you."],
        ["Notice the cleaner feed", "See how a curated feed changes your scrolling."],
      ]),
      day(12, "No screens before bed", [
        ["No screens for the hour before sleep", "Give your brain time to wind down."],
        ["Set a wind-down alarm", "A reminder to put the phone away."],
        ["Do a calm activity instead", "Read, stretch, or journal."],
      ]),
      day(13, "Single-screen rule", [
        ["Watch without a second screen", "When watching TV, just watch — no phone."],
        ["Put the phone out of sight", "Remove the dual-screen temptation."],
        ["Notice deeper enjoyment", "One screen means you actually take it in."],
      ]),
      day(14, "Design your defaults", [
        ["Set the limits you'll keep", "Lock in the boundaries that worked."],
        ["Compare your screen time", "Look at today's number versus day 1."],
        ["Write your new rules", "Note the digital habits you're keeping for good."],
      ]),
    ],
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
    days: [
      day(1, "Define deep work", [
        ["Pick one demanding task", "Choose work that needs real thinking, not busywork."],
        ["Name it as this week's focus", "Commit to it as your deep-work target."],
        ["Clear your desk for it", "Remove anything unrelated from your space."],
      ]),
      day(2, "First sprint", [
        ["Focus 15 minutes, no interruptions", "Phone in another room, one task only."],
        ["Notice the first urge to switch", "Note when the pull to distraction hits."],
        ["Return to the task", "Resist once, and the urge weakens."],
      ]),
      day(3, "Remove the triggers", [
        ["List what breaks your focus", "Name your top three interruption sources."],
        ["Remove them before starting", "Eliminate each one in advance."],
        ["Do a 15-minute block", "Work distraction-free for 15 minutes."],
      ]),
      day(4, "Two short blocks", [
        ["Do two 20-minute blocks", "Two focused sessions with a break between."],
        ["Single-task each one", "One clear goal per block."],
        ["Rest fully between", "Step away during the break."],
      ]),
      day(5, "Read with focus", [
        ["Read 15 minutes, no skimming", "Something substantial — book or long article."],
        ["Put your phone away first", "Remove the temptation to check."],
        ["Note one idea you learned", "Capture a takeaway to cement focus."],
      ]),
      day(6, "Clean 25", [
        ["Do one 25-minute block", "Your hardest task for a clean 25 minutes."],
        ["No tab-switching", "Stay on the single task the whole time."],
        ["Reward yourself after", "A short, enjoyable break as a reward."],
      ]),
      day(7, "Week one review", [
        ["Note your focus ceiling", "How long before the urge to switch hits?"],
        ["Write it down honestly", "An honest baseline guides week two."],
        ["Pick one fix", "Choose one change to focus longer next week."],
      ]),
      day(8, "Build a pre-work ritual", [
        ["Create a 2-minute starter", "Clear desk, water, headphones — a consistent cue."],
        ["Use it before a block", "Run the ritual, then start focusing."],
        ["Repeat to reinforce", "The ritual becomes your on-switch."],
      ]),
      day(9, "Two thirties", [
        ["Do two 30-minute blocks", "Extend each session to 30 minutes."],
        ["Use your ritual each time", "Start both blocks with your cue."],
        ["Track what you produced", "Note the output of each block."],
      ]),
      day(10, "Read longer", [
        ["Read 20 minutes focused", "Extend your focused reading."],
        ["Keep distractions away", "Phone in another room."],
        ["Summarize in one sentence", "Capture the gist when you finish."],
      ]),
      day(11, "Push to 45", [
        ["Do one 45-minute block", "A single uninterrupted 45-minute session."],
        ["Set a clear goal first", "Know exactly what you're working on."],
        ["Notice the deep state", "See if you slip into flow."],
      ]),
      day(12, "Capture distractions", [
        ["Keep a distraction notepad", "When a thought pops up, write it instead of acting."],
        ["Do a 30-minute block", "Park every interruption on the pad."],
        ["Review the pad after", "Handle the noted items later, on your terms."],
      ]),
      day(13, "Two 45s", [
        ["Do two 45-minute blocks", "Two long sessions with a proper break."],
        ["Protect them fiercely", "Tell others you're unavailable."],
        ["Rest between fully", "Recover so the second block stays sharp."],
      ]),
      day(14, "Week two review", [
        ["Compare to week one", "How much longer can you focus now?"],
        ["Write the difference down", "Seeing progress fuels week three."],
        ["Set the week-three goal", "Aim for your longest blocks yet."],
      ]),
      day(15, "The hour", [
        ["Do one 60-minute block", "A full hour of uninterrupted focus."],
        ["Guard it completely", "No notifications, no interruptions."],
        ["Take a real break after", "Step fully away to recover."],
      ]),
      day(16, "Deep reading", [
        ["Read 30 minutes straight", "Sustained, focused reading."],
        ["No device nearby", "Remove every digital temptation."],
        ["Note two takeaways", "Capture what stuck with you."],
      ]),
      day(17, "Morning deep work", [
        ["Do your block first thing", "Before email or messages, while fresh."],
        ["Protect the morning", "Don't let anything jump the queue."],
        ["Notice the quality", "Morning focus is often your sharpest."],
      ]),
      day(18, "Push to 75", [
        ["Do one 75-minute block", "Extend your sustained focus further."],
        ["Use your full ritual", "Start with your established cue."],
        ["Track your flow", "Note when you lost track of time."],
      ]),
      day(19, "Two deep blocks", [
        ["Do two substantial blocks", "Two long sessions in one day."],
        ["Space them with real rest", "Recover between for quality."],
        ["Review what you finished", "Tally the day's deep output."],
      ]),
      day(20, "Ninety minutes", [
        ["Do one 90-minute block", "The big one — full, sustained focus."],
        ["Eliminate everything else", "No distractions whatsoever."],
        ["Notice the deep flow", "This is what trained focus feels like."],
      ]),
      day(21, "Build your system", [
        ["Do a final 90-minute block", "Cap the program with your longest session."],
        ["Write your focus ritual", "Document the routine you'll keep using."],
        ["Schedule deep work weekly", "Lock recurring blocks into your calendar."],
      ]),
    ],
  },
];
