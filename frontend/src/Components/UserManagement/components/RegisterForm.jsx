import React, { useState } from "react";
import { registerUser } from "../api/userApi";

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

      alert(res.data.message || "Registration successful");

      console.log("Register success:", res.data);

      setFormData({
        name: "",
        email: "",
        studentId: "",
        password: "",
        phone: "",
        faculty: "",
      });
    } catch (error) {
      console.error("Register error:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.msg ||
        "Registration failed";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Register</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-4 outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-4 outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="text"
          name="studentId"
          placeholder="Student ID"
          value={formData.studentId}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-4 outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded mb-4 outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-4 outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="text"
          name="faculty"
          placeholder="Faculty"
          value={formData.faculty}
          onChange={handleChange}
          className="w-full p-3 border rounded mb-6 outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;