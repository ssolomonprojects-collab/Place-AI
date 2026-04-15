import { useState } from "react";

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color = "indigo", onClick }) {
  const colorMap = {
    indigo: {
      ring: "hover:border-indigo-500/40",
      bg: "bg-indigo-500/10",
      text: "text-indigo-400",
      glow: "hover:shadow-indigo-900/40",
    },
    violet: {
      ring: "hover:border-violet-500/40",
      bg: "bg-violet-500/10",
      text: "text-violet-400",
      glow: "hover:shadow-violet-900/40",
    },
    emerald: {
      ring: "hover:border-emerald-500/40",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      glow: "hover:shadow-emerald-900/40",
    },
    amber: {
      ring: "hover:border-amber-500/40",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      glow: "hover:shadow-amber-900/40",
    },
  };
  const c = colorMap[color];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border border-white/8 ${c.ring} ${c.glow} hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 group`}
      style={{ background: "rgba(255,255,255,0.03)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center text-xl`}>
          {icon}
        </div>
        <svg
          className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20"
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <path d="M7 17L17 7M17 7H7M17 7v10"/>
        </svg>
      </div>

      {/* LCD-style digit */}
      <div
        className={`text-3xl font-bold mb-1 ${c.text} tabular-nums`}
        style={{
          fontFamily: "SF Mono, ui-monospace, monospace",
          textShadow: color === "indigo" ? "0 0 20px rgba(99,102,241,0.4)" : undefined,
        }}
      >
        {value}
      </div>
      <p className="text-white/40 text-sm">{label}</p>
      {sub && <p className="text-white/25 text-xs mt-1">{sub}</p>}
    </button>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Applied: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    Interview: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    Offer: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Rejected: "bg-red-500/15 text-red-400 border-red-500/20",
    Shortlisted: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs border ${map[status] || "bg-white/10 text-white/50"}`}>
      {status}
    </span>
  );
}

// ─── Application Row ──────────────────────────────────────────────────────────
function ApplicationRow({ app }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className="border-b border-white/5 hover:bg-white/3 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white overflow-hidden flex items-center justify-center">
              <img
                src={`https://logo.clearbit.com/${app.domain}`}
                alt={app.company}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <span className="hidden text-xs font-bold text-gray-700 items-center justify-center w-full h-full bg-indigo-100">
                {app.company[0]}
              </span>
            </div>
            <span className="text-white text-sm font-medium">{app.company}</span>
          </div>
        </td>
        <td className="px-4 py-3 text-white/60 text-sm">{app.role}</td>
        <td className="px-4 py-3">
          <StatusBadge status={app.status} />
        </td>
        <td className="px-4 py-3 text-white/40 text-xs">{app.date}</td>
        <td className="px-4 py-3 text-white/30 text-xs">
          {expanded ? "▲" : "▼"}
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-white/5 bg-indigo-900/10">
          <td colSpan={5} className="px-4 py-3">
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <p className="text-white/30 mb-1">Round</p>
                <p className="text-white/70">{app.round || "—"}</p>
              </div>
              <div>
                <p className="text-white/30 mb-1">CTC</p>
                <p className="text-white/70">{app.ctc || "—"}</p>
              </div>
              <div>
                <p className="text-white/30 mb-1">Notes</p>
                <p className="text-white/70">{app.notes || "—"}</p>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ─── Dashboard Stats + Applications Export ────────────────────────────────────
export function DashboardStats({ stats = {}, onCardClick }) {
  const cards = [
    {
      icon: "🏢",
      label: "Companies Tracked",
      value: stats.companies ?? 0,
      color: "indigo",
      key: "companies",
    },
    {
      icon: "✅",
      label: "Questions Solved",
      value: stats.questions ?? 0,
      sub: `of ${stats.totalQuestions ?? 500}`,
      color: "violet",
      key: "questions",
    },
    {
      icon: "📋",
      label: "Applications Sent",
      value: stats.applications ?? 0,
      color: "emerald",
      key: "applications",
    },
    {
      icon: "🎯",
      label: "Readiness Score",
      value: `${stats.readiness ?? 0}%`,
      color: "amber",
      key: "readiness",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <StatCard key={c.key} {...c} onClick={() => onCardClick?.(c.key)} />
      ))}
    </div>
  );
}

export function RecentApplications({ applications = [] }) {
  return (
    <div
      className="rounded-2xl border border-white/8 overflow-hidden"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <div className="px-6 py-4 border-b border-white/8 flex items-center justify-between">
        <h3 className="text-white font-medium text-sm">Recent Applications</h3>
        <span className="text-white/30 text-xs">{applications.length} total</span>
      </div>
      {applications.length === 0 ? (
        <div className="text-center py-12 text-white/20 text-sm">
          No applications yet. Start applying!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-white/25 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Company</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <ApplicationRow key={app.id} app={app} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
