import React, { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/userApi";
import { toast } from "react-toastify";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    password: "",
    phone: "",
    faculty: "",
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
      const res = await registerUser(formData);

      toast.success(res.data.message || "Registration successful");
      //toast.success(res.data.message || "Registration successful");

          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);

      setFormData({
        name: "",
        email: "",
        studentId: "",
        password: "",
        phone: "",
        faculty: "",
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        "Registration failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-white/90 backdrop-blur-md p-8 md:p-10 rounded-[28px] shadow-[0_18px_50px_rgba(79,70,229,0.12)] border border-[#e9e7ff]">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#4f46e5] to-cyan-500 flex items-center justify-center text-white text-2xl shadow-lg">
            👤
          </div>
          <h2 className="text-4xl font-bold text-[#1f1b5b] mt-4">Register</h2>
          <p className="text-gray-500 mt-2">
            Create your UniVault account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#1f1b5b] mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-14 px-4 border border-[#dfe3f0] rounded-2xl bg-[#fbfcff] outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1f1b5b] mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your university email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full h-14 px-4 border border-[#dfe3f0] rounded-2xl bg-[#fbfcff] outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1f1b5b] mb-2">
              Student ID
            </label>
            <input
              type="text"
              name="studentId"
              placeholder="Enter your student ID"
              value={formData.studentId}
              onChange={handleChange}
              required
              className="w-full h-14 px-4 border border-[#dfe3f0] rounded-2xl bg-[#fbfcff] outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1f1b5b] mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Create a secure password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full h-14 px-4 border border-[#dfe3f0] rounded-2xl bg-[#fbfcff] outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-[#1f1b5b] mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-[#dfe3f0] rounded-2xl bg-[#fbfcff] outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1f1b5b] mb-2">
                Faculty
              </label>
              <input
                type="text"
                name="faculty"
                placeholder="Enter faculty"
                value={formData.faculty}
                onChange={handleChange}
                className="w-full h-14 px-4 border border-[#dfe3f0] rounded-2xl bg-[#fbfcff] outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-cyan-500 text-white font-semibold text-lg shadow-[0_10px_24px_rgba(79,70,229,0.22)] hover:opacity-95 transition disabled:opacity-60"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#4f46e5] hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;