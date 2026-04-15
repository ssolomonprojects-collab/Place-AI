import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /[0-9]/.test(password) },
    { label: "Special character (!@#$...)", ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-400", "bg-green-400", "bg-green-500"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${score >= i ? colors[score] : "bg-white/10"}`} />
        ))}
      </div>
      {score > 0 && <p className="text-xs text-white/50">{labels[score]} password</p>}
      <ul className="space-y-1">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center gap-2 text-xs">
            <span className={c.ok ? "text-green-400" : "text-white/30"}>{c.ok ? "✓" : "○"}</span>
            <span className={c.ok ? "text-white/60" : "text-white/30"}>{c.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.184 6.839 9.504.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.2 22 16.447 22 12.021 22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

// ── Onboarding screen for Google/GitHub users missing college ──────────────────
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
  );
}

export default function LoginPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check if Google/GitHub user is missing college after redirect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user = session.user;
        const hasCollege = user.user_metadata?.college;
        // Only show onboarding for OAuth users (no password) missing college
        const isOAuthUser = user.app_metadata?.provider !== "email";
        if (isOAuthUser && !hasCollege) {
          setCurrentUser(user);
          setShowOnboarding(true);
        }
      }
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!termsAccepted) { setError("Please accept Terms of Service to continue."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!college.trim()) { setError("Please enter your college name."); return; }
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, college: college.trim() } },
      });
      if (error) throw error;
      setError("✓ Account created! You can now sign in.");
      setMode("login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `https://place-ai-five.vercel.app/dashboard` }
  });
};

  const handleGitHub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/login` }
    });
  };

  const handleForgotPassword = async () => {
    if (!email) { setError("Enter your email above first."); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    setLoading(false);
    if (error) setError(error.message);
    else setResetSent(true);
  };

  const glassCls = "backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "#06061a", fontFamily: "SF Pro Display, -apple-system, sans-serif" }}
    >
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl" />
      </div>

      <div className={`relative w-full max-w-md p-8 ${glassCls}`}>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1"
            style={{ background: "linear-gradient(135deg, #6366f1, #7c3aed)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            PlaceAI
          </h1>
          <p className="text-white/40 text-sm">Smart Placement Preparation</p>
        </div>

        {/* Onboarding screen for OAuth users */}
        {showOnboarding ? (
          <OnboardingScreen
            user={currentUser}
            onComplete={() => {
              setShowOnboarding(false);
              // AuthContext will detect session and redirect to dashboard
            }}
          />
        ) : resetSent ? (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">📧</div>
            <h3 className="text-white font-semibold text-lg mb-2">Check your email</h3>
            <p className="text-white/40 text-sm mb-1">We sent a password reset link to</p>
            <p className="text-indigo-400 text-sm font-medium">{email}</p>
            <button onClick={() => setResetSent(false)}
              className="mt-6 text-indigo-400 text-sm hover:text-indigo-300">
              ← Back to Sign In
            </button>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1">
              {["login", "signup"].map((m) => (
                <button key={m} onClick={() => { setMode(m); setError(""); }}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize ${
                    mode === m ? "bg-indigo-600 text-white shadow" : "text-white/40 hover:text-white/70"
                  }`}>
                  {m === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* OAuth Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button type="button" onClick={handleGoogle}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm hover:bg-white/10 transition-colors">
                <GoogleLogo /> Google
              </button>
              <button type="button" onClick={handleGitHub}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white/80 text-sm hover:bg-white/10 transition-colors">
                <GitHubLogo /> GitHub
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-xs">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* LOGIN FORM */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <input type="email" placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 placeholder:text-white/20 text-sm" />

                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Password"
                    value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 placeholder:text-white/20 text-sm pr-12" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-indigo-500 w-4 h-4" />
                    <span className="text-white/40 text-xs">Remember me</span>
                  </label>
                  <button type="button" onClick={handleForgotPassword}
                    className="text-indigo-400 text-xs hover:text-indigo-300">
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <p className={`text-xs ${error.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
                  {loading ? "Signing in…" : "Sign In"}
                </button>

                <p className="text-center text-white/30 text-xs">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => { setMode("signup"); setError(""); }}
                    className="text-indigo-400 hover:text-indigo-300">Sign up free</button>
                </p>
              </form>
            )}

            {/* SIGNUP FORM */}
            {mode === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <input type="text" placeholder="Full name" value={name}
                  onChange={(e) => setName(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 placeholder:text-white/20 text-sm" />

                <input type="email" placeholder="Email address" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 placeholder:text-white/20 text-sm" />

                <input type="text" placeholder="College / University (required)" value={college}
                  onChange={(e) => setCollege(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 placeholder:text-white/20 text-sm" />

                <div className="relative">
                  <input type={showPassword ? "text" : "password"} placeholder="Password (min 8 characters)"
                    value={password} onChange={(e) => setPassword(e.target.value)} required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-indigo-500 placeholder:text-white/20 text-sm pr-12" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs">
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <PasswordStrength password={password} />

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="terms" checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 accent-indigo-500" />
                  <label htmlFor="terms" className="text-white/40 text-xs leading-relaxed">
                    I agree to the{" "}
                    <button type="button" onClick={() => setShowTermsModal(true)}
                      className="text-indigo-400 hover:text-indigo-300 underline">Terms of Service</button>
                    {" "}and{" "}
                    <button type="button" onClick={() => setShowTermsModal(true)}
                      className="text-indigo-400 hover:text-indigo-300 underline">Privacy Policy</button>
                  </label>
                </div>

                {error && (
                  <p className={`text-xs ${error.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
                  {loading ? "Creating account…" : "Create Account"}
                </button>

                <p className="text-center text-white/30 text-xs">
                  Already have an account?{" "}
                  <button type="button" onClick={() => { setMode("login"); setError(""); }}
                    className="text-indigo-400 hover:text-indigo-300">Sign in</button>
                </p>
              </form>
            )}
          </>
        )}
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowTermsModal(false)}>
          <div className={`w-full max-w-lg max-h-[80vh] overflow-y-auto p-8 ${glassCls}`}
            style={{ background: "#0d0d2b" }} onClick={(e) => e.stopPropagation()}>
            <h2 className="text-white text-xl font-semibold mb-4">Terms of Service</h2>
            <div className="text-white/50 text-sm space-y-3 leading-relaxed">
              <p>PlaceAI is a placement preparation platform for educational purposes. By using PlaceAI, you agree to use it solely for lawful placement preparation activities.</p>
              <p>We collect your email, name, and progress data solely to provide and improve the service. We never sell your data to third parties.</p>
              <p>All content in PlaceAI is for personal, non-commercial use only. You may not reproduce or distribute it without permission.</p>
              <p>PlaceAI is provided as-is and does not guarantee placement outcomes. Results depend on individual effort and external factors.</p>
            </div>
            <h2 className="text-white text-xl font-semibold mt-6 mb-4">Privacy Policy</h2>
            <div className="text-white/50 text-sm space-y-3 leading-relaxed">
              <p>We collect: email address, full name, college name, and preparation progress. We do not sell your data to third parties.</p>
              <p>Authentication is handled by Supabase Auth (SOC2-compliant). Passwords are hashed and never stored as plain text.</p>
              <p>Third-party services used: Groq AI (chat), Vercel (hosting).</p>
              <p>You may request deletion of your account and data at any time by contacting us at privacy@placeai.app</p>
            </div>
            <button onClick={() => { setTermsAccepted(true); setShowTermsModal(false); }}
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium hover:opacity-90 transition-opacity">
              Accept & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}