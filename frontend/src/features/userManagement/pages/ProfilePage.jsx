import React, { useEffect, useState } from "react";
import { getProfile } from "../../../api/userApi";
import ProfileCard from "../components/ProfileCard";
import Navbar from "../../homepage/components/Navbar";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await getProfile(token);
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 md:px-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[100px] -mr-[150px] -mt-[150px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-50 rounded-full blur-[100px] -ml-[100px] -mb-[100px] pointer-events-none"></div>
          
          <div className="max-w-[1500px] mx-auto relative z-10 w-full flex flex-col gap-6 animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-64 mb-4"></div>
            <div className="bg-white rounded-3xl p-6 border border-slate-100 h-32 w-full"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-slate-200 rounded w-32"></div>
              <div className="h-10 bg-slate-200 rounded w-32"></div>
              <div className="h-10 bg-slate-200 rounded w-32"></div>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-100 h-64 w-full"></div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 flex justify-center items-center pt-28 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-50 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-100 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="bg-white/80 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-white text-center max-w-sm relative z-10 w-full">
            <span className="text-5xl mb-4 block drop-shadow-md">🔒</span>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Access Denied</h2>
            <p className="text-slate-500 mb-8 font-medium">Please log in to view your profile dashboard.</p>
            <a href="/login" className="block w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:bg-indigo-700 hover:-translate-y-0.5 transition-all">
              Sign In Now
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 md:px-8 relative overflow-hidden font-epilogue">
        {/* Ambient Premium Background Shapes */}
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-blue-100/40 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-purple-100/30 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-[1500px] mx-auto relative z-10 w-full">
          <div className="mb-10 pl-2">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-md border border-white shadow-sm text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              USER DASHBOARD / PROFILE MANAGEMENT
            </span>
            <h1 className="text-[2.75rem] font-black text-slate-800 mt-5 tracking-[0.02em] font-clash">
              My Profile Dashboard
            </h1>
            <p className="text-slate-500 mt-2 font-medium text-[15px] max-w-2xl">
              View your personal details, trust score, activity, feedback, and
              marketplace history instantly in high resolution.
            </p>
          </div>

          <ProfileCard user={user} refreshUser={fetchUser} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;