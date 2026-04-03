import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../api/userApi";
import { toast } from "react-toastify";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    password: "",
    phone: "",
    faculty: "",
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

    const nameRegex = /^[A-Za-z\s]+$/;
    const studentIdRegex = /^IT\d{8}$/;
    const phoneRegex = /^(?:\+94|0)?7[0-9]{8}$/;

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const studentId = formData.studentId.trim().toUpperCase();
    const phone = formData.phone.trim();
    const faculty = formData.faculty.trim();

    if (!nameRegex.test(name) || name.length < 3) {
      toast.error("Name must contain only letters and at least 3 characters");
      setLoading(false);
      return;
    }

    if (!email.endsWith("@my.sliit.lk")) {
      toast.error("Email must be a SLIIT university email");
      setLoading(false);
      return;
    }

    if (!studentIdRegex.test(studentId)) {
      toast.error("Student ID must be like IT12345678");
      setLoading(false);
      return;
    }

    const emailPrefix = email.split("@")[0].toUpperCase();
    if (emailPrefix !== studentId) {
      toast.error("Student ID must match university email ID");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (phone && !phoneRegex.test(phone)) {
      toast.error("Phone number must be valid");
      setLoading(false);
      return;
    }

    try {
      const res = await registerUser({
        ...formData,
        name,
        email,
        studentId,
        phone,
        faculty,
      });

      toast.success(res.data.message || "Registration successful");

      setTimeout(() => {
        navigate("/verify-otp", {
          state: { email: res.data.email || email },
        });
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
    <div className="w-full max-w-xl">
      <div className="bg-white/95 rounded-[28px] border border-[#e5e7f2] shadow-[0_20px_60px_rgba(31,27,91,0.12)] px-8 md:px-10 py-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px flex-1 bg-[#dfe3ef]"></div>
          <span className="text-xs tracking-[0.2em] font-semibold text-[#5b57b8] uppercase">
            📝 Student Registration
          </span>
          <div className="h-px flex-1 bg-[#dfe3ef]"></div>
        </div>

        <div className="mb-6">
          <h2 className="text-4xl font-bold text-[#1f1b5b] leading-tight">
            Create Your Account
          </h2>
          <p className="mt-2 text-lg text-gray-500">
            Register with your university details
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold tracking-[0.16em] uppercase text-[#5b57b8] mb-2">
              Full Name
            </label>
            <div className="flex items-center h-14 rounded-2xl border border-[#dfe3ef] bg-[#fbfcff] px-5 shadow-sm">
              <span className="mr-4 text-lg text-gray-400">👤</span>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-base text-[#1f1b5b] placeholder:text-[#a7b0c7]"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Only letters and spaces are allowed
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold tracking-[0.16em] uppercase text-[#5b57b8] mb-2">
              University Email
            </label>
            <div className="flex items-center h-14 rounded-2xl border border-[#dfe3ef] bg-[#fbfcff] px-5 shadow-sm">
              <span className="mr-4 text-lg text-gray-400">✉️</span>
              <input
                type="email"
                name="email"
                placeholder="example@my.sliit.lk"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-base text-[#1f1b5b] placeholder:text-[#a7b0c7]"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Must be your university email address
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold tracking-[0.16em] uppercase text-[#5b57b8] mb-2">
              Student ID
            </label>
            <div className="flex items-center h-14 rounded-2xl border border-[#dfe3ef] bg-[#fbfcff] px-5 shadow-sm">
              <span className="mr-4 text-lg text-gray-400">🎓</span>
              <input
                type="text"
                name="studentId"
                placeholder="IT12345678"
                value={formData.studentId}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-base text-[#1f1b5b] placeholder:text-[#a7b0c7]"
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Must match the email ID before @
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold tracking-[0.16em] uppercase text-[#5b57b8] mb-2">
              Password
            </label>
            <div className="flex items-center h-14 rounded-2xl border border-[#dfe3ef] bg-[#fbfcff] px-5 shadow-sm">
              <span className="mr-4 text-lg text-gray-400">🔐</span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a secure password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent outline-none text-base text-[#1f1b5b] placeholder:text-[#a7b0c7]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-4 text-lg text-gray-500 hover:text-[#4f46e5]"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Minimum 6 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold tracking-[0.16em] uppercase text-[#5b57b8] mb-2">
                Phone Number
              </label>
              <div className="flex items-center h-14 rounded-2xl border border-[#dfe3ef] bg-[#fbfcff] px-5 shadow-sm">
                <span className="mr-4 text-lg text-gray-400">📱</span>
                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-base text-[#1f1b5b] placeholder:text-[#a7b0c7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold tracking-[0.16em] uppercase text-[#5b57b8] mb-2">
                Faculty
              </label>
              <div className="flex items-center h-14 rounded-2xl border border-[#dfe3ef] bg-[#fbfcff] px-5 shadow-sm">
                <span className="mr-4 text-lg text-gray-400">🏫</span>
                <input
                  type="text"
                  name="faculty"
                  placeholder="Enter faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  className="w-full bg-transparent outline-none text-base text-[#1f1b5b] placeholder:text-[#a7b0c7]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#4338ca] text-white text-xl font-semibold shadow-[0_12px_28px_rgba(79,70,229,0.28)] hover:opacity-95 transition disabled:opacity-70"
          >
            {loading ? "Registering..." : "Create Account →"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-base text-gray-500">
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
    </div>
  );
};

export default RegisterForm;