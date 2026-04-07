import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadAvatar } from "../../../api/userApi";
import { toast } from "react-toastify";

const InfoCard = ({ title, value, editable, onClick, icon }) => {
  const CardWrapper = editable ? "button" : "div";
  return (
    <CardWrapper
      type={editable ? "button" : undefined}
      onClick={editable ? onClick : undefined}
      className={`group relative flex items-center gap-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm transition-all duration-300 w-full text-left font-epilogue ${
        editable ? "cursor-pointer hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1 active:scale-95" : ""
      }`}
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 transition-colors ${editable ? "group-hover:bg-indigo-500 group-hover:text-white" : ""}`}>
        {icon || "📄"}
      </div>
      <div className="flex-1">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-slate-700 truncate">{value || "N/A"}</p>
          {editable && (
            <span className="text-indigo-400 opacity-40 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};

const ActivityCard = ({ icon, title, count, note, bgColor, iconColor, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-6 bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-left w-full h-[180px] font-epilogue`}
  >
    <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full opacity-5 transition-transform duration-700 group-hover:scale-150 ${bgColor}`}></div>
    
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl text-2xl shadow-inner transition-transform group-hover:scale-110 duration-500 ${bgColor} ${iconColor}`}>
          {icon}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{count}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
        </div>
      </div>
      <h3 className="text-lg font-extrabold text-slate-700 leading-tight mb-1">{title}</h3>
      <p className="text-sm text-slate-400 font-medium">{note}</p>
    </div>

    <div className="flex items-center gap-2 mt-4 text-xs font-bold text-indigo-500 group-hover:gap-3 transition-all">
      Open Details
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </div>
  </button>
);

