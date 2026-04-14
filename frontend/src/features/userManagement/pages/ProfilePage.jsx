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
        <div className="min-h-screen bg-gradient-to-b from-[#2D1B69] to-[#0F0A2E] pt-32 pb-16 px-4 md:px-8 relative overflow-hidden">
          {/* Anti-Gravity Empty States */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[100px] -mr-[150px] -mt-[150px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00D9FF]/20 rounded-full blur-[100px] -ml-[100px] -mb-[100px] pointer-events-none"></div>
          
          <div className="max-w-[1500px] mx-auto relative z-10 w-full flex flex-col gap-6 animate-pulse">
            <div className="h-8 bg-white/10 rounded w-64 mb-4"></div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 h-32 w-full"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-white/10 rounded w-32"></div>
              <div className="h-10 bg-white/10 rounded w-32"></div>
              <div className="h-10 bg-white/10 rounded w-32"></div>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 h-64 w-full"></div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-[#2D1B69] to-[#0F0A2E] flex justify-center items-center pt-28 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(31,38,135,0.3)] border border-white/10 text-center max-w-sm relative z-10 w-full">
            <span className="text-5xl mb-4 block drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">🔒</span>
            <h2 className="text-2xl font-black text-white tracking-tight mb-2">Access Denied</h2>
            <p className="text-white/60 mb-8 font-medium">Please log in to view your secure dashboard.</p>
            <a href="/login" className="block w-full py-4 bg-gradient-to-r from-[#4A5FE8] to-[#8B5CF6] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:opacity-90 hover:-translate-y-0.5 transition-all">
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
      <div className="min-h-screen font-inter flex flex-col">
        
        {/* Deep Dark Header Section */}
        <div className="bg-[#0F0A2E] pt-32 pb-32 px-4 md:px-8 relative overflow-hidden border-b border-white/5">
           {/* Subtle Branding Glow */}
           <div className="absolute top-0 right-0 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] -mr-64 -mt-32 pointer-events-none"></div>

           <div className="max-w-[1500px] mx-auto relative z-10 w-full">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-sm text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse"></span>
                Secure Command Center
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-epilogue drop-shadow-sm">
                User Dashboard
              </h1>
              <p className="text-white/60 mt-3 font-medium text-sm md:text-base max-w-xl leading-relaxed">
                Manage your credentials, monitor trust rankings, and oversee your marketplace footprint within the UniVault ecosystem.
              </p>
            </div>
           </div>
        </div>

        {/* Pale Blue Content Section */}
        <div className="flex-1 bg-[#F0F9FF] -mt-20 pb-20 px-4 md:px-8 relative z-20">
          <div className="max-w-[1500px] mx-auto">
            <div className="relative">
              <ProfileCard user={user} refreshUser={fetchUser} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;