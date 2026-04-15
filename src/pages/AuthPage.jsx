import { useState } from "react";
import { supabase } from "../lib/supabase";

function InputField({ label, type = "text", placeholder, value, onChange, id, required, autoComplete }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#1a4a3a] focus:ring-2 focus:ring-[#1a4a3a]/10 transition-all bg-gray-50 text-gray-800 placeholder-gray-400 min-h-[44px]"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-xs"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}

function LoginForm({ onSwitch }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    }
    // On success, App.jsx will detect the session change and redirect automatically
  };

  return (
    <div className="w-full">
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back 👋</h2>
        <p className="text-sm text-gray-500 mt-1">Sign in to your PlaceAI account</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <InputField
          id="login-email" label="Email address" type="email"
          placeholder="you@example.com" value={form.email}
          onChange={handle("email")} required autoComplete="email"
        />
        <InputField
          id="login-password" label="Password" type="password"
          placeholder="Enter your password" value={form.password}
          onChange={handle("password")} required autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded accent-[#1a4a3a]" />
            <span className="text-gray-600">Remember me</span>
          </label>
          <button type="button" className="text-[#1a4a3a] hover:underline font-medium">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1a4a3a] hover:bg-[#0f3028] disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all text-sm min-h-[48px] flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Signing in...
            </>
          ) : "Sign In"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <hr className="flex-1 border-gray-200" />
        <span className="text-xs text-gray-400">or continue with</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {["Google", "GitHub"].map((p) => (
          <button
            key={p}
            className="border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl py-2.5 text-sm text-gray-700 font-medium transition-all min-h-[44px]"
          >
            {p === "Google" ? "🔵" : "⚫"} {p}
          </button>
        ))}
      </div>

      <p className="text-sm text-center text-gray-500 mt-6">
        Don't have an account?{" "}
        <button onClick={onSwitch} className="text-[#1a4a3a] font-semibold hover:underline">
          Sign up free
        </button>
      </p>
    </div>
  );
}

function SignupForm({ onSwitch }) {
  const [form, setForm] = useState({ name: "", email: "", college: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) { setError("Please fill in all fields."); return; }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password || !form.confirm) { setError("Please fill in all fields."); return; }
    if (form.password !== form.confirm) { setError("Passwords don't match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          college: form.college,
        },
      },
    });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    }
    // On success, Supabase session fires and App.jsx redirects automatically
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create account 🚀</h2>
        <p className="text-sm text-gray-500 mt-1">Start your placement journey today</p>
        {/* Steps */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s ? "bg-[#1a4a3a] text-white" : "bg-gray-200 text-gray-400"
              }`}>{s}</div>
              {s < 2 && <div className={`w-8 h-0.5 transition-all ${step > s ? "bg-[#1a4a3a]" : "bg-gray-200"}`} />}
            </div>
          ))}
          <span className="text-xs text-gray-400 ml-1">{step === 1 ? "Basic Info" : "Set Password"}</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl" role="alert">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleNext} className="space-y-4" noValidate>
          <InputField id="signup-name" label="Full Name" placeholder="Kiruthicka K" value={form.name} onChange={handle("name")} required autoComplete="name" />
          <InputField id="signup-email" label="Email Address" type="email" placeholder="you@college.edu" value={form.email} onChange={handle("email")} required autoComplete="email" />
          <InputField id="signup-college" label="College / University" placeholder="Anna University" value={form.college} onChange={handle("college")} autoComplete="organization" />
          <button type="submit" className="w-full bg-[#1a4a3a] hover:bg-[#0f3028] text-white font-semibold py-3 rounded-xl text-sm min-h-[48px] transition-all active:scale-[0.98]">
            Continue →
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <InputField id="signup-pass" label="Password" type="password" placeholder="Min. 6 characters" value={form.password} onChange={handle("password")} required autoComplete="new-password" />
          <InputField id="signup-confirm" label="Confirm Password" type="password" placeholder="Repeat password" value={form.confirm} onChange={handle("confirm")} required autoComplete="new-password" />

          {/* Password strength */}
          {form.password && (
            <div>
              <div className="flex gap-1 mb-1">
                {[1,2,3,4].map((n) => (
                  <div key={n} className={`flex-1 h-1 rounded-full transition-all ${
                    form.password.length >= n * 3
                      ? n <= 1 ? "bg-red-400" : n <= 2 ? "bg-amber-400" : n <= 3 ? "bg-blue-400" : "bg-green-500"
                      : "bg-gray-200"
                  }`} />
                ))}
              </div>
              <p className="text-xs text-gray-400">
                {form.password.length < 4 ? "Too short" : form.password.length < 7 ? "Weak" : form.password.length < 10 ? "Good" : "Strong"}
              </p>
            </div>
          )}

          <label className="flex items-start gap-2 cursor-pointer">
            <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded accent-[#1a4a3a]" />
            <span className="text-xs text-gray-500">I agree to the <span className="text-[#1a4a3a] font-medium">Terms of Service</span> and <span className="text-[#1a4a3a] font-medium">Privacy Policy</span></span>
          </label>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-all min-h-[48px]">← Back</button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#1a4a3a] hover:bg-[#0f3028] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm min-h-[48px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating...
                </>
              ) : "Create Account 🎉"}
            </button>
          </div>
        </form>
      )}

      <p className="text-sm text-center text-gray-500 mt-6">
        Already have an account?{" "}
        <button onClick={onSwitch} className="text-[#1a4a3a] font-semibold hover:underline">
          Sign in
        </button>
      </p>
    </div>
  );
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[560px]">

        {/* Left panel */}
        <div className="bg-[#1a4a3a] text-white p-8 md:p-10 flex flex-col justify-between md:w-2/5 flex-shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">🎓</div>
              <div>
                <p className="font-bold text-lg leading-none">PlaceAI</p>
                <p className="text-xs text-green-300">Smart Placement System</p>
              </div>
            </div>
            <h2 className="text-2xl font-bold leading-snug mb-3">
              Your placement journey starts here
            </h2>
            <p className="text-sm text-green-200 leading-relaxed">
              AI-powered guidance to help you land your dream job — from company discovery to interview prep.
            </p>
          </div>

          <div className="space-y-3 mt-8">
            {[
              ["🏢", "10+ top companies"],
              ["🤖", "AI interview coach"],
              ["📊", "Real-time progress tracking"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-sm text-green-100">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 p-8 md:p-10 overflow-y-auto flex flex-col justify-center">
          {isLogin
            ? <LoginForm onSwitch={() => setIsLogin(false)} />
            : <SignupForm onSwitch={() => setIsLogin(true)} />
          }
        </div>
      </div>
    </div>
  );
}