import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f8fafc]">
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#4f46e5] via-[#4338ca] to-indigo-900 text-white shadow-2xl">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        <div className="absolute top-[-80px] right-[-60px] w-[320px] h-[320px] bg-white/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-[-80px] left-[-60px] w-[280px] h-[280px] bg-indigo-300/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg">
              🔎
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter">UniVault</h1>
          </div>

          <div className="max-w-lg">
            <h2 className="text-4xl xl:text-6xl font-black leading-[1.1] tracking-tight">
              Your campus,
              <br />
              <span className="text-indigo-300 italic">secured & connected</span>
            </h2>

            <p className="mt-6 text-lg text-white/90 leading-relaxed font-medium">
              Recover lost items, trade safely, and connect with your university
              community seamlessly.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <div className="px-6 py-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl">
                <p className="text-sm font-black uppercase tracking-widest">12K+ Items Recovered</p>
              </div>

              <div className="px-6 py-4 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl">
                <p className="text-sm font-black uppercase tracking-widest">50+ Universities</p>
              </div>
            </div>
          </div>

          <div className="text-sm font-bold opacity-60">© 2026 UniVault Secure Systems</div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-8">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;