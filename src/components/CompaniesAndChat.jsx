import { useState, useRef, useEffect } from "react";

// ──────────────────────────────────────────────────────────────────────────────
// AI CHAT COMPONENT
// ──────────────────────────────────────────────────────────────────────────────
export function AIChat({ user }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your PlaceAI assistant. Ask me anything about placement preparation, interview tips, or company-specific questions!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const textareaRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `You are PlaceAI, an expert placement preparation assistant for Indian engineering students. You help with DSA, aptitude, technical interviews, HR rounds, and company-specific preparation. Be concise and practical. User: ${user?.user_metadata?.full_name || "Student"}`,
            },
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: userMsg },
          ],
          max_tokens: 600,
        }),
      });
      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that. Try again!";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
    // Shift+Enter → new line (default textarea behavior, no need to handle)
  };

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "SF Pro Display, -apple-system, sans-serif" }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div
                className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 mt-0.5"
              >
                AI
              </div>
            )}
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-sm"
                  : "bg-white/6 text-white/80 border border-white/8 rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              AI
            </div>
            <div className="bg-white/6 border border-white/8 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-white/8">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything… (Shift+Enter for new line)"
            rows={1}
            className="flex-1 resize-none overflow-y-auto px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-white/20"
            style={{ minHeight: 44, maxHeight: 140 }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white disabled:opacity-40 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <p className="text-white/20 text-xs mt-2 text-center">Shift+Enter for new line · Enter to send</p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPANY CARD (all skills, no +N more)
// ──────────────────────────────────────────────────────────────────────────────
export function CompanyCard({ company, onClick }) {
  const [logoFailed, setLogoFailed] = useState(false);

  const difficultyColor = {
    Easy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Medium: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    Hard: "bg-red-500/15 text-red-400 border-red-500/20",
  }[company.difficulty] || "bg-white/10 text-white/50";

  return (
    <button
      onClick={() => onClick?.(company)}
      className="w-full text-left p-5 rounded-2xl border border-white/8 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-900/20 transition-all duration-200 hover:-translate-y-0.5 group"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {/* Logo */}
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
          {!logoFailed && company.domain ? (
            <img
              src={`https://www.google.com/s2/favicons?domain=${company.domain}&sz=64`}
              alt={company.name}
              className="w-8 h-8 object-contain"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <span
              className="text-sm font-bold"
              style={{ background: "linear-gradient(135deg,#6366f1,#7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              {company.name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm truncate">{company.name}</h3>
          <p className="text-white/40 text-xs">{company.ctc} · {company.prepWeeks}w prep</p>
        </div>

        <span className={`px-2 py-0.5 rounded-full text-xs border ${difficultyColor}`}>
          {company.difficulty}
        </span>
      </div>

      {/* Skills — ALL shown, no "+N more" */}
      <div className="flex flex-wrap gap-1.5">
        {(company.skills || []).map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 rounded-lg text-xs bg-indigo-500/10 text-indigo-300 border border-indigo-500/15"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Rounds */}
      {company.rounds?.length > 0 && (
        <div className="mt-3 flex items-center gap-1">
          {company.rounds.map((r, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-white/30 text-xs">{r}</span>
              {i < company.rounds.length - 1 && <span className="text-white/15">→</span>}
            </div>
          ))}
        </div>
      )}
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// SKELETON LOADER (for company cards)
// ──────────────────────────────────────────────────────────────────────────────
export function CompanyCardSkeleton() {
  return (
    <div
      className="p-5 rounded-2xl border border-white/8 space-y-4"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/8 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-white/8 rounded animate-pulse" />
          <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="h-5 w-14 bg-white/5 rounded-full animate-pulse" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {[60, 80, 50, 70, 55].map((w, i) => (
          <div key={i} style={{ width: w }} className="h-5 rounded-lg bg-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// COMPANIES PAGE with sticky search bar
// ──────────────────────────────────────────────────────────────────────────────
export function CompaniesPage({ companies = [], loading = false, onCompanyClick }) {
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  const filtered = companies.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.skills?.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchDiff = difficulty === "All" || c.difficulty === difficulty;
    return matchSearch && matchDiff;
  });

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "#06061a", fontFamily: "SF Pro Display, -apple-system, sans-serif" }}>
      {/* Sticky search bar */}
      <div
        className="sticky top-0 z-30 px-6 py-4 border-b border-white/8 backdrop-blur-xl"
        style={{ background: "rgba(6,6,26,0.85)" }}
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search companies or skills…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder:text-white/20"
            />
          </div>
          {["All", "Easy", "Medium", "Hard"].map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-2.5 rounded-xl text-sm transition-colors ${
                difficulty === d
                  ? "bg-indigo-600 text-white"
                  : "bg-white/5 border border-white/10 text-white/50 hover:text-white"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => <CompanyCardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center text-4xl mb-4">
              🔍
            </div>
            <h3 className="text-white font-medium mb-2">No companies found</h3>
            <p className="text-white/30 text-sm">Try a different search or filter</p>
            <button
              onClick={() => { setSearch(""); setDifficulty("All"); }}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-sm hover:bg-indigo-600/30 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => (
              <CompanyCard key={c.name} company={c} onClick={onCompanyClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
