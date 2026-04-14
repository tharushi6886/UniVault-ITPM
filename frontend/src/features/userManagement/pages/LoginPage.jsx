import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const features = [
  { icon: "🔍", text: "Report And Recover Lost Campus Items" },
  { icon: "🏪", text: "Trade Safely With Verified Students" },
  { icon: "🔨", text: "Participate In Item Bidding System" },
  { icon: "🔐", text: "OTP Verified University Identity" },
];

const LoginPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex font-epilogue overflow-hidden">
            <style>{`
                @keyframes float-slow { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px) rotate(1deg); } 100% { transform: translateY(0px); } }
                @keyframes particle { 0% { transform: translate(0, 0); opacity: 0.3; } 50% { transform: translate(15px, -15px); opacity: 0.6; } 100% { transform: translate(0, 0); opacity: 0.3; } }
                .animate-float-slow { animation: float-slow 10s ease-in-out infinite; }
                .animate-particle { animation: particle 8s ease-in-out infinite; }
            `}</style>

            {/* Back to Home Button */}
            <button 
                onClick={() => navigate("/")}
                className="fixed top-8 left-8 lg:left-auto lg:right-8 z-[100] group flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-xs font-bold hover:bg-white/20 transition-all shadow-xl"
            >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </button>

            {/* ── LEFT PANEL (Branding) ────────────────────────────────────────── */}
            <div className="hidden lg:flex flex-col justify-between w-[48%] xl:w-[540px] shrink-0 relative overflow-hidden bg-[#0F0A2E] px-12 py-10 border-r border-white/5">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                
                {/* Anti-Gravity Elements */}
                <div className="absolute top-[20%] right-[-10%] w-[300px] h-[400px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] animate-float-slow shadow-2xl skew-y-3" />
                <div className="absolute bottom-[-10%] left-[10%] w-[250px] h-[350px] bg-indigo-500/5 backdrop-blur-2xl border border-white/5 rounded-[50px] animate-float-slow shadow-2xl -skew-y-6" style={{ animationDelay: '2s' }} />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A8EF0] to-[#54DBC8] flex items-center justify-center text-sm font-black shadow-[0_4px_14px_rgba(79,134,239,0.24)] text-white">
                        U
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
                        UniVault
                    </span>
                </div>

        {/* Hero text */}
        <div className="relative z-10 max-w-lg mt-8 mb-8">
          {/* Brand Badge */}
          <div className="inline-flex items-center mb-5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-[10px] border border-white/20">
            <span className="text-white text-[10px] font-medium tracking-widest uppercase shadow-sm">Secure Student Platform</span>
          </div>

          <h1 className="text-[32px] xl:text-[42px] font-extrabold text-white leading-[1.05] tracking-tight mb-8 mt-1 pb-1" style={{ textShadow: "0px 0px 15px rgba(0, 217, 255, 0.4)" }}>
            Welcome Back To Your Floating Campus Hub
          </h1>

          <ul className="space-y-4 block">
            {features.map((f, i) => (
              <li key={i} className="flex items-center gap-4 group">
                {/* 48x48 Feature Card */}
                <div className="relative w-[48px] h-[48px] rounded-[14px] bg-white/5 backdrop-blur-[8px] border border-white/15 flex items-center justify-center text-xl shrink-0 group-hover:-translate-y-1 transition-all duration-300 shadow-[0_8px_32px_rgba(31,38,135,0.15)] overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#00D9FF]/20 to-[#8B5CF6]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                   <span className="relative z-10">{f.icon}</span>
                </div>
                <div className="flex-1">
                   <span className="text-white/90 text-[14px] font-medium leading-[1.4] block">{f.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-white/40 text-[13px] font-medium mb-4">© 2026 UniVault Secure Systems</p>
      </div>

            {/* ── RIGHT PANEL (Form) ─────────────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden px-6 py-12 bg-[#F0F9FF]">
        
        {/* Watermark Silhouette Abstract SVG */}
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] opacity-[0.08] pointer-events-none text-[#1A202C]">
           <svg viewBox="0 0 100 100" fill="currentColor"><path d="M10,90 L10,50 L30,50 L30,30 L50,30 L50,10 L70,10 L70,40 L90,40 L90,90 Z" /></svg>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;