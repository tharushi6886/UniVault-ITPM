import React, { useState } from "react";
import { forgotPassword } from "../../../api/userApi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../homepage/components/Navbar";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.endsWith("@my.sliit.lk")) {
      return toast.error("Please use your SLIIT student email");
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
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-[#1f1b5b]">Forgot Password</h2>
            <p className="mt-2 text-sm text-gray-600 font-medium">
              Enter your SLIIT email to receive a reset OTP
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5] focus:z-10 sm:text-sm"
                  placeholder="itXXXXXX@my.sliit.lk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                {loading ? "Sending OTP..." : "Send Reset OTP"}
              </button>
            </div>

            <div className="text-center">
              <Link to="/login" className="font-medium text-[#4f46e5] hover:text-[#4338ca] text-sm">
                Return to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
