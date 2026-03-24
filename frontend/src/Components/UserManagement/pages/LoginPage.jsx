import React from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f5f6fb]">
      {/* Left side */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#4f46e5] via-[#4f46e5] to-cyan-500 text-white">
        {/* soft dots background */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        {/* glow */}
        <div className="absolute top-[-80px] right-[-60px] w-[320px] h-[320px] bg-white/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-[-80px] left-[-60px] w-[280px] h-[280px] bg-cyan-300/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 flex flex-col justify-between w-full px-14 py-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg">
              🔎
            </div>
            <h1 className="text-4xl font-bold">UniVault</h1>
          </div>

          <div className="max-w-xl">
            <h2 className="text-6xl font-bold leading-tight">
              Your campus,
              <br />
              <span className="text-cyan-300">secured & connected</span>
            </h2>

            <p className="mt-6 text-xl text-white/85 leading-9">
              Recover lost items, trade safely, and connect with your university
              community.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <div className="px-6 py-4 rounded-2xl bg-white/12 border border-white/20 backdrop-blur-md shadow-lg">
                <p className="text-lg font-semibold">12K+ Items Recovered</p>
              </div>

              <div className="px-6 py-4 rounded-2xl bg-white/12 border border-white/20 backdrop-blur-md shadow-lg">
                <p className="text-lg font-semibold">50+ Universities</p>
              </div>

              <div className="px-6 py-4 rounded-2xl bg-white/12 border border-white/20 backdrop-blur-md shadow-lg">
                <p className="text-lg font-semibold">1.5K Students Online</p>
              </div>
            </div>
          </div>

          <div></div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center px-6 py-10">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;