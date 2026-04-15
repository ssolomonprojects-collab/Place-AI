import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

function OnboardingScreen({ user, onComplete }) {
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!college.trim()) return;
    setLoading(true);
    await supabase.auth.updateUser({
      data: { college: college.trim() }
    });
    setLoading(false);
    onComplete();
  };

  const name = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#06061a" }}
    >
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1"
            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            PlaceAI
          </h1>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-4">🎓</div>
          <h2 className="text-white text-xl font-bold mb-1">Welcome, {name}!</h2>
          <p className="text-white/40 text-sm mb-6">
            One last thing — which college are you from?
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="e.g. Anna University, IIT Madras..."
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 placeholder:text-white/20 text-sm"
            />
            <button
              type="submit"
              disabled={loading || !college.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
            >
              {loading ? "Saving…" : "Let's Go! →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children }) {
  const { user, loading, needsOnboarding, setNeedsOnboarding } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "#06061a" }}>
        <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (needsOnboarding) {
    return (
      <OnboardingScreen
        user={user}
        onComplete={() => setNeedsOnboarding(false)}
      />
    );
  }

  return children;
}