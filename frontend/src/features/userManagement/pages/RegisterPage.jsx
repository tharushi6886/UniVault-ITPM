import React from "react";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f5f6fb]">
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#4f46e5] via-[#4f46e5] to-cyan-500 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        <div className="absolute top-[-80px] right-[-60px] w-[320px] h-[320px] bg-white/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-[-80px] left-[-60px] w-[280px] h-[280px] bg-cyan-300/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg">
              👤
            </div>
            <h1 className="text-3xl font-bold">UniVault</h1>
          </div>

          <div className="max-w-lg">
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
              Create Your
              <br />
              <span className="text-cyan-300">Student Account</span>
            </h2>

            <p className="mt-5 text-lg text-white/85 leading-8">
              Join UniVault to report lost items, manage marketplace activity,
              and connect with your campus community securely.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="px-5 py-3 rounded-2xl bg-white/12 border border-white/20 backdrop-blur-md shadow-lg">
                <p className="text-base font-semibold">University Only Access</p>
              </div>

              <div className="px-5 py-3 rounded-2xl bg-white/12 border border-white/20 backdrop-blur-md shadow-lg">
                <p className="text-base font-semibold">Verified Student Identity</p>
              </div>
            </div>
          </div>

          <div></div>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-8">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;