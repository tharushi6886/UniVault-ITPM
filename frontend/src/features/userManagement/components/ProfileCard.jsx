import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadAvatar } from "../../../api/userApi";
import { getMyMarketplaceItems, getMyLostItems, getMyFoundItems, updateMarketplaceItem, updateLostItem, updateFoundItem } from "../../../api/itemApi";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import ReviewSection from "./ReviewSection";

const InfoCard = ({ title, value, editable, onClick, icon }) => {
  const CardWrapper = editable ? "button" : "div";
  return (
    <CardWrapper
      type={editable ? "button" : undefined}
      onClick={editable ? onClick : undefined}
      className={`group relative flex items-center gap-4 ag-card-secondary p-5 transition-all duration-300 w-full text-left font-inter ${
        editable ? "cursor-pointer hover:border-indigo-200 hover:shadow-md ag-hover-lift active:scale-95" : ""
      }`}
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl bg-white text-slate-400 border border-slate-100 shadow-sm transition-colors ${editable ? "group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100" : ""}`}>
        {icon || "📄"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-slate-800 truncate">{value || "Not Set"}</p>
          {editable && (
            <span className="text-indigo-400 opacity-20 group-hover:opacity-100 transition-opacity">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};

const TrustGauge = ({ score, status, onInfoClick }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  
  const getColor = (s) => {
    if (s >= 80) return "#EAB308"; // Elite (Gold)
    if (s >= 65) return "#3B82F6"; // Trusted (Blue)
    if (s >= 40) return "#F59E0B"; // Standard (Amber)
    return "#F43F5E"; // Improving (Red)
  };

  const getTierIcon = (s) => {
    if (s >= 80) return "⚜️";
    if (s >= 65) return "🛡️";
    if (s >= 40) return "🔰";
    return "🌱";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`relative flex items-center justify-center w-28 h-28 ${score >= 80 ? 'animate-pulse-glow rounded-full' : ''}`}>
        <svg className="w-full h-full -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="transparent" stroke="#F1F5F9" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="42" fill="transparent"
            stroke={getColor(score)}
            strokeWidth="8"
            strokeDasharray="264"
            strokeDashoffset={264 - (264 * score) / 100}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out fill-none dash-glow"
            style={{ filter: `drop-shadow(0 0 4px ${getColor(score)}80)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-black text-slate-800 leading-none font-epilogue">{score}</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mt-1">{status}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <button 
          onClick={onInfoClick}
          className="group/info flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover/info:text-indigo-600">Protocol Status</span>
          <svg className="w-3.5 h-3.5 text-slate-300 group-hover/info:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const MilestoneIndicator = ({ score }) => {
  const milestones = [
    { label: "Improving", min: 0, icon: "🌱" },
    { label: "Standard", min: 40, icon: "🔰" },
    { label: "Trusted", min: 65, icon: "🛡️" },
    { label: "Elite", min: 80, icon: "⚜️" }
  ];

  return (
    <div className="w-full py-8">
      <div className="relative h-2 bg-slate-100 rounded-full mb-6">
        {/* Progress Fill */}
        <div 
          className="absolute h-full bg-gradient-to-r from-rose-500 via-amber-500 via-blue-500 to-yellow-500 rounded-full transition-all duration-1000 shadow-sm"
          style={{ width: `${score}%` }}
        />
        
        {/* Indicators */}
        {milestones.map((m, i) => (
          <div 
            key={i} 
            className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
            style={{ left: `${m.min}%` }}
          >
             <div className={`w-3 h-3 rounded-full border-2 ${score >= m.min ? 'bg-white border-slate-900' : 'bg-slate-200 border-white'} ring-2 ring-white z-10`} />
             <div className="mt-4 flex flex-col items-center gap-1">
                <span className="text-[14px]">{m.icon}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${score >= m.min ? 'text-slate-900' : 'text-slate-300'}`}>
                  {m.label}
                </span>
                <span className="text-[9px] font-bold text-slate-400">{m.min}+</span>
             </div>
          </div>
        ))}

        {/* User Pointer */}
        <div 
          className="absolute -top-3 transition-all duration-1000"
          style={{ left: `${score}%` }}
        >
           <div className="px-2 py-1 bg-slate-900 text-white text-[9px] font-black rounded-lg -translate-x-1/2 shadow-xl whitespace-nowrap mb-6 flex flex-col items-center relative animate-bounce-subtle">
              YOU ARE HERE
              <div className="w-2 h-2 bg-slate-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
           </div>
        </div>
      </div>
    </div>
  );
};

const ActivityCard = ({ icon, title, count, note, bgColor, iconColor, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="group relative flex items-center gap-6 bg-white rounded-[1.8rem] p-7 border border-slate-100 shadow-sm shadow-indigo-900/5 transition-all duration-300 text-left w-full font-inter ag-hover-lift"
  >
    <div className={`w-16 h-16 flex items-center justify-center rounded-2xl text-2xl shrink-0 ${bgColor} ${iconColor} border border-white/50 shadow-inner group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-1">Total {title}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-[#1f1b5b] leading-none">{count}</span>
        <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">+ Records</span>
      </div>
    </div>
    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-sm">
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
    </div>
  </button>
);

const ReputationTimeline = ({ history }) => (
  <div className="ag-card p-8 h-full flex flex-col bg-white">
    <div className="flex items-center gap-4 mb-10">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100 text-lg shadow-sm">📈</div>
      <div>
        <h3 className="text-xl font-black tracking-tight text-[#1f1b5b] font-epilogue leading-none">Intelligence Timeline</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">Historical Activity</p>
      </div>
    </div>

    {(!history || history.length === 0) ? (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 opacity-30">
        <div className="text-4xl mb-3">🕯️</div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">No History Logged Yet</p>
      </div>
    ) : (
      <ul className="flex-1 space-y-6 relative before:absolute before:inset-0 before:left-3 before:h-full before:w-px before:bg-slate-100 before:z-0 list-none">
        {history.slice().reverse().map((entry, i) => (
          <li key={i} className="relative z-10 pl-10 group/item">
            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-indigo-100 flex items-center justify-center group-hover/item:border-indigo-500 transition-colors shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            </div>
            <div className="ag-card-secondary p-4 hover:bg-white hover:border-indigo-100 transition-all">
              <div className="flex justify-between items-start mb-1">
                <span className="text-[12px] font-black text-[#1f1b5b] tracking-tight leading-none">{entry.event}</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${entry.points >= 65 ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'} shadow-sm`}>
                   {entry.points} Pts
                </span>
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    )}
    
    <div className="mt-8 pt-6 border-t border-slate-50">
       <div className="p-4 rounded-2xl bg-slate-50/80 text-[10px] font-bold text-slate-400 leading-relaxed italic border border-slate-100">
          💡 Every verified action on UniVault updates your global integrity record.
       </div>
    </div>
  </div>
);

const DashboardSection = ({ title, items, badgeColor, onViewAll, onEdit, onResolve, userTrust }) => (
  <div className="mb-14 last:mb-0 animate-fade-in font-inter">
    <div className="flex items-center justify-between mb-8 px-2">
      <div className="flex items-center gap-4">
        <div className={`w-1.5 h-8 rounded-full ${badgeColor}`}></div>
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none mb-1 font-epilogue">{title}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Inventory: {items.length}</p>
        </div>
      </div>
      <button 
        onClick={onViewAll}
        className="group flex items-center gap-2 text-[11px] font-black text-indigo-600 hover:text-slate-900 transition-all uppercase tracking-widest"
      >
        View Complete Vault
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </button>
    </div>
    
    {items.length === 0 ? (
      <div className="bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center shadow-inner">
        <div className="text-5xl mb-4 opacity-10 font-black text-[#1f1b5b] uppercase italic tracking-[0.2em]">#EMPTY</div>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">No active decentralized records found in your vault.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.slice(0, 3).map((item, idx) => (
          <div key={item._id || idx} className="group relative ag-card p-6 overflow-hidden ag-hover-lift">
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl text-2xl transition-all duration-500 group-hover:scale-110 shadow-inner border border-white/50 overflow-hidden ${
                   item.item_id ? "bg-indigo-50 text-indigo-500" : item.status === "active" ? "bg-amber-50 text-amber-500" : "bg-sky-50 text-sky-500"
                }`}>
                  {(item.imageUrl || item.image || (item.images && item.images[0])) ? (
                    <img 
                      src={(item.imageUrl || item.image || item.images[0]).startsWith('http') ? (item.imageUrl || item.image || item.images[0]) : `http://localhost:5000${item.imageUrl || item.image || item.images[0]}`} 
                      className="w-full h-full object-cover" 
                      alt="" 
                    />
                  ) : (
                    item.item_id ? "📦" : item.status === "active" ? "🔍" : "🤝"
                  )}
                </div>
                
                <div className="flex flex-col items-end gap-2">
                   <div className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border ${
                     item.availability_status === "available" || item.status === "active" 
                     ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                     : "bg-indigo-50 text-indigo-600 border-indigo-100"
                   }`}>
                     {item.availability_status || item.status}
                   </div>
                   <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Visibility:</span>
                      <span className="text-[8px] font-black text-indigo-600 uppercase">Public</span>
                   </div>
                </div>
              </div>

              <h4 className="text-base font-black text-slate-800 mb-1 truncate leading-tight group-hover:text-indigo-600 transition-colors font-epilogue">
                {item.title || item.itemName || item.item_name}
              </h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6">{item.category}</p>
              
              <div className="flex items-center justify-between pt-5 border-t border-slate-50 mb-6">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Valuation / Date</span>
                  <span className="text-[13px] font-black text-slate-700">
                    {item.price ? `LKR ${item.price}` : new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Location</span>
                   <span className="text-[11px] font-bold text-slate-500 truncate max-w-[100px]">
                     {item.location || "Main Campus"}
                   </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  onClick={() => onEdit(item)}
                  className="flex-1 py-3 rounded-xl bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 text-[10px] font-black uppercase tracking-widest transition-all border border-slate-100 flex items-center justify-center gap-2 shadow-sm"
                >
                  Edit Entry
                </button>
                <button 
                  onClick={() => onResolve(item)}
                  className="px-4 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_8px_15px_rgba(79,70,229,0.2)] flex items-center justify-center"
                  title="Mark as Resolved"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ProfileCard = ({ user, refreshUser }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [uploading, setUploading] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Activity Data States
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);
  const [marketListings, setMarketListings] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const [myBids] = useState([]); // Member not finished yet

  // Edit Management
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isTrustInfoOpen, setIsTrustInfoOpen] = useState(false);

  const tabs = ["Overview", "Activity", "Trust & Reputation", "Feedback"];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  useEffect(() => {
    if (activeTab === "Activity") {
      fetchActivityData();
    }
  }, [activeTab]);

  const fetchActivityData = async () => {
    setLoadingActivity(true);
    try {
      const token = localStorage.getItem("token");
      
      // Parallel Fetching demonstrating system integration
      const [lostRes, foundRes, marketRes] = await Promise.all([
        getMyLostItems(token).catch(() => ({ data: [] })),
        getMyFoundItems(token).catch(() => ({ data: [] })),
        getMyMarketplaceItems(token).catch(() => ({ data: [] }))
      ]);

      setLostItems(lostRes.data || []);
      setFoundItems(foundRes.data || []);
      
      // Marketplace Filtering Logic
      const allMarket = marketRes.data?.items || [];
      setMarketListings(allMarket.filter(it => it.availability_status === "available"));
      setSoldItems(allMarket.filter(it => it.availability_status === "not_available"));
      
    } catch (error) {
      console.error("Failed to fetch activity dashboard", error);
      toast.error("Dashboard synchronization incomplete");
    } finally {
      setLoadingActivity(false);
    }
  };

  const handleResolve = async (item, type) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      if (type === 'lost') await updateLostItem(item._id, { status: 'found' }, token);
      else if (type === 'found') await updateFoundItem(item._id, { status: 'returned' }, token);
      else if (type === 'market') await updateMarketplaceItem(item._id, { availability_status: 'not_available' }, token);
      
      toast.success("Record resolved and updated in Vault!");
      fetchActivityData();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    // Front-end Validation
    const tTitle = editingItem.title || editingItem.itemName || editingItem.item_name || "";
    if (!tTitle.trim()) return toast.error("Item Designation is required.");
    if (!editingItem.category?.trim()) return toast.error("Sector / Category is required.");
    if (!editingItem.description?.trim()) return toast.error("Detailed Specification is required.");
    
    if (editingItem.type === 'market') {
       if (!editingItem.price || Number(editingItem.price) < 0) return toast.error("Valid Valuation is required.");
    } else {
       if (!editingItem.location?.trim()) return toast.error("Event Location is required.");
       if (!editingItem.date) return toast.error("Reported Date is required.");
       
       const selectedDate = new Date(editingItem.date);
       const today = new Date();
       today.setHours(0, 0, 0, 0);
       if (selectedDate > today) return toast.error("Date cannot be in the future.");
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const { _id, type, title, itemName, item_name, description, category, price, location, date } = editingItem;
      const data = { 
        title: title || itemName || item_name, 
        description, 
        category, 
        price,
        location,
        date
      };

      if (type === 'lost') await updateLostItem(_id, data, token);
      else if (type === 'found') await updateFoundItem(_id, data, token);
      else if (type === 'market') await updateMarketplaceItem(_id, data, token);

      toast.success("Vault record synchronized!");
      setIsEditModalOpen(false);
      fetchActivityData();
    } catch (error) {
      toast.error("Encryption update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    setUploading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await uploadAvatar(token, formData);
      // Sync new image to localStorage so Navbar updates immediately
      const existingUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { ...existingUser, profileImage: res.data.profileImage };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      // Dispatch custom event so Navbar listener picks it up
      window.dispatchEvent(new Event("profile-updated"));
      toast.success("Profile picture updated!");
      if (refreshUser) refreshUser();
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="font-inter w-full mx-auto ag-fade-in">
      
      {/* Anti-Gravity Header Card */}
      <div className="ag-card p-8 md:p-10 mb-10 border-white relative overflow-hidden flex flex-col xl:flex-row items-center justify-between gap-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row shadow-sm md:shadow-none bg-slate-50/50 md:bg-transparent p-6 md:p-0 rounded-3xl md:rounded-none items-center gap-8 text-center md:text-left flex-1 border md:border-none border-indigo-100">
          {/* Avatar Area with refined styles */}
          <label className={`relative group/avatar cursor-pointer w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-[0_20px_40px_rgba(79,70,229,0.2)] overflow-hidden ring-8 ring-white transition-all duration-500 hover:rotate-2 hover:scale-105 ${uploading ? "opacity-50" : ""}`}>
            {user.profileImage ? (
              <img 
                src={user.profileImage.startsWith('http') ? user.profileImage : `http://localhost:5000${user.profileImage}`} 
                alt={user.name} 
                className="w-full h-full object-cover transition-transform group-hover/avatar:scale-110"
              />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-5xl font-black text-white italic drop-shadow-sm font-epilogue">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all duration-300">
               <svg className={`w-8 h-8 text-white ${uploading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {uploading ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />}
               </svg>
            </div>
            {!uploading && <input type="file" onChange={handleAvatarChange} accept="image/*" className="hidden" />}
          </label>

          {/* User Meta - Structured Grid Alignment */}
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
               <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight font-epilogue">{user.name}</h1>
               <p className="text-sm font-bold text-slate-400 flex items-center justify-center md:justify-start gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                 {user.email}
               </p>
            </div>
            
            <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID:</span>
                <span className="text-[11px] font-bold text-slate-700 uppercase">{user.studentId || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 shadow-sm">
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Role:</span>
                <span className="text-[11px] font-black text-indigo-600 uppercase tracking-tight">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Stats with Circular Gauge */}
        <div className="flex items-center gap-10 md:gap-14 bg-slate-50/60 p-8 rounded-[2.2rem] border border-slate-100 shadow-inner">
           <TrustGauge 
             score={user.stats?.totalScore || user.stats?.trustScore || 0} 
             status={user.stats?.status || "Unranked"}
             onInfoClick={() => setIsTrustInfoOpen(true)} 
           />
           
           <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-[1.2rem] bg-white shadow-md border border-slate-100 flex items-center justify-center transition-transform hover:scale-110 cursor-default">
                 <div className="flex flex-col items-center">
                    <span className="text-xl font-black text-indigo-600 leading-none">
                      {user.stats?.pillars ? 
                        Object.values(user.stats.pillars).reduce((sum, p) => sum + (p.earned || 0), 0) : 
                        (user.stats?.trustBreakdown?.reduce((sum, item) => sum + (Number(item.earned) || 0), 0) || 0)}
                    </span>
                 </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total Pts</span>
                <span className="text-xs font-bold text-slate-600">{user.stats?.status || "Bronze"}</span>
              </div>
           </div>
        </div>

        {/* Improved Button Hierarchy */}
        <div className="flex flex-col sm:flex-row xl:flex-col gap-3 w-full xl:w-64">
          <button
            onClick={() => navigate("/profile/edit")}
            className="flex-1 w-full bg-gradient-to-r from-[#4A8EF0] to-[#8B5CF6] text-white px-8 py-4 rounded-2xl font-black text-[13px] uppercase tracking-[0.15em] shadow-[0_12px_25px_rgba(74,134,240,0.3)] hover:shadow-[0_15px_30px_rgba(74,134,240,0.4)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 font-epilogue"
          >
            Edit Profile →
          </button>
          
          <button
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="flex-1 w-full flex items-center justify-center gap-2 text-slate-400 hover:text-rose-500 bg-transparent px-8 py-3 rounded-2xl font-bold text-[11px] uppercase tracking-widest transition-all duration-300 group"
          >
            <svg className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Modern Navigation Tabs - Anti-Gravity Pill Style */}
      <div className="flex ag-card p-1.5 gap-1 mb-10 overflow-x-auto scrollbar-hide sticky top-24 z-30 font-epilogue bg-white/80 backdrop-blur-xl border border-white/40">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap flex-1 px-10 py-3.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${
              activeTab === tab
                ? "bg-slate-900 text-white shadow-2xl scale-100"
                : "text-slate-400 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Section - Remove excessive scroll limit for clarity */}
      <div className="pb-10 font-inter">
        
        {/* OVERVIEW TAB */}
        {activeTab === "Overview" && (
          <div className="animate-fade-in-up w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div className="flex items-center gap-4">
                    <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight font-epilogue">Master Credentials</h2>
                 </div>
                 <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Global Identity Record</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

            {/* SECONDARY COLUMN - System Verification & Setup */}
            <div className="lg:col-span-1">
               <div className="bg-white rounded-[2.5rem] shadow-[0_32px_80px_rgba(30,58,138,0.06)] p-8 border border-white h-full flex flex-col">
                  <div className="flex items-center gap-4 mb-8">
                     <span className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100 text-lg">🛡️</span>
                     <h3 className="text-xl font-black tracking-tight text-slate-800 font-epilogue">Security & Setup</h3>
                  </div>

                  <div className="flex-1 space-y-8">
                     {/* Meter */}
                     <div>
                       <div className="flex justify-between items-end mb-3">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Completion</span>
                         <span className="text-sm font-black text-indigo-600">85%</span>
                       </div>
                       <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                         <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 w-[85%] rounded-full shadow-[0_0_12px_rgba(79,70,229,0.3)]"></div>
                       </div>
                     </div>

                     <ul className="space-y-5">
                        <li className="flex items-center gap-4">
                           <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-black border border-emerald-200 shadow-sm shrink-0">✓</div>
                           <span className="text-[13px] font-bold text-slate-700">Email Identity Verified</span>
                        </li>
                        <li className="flex items-center gap-4">
                           <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-black border border-emerald-200 shadow-sm shrink-0">✓</div>
                           <span className="text-[13px] font-bold text-slate-700">Student ID Records Linked</span>
                        </li>
                        <li className="flex items-center gap-4">
                           <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px] font-black border border-slate-200 shrink-0">!</div>
                           <span className="text-[13px] font-bold text-slate-400">2FA Security Authentication Disabled</span>
                        </li>
                     </ul>

                     <div className="pt-8 border-t border-slate-50 mt-auto">
                        <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-[0_10px_25px_rgba(15,10,46,0.15)] hover:shadow-indigo-200">
                          Manage Security Settings
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "Activity" && (
          <div className="pt-2 animate-fade-in-up">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight font-epilogue uppercase tracking-tight">Activity Dashboard</h2>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time system synchronization</p>
              </div>
              <button 
                onClick={fetchActivityData}
                disabled={loadingActivity}
                className={`p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-indigo-500 hover:text-indigo-600 ${loadingActivity ? "animate-spin" : ""}`}
                title="Refresh All Data"
              >
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {loadingActivity ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-40 bg-slate-100 rounded-[2rem]"></div>)}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Statistics Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                   <ActivityCard icon="🔍" title="Lost Reports" count={lostItems.length} note="Missing item logs" bgColor="bg-amber-50" iconColor="text-amber-500" onClick={() => navigate("/profile/lost-reports")} />
                   <ActivityCard icon="🤝" title="Found & Returned" count={foundItems.length} note="Successful resolutions" bgColor="bg-sky-50" iconColor="text-sky-500" onClick={() => navigate("/profile/found-returned")} />
                   <ActivityCard icon="📦" title="Active Listings" count={marketListings.length} note="Listed in Marketplace" bgColor="bg-blue-50" iconColor="text-blue-500" onClick={() => navigate("/profile/items-posted")} />
                </div>

                <div className="bg-white rounded-[2.5rem] p-1.5 shadow-sm border border-white">
                  <div className="bg-slate-50/50 rounded-[2.2rem] p-8 border border-white">
                    <DashboardSection 
                      title="My Lost Reports" 
                      items={lostItems} 
                      badgeColor="bg-amber-500 font-bold" 
                      onViewAll={() => navigate("/profile/lost-reports")}
                      onEdit={(item) => { setEditingItem({...item, type: 'lost'}); setIsEditModalOpen(true); }}
                      onResolve={(item) => handleResolve(item, 'lost')}
                      userTrust={user.trust?.level}
                    />
                    <hr className="my-10 border-slate-100" />
                    <DashboardSection 
                      title="My Found Reports" 
                      items={foundItems} 
                      badgeColor="bg-sky-500 font-bold" 
                      onViewAll={() => navigate("/profile/found-returned")}
                      onEdit={(item) => { setEditingItem({...item, type: 'found'}); setIsEditModalOpen(true); }}
                      onResolve={(item) => handleResolve(item, 'found')}
                      userTrust={user.trust?.level}
                    />
                    <hr className="my-10 border-slate-100" />
                    <DashboardSection 
                      title="Marketplace Items" 
                      items={marketListings} 
                      badgeColor="bg-blue-500 font-bold" 
                      onViewAll={() => navigate("/profile/items-posted")}
                      onEdit={(item) => { setEditingItem({...item, type: 'market'}); setIsEditModalOpen(true); }}
                      onResolve={(item) => handleResolve(item, 'market')}
                      userTrust={user.trust?.level}
                    />
                    <hr className="my-10 border-white/10" />
                    <DashboardSection 
                      title="Sold Items" 
                      items={soldItems} 
                      badgeColor="bg-indigo-400 font-bold" 
                      onViewAll={() => navigate("/profile/items-sold")}
                      onEdit={(item) => { setEditingItem({...item, type: 'market'}); setIsEditModalOpen(true); }}
                      onResolve={(item) => handleResolve(item, 'market')}
                      userTrust={user.trust?.level}
                    />
                    <hr className="my-10 border-white/10" />
                    <DashboardSection 
                      title="My Bids" 
                      items={myBids} 
                      badgeColor="bg-rose-400 font-bold" 
                      onViewAll={() => navigate("/profile/my-bids")}
                      userTrust={user.trust?.level}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TRUST & REPUTATION TAB */}
        {activeTab === "Trust & Reputation" && (
          <div className="pt-2 animate-fade-in-up w-full grid grid-cols-1 lg:grid-cols-3 gap-8 font-inter">
            <div className="lg:col-span-2 space-y-8">
              
              {/* PENALTY WARNING BANNER */}
              {(user.stats?.penalties < 0) && (
                <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-6 shadow-[0_12px_30px_rgba(244,63,94,0.1)]">
                   <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl shrink-0 border border-rose-200">⚠️</div>
                   <div className="flex-1 text-center md:text-left">
                     <h4 className="text-rose-900 font-black text-sm uppercase tracking-widest mb-1">Deduction Protocol Active</h4>
                     <p className="text-rose-600/80 text-xs font-bold leading-relaxed">
                        Your score has a {user.stats.penalties} pt deduction due to unresolved disputes or record flags. Resolve pending issues to restore your standing.
                     </p>
                   </div>
                   <button onClick={() => setActiveTab("Activity")} className="px-6 py-3 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-rose-700 transition-all">
                      Review Records
                   </button>
                </div>
              )}

              <div className="bg-white rounded-[3rem] shadow-[0_32px_80px_rgba(30,58,138,0.06)] p-8 md:p-14 border border-white relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
                 
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8 relative z-10">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight font-epilogue">Reputation Algorithm</h3>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">V2.0 ALPHA • SECURE AUDIT SYNC</p>
                    </div>
                    {user.stats?.nextMilestone?.pointsNeeded > 0 && (
                      <div className="bg-indigo-50 border border-indigo-100 px-6 py-4 rounded-[2rem] flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-lg shadow-sm">🚀</div>
                        <div>
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">NEXT RANK: {user.stats.nextMilestone.label}</p>
                          <p className="text-xs font-black text-indigo-900 tracking-tight">Need {user.stats.nextMilestone.pointsNeeded} pts</p>
                        </div>
                      </div>
                    )}
                 </div>

                 {/* SCORE HERO */}
                 <div className="grid grid-cols-1 md:grid-cols-5 gap-10 items-center mb-16 relative z-10">
                    <div className="md:col-span-2 flex justify-center">
                       <TrustGauge 
                         score={user.stats?.totalScore || 0} 
                         status={user.stats?.status || "Standard"}
                         onInfoClick={() => setIsTrustInfoOpen(true)} 
                       />
                    </div>
                    <div className="md:col-span-3">
                       <MilestoneIndicator score={user.stats?.totalScore || 0} />
                    </div>
                 </div>

                 {/* PILLAR BREAKDOWN GRID */}
                 <div className="relative z-10 space-y-12">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { 
                          name: "Identity Verification", 
                          icon: "🛡️", 
                          key: "identityVerification", 
                          hint: "Complete Student ID validation for a fixed security boost.",
                          cta: "Verify Now",
                          path: "/verify" 
                        },
                        { 
                          name: "Community Hero", 
                          icon: "🌍", 
                          key: "communityHero", 
                          hint: "Return lost items to earn +5 pts per resolution.", 
                          cta: "Report Found",
                          path: "/report-found"
                        },
                        { 
                          name: "Marketplace Reliability", 
                          icon: "🛍️", 
                          key: "marketplaceTrust", 
                          hint: "Complete successful sales to earn +4 pts per trade.", 
                          cta: "Manage Items",
                          path: "/profile/items-posted"
                        },
                        { 
                          name: "Peer Consistency", 
                          icon: "⭐", 
                          key: "peerReview", 
                          hint: "Maintain 5-star feedback to maximize this rating.", 
                          cta: "View Feedback",
                          path: "/profile/feedback"
                        }
                      ].map((pillar, idx) => {
                        const data = user.stats?.pillars?.[pillar.key] || { earned: 0, max: 25 };
                        const pct = Math.round((data.earned / data.max) * 100);
                        
                        return (
                          <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-[2.5rem] p-8 flex flex-col hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 group-hover:rotate-0 transition-transform text-6xl">{pillar.icon}</div>
                            
                            <div className="flex items-center gap-4 mb-6 relative">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm border border-slate-100">{pillar.icon}</div>
                              <div>
                                <h4 className="font-epilogue font-black text-slate-900 text-sm tracking-tight">{pillar.name}</h4>
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{data.earned} / {data.max} PTS</span>
                              </div>
                            </div>

                            <div className="space-y-4 relative">
                               <div className="h-2 w-full bg-white rounded-full border border-slate-100 overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${pct >= 85 ? 'bg-emerald-500' : pct >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                    style={{ width: `${pct}%` }}
                                  />
                               </div>
                               <p className="text-[11px] text-slate-500 font-bold leading-relaxed min-h-[32px]">💡 {pillar.hint}</p>
                               <button 
                                 onClick={() => navigate(pillar.path)}
                                 className="w-full py-4 mt-2 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                               >
                                 {pillar.cta} →
                               </button>
                            </div>
                          </div>
                        );
                      })}
                   </div>
                 </div>
              </div>
            </div>

            {/* SECONDARY COLUMN - QUICK WINS & TIMELINE */}
            <div className="lg:col-span-1 space-y-6">
               <ReputationTimeline history={user.reputationHistory} />

               <div className="bg-slate-900 text-white rounded-[2.5rem] shadow-2xl p-8 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                       <span className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-lg backdrop-blur-md shadow-inner">⚡</span>
                       <h3 className="text-lg font-black tracking-tight font-epilogue uppercase">Quick Wins</h3>
                    </div>

                    <div className="space-y-4">
                       {/* DYNAMIC QUICK WINS LOGIC */}
                       {[
                         { condition: !(user.profileImage), label: "Avatar Upload", points: "+8 Pts", action: "Edit Profile", path: "/profile/edit" },
                         { condition: !(user.phone), label: "Link Contact", points: "+6 Pts", action: "Verify ID", path: "/verify" },
                         { condition: !(user.isVerified), label: "ID Verification", points: "+30 Pts", action: "Submit ID", path: "/verify" },
                         { condition: (user.stats?.stats?.itemsSold === 0), label: "Complete Marketplace Sale", points: "+4 Pts", action: "Open Shop", path: "/marketplace" },
                       ].filter(w => w.condition).slice(0, 3).map((win, i) => (
                         <div key={i} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group/win" onClick={() => navigate(win.path)}>
                            <div className="flex justify-between items-start mb-3">
                               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">{win.points} GROWTH</span>
                               <span className="text-white/20 group-hover/win:text-white transition-colors">→</span>
                            </div>
                            <h5 className="text-[15px] font-black tracking-tight mb-2 font-epilogue">{win.label}</h5>
                            <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/win:text-indigo-400">Run protocol: {win.action}</button>
                         </div>
                       ))}
                       
                       {/* If all quick wins achieved or no points left */}
                       {(!user.isVerified && user.profileImage && user.phone) === false && (
                          <div className="p-6 text-center text-slate-400 italic text-xs font-bold font-epilogue opacity-50">
                             Analysis complete. Your integrity profile is performing within optimal parameters.
                          </div>
                       )}
                    </div>

                    <div className="mt-14 pt-8 border-t border-white/10 flex flex-col items-center gap-4">
                       <div className="group/audit relative inline-block">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] cursor-help hover:text-indigo-400 transition-colors">
                           AI Audited by UniVault
                         </p>
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 p-4 bg-white text-slate-900 rounded-2xl shadow-2xl scale-0 group-hover/audit:scale-100 transition-all origin-bottom pointer-events-none">
                            <p className="text-[10px] font-bold leading-relaxed">
                               Your trust score is verified by UniVault's AI integrity engine, which cross-checks all activity in real time.
                            </p>
                            <div className="w-3 h-3 bg-white rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2" />
                         </div>
                       </div>
                       <span className="text-[9px] font-bold text-slate-600">LAST SYNC: {new Date(user.stats?.lastAudit || Date.now()).toLocaleString()}</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === "Feedback" && (
          <ReviewSection
            profileUserId={user._id}
            currentUser={user}
          />
        )}

      </div>

      {/* EDIT MODAL Overlay */}
      {isEditModalOpen && editingItem && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 animate-fade-in" style={{ isolate: 'isolate' }}>
           <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setIsEditModalOpen(false)}></div>
           
           <div className="relative bg-[#1A1A2E]/95 backdrop-blur-2xl w-full max-w-xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden animate-fade-in-up">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-10 text-white relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <h3 className="text-2xl font-black tracking-tight font-epilogue">Modify Vault Record</h3>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] mt-2">UUID: {editingItem._id?.slice(-8)} • SECURITY LAYER ON</p>
                <button onClick={() => setIsEditModalOpen(false)} className="absolute top-10 right-10 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-10 space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Item Designation</label>
                  <input 
                    type="text" 
                    placeholder="Brief name of item"
                    value={editingItem.title || editingItem.itemName || editingItem.item_name || ""} 
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value, item_name: e.target.value, itemName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Sector / Category</label>
                    <input 
                      type="text" 
                      value={editingItem.category || ""} 
                      onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                  <div>
                    {editingItem.type === 'market' ? (
                      <>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Valuation (LKR)</label>
                        <input 
                          type="number" 
                          placeholder="Points equivalent"
                          value={editingItem.price || ""} 
                          onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
                        />
                      </>
                    ) : (
                      <>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Reported Date</label>
                        <input 
                          type="date" 
                          value={editingItem.date ? new Date(editingItem.date).toISOString().split('T')[0] : ""} 
                          onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                        />
                      </>
                    )}
                  </div>
                </div>

                {editingItem.type !== 'market' && (
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Event Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Main Library, Faculty Cafe"
                      value={editingItem.location || ""} 
                      onChange={(e) => setEditingItem({...editingItem, location: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-white/20"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Detailed Specification</label>
                  <textarea 
                    rows="4"
                    placeholder="Provide specific identifiers..."
                    value={editingItem.description || ""} 
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none placeholder:text-white/20"
                  ></textarea>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-sm font-bold text-white/50 uppercase tracking-widest hover:text-white transition-colors">
                    Discard
                  </button>
                  <button type="submit" disabled={isSaving} className={`bg-gradient-to-r from-[#4A5FE8] to-[#8B5CF6] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_8px_20px_rgba(79,70,229,0.3)] hover:-translate-y-1 active:translate-y-0 transition-all duration-300 ${isSaving ? "opacity-50 cursor-not-allowed leading-[0]" : ""}`}>
                     {isSaving ? <span className="inline-block w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span> : "Update Record"}
                  </button>
                </div>
              </form>
           </div>
        </div>,
        document.body
      )}
      {/* TRUST INFO MODAL */}
      {isTrustInfoOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 animate-fade-in" style={{ isolate: 'isolate' }}>
          <div className="absolute inset-0 bg-[#0F0A2E]/90 backdrop-blur-xl" onClick={() => setIsTrustInfoOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-[0_32px_100px_rgba(0,0,0,0.5)] border border-white overflow-hidden animate-fade-in-up font-inter">
            {/* Header */}
            <div className="bg-[#0F0A2E] p-10 text-white relative">
               <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full -mr-24 -mt-24 blur-3xl"></div>
               <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Integrity Algorithm Analysis</span>
                    <h3 className="text-3xl font-black tracking-tight font-epilogue">Trust Protocol V2</h3>
                    <p className="text-slate-400 text-sm font-bold mt-2">Decentralized reputation scoring system</p>
                  </div>
                  <button onClick={() => setIsTrustInfoOpen(false)} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
               </div>
            </div>

            {/* Content */}
            <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: "🛡️", title: "Identity Verification", points: "30 PTS", desc: "Awarded for completing the secure Student ID verification process.", status: user.isVerified },
                    { icon: "📋", title: "Profile Integrity", points: "20 PTS", desc: "Avatar (8pts), Phone (6pts), and Faculty (6pts) records.", status: !!(user.profileImage && user.phone) },
                    { icon: "🌍", title: "Community Hero", points: "25 PTS", desc: "Earn 5 pts for each lost item successfully returned to its owner.", status: (user.stats?.foundReturned || 0) > 0 },
                    { icon: "🤝", title: "Marketplace Trust", points: "20 PTS", desc: "Earn 4 pts for each successful marketplace transaction completed.", status: (user.stats?.itemsSold || 0) > 0 },
                    { icon: "⭐", title: "Peer Reputation", points: "10 PTS", desc: "Calculated from your average marketplace rating (Avg x 2).", status: (user.stats?.reviewCount || 0) > 0 },
                    { icon: "⚡", title: "Response Factor", points: "3 PTS", desc: "Measures your interaction speed and reliability in chat.", status: true },
                    { icon: "⏳", title: "Account Maturity", points: "2 PTS", desc: "Awarded to vetted accounts older than 30 days.", status: true }
                  ].map((pillar, i) => (
                    <div key={i} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl">{pillar.icon}</span>
                        <span className={`text-[10px] font-black ${pillar.status ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'} px-2 py-1 rounded-lg`}>
                          {pillar.status ? 'ACTIVE' : pillar.points}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 font-epilogue">{pillar.title}</h4>
                      <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{pillar.desc}</p>
                    </div>
                  ))}
               </div>

               <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 mt-4">
                  <div className="flex gap-4 items-start">
                    <span className="text-xl">⚠️</span>
                    <div>
                      <h5 className="text-[11px] font-black text-rose-900 uppercase mb-1">Deduction Protocols</h5>
                      <p className="text-[11px] text-rose-700 font-bold leading-relaxed">
                        Unresolved disputes (-5 pts) and verified false reports (-10 pts) will significantly impact your community standing.
                      </p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="px-10 pb-10">
               <button 
                onClick={() => setIsTrustInfoOpen(false)}
                className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all"
               >
                 Acknowledge Protocol
               </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* LOGOUT CONFIRMATION MODAL */}
      {isLogoutConfirmOpen && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 animate-fade-in" style={{ isolate: 'isolate' }}>
          <div className="absolute inset-0 bg-[#0F0A2E]/90 backdrop-blur-xl" onClick={() => setIsLogoutConfirmOpen(false)}></div>
          
          <div className="relative bg-white/5 backdrop-blur-3xl w-full max-w-sm rounded-[2.5rem] p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] text-center animate-fade-in-up">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20">
               <svg className="w-10 h-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
               </svg>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-2 tracking-tight">Confirm Sign Out</h3>
            <p className="text-white/60 font-medium mb-8 leading-relaxed">Are you sure you want to end your secure session with UniVault?</p>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_10px_25px_rgba(225,29,72,0.3)] hover:bg-rose-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                Yes, Sign Me Out
              </button>
              <button 
                onClick={() => setIsLogoutConfirmOpen(false)}
                className="w-full py-4 bg-white/5 text-white/70 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
              >
                No, Keep me logged in
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

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
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(234, 179, 8, 0.1); }
          50% { box-shadow: 0 0 40px rgba(234, 179, 8, 0.25); }
        }
        .animate-pulse-glow { animation: pulse-glow 3s infinite; }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle { animation: bounce-subtle 3s infinite ease-in-out; }
      `}} />
    </div>
  );
};

export default ProfileCard;