import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const NAV_ITEMS = [
  { icon: "🏠", label: "Dashboard", id: "dashboard", path: null },
  { icon: "🏢", label: "Companies", id: "companies", path: "/companies" },
  { icon: "🤖", label: "AI Assistant", id: "chat", path: "/chat" },
  { icon: "📝", label: "Questions", id: "questions", path: null },
  { icon: "📊", label: "Progress", id: "progress", path: null },
  { icon: "📅", label: "Roadmap", id: "roadmap", path: null },
  { icon: "📋", label: "Applications", id: "applications", path: null },
  { icon: "🎯", label: "Mock Interview", id: "mock", path: null },
  { icon: "⚙️", label: "Settings", id: "settings", path: null },
  { icon: "🔐", label: "Admin Panel", id: "admin", path: null },
];

const STATS = [
  { label: "Companies Applied", value: "12", change: "+3 this week", up: true, icon: "🏢" },
  { label: "Interviews Scheduled", value: "4", change: "+1 this week", up: true, icon: "📅" },
  { label: "Offers Received", value: "1", change: "In progress", up: null, icon: "🎉" },
  { label: "Profile Strength", value: "78%", change: "+5% today", up: true, icon: "💪" },
];

const COMPANIES = [
  { name: "TechNova", role: "ML Engineer", status: "Interview", statusColor: "bg-blue-100 text-blue-700", emoji: "🤖", date: "Apr 15" },
  { name: "FinVault", role: "Backend Dev", status: "Applied", statusColor: "bg-amber-100 text-amber-700", emoji: "🏦", date: "Apr 12" },
  { name: "EduSpark", role: "Frontend Dev", status: "Shortlisted", statusColor: "bg-indigo-100 text-indigo-700", emoji: "📚", date: "Apr 10" },
  { name: "CipherShield", role: "Security Analyst", status: "Pending", statusColor: "bg-gray-100 text-gray-600", emoji: "🔐", date: "Apr 8" },
];

const TIPS = [
  { title: "Update your resume", desc: "Add your latest project to boost profile strength.", icon: "📝" },
  { title: "Mock interview due", desc: "TechNova interview is on Apr 15 — practice today!", icon: "🎯" },
  { title: "New company added", desc: "StyleLoop is now accepting applications.", icon: "✨" },
];

const ROADMAP = [
  { title: "Aptitude & Reasoning", weeks: "Week 1–2", done: true, topics: ["Quantitative Aptitude", "Logical Reasoning", "Verbal Ability", "Data Interpretation"], color: "bg-indigo-500" },
  { title: "Coding & DSA", weeks: "Week 2–3", done: true, topics: ["Arrays & Strings", "Linked Lists", "Trees & Graphs", "Dynamic Programming"], color: "bg-violet-500" },
  { title: "Technical Interview", weeks: "Week 3–4", done: false, topics: ["OOP Concepts", "DBMS & SQL", "OS Concepts", "CN Basics"], color: "bg-sky-500" },
  { title: "HR Round", weeks: "Week 4", done: false, topics: ["Tell me about yourself", "Strengths & Weaknesses", "Why this company?", "Situation-based Qs"], color: "bg-blue-500" },
];

const PROGRESS_DATA = [
  { label: "DSA", percent: 65, color: "bg-indigo-500" },
  { label: "Aptitude", percent: 80, color: "bg-violet-500" },
  { label: "Technical", percent: 50, color: "bg-sky-500" },
  { label: "HR Prep", percent: 40, color: "bg-blue-500" },
  { label: "Mock Interviews", percent: 30, color: "bg-purple-500" },
];

const NOTIFICATIONS = [
  { id: 1, title: "New company added", desc: "Zoho is now accepting applications.", time: "2 min ago", read: false, icon: "🏢" },
  { id: 2, title: "Mock interview reminder", desc: "TechNova interview practice due today.", time: "1 hr ago", read: false, icon: "🎯" },
  { id: 3, title: "Profile updated", desc: "Your profile strength increased to 78%.", time: "3 hrs ago", read: true, icon: "✅" },
];

