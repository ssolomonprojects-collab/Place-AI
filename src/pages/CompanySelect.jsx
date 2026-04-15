import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

const difficultyConfig = {
  Easy:         { pill: "bg-emerald-100 text-emerald-700 border border-emerald-200", dot: "bg-emerald-400", glow: "hover:shadow-emerald-100" },
  Medium:       { pill: "bg-amber-100 text-amber-700 border border-amber-200",       dot: "bg-amber-400",   glow: "hover:shadow-amber-100"   },
  "Medium-Hard":{ pill: "bg-orange-100 text-orange-700 border border-orange-200",    dot: "bg-orange-400",  glow: "hover:shadow-orange-100"  },
  Hard:         { pill: "bg-red-100 text-red-700 border border-red-200",             dot: "bg-red-400",     glow: "hover:shadow-red-100"     },
}

const LOGO_OVERRIDES = {
  "TCS":            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/200px-Tata_Consultancy_Services_Logo.svg.png",
  "HCL Technologies":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/HCL_Technologies_logo.svg/200px-HCL_Technologies_logo.svg.png",
  "Tech Mahindra":  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Tech_Mahindra_New_Logo.svg/200px-Tech_Mahindra_New_Logo.svg.png",
  "Mphasis":        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Mphasis_logo.svg/200px-Mphasis_logo.svg.png",
  "Mindtree":       "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/LTIMindtree_logo.svg/200px-LTIMindtree_logo.svg.png",
  "Ola":            "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Ola_Cabs_logo.svg/200px-Ola_Cabs_logo.svg.png",
  "Dunzo":          "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/Dunzo_logo.png/200px-Dunzo_logo.png",
  "Infosys":        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Infosys_logo.svg/200px-Infosys_logo.svg.png",
  "Wipro":          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Wipro_Primary_Logo_Color_RGB.svg/200px-Wipro_Primary_Logo_Color_RGB.svg.png",
  "Cognizant":      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Cognizant_logo.svg/200px-Cognizant_logo.svg.png",
  "Accenture":      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Accenture.svg/200px-Accenture.svg.png",
  "Capgemini":      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Capgemini_201x_logo.svg/200px-Capgemini_201x_logo.svg.png",
}

function CompanyLogoImg({ company, size = 32 }) {
  const getInitialSrc = () => {
    if (LOGO_OVERRIDES[company.name]) return LOGO_OVERRIDES[company.name]
    if (company.logo) return company.logo
    return `https://www.google.com/s2/favicons?domain=${company.domain}&sz=128`
  }

  const [src, setSrc] = useState(getInitialSrc)
  const [failed, setFailed] = useState(false)
  const fallbackIndex = useRef(0)

  const fallbacks = [
    `https://www.google.com/s2/favicons?domain=${company.domain}&sz=128`,
    `https://www.google.com/s2/favicons?domain=${company.domain}&sz=64`,
  ]

  const handleError = () => {
    if (fallbackIndex.current < fallbacks.length) {
      setSrc(fallbacks[fallbackIndex.current])
      fallbackIndex.current += 1
    } else {
      setFailed(true)
    }
  }

  if (failed) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold flex-shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.32 }}
      >
        {company.name.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={company.name}
      style={{ width: size, height: size }}
      className="object-contain flex-shrink-0"
      onError={handleError}
    />
  )
}

