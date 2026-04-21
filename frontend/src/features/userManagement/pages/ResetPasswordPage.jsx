import React, { useState } from "react";
import { resetPassword } from "../../../api/userApi";
import { toast } from "react-toastify";
import { useLocation, useNavigate, Link } from "react-router-dom";

const ResetPasswordPage = () => {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  if (!email) {
    navigate("/forgot-password");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await resetPassword({ email, otp, newPassword });
      toast.success("Password reset successfully! Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
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

      <div className="w-full max-w-[460px] relative z-10">
        <div className="bg-white rounded-[40px] shadow-[0_32px_80px_rgba(30,58,138,0.1)] border border-white p-8 md:p-12">

          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
              Reset Password
            </h2>
            <p className="text-[15px] text-slate-500 font-medium leading-relaxed">
              Create a new secure key for your account tied to <span className="text-indigo-600 font-bold">{email}</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* OTP Field */}
            <div className="group space-y-2">
              <label htmlFor="otp" className="text-[11px] font-black uppercase tracking-widest text-indigo-600 ml-1">6-Digit OTP</label>
              <div className="relative flex items-center h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300 tracking-[0.2em]"
                />
              </div>
            </div>

            {/* New Password */}
            <div className="group space-y-2">
              <label htmlFor="newPassword" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
              <div className="relative flex items-center h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="group space-y-2">
              <label htmlFor="confirmPassword" className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
              <div className="relative flex items-center h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 focus-within:border-indigo-500 focus-within:bg-white transition-all">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#4A8EF0] to-[#8B5CF6] hover:shadow-[0_12px_30px_rgba(74,134,240,0.3)] text-white text-[15px] font-black uppercase tracking-widest hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? "Updating Security..." : "Reset Password →"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <Link to="/forgot-password" text="Resend OTP" className="text-[13px] text-slate-400 font-medium hover:text-indigo-600 transition-colors">
              Didn't receive code? <span className="text-indigo-600 font-bold underline">Try again</span>
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

export default ResetPasswordPage;
