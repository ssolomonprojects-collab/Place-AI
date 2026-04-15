import { useState, useEffect, useRef } from "react";

// ─── Animated Progress Bar ────────────────────────────────────────────────────
function AnimatedBar({ label, value, max = 100, color = "indigo" }) {
  const [width, setWidth] = useState(0);
  const ref = useRef();

  const colorMap = {
    indigo: "from-indigo-600 to-violet-600",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
    blue: "from-blue-500 to-cyan-500",
    pink: "from-pink-500 to-rose-500",
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTimeout(() => setWidth((value / max) * 100), 100); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, max]);

  const pct = Math.round((value / max) * 100);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/70">{label}</span>
        <span className="text-white/40 tabular-nums">
          {value}/{max} · <span className="text-white font-medium">{pct}%</span>
        </span>
      </div>
      <div className="h-2.5 rounded-full bg-white/8 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

// ─── Circular Progress Ring ───────────────────────────────────────────────────
function CircularRing({ value, size = 140, strokeWidth = 10 }) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 200);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-3xl font-bold text-white tabular-nums"
          style={{ fontFamily: "SF Mono, ui-monospace, monospace", textShadow: "0 0 20px rgba(99,102,241,0.5)" }}
        >
          {animated}%
        </span>
        <span className="text-white/40 text-xs">Readiness</span>
      </div>
    </div>
  );
}

// ─── Progress Page ────────────────────────────────────────────────────────────
export function ProgressPage({ stats = {} }) {
  const categories = [
    { label: "Aptitude", value: stats.aptitude ?? 42, max: 100, color: "indigo" },
    { label: "Data Structures & Algorithms", value: stats.dsa ?? 68, max: 150, color: "blue" },
    { label: "Technical (Core CS)", value: stats.technical ?? 31, max: 150, color: "emerald" },
    { label: "HR / Behavioral", value: stats.hr ?? 55, max: 100, color: "amber" },
    { label: "Mock Interviews", value: stats.mocks ?? 3, max: 10, color: "pink" },
  ];

  const overallReadiness = stats.readiness ?? Math.round(
    categories.reduce((sum, c) => sum + (c.value / c.max) * 100, 0) / categories.length
  );

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-white text-xl font-semibold">Progress Tracker</h2>
        <p className="text-white/40 text-sm mt-1">Track your placement preparation across all categories</p>
      </div>

      {/* Overall ring + stats */}
      <div
        className="rounded-2xl border border-white/8 p-6 flex flex-col sm:flex-row items-center gap-8"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <CircularRing value={overallReadiness} />
        <div className="flex-1 space-y-1">
          <h3 className="text-white font-medium mb-3">Overall Placement Readiness</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Questions Solved", value: categories[0].value + categories[1].value + categories[2].value + categories[3].value },
              { label: "Mock Interviews", value: stats.mocks ?? 3 },
              { label: "Streak (days)", value: stats.streak ?? 7 },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p
                  className="text-2xl font-bold text-indigo-400 tabular-nums"
                  style={{ fontFamily: "SF Mono, ui-monospace, monospace" }}
                >
                  {s.value}
                </p>
                <p className="text-white/30 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category bars */}
      <div
        className="rounded-2xl border border-white/8 p-6 space-y-6"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <h3 className="text-white font-medium text-sm">Category Breakdown</h3>
        {categories.map((c) => (
          <AnimatedBar key={c.label} {...c} />
        ))}
      </div>
    </div>
  );
}

