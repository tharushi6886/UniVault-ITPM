import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../../api/userApi";
import { toast } from "react-toastify";

const EyeOpen = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const EyeClosed = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
  </svg>
);

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(res.data.message || "Login successful");
      setTimeout(() => { window.location.href = "/"; }, 1000);
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "Login failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px]">
      <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(30,42,120,0.12)] border border-slate-100 px-10 py-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Sign in to your UniVault account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 tracking-wide">Email</label>
            <div className="flex items-center h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 gap-3 focus-within:border-[#4f46e5] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.08)] transition-all">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="student@my.sliit.lk"
                value={formData.email}
                onChange={handleChange}
                required
                className="flex-1 bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-300 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-600 tracking-wide">Password</label>
              <Link to="/forgot-password" className="text-xs font-bold text-[#4f46e5] hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="flex items-center h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 gap-3 focus-within:border-[#4f46e5] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.08)] transition-all">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="flex-1 bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-300 outline-none"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-[#4f46e5] transition-colors shrink-0">
                {showPassword ? <EyeOpen /> : <EyeClosed />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#3b46c8] hover:bg-[#2f3baa] text-white text-sm font-black uppercase tracking-widest shadow-[0_4px_18px_rgba(59,70,200,0.35)] hover:shadow-[0_6px_24px_rgba(59,70,200,0.45)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0 mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-7 text-center text-sm text-slate-400 font-medium">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#4f46e5] font-bold hover:underline">
            Create one
          </Link>
        </p>
        <p className="mt-2 text-center">
          <Link to="/" className="text-xs text-slate-400 font-medium hover:text-[#4f46e5] transition-colors">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;