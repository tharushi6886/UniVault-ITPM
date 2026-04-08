import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../../api/userApi";
import { useNavigate } from "react-router-dom";
import Navbar from "../../homepage/components/Navbar";
import { toast } from "react-toastify";

const EditProfilePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    faculty: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setLoading(false); return; }
        const res = await getProfile(token);
        setFormData({
          name: res.data.name || "",
          phone: res.data.phone || "",
          faculty: res.data.faculty || "",
        });
      } catch (error) {
        toast.error("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // ─── VALIDATION ────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name.trim())) {
      newErrors.name = "Name can only contain letters, spaces, hyphens, or apostrophes.";
    }

    if (formData.phone && !/^\+?[0-9\s\-()]{7,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid phone number (7–15 digits).";
    }

    if (formData.faculty && formData.faculty.trim().length < 2) {
      newErrors.faculty = "Faculty name must be at least 2 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before saving.");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await updateProfile(token, formData);
      // Sync updated name into localStorage so Navbar refreshes
      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...existingUser, ...res.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("profile-updated"));
      toast.success("Vault identity synchronized!");
      navigate("/profile");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── FIELD META ─────────────────────────────────────────────
  const fields = [
    {
      key: "name",
      label: "Full Name",
      type: "text",
      placeholder: "e.g. Hasindu Kavinda",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      key: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "e.g. +94 71 234 5678",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      key: "faculty",
      label: "Faculty",
      type: "text",
      placeholder: "e.g. Faculty of Computing",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#f3f0ff] to-[#eef6ff] pt-28">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm">Loading Vault Data...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f3f0ff] via-[#f8f9ff] to-[#eef6ff] pt-28 pb-16 px-4">
        
        {/* Background decorations */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: "radial-gradient(ellipse 600px 400px at 10% 10%, rgba(79,70,229,0.06) 0%, transparent 60%), radial-gradient(ellipse 600px 400px at 90% 90%, rgba(99,102,241,0.06) 0%, transparent 60%)"
        }} />

        <div className="relative z-10 max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all text-slate-500 hover:text-indigo-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">Vault Identity Editor</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Modify Your UniVault Profile</p>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_rgba(79,70,229,0.1)] border border-white/80 overflow-hidden">
            
            {/* Card Header Banner */}
            <div className="relative bg-gradient-to-br from-indigo-500 to-indigo-700 p-10 overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-2xl mb-4 backdrop-blur-sm">
                  🖊️
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Edit Profile</h2>
                <p className="text-indigo-200 text-sm font-medium mt-1">Changes are synced system-wide instantly.</p>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-10 space-y-7" noValidate>

              {fields.map(({ key, label, type, placeholder, icon }) => (
                <div key={key}>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5">
                    {label}
                  </label>
                  <div className={`flex items-center gap-4 bg-slate-50 rounded-2xl px-5 py-4 border-2 transition-all duration-300 ${
                    errors[key]
                      ? "border-rose-300 bg-rose-50"
                      : "border-transparent focus-within:border-indigo-300 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.08)]"
                  }`}>
                    <span className={`shrink-0 transition-colors ${errors[key] ? "text-rose-400" : "text-slate-300 group-focus-within:text-indigo-500"}`}>
                      {icon}
                    </span>
                    <input
                      type={type}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="flex-1 bg-transparent text-sm font-bold text-slate-700 placeholder-slate-300 focus:outline-none"
                    />
                    {formData[key] && !errors[key] && (
                      <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {errors[key] && (
                      <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  {errors[key] && (
                    <p className="mt-2 text-xs font-bold text-rose-500 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}

              {/* Divider */}
              <div className="border-t border-slate-100 pt-4" />

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Syncing...
                    </>
                  ) : (
                    "Save Changes →"
                  )}
                </button>
              </div>

              {/* Info note */}
              <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                Your email and Student ID cannot be changed
              </p>

            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfilePage;