import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyOtp } from "../../../api/userApi";
import { toast } from "react-toastify";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(600);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOtp(formData);
      toast.success(res.data.message || "OTP verified successfully");
      setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const isExpired = secondsLeft === 0;

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
              Identity Verification
            </h2>
            <p className="text-[15px] text-slate-500 font-medium leading-relaxed">
              We've sent a 6-digit decryption code to your university email.
            </p>
          </div>

          {/* Countdown Area */}
          <div className={`flex items-center justify-between px-6 py-4 rounded-3xl mb-8 border transition-all duration-500 ${
            isExpired 
              ? "bg-rose-50 border-rose-100 shadow-sm" 
              : "bg-indigo-50 border-indigo-100 shadow-sm"
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{isExpired ? "⛔" : "⏱️"}</span>
              <span className={`text-sm font-bold uppercase tracking-widest ${isExpired ? "text-rose-500" : "text-indigo-600"}`}>
                {isExpired ? "Expired" : "Expires in"}
              </span>
            </div>
            <span className={`text-2xl font-black ${isExpired ? "text-rose-600" : "text-indigo-700"}`}>
              {formatTime(secondsLeft)}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field (Disabled-like appearance) */}
            <div className="group space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative flex items-center h-14 rounded-2xl border border-slate-200 bg-slate-50 px-5 text-slate-400 font-bold text-sm">
                {formData.email}
              </div>
            </div>

            {/* OTP Field */}
            <div className="group space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-indigo-600 ml-1">Verification Code</label>
              <div className="relative flex items-center h-16 rounded-2xl border-2 border-indigo-100 bg-indigo-50/30 px-5 gap-4 focus-within:border-indigo-500 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(79,134,239,0.1)] transition-all">
                <input
                  type="text"
                  name="otp"
                  placeholder="0 0 0 0 0 0"
                  value={formData.otp}
                  onChange={handleChange}
                  required
                  maxLength={6}
                  className="w-full bg-transparent text-2xl font-black text-slate-900 outline-none placeholder:text-slate-300 tracking-[0.4em] text-center"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || isExpired}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#4A8EF0] to-[#8B5CF6] hover:shadow-[0_12px_30px_rgba(74,134,240,0.3)] text-white text-[15px] font-black uppercase tracking-widest hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-40 disabled:grayscale disabled:translate-y-0 mt-4"
            >
              {loading ? "Verifying..." : "Confirm Verification →"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 text-center">
            <p className="text-[14px] text-slate-400 font-medium">
              Didn't receive a code?{" "}
              <button 
                type="button" 
                onClick={() => window.location.reload()}
                className="text-indigo-600 font-black hover:underline ml-1"
              >
                Resend OTP
              </button>
            </p>
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

export default VerifyOtpPage;