import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { verifyOtp } from "../api/userApi";
import { toast } from "react-toastify";

const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.email || "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);

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
      const res = await verifyOtp(formData);
      toast.success(res.data.message || "OTP verified successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      const message =
        error.response?.data?.message || "OTP verification failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f5f6fb]">
      {/* Left side */}
      <div className="hidden lg:flex relative overflow-hidden bg-gradient-to-br from-[#4f46e5] via-[#4f46e5] to-cyan-500 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[radial-gradient(circle,white_1px,transparent_1px)] [background-size:28px_28px]" />
        </div>

        <div className="absolute top-[-80px] right-[-60px] w-[320px] h-[320px] bg-white/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-[-80px] left-[-60px] w-[280px] h-[280px] bg-cyan-300/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 flex flex-col justify-between w-full px-14 py-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-lg">
              🔐
            </div>
            <h1 className="text-4xl font-bold">UniVault</h1>
          </div>

          <div className="max-w-xl">
            <h2 className="text-5xl font-bold leading-tight">
              Verify Your
              <br />
              <span className="text-cyan-300">University Email</span>
            </h2>

            <p className="mt-6 text-xl text-white/85 leading-9">
              We sent a one-time password to your university email. Enter it to
              activate your account and continue securely.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <div className="px-6 py-4 rounded-2xl bg-white/12 border border-white/20 backdrop-blur-md shadow-lg">
                <p className="text-lg font-semibold">Secure Student Access</p>
              </div>

              <div className="px-6 py-4 rounded-2xl bg-white/12 border border-white/20 backdrop-blur-md shadow-lg">
                <p className="text-lg font-semibold">OTP Valid for 10 Minutes</p>
              </div>
            </div>
          </div>

          <div></div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          <div className="bg-white/95 rounded-[34px] border border-[#e5e7f2] shadow-[0_20px_60px_rgba(31,27,91,0.12)] px-8 md:px-12 py-10">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px flex-1 bg-[#dfe3ef]"></div>
              <span className="text-sm tracking-[0.2em] font-semibold text-[#5b57b8] uppercase">
                ✉️ OTP Verification
              </span>
              <div className="h-px flex-1 bg-[#dfe3ef]"></div>
            </div>

            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1f1b5b] leading-tight">
                Verify Your Account
              </h2>
              <p className="mt-3 text-xl text-gray-500">
                Enter the OTP sent to your university email
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold tracking-[0.18em] uppercase text-[#5b57b8] mb-3">
                  University Email
                </label>
                <div className="flex items-center h-16 rounded-2xl border border-[#dfe3ef] bg-[#fbfcff] px-5 shadow-sm">
                  <span className="mr-4 text-xl text-gray-400">📧</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent outline-none text-lg text-[#1f1b5b] placeholder:text-[#a7b0c7]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold tracking-[0.18em] uppercase text-[#5b57b8] mb-3">
                  OTP Code
                </label>
                <div className="flex items-center h-16 rounded-2xl border border-[#dfe3ef] bg-[#fbfcff] px-5 shadow-sm">
                  <span className="mr-4 text-xl text-gray-400">🔢</span>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent outline-none text-lg text-[#1f1b5b] placeholder:text-[#a7b0c7]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-16 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] text-white text-2xl font-semibold shadow-[0_12px_28px_rgba(79,70,229,0.28)] hover:opacity-95 transition disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify OTP →"}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-lg text-gray-500">
                Already verified?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-[#4f46e5] hover:underline"
                >
                  Login
                </Link>
              </p>

              <div className="mt-6 inline-flex items-center gap-6 px-6 py-3 rounded-full bg-[#f7f8ff] border border-[#ebedfa]">
                <span className="text-sm font-bold text-green-600">EMAIL SECURED</span>
                <span className="text-gray-300">|</span>
                <span className="text-sm font-bold text-gray-500">OTP ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;