function NotificationPanel({ onClose }) {
  const [notes, setNotes] = useState(NOTIFICATIONS);
  const markAllRead = () => setNotes(n => n.map(x => ({ ...x, read: true })));
  return (
    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="font-semibold text-gray-800 text-sm">Notifications</span>
        <button onClick={markAllRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Mark all read</button>
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
        {notes.map(n => (
          <div key={n.id} onClick={() => setNotes(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
            className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? "bg-indigo-50/50" : ""}`}>
            <span className="text-xl flex-shrink-0 mt-0.5">{n.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-800 truncate">{n.title}</p>
                {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
              <p className="text-xs text-gray-400 mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 border-t border-gray-100 text-center">
        <button onClick={onClose} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Close</button>
      </div>
    </div>
  );
}

function ProfileDropdown({ name, email, initials, onSettings, onLogout, onClose }) {
  return (
    <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">{initials}</div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{name}</p>
            <p className="text-xs text-gray-400 truncate">{email}</p>
          </div>
        </div>
      </div>
      <div className="py-1">
        <button onClick={() => { onSettings(); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg> Account Settings
        </button>
        <button onClick={() => { onSettings(); onClose(); }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg> View Profile
        </button>
      </div>
      <div className="border-t border-gray-100 py-1">
        <button onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg> Sign Out
        </button>
      </div>
    </div>
  );
}

function ProgressTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 text-base mb-1">Overall Readiness</h2>
        <p className="text-xs text-gray-400 mb-5">Based on your mock interviews and prep activity</p>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-24 h-24 rounded-full border-8 border-indigo-600 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-extrabold text-indigo-600">78%</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">Good Progress!</p>
            <p className="text-xs text-gray-400 mt-1">Complete 2 more mock interviews to reach 90%</p>
            <span className="inline-block mt-2 bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full font-medium">Goal: 90% by Apr 30</span>
          </div>
        </div>
        <div className="space-y-4">
          {PROGRESS_DATA.map((p, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{p.label}</span>
                <span className="text-gray-400">{p.percent}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className={`${p.color} h-2.5 rounded-full transition-all duration-1000`} style={{ width: `${p.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Mock Interviews Done", value: "3", icon: "🎯" },
          { label: "Questions Practiced", value: "142", icon: "📝" },
          { label: "Days Streak", value: "7", icon: "🔥" },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapTab({ navigate }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="font-bold text-gray-900 text-base mb-1">Your 4-Week Placement Roadmap</h2>
      <p className="text-xs text-gray-400 mb-6">Follow this plan to be fully prepared</p>
      <div className="space-y-4">
        {ROADMAP.map((r, i) => (
          <div key={i} className={`rounded-2xl border p-4 ${r.done ? "border-indigo-200 bg-indigo-50/50" : "border-gray-100"}`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full ${r.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{i + 1}</div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800 text-sm">{r.title}</p>
                <p className="text-xs text-gray-400">{r.weeks}</p>
              </div>
              {r.done
                ? <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">✓ Done</span>
                : <span className="bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full font-medium">Pending</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {r.topics.map((t, j) => (
                <span key={j} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => navigate('/companies')}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all">
        Start Preparing → Pick a Company
      </button>
    </div>
  );
}

function SettingsTab({ user, name, setActiveNav }) {
  const [form, setForm] = useState({
    name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student",
    email: user?.email || "",
    college: user?.user_metadata?.college || "",
    notifications: true,
  });
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await supabase.auth.updateUser({ data: { full_name: form.name, college: form.college } });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 text-base mb-5">Profile Settings</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
            {form.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{form.name}</p>
            <p className="text-sm text-gray-400">{form.email}</p>
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full mt-1 inline-block">Free Plan</span>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: "Full Name", key: "name", type: "text" },
            { label: "Email", key: "email", type: "email" },
            { label: "College", key: "college", type: "text" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type={f.type} value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 bg-gray-50" />
            </div>
          ))}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700">Email Notifications</p>
              <p className="text-xs text-gray-400">Get updates about new companies and tips</p>
            </div>
            <button onClick={() => setForm(p => ({ ...p, notifications: !p.notifications }))}
              className={`w-12 h-6 rounded-full transition-all relative ${form.notifications ? "bg-indigo-600" : "bg-gray-200"}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.notifications ? "left-7" : "left-1"}`} />
            </button>
          </div>
          <button onClick={save}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all">
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 text-base mb-4">Plan</h2>
        <div className="bg-indigo-600 rounded-xl p-4 text-white mb-3">
          <p className="text-xs text-indigo-200 mb-1">Current Plan</p>
          <p className="text-xl font-bold">Free</p>
          <p className="text-xs text-indigo-200 mt-1">10 companies · AI Chat · Mock Interview</p>
        </div>
        <div className="border-2 border-indigo-200 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-gray-800">Premium</p>
            <span className="text-indigo-600 font-bold">₹299/month</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">50+ companies · Resume review · Priority support</p>
          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onSuccess }) {
  const [adminId, setAdminId] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN_ID = "placeai_admin";
  const ADMIN_PASS = "PlaceAI@2026";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    if (adminId === ADMIN_ID && adminPass === ADMIN_PASS) {
      onSuccess();
    } else {
      setError("Invalid Admin ID or Password");
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🔐</div>
          <h2 className="text-xl font-bold text-gray-900">Admin Access</h2>
          <p className="text-gray-400 text-sm mt-1">Enter your admin credentials to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin ID</label>
            <input type="text" placeholder="Enter admin ID"
              value={adminId} onChange={e => setAdminId(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" placeholder="Enter admin password"
              value={adminPass} onChange={e => setAdminPass(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 bg-gray-50" />
          </div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-all disabled:opacity-50">
            {loading ? "Verifying..." : "Access Admin Panel →"}
          </button>
        </form>
        <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-amber-700 text-xs text-center">⚠️ Restricted access — Admin only</p>
        </div>
      </div>
    </div>
  );
}
export default function Dashboard({ user }) {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showSidebarProfile, setShowSidebarProfile] = useState(false);

  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student";
  const email = user?.email || "";
  const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleNavClick = (item) => {
    setActiveNav(item.id);
    setSidebarOpen(false);
    setShowSidebarProfile(false);
    if (item.path) navigate(item.path);
  };

  const renderContent = () => {
    if (activeNav === "progress") return <ProgressTab />;
    if (activeNav === "roadmap") return <RoadmapTab navigate={navigate} />;
    if (activeNav === "settings") return <SettingsTab user={user} name={name} setActiveNav={setActiveNav} />;
    if (activeNav === "questions") return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Questions Bank</h3>
          <p className="text-gray-500 text-sm mb-4">500+ real interview questions sorted by company and topic</p>
          <button onClick={() => navigate('/companies')}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all">
            Practice by Company →
          </button>
        </div>
      </div>
    );
    if (activeNav === "applications") return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm">My Applications</h2>
          <span className="text-xs text-gray-400">4 total</span>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase">Company</th>
              <th className="text-left px-3 py-3 text-xs font-medium text-gray-400 uppercase">Role</th>
              <th className="text-left px-3 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
              <th className="text-left px-3 py-3 text-xs font-medium text-gray-400 uppercase">Date</th>
            </tr>
          </thead>
          <tbody>
            {COMPANIES.map((c, i) => (
              <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                <td className="px-5 py-3.5"><div className="flex items-center gap-3"><span>{c.emoji}</span><span className="font-medium text-gray-800">{c.name}</span></div></td>
                <td className="px-3 py-3.5 text-gray-500">{c.role}</td>
                <td className="px-3 py-3.5"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.statusColor}`}>{c.status}</span></td>
                <td className="px-3 py-3.5 text-gray-400 text-xs">{c.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    if (activeNav === "admin") return <AdminLogin onSuccess={() => navigate("/admin")} />;
    if (activeNav === "mock") return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Mock Interview</h3>
          <p className="text-gray-500 text-sm mb-4">Practice AI-powered mock interviews for your target company</p>
          <button onClick={() => navigate('/companies')}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all">
            Pick a Company →
          </button>
        </div>
      </div>
    );

    // Dashboard home
    return (
      <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{s.icon}</span>
                {s.up !== null && (
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.up ? "bg-indigo-100 text-indigo-700" : "bg-red-100 text-red-600"}`}>
                    {s.up ? "↑" : "↓"}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400 mt-1">{s.change}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900 text-sm">Recent Applications</h2>
              <button onClick={() => setActiveNav("applications")} className="text-xs text-indigo-600 font-medium hover:underline">View all</button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-gray-400 uppercase">Company</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-gray-400 uppercase hidden sm:table-cell">Role</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-gray-400 uppercase">Status</th>
                  <th className="text-left px-3 py-3 text-xs font-medium text-gray-400 uppercase hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {COMPANIES.map((c, i) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5"><div className="flex items-center gap-3"><span>{c.emoji}</span><span className="font-medium text-gray-800">{c.name}</span></div></td>
                    <td className="px-3 py-3.5 text-gray-500 hidden sm:table-cell">{c.role}</td>
                    <td className="px-3 py-3.5"><span className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.statusColor}`}>{c.status}</span></td>
                    <td className="px-3 py-3.5 text-gray-400 text-xs hidden md:table-cell">{c.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-semibold text-gray-900 text-sm">AI Tips for You</h2>
              <p className="text-xs text-gray-400 mt-0.5">Personalised guidance</p>
            </div>
            <div className="p-4 space-y-3">
              {TIPS.map((tip, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                  <span className="text-xl flex-shrink-0">{tip.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{tip.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 pb-5">
              <div className="bg-indigo-600 rounded-xl p-4 text-white">
                <p className="text-xs text-indigo-200 mb-1">Overall Readiness</p>
                <div className="flex items-end justify-between mb-2">
                  <p className="text-2xl font-bold">78%</p>
                  <p className="text-xs text-indigo-200">Goal: 90%</p>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-indigo-300 h-2 rounded-full" style={{ width: "78%" }} />
                </div>
                <p className="text-xs text-indigo-200 mt-2">Complete 2 more mock interviews to level up!</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button onClick={() => navigate('/companies')} className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-indigo-300 hover:shadow-md transition-all">
            <span className="text-2xl block mb-2">🏢</span>
            <p className="font-semibold text-gray-800 text-sm">Browse Companies</p>
            <p className="text-xs text-gray-400 mt-0.5">50+ top companies</p>
          </button>
          <button onClick={() => navigate('/chat')} className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-indigo-300 hover:shadow-md transition-all">
            <span className="text-2xl block mb-2">🤖</span>
            <p className="font-semibold text-gray-800 text-sm">AI Coach</p>
            <p className="text-xs text-gray-400 mt-0.5">Get personalized tips</p>
          </button>
          <button onClick={() => navigate('/interview/TCS')} className="bg-white border border-gray-100 rounded-2xl p-4 text-left hover:border-indigo-300 hover:shadow-md transition-all">
            <span className="text-2xl block mb-2">🎯</span>
            <p className="font-semibold text-gray-800 text-sm">Mock Interview</p>
            <p className="text-xs text-gray-400 mt-0.5">Practice with AI</p>
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* SIDEBAR — fixed, full height, no scroll */}
      <aside className={`fixed top-0 left-0 h-screen z-30 w-64 bg-indigo-700 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>

        {/* Logo — click to go home */}
        <div className="px-6 py-5 border-b border-white/10 cursor-pointer hover:bg-white/10 transition-colors flex-shrink-0"
          onClick={() => navigate('/')}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-lg">🎓</div>
            <div>
              <p className="font-bold text-base leading-tight">PlaceAI</p>
              <p className="text-xs text-indigo-200">← Back to Home</p>
            </div>
          </div>
        </div>

        {/* Nav items — scrollable if needed */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => handleNavClick(item)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all min-h-[44px] ${
                activeNav === item.id ? "bg-white/20 text-white shadow-sm" : "text-indigo-100 hover:bg-white/10"
              }`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Profile block — always at bottom */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-white/10 relative">
          <button onClick={() => setShowSidebarProfile(!showSidebarProfile)}
            className="w-full flex items-center gap-3 rounded-xl hover:bg-white/10 transition-colors p-2">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-semibold text-sm flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-medium truncate">{name}</p>
              <p className="text-xs text-indigo-200 truncate">Free Plan</p>
            </div>
            <svg className="w-4 h-4 text-indigo-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Sidebar profile dropdown */}
          {showSidebarProfile && (
            <div className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800 text-sm">{name}</p>
                <p className="text-xs text-gray-400">{email}</p>
              </div>
              <button onClick={() => { setActiveNav("settings"); setShowSidebarProfile(false); setSidebarOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg> Account Settings
              </button>
              <div className="border-t border-gray-100">
                <button onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT — offset by sidebar width */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">

        {/* HEADER — sticky */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center gap-4 sticky top-0 z-10 flex-shrink-0">
          <button className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}>
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-semibold text-gray-900">{greeting}, {name} 👋</h1>
            <p className="text-xs text-gray-400">Smart Placement Preparation &amp; Guidance System</p>
          </div>
          <div className="flex items-center gap-2">

            {/* Notification bell */}
            <div className="relative">
              <button onClick={() => { setShowNotifications(!showNotifications); setShowProfileDropdown(false); }}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-9.33-5.004L8 6v8.158c0 .538-.214 1.055-.595 1.437L6 17h5m4 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationPanel onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* Profile avatar */}
            <div className="relative">
              <button onClick={() => { setShowProfileDropdown(!showProfileDropdown); setShowNotifications(false); }}
                className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold hover:bg-indigo-700 transition-colors cursor-pointer">
                {initials}
              </button>
              {showProfileDropdown && (
                <ProfileDropdown
                  name={name}
                  email={email}
                  initials={initials}
                  onSettings={() => setActiveNav("settings")}
                  onLogout={handleLogout}
                  onClose={() => setShowProfileDropdown(false)}
                />
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT — scrollable */}
        <main className="flex-1 px-4 sm:px-6 py-6 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}