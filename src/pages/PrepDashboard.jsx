import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import companies from '../data/companies'

function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return [ref, inView]
}

function useCounter(target, duration = 1500, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start || typeof target !== 'number') return
    let startTime = null
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

const difficultyConfig = {
  Easy:   { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-400" },
  Medium: { bg: "bg-amber-100",   text: "text-amber-700",   border: "border-amber-200",   dot: "bg-amber-400"   },
  Hard:   { bg: "bg-red-100",     text: "text-red-700",     border: "border-red-200",     dot: "bg-red-400"     },
}

const phaseConfig = [
  { color: "from-indigo-500 to-indigo-600", light: "bg-indigo-50", border: "border-indigo-200", tag: "bg-indigo-100 text-indigo-700", num: "bg-indigo-600", icon: "🧮" },
  { color: "from-violet-500 to-purple-600", light: "bg-violet-50", border: "border-violet-200", tag: "bg-violet-100 text-violet-700", num: "bg-violet-600", icon: "💻" },
  { color: "from-sky-500 to-blue-600",      light: "bg-sky-50",    border: "border-sky-200",    tag: "bg-sky-100 text-sky-700",       num: "bg-sky-600",    icon: "🔧" },
  { color: "from-emerald-500 to-teal-600",  light: "bg-emerald-50",border: "border-emerald-200",tag: "bg-emerald-100 text-emerald-700",num: "bg-emerald-600",icon: "🤝" },
]

const phases = [
  { title: "Aptitude & Reasoning", weeks: "Week 1–2", topics: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Data Interpretation"] },
  { title: "Coding & DSA",         weeks: "Week 2–3", topics: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Dynamic Programming"] },
  { title: "Technical Interview",  weeks: "Week 3–4", topics: ["OOP Concepts", "DBMS & SQL", "OS Concepts", "CN Basics"] },
  { title: "HR Round",             weeks: "Week 4",   topics: ["Tell me about yourself", "Strengths & Weaknesses", "Why this company?", "Situation-based Qs"] },
]

// ── Company Logo with favicon + letter fallback ──
function CompanyLogo({ domain, name, size = 48 }) {
  const [failed, setFailed] = useState(false)
  const sz = size >= 48 ? 64 : 32

  if (failed || !domain) {
    return (
      <div
        className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white font-extrabold shadow-lg"
        style={{ width: size, height: size, fontSize: size * 0.3 }}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl bg-white border border-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg overflow-hidden"
      style={{ width: size, height: size }}
    >
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${sz}`}
        alt={name}
        style={{ width: size * 0.65, height: size * 0.65, objectFit: "contain" }}
        onError={() => setFailed(true)}
      />
    </div>
  )
}

// Stat card
function StatCard({ label, value, isText, color, icon, delay, inView }) {
  const numVal = isText ? 0 : (parseInt(value) || 0)
  const count = useCounter(numVal, 1400, inView)
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col items-center justify-center text-center hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms, box-shadow 0.3s ease`,
      }}
    >
      <span className="text-2xl mb-2">{icon}</span>
      <div className={`text-2xl font-extrabold ${color} mb-1`}>
        {isText ? value : count}
      </div>
      <div className="text-slate-400 text-xs font-medium uppercase tracking-wide">{label}</div>
    </div>
  )
}

// Phase card
function PhaseCard({ phase, cfg, index, inView, isActive, onClick }) {
  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden
        ${isActive ? `border-indigo-300 shadow-lg shadow-indigo-100` : `border-slate-100 hover:border-slate-200 hover:shadow-md`}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
      }}
      onClick={onClick}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${cfg.color} rounded-l-2xl`} />
      <div className="p-5 pl-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform duration-300`}>
              {cfg.icon}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base leading-tight">{phase.title}</h3>
              <span className="text-xs text-slate-400 font-medium">{phase.weeks}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{phase.topics.length} topics</span>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isActive ? "rotate-180" : ""}`}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <div className={`flex flex-wrap gap-2 overflow-hidden transition-all duration-300 ${isActive ? "max-h-40" : "max-h-10"}`}>
          {phase.topics.map((t, j) => (
            <span key={j} className={`text-xs px-3 py-1.5 rounded-full font-semibold ${cfg.tag} border ${cfg.border}`}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function PrepDashboard() {
  const { company } = useParams()
  const c = companies.find(x => x.name === company) || companies[0]
  const diff = difficultyConfig[c.difficulty] || difficultyConfig.Medium

  const [activePhase, setActivePhase] = useState(null)
  const [headerRef, headerInView] = useInView(0.2)
  const [statsRef, statsInView] = useInView(0.3)
  const [roundsRef, roundsInView] = useInView(0.2)
  const [roadmapRef, roadmapInView] = useInView(0.05)
  const [storiesRef, storiesInView] = useInView(0.1)
  const [ctaRef, ctaInView] = useInView(0.3)

  const togglePhase = (i) => setActivePhase(activePhase === i ? null : i)

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ─── HERO HEADER ─── */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 px-6 pt-14 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "36px 36px" }}
        />
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400 rounded-full opacity-10 blur-3xl -translate-x-1/3 translate-y-1/3" />

        <div ref={headerRef} className="relative z-10 max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div
            className="flex items-center gap-2 text-indigo-300 text-sm mb-6"
            style={{ opacity: headerInView ? 1 : 0, transition: "opacity 0.6s ease" }}
          >
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link to="/companies" className="hover:text-white transition-colors">Companies</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">{c.name}</span>
          </div>

          <div
            style={{
              opacity: headerInView ? 1 : 0,
              transform: headerInView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
          >
            {/* ── Company logo + name — NOW USES REAL FAVICON ── */}
            <div className="flex items-center gap-4 mb-4">
              <CompanyLogo domain={c.domain} name={c.name} size={64} />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                    {c.name} Prep Plan
                  </h1>
                  <span className={`hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${diff.bg} ${diff.text} ${diff.border}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                    {c.difficulty}
                  </span>
                </div>
                <p className="text-indigo-200 mt-1">
                  {c.roles?.[0]} · {c.prepWeeks} week preparation plan
                </p>
              </div>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {c.skills?.slice(0, 5).map((s, i) => (
                <span key={i} className="bg-white/10 border border-white/20 text-indigo-100 text-xs px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 pb-16 relative z-10">

        {/* ── STAT CARDS ── */}
        <div ref={statsRef} className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Average CTC"      value={c.ctc}            isText={true}  color="text-indigo-600"  icon="💰" delay={0}   inView={statsInView} />
          <StatCard label="Interview Rounds" value={c.rounds?.length} isText={false} color="text-purple-600"  icon="🎯" delay={80}  inView={statsInView} />
          <StatCard label="Prep Duration"    value={c.prepWeeks}      isText={false} color="text-emerald-600" icon="📅" delay={160} inView={statsInView} />
        </div>

        {/* ── INTERVIEW ROUNDS ── */}
        <div
          ref={roundsRef}
          className="bg-white rounded-2xl border border-slate-100 p-6 mb-6"
          style={{
            opacity: roundsInView ? 1 : 0,
            transform: roundsInView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-base">🎯</div>
            <h2 className="text-lg font-bold text-slate-800">Interview Rounds</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {c.rounds?.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-4 py-2.5 rounded-xl hover:bg-indigo-100 hover:border-indigo-200 transition-all duration-200 group"
                style={{
                  opacity: roundsInView ? 1 : 0,
                  transform: roundsInView ? "scale(1)" : "scale(0.9)",
                  transition: `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`,
                }}
              >
                <span className="w-6 h-6 bg-indigo-600 text-white rounded-full text-xs flex items-center justify-center font-bold group-hover:bg-indigo-700 transition-colors">
                  {i + 1}
                </span>
                <span className="text-indigo-700 font-semibold text-sm">{r}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── PREP ROADMAP ── */}
        <div ref={roadmapRef} className="mb-6">
          <div
            className="flex items-center justify-between mb-5"
            style={{ opacity: roadmapInView ? 1 : 0, transition: "opacity 0.5s ease" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-base">🗺️</div>
              <h2 className="text-lg font-bold text-slate-800">Preparation Roadmap</h2>
            </div>
            <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
              Click to expand phases
            </span>
          </div>
          <div className="space-y-3">
            {phases.map((p, i) => (
              <PhaseCard
                key={i}
                phase={p}
                cfg={phaseConfig[i]}
                index={i}
                inView={roadmapInView}
                isActive={activePhase === i}
                onClick={() => togglePhase(i)}
              />
            ))}
          </div>
        </div>

        {/* ── STUDENT STORIES ── */}
        {c.stories?.length > 0 && (
          <div ref={storiesRef} className="mb-8">
            <div
              className="flex items-center gap-3 mb-5"
              style={{ opacity: storiesInView ? 1 : 0, transition: "opacity 0.5s ease" }}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-base">💬</div>
              <h2 className="text-lg font-bold text-slate-800">Real Student Experiences</h2>
            </div>
            <div className="space-y-4">
              {c.stories.map((s, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 p-5 hover:border-emerald-200 hover:shadow-md transition-all duration-300 relative overflow-hidden group"
                  style={{
                    opacity: storiesInView ? 1 : 0,
                    transform: storiesInView ? "translateX(0)" : "translateX(-20px)",
                    transition: `opacity 0.5s ease ${i * 100}ms, transform 0.5s ease ${i * 100}ms`,
                  }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-2xl" />
                  <div className="absolute top-4 right-5 text-slate-100 text-5xl font-serif leading-none group-hover:text-emerald-100 transition-colors">"</div>
                  <div className="flex items-start gap-3 pl-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5">
                      S{i + 1}
                    </div>
                    <p className="text-slate-600 italic text-sm leading-relaxed">"{s}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA ── */}
        <div
          ref={ctaRef}
          className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-center overflow-hidden"
          style={{
            opacity: ctaInView ? 1 : 0,
            transform: ctaInView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "28px 28px" }}
          />
          <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full opacity-5 translate-x-1/2 -translate-y-1/2" />
          <div className="relative z-10">
            <div className="text-4xl mb-3">🚀</div>
            <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
              Ready to test your skills?
            </h3>
            <p className="text-indigo-200 mb-6 text-sm max-w-sm mx-auto">
              Jump into a live AI-powered mock interview session and get instant, personalized feedback.
            </p>
            <Link
              to={`/interview/${c.name}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl text-base hover:shadow-2xl hover:shadow-white/20 active:scale-95 transition-all duration-200"
            >
              Start AI Mock Interview for {c.name}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}