const ProfileCard = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [uploading, setUploading] = useState(false);

  const tabs = ["Overview", "Activity", "Trust & Reputation", "Feedback"];

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      await uploadAvatar(token, formData);
      toast.success("Profile picture updated!");
      if (refreshUser) refreshUser();
    } catch (error) {
      toast.error("Failed to upload info");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-fade-in font-epilogue max-w-[1250px] mx-auto px-4 md:px-0">
      
      {/* Premium Header Card */}
      <div className="relative group bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(79,70,229,0.08)] p-8 border border-white/50 backdrop-blur-xl mb-12 flex flex-col lg:flex-row items-center justify-between gap-8 transition-all hover:shadow-[0_30px_70px_rgba(79,70,229,0.12)]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent rounded-[2.5rem] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
          {/* Avatar Area */}
          <label className={`relative group/avatar cursor-pointer w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-2xl overflow-hidden ring-8 ring-indigo-50 transition-all duration-500 hover:rotate-6 hover:scale-105 ${uploading ? "opacity-50" : ""}`}>
            {user.profileImage ? (
              <img 
                src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`} 
                alt={user.name} 
                className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110"
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-5xl font-black text-white italic drop-shadow-md">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300">
               <svg className={`w-8 h-8 text-white ${uploading ? "animate-spin" : "animate-bounce"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {uploading ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />}
               </svg>
            </div>
            {!uploading && <input type="file" onChange={handleAvatarChange} accept="image/*" className="hidden" />}
          </label>

          {/* User Meta */}
          <div className="flex flex-col gap-3">
            <div>
               <h1 className="text-4xl font-black text-slate-800 tracking-tight">{user.name}</h1>
               <div className="flex items-center gap-2 justify-center md:justify-start text-indigo-600 mt-1 font-bold">
                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L8 14v1c0 1.1.9 2 2 2v2.93zM18 17c-1.1 0-2-.9-2-2v-1l-5-5V7c0-1.1.9-2 2-2h1V3.07c3.95.49 7 3.85 7 7.93 0 .62-.08 1.21-.21 1.79L18 17z"/></svg>
                 <span className="text-sm tracking-wide">{user.email}</span>
               </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-5 py-2 rounded-2xl text-[10px] uppercase font-black tracking-[0.2em] bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                System ROLE: {user.role}
              </span>
              <span className={`px-5 py-2 rounded-2xl text-[10px] uppercase font-black tracking-[0.2em] border shadow-sm ${
                user.status === "active" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-rose-50 text-rose-600 border-rose-100"
              }`}>
                {user.status} account
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <button
          onClick={() => navigate("/profile/edit")}
          className="relative z-10 group bg-indigo-600 text-white px-10 py-4 rounded-3xl font-black text-sm uppercase tracking-widest shadow-[0_15px_30px_rgba(79,70,229,0.25)] hover:bg-indigo-700 hover:-translate-y-1.5 active:translate-y-0 transition-all duration-300 w-full lg:w-auto overflow-hidden"
        >
          <span className="relative z-10">Edit My Profile →</span>
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex bg-slate-100/50 p-2 rounded-[2rem] gap-2 mb-12 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-8 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all duration-300 ${
              activeTab === tab
                ? "bg-white text-indigo-600 shadow-lg scale-100"
                : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Section with Limit Viewport */}
      <div className="max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* OVERVIEW TAB */}
        {activeTab === "Overview" && (
          <div className="pt-2 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-8">
               <div className="h-10 w-2 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
               <h2 className="text-2xl font-black text-slate-800 tracking-tight">Main account Overview</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoCard 
                title="Legal Identity" 
                value={user.name} 
                editable 
                onClick={() => navigate("/profile/edit")}
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
              />
              <InfoCard 
                title="Primary Contact" 
                value={user.email} 
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>}
              />
              <InfoCard 
                title="Enrollment ID" 
                value={user.studentId} 
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>}
              />
              <InfoCard 
                title="Mobile Link" 
                value={user.phone || "Not Linked"} 
                editable 
                onClick={() => navigate("/profile/edit")}
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
              />
              <InfoCard 
                title="Campus Faculty" 
                value={user.faculty || "N/A"} 
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>}
              />
              <InfoCard 
                title="Availability Status" 
                value={user.status} 
                icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "Activity" && (
          <div className="pt-2 animate-fade-in-up">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ActivityCard icon="🛒" title="Commerce Ledger" count={user.stats?.buySellHistory ?? 0} note="Successful trades & deals" bgColor="bg-indigo-50" iconColor="text-indigo-500" onClick={() => navigate("/profile/buy-sell-history")} />
              <ActivityCard icon="📦" title="Active Postings" count={user.stats?.itemsPosted ?? 0} note="Items listed in marketplace" bgColor="bg-blue-50" iconColor="text-blue-500" onClick={() => navigate("/profile/items-posted")} />
              <ActivityCard icon="💰" title="Sales Completed" count={user.stats?.itemsSold ?? 0} note="Successfully closed listings" bgColor="bg-violet-50" iconColor="text-violet-500" onClick={() => navigate("/profile/items-sold")} />
              <ActivityCard icon="🤝" title="Returns Made" count={user.stats?.foundReturned ?? 0} note="Found items resolved" bgColor="bg-sky-50" iconColor="text-sky-500" onClick={() => navigate("/profile/found-returned")} />
              <ActivityCard icon="🔍" title="Lost Reports" count={user.stats?.lostReports ?? 0} note="Personal missing items" bgColor="bg-amber-50" iconColor="text-amber-500" onClick={() => navigate("/profile/lost-reports")} />
              <ActivityCard icon="🎯" title="Bid Activity" count={user.stats?.myBids ?? 0} note="Ongoing marketplace bids" bgColor="bg-rose-50" iconColor="text-rose-500" onClick={() => navigate("/profile/my-bids")} />
            </div>
          </div>
        )}

        {/* TRUST & REPUTATION TAB */}
        {activeTab === "Trust & Reputation" && (
          <div className="pt-2 animate-fade-in-up max-w-4xl">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-50 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
               
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 relative z-10">
                  <div>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight">Trust Magnitude</h3>
                    <p className="text-sm font-medium text-slate-400 mt-1">Calculated based on community interaction</p>
                  </div>
                  <div className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl ${
                    (user.stats?.trust?.score || 0) >= 80 ? "bg-indigo-500 text-white shadow-indigo-200" : 
                    (user.stats?.trust?.score || 0) >= 40 ? "bg-amber-500 text-white shadow-amber-200" : "bg-rose-500 text-white shadow-rose-200"
                  }`}>
                    {user.stats?.trust?.level || "Unranked"} Standing
                  </div>
               </div>

               {/* PROGRESS Visual */}
               <div className="mb-14 relative z-10">
                  <div className="flex justify-between items-end mb-5">
                    <div className="flex items-baseline gap-2">
                       <span className="text-6xl font-black text-indigo-600 tracking-tighter leading-none">{user.stats?.trust?.score || 0}</span>
                       <span className="text-xl font-bold text-slate-300 uppercase tracking-widest">Score</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Target: 80+ FOR SUPREME STATUS</span>
                  </div>
                  
                  <div className="h-6 w-full bg-slate-50 rounded-full overflow-hidden p-1.5 shadow-inner">
                    <div 
                      className={`h-full rounded-full transition-all duration-[1.5s] ease-out relative group/bar ${
                        (user.stats?.trust?.score || 0) >= 80 ? "bg-gradient-to-r from-indigo-400 to-indigo-600 shadow-[0_0_25px_rgba(79,70,229,0.5)]" : 
                        (user.stats?.trust?.score || 0) >= 40 ? "bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_0_25px_rgba(245,158,11,0.5)]" : 
                        "bg-gradient-to-r from-rose-400 to-rose-600 shadow-[0_0_25px_rgba(244,63,94,0.5)]"
                      }`}
                      style={{ width: `${user.stats?.trust?.score || 0}%` }}
                    >
                       <div className="absolute top-0 right-0 h-full w-4 bg-white/20 skew-x-[-20deg]"></div>
                    </div>
                  </div>
               </div>

               {/* BREAKDOWN SCALES */}
               <div className="relative z-10">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-indigo-500/30"></span>
                    Detailed Breakdown
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(user.stats?.trust?.breakdown || []).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 transition-all hover:bg-white hover:shadow-xl border border-transparent hover:border-slate-100 group">
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{item.name}</span>
                           <span className="text-lg font-black text-slate-700 tracking-tight">Magnification</span>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className={`text-xl font-black ${item.earned > 0 ? "text-indigo-600" : "text-slate-300"}`}>
                             +{item.earned}
                           </span>
                           <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">OUT OF {item.max}</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               {/* AI Feedback Summary */}
               <div className="mt-12 p-8 rounded-[2rem] bg-indigo-600 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
                  <h5 className="text-[10px] uppercase font-black tracking-[0.3em] mb-3 opacity-60">Insight Analysis</h5>
                  <p className="text-lg font-bold leading-relaxed italic pr-12">
                     " {user.stats?.trust?.feedback || "Your data footprint is growing. Continue high-integrity participation to unlock supreme community privileges."} "
                  </p>
               </div>
            </div>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === "Feedback" && (
          <div className="pt-2 animate-fade-in-up">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Community Testimonials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: "Acquisition Feedback", val: user.trust?.buyerFeedback, icon: "👤" },
                { label: "Vendor Reputation", val: user.trust?.sellerFeedback, icon: "🏷️" },
                { label: "Recovery Integrity", val: user.trust?.recoveryTrust, icon: "🤝" },
                { label: "Global Presence", val: user.trust?.communityScore, icon: "💎" }
              ].map((fb, i) => (
                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{fb.icon}</div>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{fb.label}</span>
                   </div>
                   <p className="text-xl font-bold text-slate-700 leading-tight italic">
                     "{fb.val || "No data yet"}"
                   </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
};

export default ProfileCard;