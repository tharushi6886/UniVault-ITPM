import React from "react";
import RegisterForm from "../components/RegisterForm";

const features = [
  { icon: "📋", text: "Create & manage lost item reports" },
  { icon: "✅", text: "Review verified student listings" },
  { icon: "📧", text: "Secure email OTP verification" },
];

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex font-epilogue">
      {/* ── LEFT PANEL ──────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] xl:w-[42%] shrink-0 relative overflow-hidden bg-[#1e2a78] px-14 py-12">
        {/* Decorative blobs */}
        <div className="absolute top-[-120px] right-[-80px] w-[340px] h-[340px] bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-60px] w-[280px] h-[280px] bg-blue-700/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-[38%] left-[-40px] w-[180px] h-[180px] bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-xl">
            🔎
          </div>
          <div>
            <p className="text-white font-black text-xl leading-none">UniVault</p>
            <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">Campus Ecosystem</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10 max-w-sm">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
            <span className="text-indigo-200 text-xs font-bold uppercase tracking-widest">Build your student presence</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-5">
            Create your student account
          </h2>
          <p className="text-[#a5b4fc] text-base font-medium leading-relaxed mb-10">
            Join UniVault to report lost items, discover the marketplace, and manage your university activities all in one place.
          </p>

          <ul className="space-y-4">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-base shrink-0">
                  {f.icon}
                </div>
                <span className="text-white/80 text-sm font-medium">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-white/30 text-xs font-medium">© 2026 UniVault Secure Systems</p>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-[#f0f2f9] px-6 py-12">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;