function CompanyCard({ c, index, inView }) {
  const config = difficultyConfig[c.difficulty] || difficultyConfig.Medium

  const handleClick = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <div
      className={`group relative bg-white rounded-2xl border border-slate-100 p-6 flex flex-col hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300 ${config.glow}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.5s ease ${index * 60}ms, transform 0.5s ease ${index * 60}ms, box-shadow 0.3s ease`,
      }}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/0 to-purple-50/0 group-hover:from-indigo-50/40 group-hover:to-purple-50/20 transition-all duration-300 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 transition-transform duration-300">
            <CompanyLogoImg company={c} size={36} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors duration-200">
              {c.name}
            </h3>
            <p className="text-xs text-slate-400 font-medium">{c.roles?.[0] || "Software Engineer"}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${config.pill}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {c.difficulty}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-5 relative z-10">
        <div className="bg-slate-50 rounded-xl p-3 group-hover:bg-indigo-50/60 transition-colors duration-300">
          <p className="text-xs text-slate-400 mb-0.5">💰 Package</p>
          <p className="text-sm font-bold text-slate-700">{c.ctc}</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-3 group-hover:bg-indigo-50/60 transition-colors duration-300">
          <p className="text-xs text-slate-400 mb-0.5">⏱️ Prep Time</p>
          <p className="text-sm font-bold text-slate-700">{c.prepWeeks} weeks</p>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        {c.skills.map((s, j) => (
          <span key={j} className="bg-indigo-50 text-indigo-600 text-xs px-3 py-1 rounded-full font-medium border border-indigo-100 group-hover:bg-indigo-100 transition-colors duration-200">
            {s}
          </span>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-auto relative z-10">
        <Link to={`/prep/${c.name}`} onClick={handleClick}
          className="flex-1 text-center bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all duration-150 shadow-md shadow-indigo-200 flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Prep Plan
        </Link>
        <Link to={`/interview/${c.name}`} onClick={handleClick}
          className="flex-1 text-center border border-indigo-200 text-indigo-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-50 hover:border-indigo-300 active:scale-95 transition-all duration-150 flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Mock Interview
        </Link>
      </div>
    </div>
  )
}

export default function CompanySelect() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [headerRef, headerInView] = useInView(0.2)
  const [gridRef, gridInView] = useInView(0.05)

  const difficulties = ["All", "Easy", "Medium", "Hard"]

  const filtered = companies.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === "All" || c.difficulty === filter || (filter === "Medium" && c.difficulty === "Medium-Hard")
    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen bg-slate-50">

      {/* HEADER */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 px-6 pt-16 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: "36px 36px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full opacity-10 blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400 rounded-full opacity-10 blur-3xl -translate-x-1/3 translate-y-1/3" />

        <div ref={headerRef} className="relative z-10 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-indigo-300 text-sm mb-6"
            style={{ opacity: headerInView ? 1 : 0, transition: "opacity 0.6s ease" }}>
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-medium">Companies</span>
          </div>

          <div style={{ opacity: headerInView ? 1 : 0, transform: headerInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }}>
            <span className="inline-block bg-indigo-700/50 border border-indigo-500/30 text-indigo-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 backdrop-blur-sm">
              🏢 500+ Companies Available
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 tracking-tight leading-tight">
              Choose Your Target<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Company</span>
            </h1>
            <p className="text-indigo-200 text-lg max-w-xl">Select a company to get your AI-generated preparation plan, tailored just for you.</p>
          </div>

          <div className="flex gap-6 mt-8" style={{ opacity: headerInView ? 1 : 0, transition: "opacity 0.7s ease 0.3s" }}>
            {[
              { label: "Companies", value: companies.length },
              { label: "Easy", value: companies.filter(c => c.difficulty === "Easy" || c.difficulty === "Easy-Medium").length },
              { label: "Medium", value: companies.filter(c => c.difficulty === "Medium" || c.difficulty === "Medium-Hard").length },
              { label: "Hard", value: companies.filter(c => c.difficulty === "Hard").length },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-indigo-300 text-xs uppercase tracking-wide">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search companies..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 bg-slate-50 transition-all" />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">✕</button>
            )}
          </div>
          <div className="flex gap-2">
            {difficulties.map(d => (
              <button key={d} onClick={() => setFilter(d)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ${filter === d ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {d}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-400 whitespace-nowrap">
            <span className="font-semibold text-slate-700">{filtered.length}</span> companies
          </p>
        </div>
      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-6 py-10" ref={gridRef}>
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No companies found</h3>
            <p className="text-slate-400">Try a different search term or filter.</p>
            <button onClick={() => { setSearch(""); setFilter("All") }}
              className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((c, i) => (
              <CompanyCard key={c.name} c={c} index={i} inView={gridInView} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}