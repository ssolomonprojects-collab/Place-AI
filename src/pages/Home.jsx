import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function useCounter(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

function StatCard({ value, suffix = "", label, delay = 0, inView }) {
  const count = useCounter(value, 2000, inView);
  return (
    <div className="flex flex-col items-center"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      <span className="text-4xl font-bold text-white tabular-nums">{count.toLocaleString()}{suffix}</span>
      <span className="text-sm text-indigo-200 mt-1 tracking-wide uppercase">{label}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay = 0, inView }) {
  return (
    <div className="group relative bg-white rounded-2xl p-6 border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50 transition-all duration-300 cursor-default"
      style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms` }}>
      <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 group-hover:scale-110 transition-all duration-300">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-slate-800 font-semibold text-lg mb-2 group-hover:text-indigo-700 transition-colors duration-200">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-50/0 to-indigo-50/0 group-hover:from-indigo-50/30 group-hover:to-purple-50/30 transition-all duration-300 pointer-events-none" />
    </div>
  );
}

function Particle({ style }) {
  return <div className="absolute rounded-full bg-indigo-300 opacity-20 animate-ping" style={style} />;
}

// ── Hardcoded reliable logo URLs for each company ──────────────────────────────
const COMPANY_LOGOS = {
  "Google":    "https://www.google.com/s2/favicons?domain=google.com&sz=128",
  "Microsoft": "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128",
  "Amazon":    "https://www.google.com/s2/favicons?domain=amazon.com&sz=128",
  "Meta":      "https://www.google.com/s2/favicons?domain=meta.com&sz=128",
  "Apple":     "https://www.google.com/s2/favicons?domain=apple.com&sz=128",
  "TCS":       "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/200px-Tata_Consultancy_Services_Logo.svg.png",
  "Infosys":   "https://www.google.com/s2/favicons?domain=infosys.com&sz=128",
  "Wipro":     "https://www.google.com/s2/favicons?domain=wipro.com&sz=128",
  "Zoho":      "https://www.google.com/s2/favicons?domain=zoho.com&sz=128",
  "Accenture": "https://www.google.com/s2/favicons?domain=accenture.com&sz=128",
  "Flipkart":  "https://www.google.com/s2/favicons?domain=flipkart.com&sz=128",
  "Cognizant": "https://www.google.com/s2/favicons?domain=cognizant.com&sz=128",
  "HCL":       "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/HCL_Technologies_logo.svg/200px-HCL_Technologies_logo.svg.png",
};

const GRAD_COLORS = [
  "from-indigo-500 to-purple-600",
  "from-pink-500 to-rose-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
  "from-violet-500 to-purple-500",
];

function HomeLogo({ c, i, companiesInView }) {
  const logoUrl = COMPANY_LOGOS[c.name];
  const [failed, setFailed] = useState(!logoUrl);
  const gradColor = GRAD_COLORS[i % GRAD_COLORS.length];

  return (
    <div
      style={{
        opacity: companiesInView ? 1 : 0,
        transform: companiesInView ? "scale(1)" : "scale(0.85)",
        transition: `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms`,
      }}
      className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
    >
      {!failed ? (
        <img
          src={logoUrl}
          alt={c.name}
          className="w-5 h-5 object-contain flex-shrink-0"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={`w-5 h-5 rounded bg-gradient-to-br ${gradColor} flex items-center justify-center flex-shrink-0`}>
          <span className="text-white font-bold" style={{ fontSize: 7 }}>
            {c.name.slice(0, 2).toUpperCase()}
          </span>
        </div>
      )}
      <span className="text-sm font-medium text-slate-700">{c.name}</span>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const onGetStarted = () => navigate(user ? "/dashboard" : "/login");

  const [heroRef, heroInView] = useInView(0.2);
  const [statsRef, statsInView] = useInView(0.3);
  const [featuresRef, featuresInView] = useInView(0.1);
  const [stepsRef, stepsInView] = useInView(0.2);
  const [companiesRef, companiesInView] = useInView(0.2);
  const [testimonialRef, testimonialInView] = useInView(0.3);
  const [ctaRef, ctaInView] = useInView(0.3);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 20, y: (e.clientY / window.innerHeight - 0.5) * 20 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: "🤖", title: "AI-Powered Interview Prep", description: "Groq AI generates realistic interview questions tailored to your target company's culture and tech stack." },
    { icon: "🗺️", title: "Smart Roadmaps", description: "Get a personalized day-by-day preparation plan based on your timeline and skill gaps." },
    { icon: "💡", title: "DSA Topic Mastery", description: "Curated problem sets with difficulty ratings, patterns, and solutions for every key algorithm topic." },
    { icon: "📊", title: "Progress Analytics", description: "Visual dashboards track your readiness score and identify weak areas to focus on next." },
    { icon: "🏢", title: "Company Intelligence", description: "Deep-dive into company-specific hiring patterns, tech stacks, and culture notes from real candidates." },
    { icon: "⚡", title: "Mock Tests", description: "Timed coding challenges that simulate real OA environments with instant AI feedback." },
  ];

  const companies = [
    { name: "Google",    domain: "google.com"    },
    { name: "Microsoft", domain: "microsoft.com" },
    { name: "Amazon",    domain: "amazon.com"    },
    { name: "Meta",      domain: "meta.com"      },
    { name: "Apple",     domain: "apple.com"     },
    { name: "TCS",       domain: "tcs.com"       },
    { name: "Infosys",   domain: "infosys.com"   },
    { name: "Wipro",     domain: "wipro.com"     },
    { name: "Zoho",      domain: "zoho.com"      },
    { name: "Accenture", domain: "accenture.com" },
    { name: "Flipkart",  domain: "flipkart.com"  },
    { name: "Cognizant", domain: "cognizant.com" },
    { name: "HCL",       domain: "hcltech.com"   },
  ];

  const testimonials = [
    { quote: "PlaceAI's roadmap got me into Google in 3 months. The interview questions were scarily accurate — almost exactly what they asked me!", name: "Arjun Kumar", role: "Software Engineer @ Google India", initials: "AK", color: "from-indigo-400 to-purple-500" },
    { quote: "The AI mock interview feature is incredible. It gave me real-time feedback and boosted my confidence before my TCS interview.", name: "Priya Sharma", role: "System Engineer @ TCS", initials: "PS", color: "from-pink-400 to-rose-500" },
    { quote: "I used PlaceAI for 6 weeks before my Zoho interview. The DSA roadmap was perfectly structured. Got placed in my first attempt!", name: "Rahul Menon", role: "Software Developer @ Zoho", initials: "RM", color: "from-green-400 to-teal-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans">

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="font-bold text-slate-800 text-lg tracking-tight">Place<span className="text-indigo-600">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors cursor-pointer">Features</a>
            <span onClick={() => navigate("/companies")} className="hover:text-indigo-600 transition-colors cursor-pointer">Companies</span>
            <span onClick={() => navigate("/chat")} className="hover:text-indigo-600 transition-colors cursor-pointer">AI Chat</span>
            <span onClick={() => navigate("/dashboard")} className="hover:text-indigo-600 transition-colors cursor-pointer">Dashboard</span>
          </div>
          <button onClick={onGetStarted}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 active:scale-95 transition-all duration-150 shadow-md shadow-indigo-200">
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full opacity-10 blur-3xl"
            style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)`, transition: "transform 0.3s ease" }} />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-400 rounded-full opacity-10 blur-3xl"
            style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)`, transition: "transform 0.3s ease" }} />
          <div className="absolute inset-0"
            style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
        </div>
        <Particle style={{ top: "20%", left: "10%", width: 8, height: 8, animationDuration: "3s" }} />
        <Particle style={{ top: "60%", left: "80%", width: 6, height: 6, animationDuration: "4s", animationDelay: "1s" }} />
        <Particle style={{ top: "40%", left: "90%", width: 10, height: 10, animationDuration: "5s", animationDelay: "0.5s" }} />
        <Particle style={{ top: "80%", left: "20%", width: 7, height: 7, animationDuration: "3.5s", animationDelay: "1.5s" }} />
        <Particle style={{ top: "30%", left: "50%", width: 5, height: 5, animationDuration: "2.5s", animationDelay: "0.8s" }} />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-20">
          <div className="inline-flex items-center gap-2 bg-indigo-700/50 border border-indigo-500/40 text-indigo-200 text-sm px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
            style={{ opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(-10px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Powered by Groq AI · Built for Placement Season 2026
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight"
            style={{ opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.8s ease 0.1s, transform 0.8s ease 0.1s" }}>
            Crack Your{" "}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Dream Job</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M2 6 Q50 2 100 5 Q150 8 198 4" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7" />
              </svg>
            </span>{" "}with AI
          </h1>
          <p className="text-indigo-200 text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed"
            style={{ opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.8s ease 0.25s, transform 0.8s ease 0.25s" }}>
            Personalized placement preparation for top companies — interview questions, roadmaps, and DSA tracks, all generated by AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center"
            style={{ opacity: heroInView ? 1 : 0, transform: heroInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s" }}>
            <button onClick={onGetStarted}
              className="group relative bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl text-lg overflow-hidden hover:shadow-2xl hover:shadow-white/20 active:scale-95 transition-all duration-200">
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Start Preparing
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>
            <button onClick={() => navigate("/chat")}
              className="flex items-center gap-2 justify-center text-white border border-white/30 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-white/10 active:scale-95 transition-all duration-200 backdrop-blur-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Try AI Chat
            </button>
          </div>
          <div className="mt-16 flex flex-col items-center gap-2 text-indigo-300 text-sm"
            style={{ opacity: heroInView ? 1 : 0, transition: "opacity 1s ease 0.8s" }}>
            <span>Scroll to explore</span>
            <div className="w-5 h-8 border border-indigo-400/40 rounded-full flex items-start justify-center p-1">
              <div className="w-1 h-2 bg-indigo-300 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value={500}   suffix="+" label="Companies"       delay={0}   inView={statsInView} />
          <StatCard value={10000} suffix="+" label="Questions"       delay={100} inView={statsInView} />
          <StatCard value={5000}  suffix="+" label="Students Helped" delay={200} inView={statsInView} />
          <StatCard value={95}    suffix="%" label="Success Rate"    delay={300} inView={statsInView} />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" ref={featuresRef} className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16"
            style={{ opacity: featuresInView ? 1 : 0, transform: featuresInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <span className="inline-block bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">Everything you need</span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">Built for placement warriors</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto">Every tool you need to go from zero to offer, powered by cutting-edge AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 80} inView={featuresInView} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section ref={stepsRef} className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16"
            style={{ opacity: stepsInView ? 1 : 0, transform: stepsInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
            <span className="inline-block bg-amber-100 text-amber-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">Simple process</span>
            <h2 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">Get offer-ready in 3 steps</h2>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-0.5 bg-gradient-to-r from-indigo-200 via-indigo-400 to-indigo-200" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Pick a Company", desc: "Choose from 500+ companies — startups to FAANG. We tailor everything to them.", icon: "🏢" },
                { step: "02", title: "Get Your Roadmap", desc: "AI generates a personalised prep plan with DSA tracks, system design, and HR rounds.", icon: "🗺️" },
                { step: "03", title: "Practice & Ace It", desc: "Do mock tests, study questions, and track your readiness score until you're ready.", icon: "🏆" },
              ].map(({ step, title, desc, icon }, i) => (
                <div key={step} className="relative flex flex-col items-center text-center group"
                  style={{ opacity: stepsInView ? 1 : 0, transform: stepsInView ? "translateY(0)" : "translateY(30px)", transition: `opacity 0.6s ease ${i * 150}ms, transform 0.6s ease ${i * 150}ms` }}>
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <span className="text-3xl">{icon}</span>
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-amber-400 text-amber-900 text-xs font-bold rounded-full flex items-center justify-center">{step}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPANIES */}
      <section id="companies" ref={companiesRef} className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-3"
            style={{ opacity: companiesInView ? 1 : 0, transition: "opacity 0.6s ease" }}>
            Prep for your dream company
          </h2>
          <p className="text-slate-500 mb-10"
            style={{ opacity: companiesInView ? 1 : 0, transition: "opacity 0.6s ease 0.1s" }}>
            Company-specific content for top organizations across India and the world.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {companies.map((c, i) => (
              <HomeLogo key={c.name} c={c} i={i} companiesInView={companiesInView} />
            ))}
            <div
              className="flex items-center gap-2 bg-indigo-600 text-white border border-indigo-500 rounded-2xl px-5 py-3 text-sm font-semibold cursor-pointer hover:bg-indigo-700 transition-colors"
              onClick={onGetStarted}
              style={{ opacity: companiesInView ? 1 : 0, transition: `opacity 0.5s ease ${companies.length * 60}ms` }}
            >
              +490 more →
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section ref={testimonialRef} className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12"
            style={{ opacity: testimonialInView ? 1 : 0, transition: "opacity 0.6s ease" }}>
            <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 tracking-wide uppercase">Success stories</span>
            <h2 className="text-3xl font-bold text-slate-800">Students who got placed</h2>
          </div>
          <div className="relative"
            style={{ opacity: testimonialInView ? 1 : 0, transform: testimonialInView ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s" }}>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-10 border border-indigo-100 text-center relative overflow-hidden min-h-64">
              <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-100 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-100 rounded-full translate-x-1/3 translate-y-1/3 opacity-50" />
              <div className="relative z-10">
                <div className="flex justify-center gap-1 mb-6">
                  {Array(5).fill(0).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-xl text-slate-700 leading-relaxed mb-6 font-medium italic transition-all duration-500">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonials[activeTestimonial].color} flex items-center justify-center text-white font-bold text-sm`}>
                    {testimonials[activeTestimonial].initials}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-800 text-sm">{testimonials[activeTestimonial].name}</p>
                    <p className="text-slate-500 text-xs">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActiveTestimonial(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === activeTestimonial ? "bg-indigo-600 w-6" : "bg-slate-300"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section ref={ctaRef} className="relative py-24 px-6 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0"
          style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-2xl mx-auto text-center"
          style={{ opacity: ctaInView ? 1 : 0, transform: ctaInView ? "translateY(0)" : "translateY(30px)", transition: "opacity 0.8s ease, transform 0.8s ease" }}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Your offer letter is waiting.</h2>
          <p className="text-indigo-200 text-xl mb-10">Join thousands of students who landed their dream jobs with PlaceAI.</p>
          <button onClick={onGetStarted}
            className="group bg-white text-indigo-700 font-bold px-10 py-5 rounded-2xl text-xl hover:shadow-2xl hover:shadow-white/20 active:scale-95 transition-all duration-200 flex items-center gap-3 mx-auto">
            Start for free
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <p className="text-indigo-400 text-sm mt-4">No signup needed · Works instantly · Free for students</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="font-bold text-white text-base">Place<span className="text-indigo-400">AI</span></span>
          </div>
          <p className="text-sm">Built with ❤️ for Hackfest 2026 · Powered by Groq AI</p>
          <p className="text-sm">© 2026 PlaceAI Team</p>
        </div>
      </footer>
    </div>
  );
}