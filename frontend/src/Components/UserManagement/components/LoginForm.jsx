import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../api/userApi";
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
    <div className="w-full max-w-2xl">
      <div className="bg-white/95 rounded-[34px] border border-[#e5e7f2] shadow-[0_20px_60px_rgba(31,27,91,0.12)] px-8 md:px-12 py-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-px flex-1 bg-[#dfe3ef]"></div>
          <span className="text-sm tracking-[0.2em] font-semibold text-[#5b57b8] uppercase">
            🔐 Secure Login
          </span>
          <div className="h-px flex-1 bg-[#dfe3ef]"></div>
        </div>

        <div className="mb-8">
          <h2 className="text-5xl font-bold text-[#1f1b5b] leading-tight">
            Sign In to Your Account
          </h2>
          <p className="mt-3 text-2xl text-gray-500">
            Access your campus dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold tracking-[0.18em] uppercase text-[#5b57b8] mb-3">
              University Email
            </label>
            <div className="flex items-center h-16 rounded-2xl border border-[#dfe3ef] bg-[#fbfcff] px-5 shadow-sm">
              <span className="mr-4 text-xl text-gray-400">✉️</span>
              <input
                type="email"
                name="email"
                placeholder="student@university.edu"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-lg text-[#1f1b5b] placeholder:text-[#a7b0c7]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold tracking-[0.18em] uppercase text-[#5b57b8] mb-3">
              Password
            </label>
            <div className="flex items-center h-16 rounded-2xl border border-[#dfe3ef] bg-[#fbfcff] px-5 shadow-sm">
              <span className="mr-4 text-xl text-gray-400">🔐</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-lg text-[#1f1b5b] placeholder:text-[#a7b0c7]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-4 text-lg text-gray-500 hover:text-[#4f46e5]"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-base">
            <label className="flex items-center gap-3 text-gray-600 cursor-pointer">
              <input type="checkbox" className="w-5 h-5 rounded" />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              className="font-semibold text-[#4f46e5] hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] text-white text-2xl font-semibold shadow-[0_12px_28px_rgba(79,70,229,0.28)] hover:opacity-95 transition disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Log In →"}
          </button>
        </form>

        <div className="flex items-center gap-4 my-8">
          <div className="h-px flex-1 bg-[#dfe3ef]"></div>
          <span className="text-sm uppercase tracking-[0.18em] font-semibold text-[#b1b7cc]">
            Or Continue With
          </span>
          <div className="h-px flex-1 bg-[#dfe3ef]"></div>
        </div>

        <div className="space-y-4">
          <button
            type="button"
            className="w-full h-16 rounded-2xl border border-[#dfe3ef] bg-white text-xl font-semibold text-[#1f1b5b] hover:bg-[#f8f9ff] transition"
          >
            Continue with Google
          </button>

          <button
            type="button"
            className="w-full h-16 rounded-2xl border border-[#dfe3ef] bg-white text-xl font-semibold text-[#1f1b5b] hover:bg-[#f8f9ff] transition"
          >
            University SSO
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-lg text-gray-500">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#4f46e5] hover:underline"
            >
              Create Account
            </Link>
          </p>

          <div className="mt-6 inline-flex items-center gap-6 px-6 py-3 rounded-full bg-[#f7f8ff] border border-[#ebedfa]">
            <span className="text-sm font-bold text-green-600">SYSTEM SECURE</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-bold text-gray-500">CAMPUS NODE-01</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;