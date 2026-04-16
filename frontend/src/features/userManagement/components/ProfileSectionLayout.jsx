import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../homepage/components/Navbar";

const ProfileSectionLayout = ({ title, description, children }) => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-inter flex flex-col ag-bg-gradient">
        
        {/* Anti-Gravity Header */}
        <div className="bg-[#0F0A2E] pt-24 pb-16 px-4 md:px-8 relative overflow-hidden border-b border-white/5 shadow-2xl">
           {/* Glow Accent */}
           <div className="absolute top-0 right-0 w-[400px] h-[200px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
           
           <div className="max-w-[1200px] mx-auto relative z-10 w-full">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="ag-fade-in">
                  <h1 className="text-3xl font-black text-white tracking-tight font-epilogue drop-shadow-sm">{title}</h1>
                  <p className="text-white/50 mt-1.5 text-sm font-medium max-w-lg leading-relaxed">{description}</p>
                </div>

                <button
                  onClick={() => navigate("/profile")}
                  className="w-fit flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-[0.15em] hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-md shadow-lg ag-hover-lift"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Profile Hub
                </button>
              </div>
           </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 pb-16 px-4 md:px-8 relative z-20">
          <div className="max-w-[1200px] mx-auto -mt-8">
            <div className="ag-card p-6 md:p-10 bg-white ring-1 ring-black/[0.02] shadow-2xl shadow-indigo-900/5 min-h-[500px]">
              <div className="ag-fade-in" style={{ animationDelay: '0.1s' }}>
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSectionLayout;