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
        <div className="min-h-screen font-inter flex flex-col ag-bg-gradient">
          {/* Skeleton Header */}
          <div className="bg-[#0F0A2E] pt-28 pb-20 px-4 md:px-8 relative overflow-hidden border-b border-white/5 shadow-2xl animate-pulse">
             <div className="absolute top-0 right-0 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] -mr-64 -mt-32 pointer-events-none"></div>
             <div className="max-w-[1500px] mx-auto relative z-10 w-full">
                <div className="w-40 h-10 bg-white/10 rounded-xl mb-6"></div>
                <div className="w-64 h-12 bg-white/10 rounded-2xl mb-4"></div>
                <div className="w-96 h-6 bg-white/5 rounded-lg max-w-full"></div>
             </div>
          </div>

          {/* Skeleton Content */}
          <div className="flex-1 pb-20 px-4 md:px-8 relative z-20">
            <div className="max-w-[1500px] mx-auto -mt-10 animate-pulse">
               <div className="ag-card p-10 h-[600px] bg-white opacity-60">
                  <div className="flex gap-10 mb-12">
                     <div className="w-32 h-32 rounded-3xl bg-slate-100"></div>
                     <div className="flex-1 space-y-4 pt-4">
                        <div className="h-8 bg-slate-100 rounded-lg w-1/3"></div>
                        <div className="h-4 bg-slate-100 rounded-lg w-1/4"></div>
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <div className="h-40 bg-slate-50/50 rounded-3xl border border-slate-100"></div>
                     <div className="h-40 bg-slate-50/50 rounded-3xl border border-slate-100"></div>
                     <div className="h-40 bg-slate-50/50 rounded-3xl border border-slate-100"></div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen font-inter flex flex-col ag-bg-gradient">
          <div className="flex-1 flex justify-center items-center px-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00D9FF]/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="ag-card p-12 text-center max-w-sm relative z-10 w-full bg-white/40 backdrop-blur-3xl border-white ag-fade-in shadow-2xl shadow-indigo-900/5">
              <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-4xl mb-8 mx-auto ag-glow-indigo">🔒</div>
              <h2 className="text-3xl font-black text-[#1f1b5b] tracking-tight mb-3 font-epilogue">Restricted Access</h2>
              <p className="text-slate-500 mb-10 font-medium leading-relaxed">Please authenticate with your university credentials to access the operational dashboard.</p>
              <a href="/login" className="block w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-slate-800 hover:-translate-y-1 transition-all">
                Sign In Now
              </a>
            </div>
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
        <div className="bg-[#0F0A2E] pt-28 pb-20 px-4 md:px-8 relative overflow-hidden border-b border-white/5">
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

        {/* Anti-Gravity Content Section */}
        <div className="flex-1 ag-bg-gradient pb-20 px-4 md:px-8 relative z-20">
          <div className="max-w-[1500px] mx-auto -mt-10">
            <div className="relative ag-fade-in" style={{ animationDelay: '0.2s' }}>
              <ProfileCard user={user} refreshUser={fetchUser} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;