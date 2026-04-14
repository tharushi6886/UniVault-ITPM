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
    <div className="min-h-screen flex flex-col items-center justify-center font-epilogue bg-[#F0F9FF] p-6 relative overflow-hidden">
      <style>{`
        @keyframes rotate-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-rotate-slow { animation: rotate-slow 20s linear infinite; }
      `}</style>

      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] -mr-64 -mt-64 animate-rotate-slow"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] -ml-40 -mb-40"></div>

      {/* Back to Home Button */}
      <button 
        onClick={() => navigate("/")}
        className="fixed top-8 left-8 z-[100] group flex items-center gap-2 px-4 py-2 bg-white shadow-xl border border-slate-200 rounded-xl text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10 relative z-10">
        <div className="w-12 h-12 rounded-[18px] bg-gradient-to-br from-[#4A8EF0] to-[#54DBC8] flex items-center justify-center text-lg font-black shadow-[0_8px_20px_rgba(79,134,239,0.3)] text-white">
          U
        </div>
        <span className="text-2xl font-black tracking-tight text-slate-900">UniVault</span>
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="bg-white rounded-[40px] shadow-[0_32px_80px_rgba(30,58,138,0.1)] border border-white p-8 md:p-12">

          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
              Recover Access
            </h2>
            <p className="text-[15px] text-slate-500 font-medium leading-relaxed px-2">
              Lost your credentials? Enter your university email to start the secure recovery process.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="group space-y-2">
              <label htmlFor="email" className="text-[11px] font-black uppercase tracking-widest text-indigo-600 ml-1">University Email</label>
              <div className="relative flex items-center h-16 rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 gap-4 focus-within:border-indigo-500 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(79,134,239,0.1)] transition-all">
                <svg className="w-5 h-5 text-indigo-400 group-focus-within:text-indigo-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@my.sliit.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#4A8EF0] to-[#8B5CF6] hover:shadow-[0_12px_30px_rgba(74,134,240,0.3)] text-white text-[15px] font-black uppercase tracking-widest hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 mt-4"
            >
              {loading ? "Sending Recovery Data..." : "Send Verification OTP →"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <Link to="/login" className="text-[14px] text-slate-400 font-medium hover:text-indigo-600 transition-colors">
              Remembered your password? <span className="text-indigo-600 font-black">Sign In</span>
            </Link>
          </div>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-center text-[13px] text-slate-400 font-medium opacity-60">
          Shielded by UniVault Secure Auth System
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
