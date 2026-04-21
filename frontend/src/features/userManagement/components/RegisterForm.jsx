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

const Field = ({ hint, success, children }) => (
  <div>
    {children}
    {hint && <p className={`text-[10px] font-medium mt-1.5 ml-1 tracking-wide ${success ? 'text-[#27AE60]' : 'text-slate-400'}`}>{hint}</p>}
  </div>
);

const Input = ({ icon, label, action, children }) => (
  <div className="relative flex items-center h-[48px] rounded-[10px] border border-[#E2E8F0] bg-[#F7F8FC] px-4 gap-3 focus-within:border-[#4A5FE8] focus-within:bg-white focus-within:shadow-[0_0_0_2px_rgba(74,95,232,0.2)] transition-all">
    {icon && <span className="text-[#4A5FE8] shrink-0 w-4 h-4 flex items-center justify-center">{icon}</span>}
    <div className="relative flex-1 h-full flex flex-col justify-center pt-2">
      {children}
      <label className="absolute left-0 top-0 text-[10px] sm:text-xs text-slate-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-[50%] peer-placeholder-shown:-translate-y-1/2 peer-focus:top-0 peer-focus:text-[10px] peer-focus:text-[#3B4ED8] pointer-events-none">{label}</label>
    </div>
    {action}
  </div>
);

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "", email: "", studentId: "", password: "", phone: "", faculty: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEmailValid = formData.email.trim().toLowerCase().endsWith('@my.sliit.lk');
  const studentIdRegex = /^IT\d{8}$/;
  const isStudentIdValid = studentIdRegex.test(formData.studentId.trim().toUpperCase()) && 
                           formData.email.trim().split("@")[0].toUpperCase() === formData.studentId.trim().toUpperCase();

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

  const inputClass = "peer w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder-transparent";

  return (
    <div className="w-full max-w-[420px] relative z-10">
      <div className="bg-white rounded-[32px] shadow-[0_32px_80px_rgba(30,58,138,0.12)] border border-white px-8 md:px-10 py-10 md:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-[32px] font-black text-slate-900 tracking-tight leading-none mb-3 font-clash">
            Join the Vault
          </h2>
          <p className="text-[15px] text-slate-500 font-medium leading-relaxed">Create your secure student account in seconds.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <Field hint="Only letters and spaces allowed">
            <Input label="Full Name" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
              <input type="text" name="name" placeholder=" " value={formData.name} onChange={handleChange} required className={inputClass} />
            </Input>
          </Field>

          {/* University Email */}
          <Field hint="Must end with @my.sliit.lk" success={isEmailValid}>
            <Input label="University Email" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}>
              <input type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} required className={inputClass} />
            </Input>
          </Field>

          {/* Student ID */}
          <Field hint="Must match your email prefix (e.g. IT12345678)" success={isStudentIdValid}>
            <Input label="Student ID" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>}>
              <input type="text" name="studentId" placeholder=" " value={formData.studentId} onChange={handleChange} required className={inputClass} />
            </Input>
          </Field>

          {/* Password */}
          <Field hint="Minimum 6 characters">
            <Input label="Password" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} action={
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 hover:text-[#4f46e5] transition-colors shrink-0 z-10">
                {showPassword ? <EyeOpen /> : <EyeClosed />}
              </button>
            }>
              <input type={showPassword ? "text" : "password"} name="password" placeholder=" " value={formData.password} onChange={handleChange} required className={inputClass} />
            </Input>
          </Field>

          {/* Phone + Faculty */}
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <Input label="Phone Number" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}>
                <input type="text" name="phone" placeholder=" " value={formData.phone} onChange={handleChange} className={inputClass} />
              </Input>
            </Field>
            <Field>
              <Input label="Faculty" icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>}>
                <select 
                  name="faculty" 
                  value={formData.faculty} 
                  onChange={handleChange} 
                  required 
                  className={`${inputClass} appearance-none cursor-pointer`}
                >
                  <option value="" disabled hidden></option>
                  <option value="Faculty of Computing">Faculty of Computing</option>
                  <option value="SLIIT Business School">SLIIT Business School</option>
                  <option value="Faculty of Engineering">Faculty of Engineering</option>
                  <option value="School of Architecture">School of Architecture</option>
                  <option value="Faculty of Humanities & Sciences">Faculty of Humanities & Sciences</option>
                </select>
              </Input>
            </Field>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[54px] rounded-2xl bg-gradient-to-r from-[#4A8EF0] to-[#8B5CF6] hover:shadow-[0_8px_25px_rgba(74,95,232,0.35)] text-white text-[14px] font-black uppercase tracking-widest hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-60 disabled:translate-y-0 mt-6 font-epilogue"
          >
            {loading ? "Initializing..." : "Register Now →"}
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