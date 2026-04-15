import { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabase";

// ─── Notification Bell Dropdown ───────────────────────────────────────────────
function NotificationDropdown({ notifications, onMarkRead }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
          style={{ background: "#0d0d2b" }}
        >
          <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-white text-sm font-medium">Notifications</span>
            <button
              onClick={() => onMarkRead("all")}
              className="text-indigo-400 text-xs hover:text-indigo-300"
            >
              Mark all read
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-8">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => onMarkRead(n.id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors ${
                    !n.read ? "bg-indigo-900/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? "bg-indigo-400" : "bg-transparent"}`} />
                    <div>
                      <p className="text-white/80 text-sm">{n.message}</p>
                      <p className="text-white/30 text-xs mt-1">{n.time}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Avatar Dropdown ──────────────────────────────────────────────────────────
function AvatarDropdown({ user, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = user?.user_metadata?.full_name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        {initials}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden"
          style={{ background: "#0d0d2b" }}
        >
          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-white text-sm font-medium truncate">
              {user?.user_metadata?.full_name || "User"}
            </p>
            <p className="text-white/40 text-xs truncate">{user?.email}</p>
          </div>
          {[
            { label: "View Profile", icon: "👤", path: "/profile" },
            { label: "Settings", icon: "⚙️", path: "/settings" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => { onNavigate(item.path); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-white/70 text-sm hover:bg-white/5 hover:text-white transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
            >
              <span className="text-base">🚪</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar Nav Item ─────────────────────────────────────────────────────────
function NavItem({ icon, label, path, active, onClick }) {
  return (
    <button
      onClick={() => onClick(path)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
          : "text-white/50 hover:text-white hover:bg-white/8"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ─── Main Sidebar Component ───────────────────────────────────────────────────
export default function DashboardSidebar({ user, currentPath, onNavigate, notifications = [], onMarkRead }) {
  const navItems = [
  { icon: "🏠", label: "Dashboard", path: "/dashboard" },
  { icon: "🏢", label: "Companies", path: "/companies" },
  { icon: "📝", label: "Questions", path: "/dashboard/questions" },
  { icon: "🗺️", label: "Roadmap", path: "/dashboard/roadmap" },
  { icon: "📊", label: "Progress", path: "/dashboard/progress" },
  { icon: "🤖", label: "AI Chat", path: "/dashboard/chat" },
  { icon: "📋", label: "Applications", path: "/dashboard/applications" },
  { icon: "🎯", label: "Mock Interview", path: "/dashboard/mock" },
];

  return (
    <aside
      className="flex flex-col min-h-screen w-64 border-r border-white/10 px-4 py-6"
      style={{ background: "linear-gradient(180deg, #080820 0%, #06061a 100%)" }}
    >
      {/* Logo */}
      <div className="px-2 mb-8">
        <h1
          className="text-2xl font-bold"
          style={{
            background: "linear-gradient(135deg, #6366f1, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          PlaceAI
        </h1>
        <p className="text-white/25 text-xs mt-0.5">Placement Prep System</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            {...item}
            active={currentPath === item.path}
            onClick={onNavigate}
          />
        ))}
      </nav>

      {/* Profile block — sticky bottom */}
      <div className="mt-auto pt-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          {/* Avatar with dropdown */}
          <AvatarDropdown user={user} onNavigate={onNavigate} />

          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.user_metadata?.full_name || "User"}
            </p>
            <p className="text-white/30 text-xs truncate">{user?.email}</p>
          </div>

          {/* Bell */}
          <NotificationDropdown notifications={notifications} onMarkRead={onMarkRead} />
        </div>
      </div>
    </aside>
  );
}
