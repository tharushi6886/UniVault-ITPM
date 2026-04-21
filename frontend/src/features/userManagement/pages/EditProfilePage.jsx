import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../../api/userApi";
import { useNavigate } from "react-router-dom";
import Navbar from "../../homepage/components/Navbar";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import ProfileSectionLayout from "../components/ProfileSectionLayout";

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

    if (formData.phone && !/^(?:\+94|0)?7[0-9]{8}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid Sri Lankan phone number (e.g. 07XXXXXXXX or +947XXXXXXXX).";
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
    <ProfileSectionLayout
      title="Vault Identity Editor"
      description="Update your UniVault student profile to ensure your listings and reports are accurately synchronized across the campus network."
    >
      <div className="max-w-2xl mx-auto w-full">
        {/* Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2rem] shadow-[0_30px_70px_rgba(74,95,232,0.12)] border border-slate-100 overflow-hidden relative z-10"
        >
          {/* Card Header Section */}
          <div className="p-8 pb-4 border-b border-slate-50">
             <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-sm border border-indigo-100/50">
                  🖊️
                </div>
                <div>
                   <h2 className="text-xl font-black text-slate-800 tracking-tight font-epilogue">Profile Identification</h2>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Edit Personal Records</p>
                </div>
             </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-8 pt-6 space-y-6" noValidate>
            {fields.map(({ key, label, type, placeholder, icon }) => (
              <div key={key}>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2.5 ml-1">
                  {label}
                </label>
                <div className={`relative flex items-center h-[52px] rounded-2xl border px-4 gap-3 transition-all duration-300 ${
                  errors[key]
                    ? "border-rose-200 bg-rose-50/30"
                    : "border-slate-100 bg-slate-50/50 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                }`}>
                  <span className={`shrink-0 transition-colors w-5 h-5 flex items-center justify-center ${errors[key] ? "text-rose-400" : "text-indigo-500/70"}`}>
                    {icon}
                  </span>
                  {key === "faculty" ? (
                    <select
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="flex-1 bg-transparent text-[14px] font-semibold text-slate-700 focus:outline-none h-full appearance-none cursor-pointer"
                    >
                      <option value="" disabled hidden>Select Faculty</option>
                      <option value="Faculty of Computing">Faculty of Computing</option>
                      <option value="SLIIT Business School">SLIIT Business School</option>
                      <option value="Faculty of Engineering">Faculty of Engineering</option>
                      <option value="School of Architecture">School of Architecture</option>
                      <option value="Faculty of Humanities & Sciences">Faculty of Humanities & Sciences</option>
                    </select>
                  ) : (
                    <input
                      type={type}
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="flex-1 bg-transparent text-[14px] font-semibold text-slate-700 placeholder-slate-300 focus:outline-none h-full"
                    />
                  )}
                  {formData[key] && !errors[key] && (
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors[key] && (
                  <p className="mt-2 text-[11px] font-bold text-rose-500 flex items-center gap-1.5 ml-1">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors[key]}
                  </p>
                )}
              </div>
            ))}

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="flex-1 h-[52px] rounded-2xl bg-white border border-slate-100 text-slate-400 font-bold text-[11px] uppercase tracking-[0.15em] hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center justify-center uppercase"
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`flex-1 h-[52px] rounded-2xl bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {submitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Syncing...
                  </>
                ) : (
                  "Save Vault Records →"
                )}
              </button>
            </div>

            {/* Footer Tip */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mt-2">
               <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                Security Note: Sensitive identifiers like student ID and email are permanently locked to your vault core.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </ProfileSectionLayout>
  );
};

export default EditProfilePage;