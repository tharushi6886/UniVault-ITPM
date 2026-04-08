import React, { useState } from "react";
import { forgotPassword } from "../../../api/userApi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.endsWith("@my.sliit.lk")) {
      return toast.error("Please use your SLIIT student email (@my.sliit.lk)");
    }
    setLoading(true);
    try {
      await forgotPassword({ email });
      toast.success("OTP sent to your email!");
      navigate("/reset-password", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-epilogue">

      {/* ── LEFT PANEL ──────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] xl:w-[42%] shrink-0 relative overflow-hidden bg-[#1e2a78] px-14 py-12">
        <div className="absolute top-[-120px] right-[-80px] w-[340px] h-[340px] bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-60px] w-[280px] h-[280px] bg-blue-700/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[38%] left-[-40px] w-[180px] h-[180px] bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-xl">🔎</div>
          <div>
            <p className="text-white font-black text-xl leading-none">UniVault</p>
            <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Campus Ecosystem</p>
          </div>
        </div>

        {/* Hero */}
        <div className="relative z-10 max-w-sm">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Account Recovery</span>
          </div>
          <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-5">
            Reset your password securely
          </h2>
          <p className="text-[#a5b4fc] text-base font-medium leading-relaxed mb-10">
            Enter your SLIIT university email and we'll send a one-time password to help you regain access.
          </p>
          <ul className="space-y-4">
            {[
              { icon: "📧", text: "OTP sent to your university email" },
              { icon: "⏱️", text: "Code valid for 10 minutes only" },
              { icon: "🔐", text: "Secure university-only recovery" },
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-base shrink-0">{f.icon}</div>
                <span className="text-white/80 text-sm font-medium">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-10 text-white/30 text-xs font-medium">© 2026 UniVault Secure Systems</p>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-[#f0f2f9] px-6 py-12">
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(30,42,120,0.12)] border border-slate-100 px-10 py-10">

            {/* Header */}
            <div className="mb-8 text-center">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">🔑</div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Forgot Password</h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Enter your SLIIT email to receive a reset OTP</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 tracking-wide">University Email</label>
                <div className="flex items-center h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 gap-3 focus-within:border-[#4f46e5] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.08)] transition-all">
                  <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    type="email"
                    name="email"
                    placeholder="itXXXXXX@my.sliit.lk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-300 outline-none"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#3b46c8] hover:bg-[#2f3baa] text-white text-sm font-black uppercase tracking-widest shadow-[0_4px_18px_rgba(59,70,200,0.35)] hover:shadow-[0_6px_24px_rgba(59,70,200,0.45)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0 mt-2"
              >
                {loading ? "Sending OTP..." : "Send Reset OTP"}
              </button>
            </form>

            {/* Footer */}
            <p className="mt-7 text-center">
              <Link to="/login" className="text-sm font-bold text-[#4f46e5] hover:underline">
                ← Return to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
