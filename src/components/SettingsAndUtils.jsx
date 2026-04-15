// ─────────────────────────────────────────────────────────────────────────────
// FILE: src/components/PageSpinner.jsx
// Use this as a loading indicator for page transitions
// ─────────────────────────────────────────────────────────────────────────────

export function PageSpinner() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: "#06061a", fontFamily: "SF Pro Display, -apple-system, sans-serif" }}
    >
      {/* Animated ring */}
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-2 border-white/5" />
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
          style={{
            borderTopColor: "#6366f1",
            borderRightColor: "#7c3aed",
            animationDuration: "0.8s",
          }}
        />
        <div
          className="absolute inset-2 rounded-full"
          style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(124,58,237,0.15))" }}
        />
      </div>
      <p className="text-white/30 text-sm">Loading PlaceAI…</p>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// FILE: Fix "Start for free" → scroll to top of /companies
// Add this to your homepage Hero section button:
// ─────────────────────────────────────────────────────────────────────────────

/*
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  const handleStartFree = () => {
    navigate("/companies");
    // After navigation, scroll to top
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 50);
  };

  return (
    // ... your existing hero JSX
    <button
      onClick={handleStartFree}
      className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-lg hover:opacity-90 transition-opacity"
    >
      Start for free
    </button>
  );
}
*/


// ─────────────────────────────────────────────────────────────────────────────
// FILE: Fix blurred blue avatar artifact in Navbar — add this to your Navbar
// Replace whatever avatar/icon is causing the blurred artifact
// ─────────────────────────────────────────────────────────────────────────────

/*
// In your Navbar component, replace the old avatar with this clean version:
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";

function NavbarAvatar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const initials = user?.user_metadata?.full_name
    ?.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div
      className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity"
      // NOTE: No filter, no blur, no box-shadow glow — clean only
    >
      {initials}
    </div>
  );
}
*/


// ─────────────────────────────────────────────────────────────────────────────
// FILE: Settings Page with avatar upload UI + toggle switches
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { supabase } from "../lib/supabase";

function Toggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/8 last:border-0">
      <div>
        <p className="text-white text-sm font-medium">{label}</p>
        {description && <p className="text-white/40 text-xs mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${
          enabled ? "bg-indigo-600" : "bg-white/10"
        }`}
      >
        <div
          className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
            enabled ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsPage({ user }) {
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [college, setCollege] = useState(user?.user_metadata?.college || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [notifications, setNotifications] = useState({
    email: true,
    progress: true,
    reminders: false,
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
    // Upload logic: supabase.storage.from('avatars').upload(...)
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, college },
    });
    setSaving(false);
    if (!error) { setSaved(true); setTimeout(() => setSaved(false), 2000); }
  };

  const initials = fullName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "?";

  return (
    <div className="p-6 max-w-2xl space-y-6" style={{ fontFamily: "SF Pro Display, -apple-system, sans-serif" }}>
      <h2 className="text-white text-xl font-semibold">Settings</h2>

      {/* Profile */}
      <div className="rounded-2xl border border-white/8 p-6 space-y-5" style={{ background: "rgba(255,255,255,0.02)" }}>
        <h3 className="text-white/60 text-xs uppercase tracking-wider">Profile</h3>

        {/* Avatar upload */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : initials}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 border-2 border-[#06061a] flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-colors"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="text-white text-sm font-medium">{fullName || "Your Name"}</p>
            <p className="text-white/40 text-xs">{user?.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-white/40 text-xs mb-1 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-white/40 text-xs mb-1 block">College / University</label>
            <input
              type="text"
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-medium disabled:opacity-60 hover:opacity-90 transition-opacity"
        >
          {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Notification toggles */}
      <div className="rounded-2xl border border-white/8 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
        <h3 className="text-white/60 text-xs uppercase tracking-wider mb-2">Notifications</h3>
        <Toggle
          label="Email Notifications"
          description="Receive preparation tips and updates via email"
          enabled={notifications.email}
          onChange={(v) => setNotifications((n) => ({ ...n, email: v }))}
        />
        <Toggle
          label="Progress Reminders"
          description="Daily reminders to maintain your streak"
          enabled={notifications.progress}
          onChange={(v) => setNotifications((n) => ({ ...n, progress: v }))}
        />
        <Toggle
          label="Application Updates"
          description="Alerts when application status changes"
          enabled={notifications.reminders}
          onChange={(v) => setNotifications((n) => ({ ...n, reminders: v }))}
        />
      </div>
    </div>
  );
}
