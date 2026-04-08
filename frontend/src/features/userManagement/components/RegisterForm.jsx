import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../api/userApi";
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

const Field = ({ label, hint, children }) => (
  <div>
    <label className="block text-xs font-bold text-slate-600 mb-2 tracking-wide">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-slate-400 font-medium mt-1.5">{hint}</p>}
  </div>
);

const Input = ({ icon, children, ...props }) => (
  <div className="flex items-center h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 gap-3 focus-within:border-[#4f46e5] focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(79,70,229,0.08)] transition-all">
    {icon && <span className="text-slate-400 shrink-0 w-4 h-4 flex items-center justify-center">{icon}</span>}
    {children}
  </div>
);

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", studentId: "", password: "", phone: "", faculty: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      setLoading(false); return;
    }
    if (!email.endsWith("@my.sliit.lk")) {
      toast.error("Email must be a SLIIT university email (@my.sliit.lk)");
      setLoading(false); return;
    }
    if (!studentIdRegex.test(studentId)) {
      toast.error("Student ID must be in format IT12345678");
      setLoading(false); return;
    }
    if (email.split("@")[0].toUpperCase() !== studentId) {
      toast.error("Student ID must match your email prefix");
      setLoading(false); return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false); return;
    }
    if (phone && !phoneRegex.test(phone)) {
      toast.error("Enter a valid Sri Lankan phone number");
      setLoading(false); return;
    }

    try {
      const res = await registerUser({ ...formData, name, email, studentId, phone, faculty });
      toast.success(res.data.message || "Registration successful");
      setTimeout(() => {
        navigate("/verify-otp", { state: { email: res.data.email || email } });
      }, 1000);
      setFormData({ name: "", email: "", studentId: "", password: "", phone: "", faculty: "" });
    } catch (error) {
      const message = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || "Registration failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "flex-1 bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-300 outline-none";

  return (
    <div className="w-full max-w-[460px]">
      <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(30,42,120,0.12)] border border-slate-100 px-10 py-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-400 font-medium mt-1">Register with your university details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <Field label="Full Name" hint="Only letters and spaces allowed">
            <Input icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
              <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required className={inputClass} />
            </Input>
          </Field>

          {/* University Email */}
          <Field label="University Email" hint="Must end with @my.sliit.lk">
            <Input icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}>
              <input type="email" name="email" placeholder="IT12345678@my.sliit.lk" value={formData.email} onChange={handleChange} required className={inputClass} />
            </Input>
          </Field>

          {/* Student ID */}
          <Field label="Student ID" hint="Must match your email prefix (e.g. IT12345678)">
            <Input icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>}>
              <input type="text" name="studentId" placeholder="IT12345678" value={formData.studentId} onChange={handleChange} required className={inputClass} />
            </Input>
          </Field>

          {/* Password */}
          <Field label="Password" hint="Minimum 6 characters">
            <Input icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}>
              <input type={showPassword ? "text" : "password"} name="password" placeholder="Create a secure password" value={formData.password} onChange={handleChange} required className={inputClass} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-[#4f46e5] transition-colors shrink-0">
                {showPassword ? <EyeOpen /> : <EyeClosed />}
              </button>
            </Input>
          </Field>

          {/* Phone + Faculty */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone Number">
              <Input icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}>
                <input type="text" name="phone" placeholder="07X XXXXXXX" value={formData.phone} onChange={handleChange} className={inputClass} />
              </Input>
            </Field>
            <Field label="Faculty">
              <Input icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>}>
                <input type="text" name="faculty" placeholder="e.g. FOC" value={formData.faculty} onChange={handleChange} className={inputClass} />
              </Input>
            </Field>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#3b46c8] hover:bg-[#2f3baa] text-white text-sm font-black uppercase tracking-widest shadow-[0_4px_18px_rgba(59,70,200,0.35)] hover:shadow-[0_6px_24px_rgba(59,70,200,0.45)] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0 mt-2"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-400 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-[#4f46e5] font-bold hover:underline">Sign In</Link>
        </p>
        <p className="mt-1.5 text-center">
          <Link to="/verify-otp" className="text-xs text-slate-400 font-medium hover:text-[#4f46e5] transition-colors">
            Need to verify your email? Verify here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;