import React, { useState } from "react";
import { resetPassword } from "../../../api/userApi";
import { toast } from "react-toastify";
import { useLocation, useNavigate, Link } from "react-router-dom";
import Navbar from "../../homepage/components/Navbar";

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
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-[#1f1b5b]">Set New Password</h2>
            <p className="mt-2 text-sm text-gray-600 font-medium">
              Check your email for the OTP sent to {email}
            </p>
          </div>
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">6-Digit OTP</label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5] font-mono tracking-widest text-center text-lg"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                  placeholder="Enter at least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-all ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </div>

            <div className="text-center">
              <Link to="/forgot-password" title="Resend OTP" className="font-medium text-[#4f46e5] hover:text-[#4338ca] text-sm">
                 Didn't receive code? Try again
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;
