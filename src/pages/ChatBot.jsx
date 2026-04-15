import { useState, useRef, useEffect } from 'react'
import Groq from 'groq-sdk'

const systemPrompt = `You are PlaceAI, an expert placement preparation coach for engineering students in India.
You help students with:
- Company-specific preparation strategies (TCS, Infosys, Wipro, Accenture, Zoho, Google, Amazon, Microsoft, HCL, Cognizant)
- DSA topics and coding practice advice
- Aptitude preparation tips
- HR interview questions and answers
- Resume building tips
- Placement roadmaps and timelines
Always be encouraging, specific, and practical. Keep responses concise and actionable.`

function RenderText({ text }) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hi! I'm PlaceAI 🤖 Your personal placement preparation coach. Which company are you preparing for? I'll give you a customized plan!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages = [...messages, { role: 'user', text: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const groq = new Groq({ apiKey: import.meta.env.VITE_GROQ_API_KEY, dangerouslyAllowBrowser: true })
      const chatHistory = messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))
      const completion = await groq.chat.completions.create({
        messages: [{ role: 'system', content: systemPrompt }, ...chatHistory, { role: 'user', content: userMsg }],
        model: 'llama-3.3-70b-versatile',
        max_tokens: 600,
      })
      const text = completion.choices[0]?.message?.content || 'Sorry, try again.'
      setMessages(prev => [...prev, { role: 'ai', text }])
    } catch (e) {
      console.error(e)
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, something went wrong. Please try again.' }])
    }
    setLoading(false)
  }

  const quickQuestions = ["How to prepare for TCS?", "Best DSA resources?", "Common HR questions?", "Zoho preparation tips?"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 px-4 py-8 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600 opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-600 opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg">🤖</div>
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight">AI Placement Coach</h1>
            <div className="ml-auto flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-indigo-400 text-xs font-semibold">PlaceAI Online</span>
            </div>
          </div>
          <p className="text-white/40 text-sm ml-[52px]">Ask me anything about placements, companies, DSA, or HR prep</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          {quickQuestions.map((q, i) => (
            <button key={i} onClick={() => setInput(q)}
              className="bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-400/40 text-white/60 hover:text-indigo-300 text-xs font-medium px-4 py-2 rounded-full transition-all duration-200 hover:scale-105">
              ✦ {q}
            </button>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ height: '72vh' }}>
          <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-white/5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shadow-md">🤖</div>
            <div>
              <p className="text-white font-bold text-sm">PlaceAI Coach</p>
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-indigo-400'}`} />
                <span className={`text-xs font-medium ${loading ? 'text-yellow-400' : 'text-indigo-400'}`}>{loading ? 'Thinking...' : 'Ready to help'}</span>
              </span>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400/70" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-end gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animation: 'fadeSlideUp 0.3s ease forwards', animationDelay: `${i * 0.04}s`, opacity: 0 }}>
                {m.role === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0 shadow-md">🤖</div>
                )}
                <div className={`max-w-lg px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-lg ${
                  m.role === 'user'
                    ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-br-sm'
                    : 'bg-white/10 border border-white/10 text-white/90 rounded-bl-sm'
                }`}>
                  {m.role === 'ai' && <span className="text-xs font-bold text-indigo-400 block mb-1.5 uppercase tracking-widest">PlaceAI</span>}
                  <span className="whitespace-pre-wrap"><RenderText text={m.text} /></span>
                </div>
                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs flex-shrink-0 font-bold text-white">You</div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-2.5 justify-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0">🤖</div>
                <div className="bg-white/10 border border-white/10 px-5 py-4 rounded-2xl rounded-bl-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/10 px-4 py-4 flex gap-3 bg-white/5">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              placeholder="Ask about any company, DSA, HR questions... (Shift+Enter for new line)"
              disabled={loading}
              rows={1}
              className="flex-1 bg-white/10 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 disabled:opacity-50 resize-none"
              style={{ minHeight: '48px', maxHeight: '120px', overflowY: 'auto' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-40 transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
            >
              <span>Send</span><span>↑</span>
            </button>
          </div>
        </div>
        <p className="text-center text-white/20 text-xs mt-4">Powered by Groq AI · PlaceAI Hackfest 2026</p>
      </div>

      <style>{`@keyframes fadeSlideUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  )
}