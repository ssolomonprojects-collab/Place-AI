import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Groq from 'groq-sdk'

export default function MockInterview() {
  const { company } = useParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState(null)
  const bottomRef = useRef(null)

  const systemPrompt = `You are a strict but fair technical interviewer at ${company}. 
Your job is to conduct a realistic placement interview.
Rules:
1. Start by asking ONE technical question relevant to ${company}'s interview pattern.
2. After the candidate answers, give a score out of 10 and brief feedback.
3. Then ask the next question.
4. Ask 5 questions total (mix of technical, DSA, and HR).
5. After 5 questions, give a final overall score and improvement tips.
6. Keep responses concise and professional.
Start the interview now with your first question.`

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getGroq = () => new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true
  })

  const startInterview = async () => {
    setStarted(true)
    setLoading(true)
    try {
      const groq = getGroq()
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Start the interview.' }
        ],
        model: 'llama-3.3-70b-versatile',
        max_tokens: 500,
      })
      const text = completion.choices[0]?.message?.content || 'Error starting interview.'
      setMessages([{ role: 'ai', text }])
    } catch (e) {
      console.error(e)
      setMessages([{ role: 'ai', text: 'Error starting interview. Check your API key.' }])
    }
    setLoading(false)
  }

  const sendAnswer = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    const newMessages = [...messages, { role: 'user', text: userMsg }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const groq = getGroq()
      const chatHistory = newMessages.map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text
      }))
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...chatHistory
        ],
        model: 'llama-3.3-70b-versatile',
        max_tokens: 500,
      })
      const text = completion.choices[0]?.message?.content || 'Error getting response.'
      setMessages(prev => [...prev, { role: 'ai', text }])
      const scoreMatch = text.match(/(\d+)\/10/)
      if (scoreMatch) setScore(scoreMatch[1])
    } catch (e) {
      console.error(e)
      setMessages(prev => [...prev, { role: 'ai', text: 'Error getting response. Try again.' }])
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 px-4 py-8 relative overflow-hidden">

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-600 opacity-10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-purple-600 opacity-10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-violet-500 opacity-5 blur-3xl" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">

        <div className="flex items-center gap-4 mb-6">
          <Link
            to={`/dashboard/${company}`}
            className="flex items-center gap-1 text-indigo-300 hover:text-white text-sm font-medium transition-colors duration-200 group"
          >
            <span className="inline-block group-hover:-translate-x-1 transition-transform duration-200">←</span>
            <span>Back</span>
          </Link>

          <div className="flex-1 flex items-center gap-3">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent tracking-tight">
              Mock Interview
            </h1>
            <span className="text-white/30 text-xl font-thin">|</span>
            <span className="text-white/80 font-semibold text-lg tracking-wide">{company}</span>
          </div>

          {score && (
            <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-emerald-900/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {score}/10
            </div>
          )}
        </div>

        {!started ? (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: 'linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px'
              }}
            />

            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="absolute w-32 h-32 rounded-full bg-indigo-500/20 animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute w-24 h-24 rounded-full bg-purple-500/30 animate-pulse" />
              <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-900/50 text-4xl rotate-3 hover:rotate-0 transition-transform duration-300">
                🤖
              </div>
            </div>

            <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">
              Ready for your{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {company}
              </span>{' '}
              Interview?
            </h2>

            <p className="text-white/50 mb-3 text-base max-w-md mx-auto leading-relaxed">
              The AI will ask you <span className="text-indigo-300 font-semibold">5 real interview questions</span>, score your answers, and give actionable feedback.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10 mt-6">
              {['5 Questions', 'Scored /10', 'Live Feedback', 'DSA + HR Mix'].map((tag, i) => (
                <span key={i} className="bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={startInterview}
              className="relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-12 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-900/50 hover:shadow-indigo-700/50 transition-all duration-300 hover:scale-105 active:scale-95 group"
            >
              <span>Start Interview</span>
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              <span className="absolute inset-0 rounded-2xl overflow-hidden">
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </span>
            </button>
          </div>

        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden" style={{ height: '72vh' }}>

            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg shadow-md">
                🤖
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">{company} AI Interviewer</p>
                <span className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400'}`} />
                  <span className={`text-xs font-medium ${loading ? 'text-yellow-400' : 'text-emerald-400'}`}>
                    {loading ? 'Typing...' : 'Online'}
                  </span>
                </span>
              </div>
              {score && (
                <div className="ml-auto bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                  Last: {score}/10
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-end gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  style={{ animation: 'fadeSlideUp 0.3s ease forwards', animationDelay: `${i * 0.05}s`, opacity: 0 }}
                >
                  {m.role === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0 shadow-md">
                      🤖
                    </div>
                  )}
                  <div className={`max-w-lg px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-lg ${
                    m.role === 'user'
                      ? 'bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-br-sm shadow-indigo-900/40'
                      : 'bg-white/10 border border-white/10 text-white/90 rounded-bl-sm'
                  }`}>
                    {m.role === 'ai' && (
                      <span className="text-xs font-bold text-indigo-400 block mb-1.5 uppercase tracking-widest">
                        Interviewer
                      </span>
                    )}
                    <span className="whitespace-pre-wrap">{m.text}</span>
                  </div>
                  {m.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm flex-shrink-0 shadow-md font-bold text-white">
                      U
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-end gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm flex-shrink-0 shadow-md">
                    🤖
                  </div>
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
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendAnswer()}
                placeholder="Type your answer here..."
                disabled={loading}
                className="flex-1 bg-white/10 border border-white/10 text-white placeholder-white/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-200 disabled:opacity-50"
              />
              <button
                onClick={sendAnswer}
                disabled={loading || !input.trim()}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-bold text-sm disabled:opacity-40 transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100 shadow-lg shadow-indigo-900/40 flex items-center gap-2"
              >
                <span>Send</span>
                <span className="text-base">↑</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}