import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../../api/userApi";
import { toast } from "react-toastify";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginUser(formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(res.data.message || "Login successful");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        "Login failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl font-epilogue">
      <div className="bg-white/95 rounded-[2.5rem] border border-slate-100 shadow-[0_30px_70px_rgba(79,70,229,0.08)] px-8 md:px-12 py-10 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-[2px] flex-1 bg-indigo-50"></div>
          <span className="text-[10px] tracking-[0.3em] font-black text-indigo-600 uppercase">
             Secure Entry Gate
          </span>
          <div className="h-[2px] flex-1 bg-indigo-50"></div>
        </div>

        <div className="mb-10">
          <h2 className="text-4xl font-black text-[#1f1b5b] leading-tight tracking-tight">
            Sign In to Your Account
          </h2>
          <p className="mt-2 text-md font-medium text-slate-400">
            Access your UniVault campus ecosystem.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 mb-3 ml-1">
              University Email
            </label>
            <div className="flex items-center h-16 rounded-2xl border border-slate-100 bg-slate-50/50 px-6 shadow-sm focus-within:border-indigo-200 transition-all">
              <span className="mr-4 text-xl">✉️</span>
              <input
                type="email"
                name="email"
                placeholder="student@university.edu"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-base font-bold text-slate-700 placeholder:text-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-slate-400 mb-3 ml-1">
              Secret Password
            </label>
            <div className="flex items-center h-16 rounded-2xl border border-slate-100 bg-slate-50/50 px-6 shadow-sm focus-within:border-indigo-200 transition-all">
              <span className="mr-4 text-xl">🔐</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-base font-bold text-slate-700 placeholder:text-slate-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-4 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-bold px-1">
            <label className="flex items-center gap-3 text-slate-500 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500 transition-all" />
              <span className="group-hover:text-indigo-600">Remember session</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Recover Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-lg font-black uppercase tracking-widest shadow-[0_15px_30px_rgba(79,70,229,0.25)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.35)] hover:-translate-y-1 transition-all disabled:opacity-70 disabled:translate-y-0"
          >
            {loading ? "Authenticating..." : "Log In Securely →"}
          </button>
        </form>

        <div className="flex items-center gap-4 my-10">
          <div className="h-px flex-1 bg-slate-100"></div>
          <span className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-300">
            Social Gateways
          </span>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            className="w-full h-16 rounded-2xl border border-slate-100 bg-white text-sm font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:shadow-md transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>

          <button
            type="button"
            className="w-full h-16 rounded-2xl border border-slate-100 bg-white text-sm font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:shadow-md transition-all"
          >
            University SSO
          </button>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm font-bold text-slate-400">
            New to UniVault?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-700 underline underline-offset-4 decoration-indigo-200 transition-all"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;