// ─── Roadmap Phase ────────────────────────────────────────────────────────────
function RoadmapPhase({ phase, onToggle }) {
  const [expanded, setExpanded] = useState(true);
  const doneCount = phase.tasks.filter((t) => t.done).length;

  return (
    <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
      {/* Phase header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
              doneCount === phase.tasks.length
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-indigo-500/20 text-indigo-400"
            }`}
          >
            {doneCount === phase.tasks.length ? "✓" : `W${phase.week}`}
          </div>
          <div className="text-left">
            <p className="text-white text-sm font-medium">{phase.title}</p>
            <p className="text-white/30 text-xs">{doneCount}/{phase.tasks.length} tasks done</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Mini progress bar */}
          <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
              style={{ width: `${(doneCount / phase.tasks.length) * 100}%` }}
            />
          </div>
          <span className="text-white/30 text-xs">{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {/* Tasks */}
      {expanded && (
        <div className="border-t border-white/8 divide-y divide-white/5">
          {phase.tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center gap-4 px-5 py-3 hover:bg-white/3 transition-colors"
            >
              {/* Animated toggle */}
              <button
                onClick={() => onToggle(phase.id, task.id)}
                className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  task.done
                    ? "bg-emerald-500 border-emerald-500 scale-110"
                    : "border-white/20 hover:border-indigo-400"
                }`}
              >
                {task.done && (
                  <svg
                    className="w-3 h-3 text-white"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                )}
              </button>

              <span className={`text-sm flex-1 transition-all duration-200 ${task.done ? "text-white/30 line-through" : "text-white/70"}`}>
                {task.label}
              </span>

              {task.tag && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {task.tag}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Roadmap Page ─────────────────────────────────────────────────────────────
export function RoadmapPage({ phases, onToggle }) {
  const defaultPhases = [
    {
      id: 1, week: 1, title: "Foundation Week — Core CS",
      tasks: [
        { id: 1, label: "Complete Arrays & Strings (LeetCode Easy)", done: false, tag: "DSA" },
        { id: 2, label: "Solve 20 Aptitude questions", done: false, tag: "Aptitude" },
        { id: 3, label: "Revise OS basics (process, threads)", done: false, tag: "Technical" },
        { id: 4, label: "Set up PlaceAI profile", done: false },
      ],
    },
    {
      id: 2, week: 2, title: "Data Structures Deep Dive",
      tasks: [
        { id: 5, label: "LinkedList, Stack, Queue problems (15 Qs)", done: false, tag: "DSA" },
        { id: 6, label: "Binary Search mastery (10 Qs)", done: false, tag: "DSA" },
        { id: 7, label: "DBMS fundamentals — SQL queries", done: false, tag: "Technical" },
        { id: 8, label: "Mock HR interview practice", done: false, tag: "HR" },
      ],
    },
    {
      id: 3, week: 3, title: "Company-Specific Prep",
      tasks: [
        { id: 9, label: "Research top 5 target companies", done: false },
        { id: 10, label: "Solve company-tagged questions on PlaceAI", done: false, tag: "DSA" },
        { id: 11, label: "Complete 1 Full Mock Interview", done: false, tag: "Mock" },
        { id: 12, label: "Prepare STAR-method HR answers", done: false, tag: "HR" },
      ],
    },
    {
      id: 4, week: 4, title: "Final Sprint & Applications",
      tasks: [
        { id: 13, label: "Apply to 10+ companies", done: false },
        { id: 14, label: "Complete 2 more mock interviews", done: false, tag: "Mock" },
        { id: 15, label: "Revise all weak areas from progress tracker", done: false },
        { id: 16, label: "Prepare resume + LinkedIn update", done: false },
      ],
    },
  ];

  const [roadmapPhases, setRoadmapPhases] = useState(phases || defaultPhases);

  const handleToggle = (phaseId, taskId) => {
    setRoadmapPhases((prev) =>
      prev.map((p) =>
        p.id === phaseId
          ? { ...p, tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)) }
          : p
      )
    );
    onToggle?.(phaseId, taskId);
  };

  const totalDone = roadmapPhases.flatMap((p) => p.tasks).filter((t) => t.done).length;
  const totalTasks = roadmapPhases.flatMap((p) => p.tasks).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white text-xl font-semibold">Placement Roadmap</h2>
          <p className="text-white/40 text-sm mt-1">{totalDone} of {totalTasks} tasks completed</p>
        </div>
        <div className="text-right">
          <span
            className="text-2xl font-bold text-indigo-400 tabular-nums"
            style={{ fontFamily: "SF Mono, ui-monospace, monospace" }}
          >
            {Math.round((totalDone / totalTasks) * 100)}%
          </span>
          <p className="text-white/30 text-xs">Complete</p>
        </div>
      </div>

      <div className="space-y-4">
        {roadmapPhases.map((phase) => (
          <RoadmapPhase key={phase.id} phase={phase} onToggle={handleToggle} />
        ))}
      </div>
    </div>
  );
}
