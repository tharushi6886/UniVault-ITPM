import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AIMatchesPanel from '../Matches/AIMatchesPanel';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getLostItemById, getFoundItemById } from '../../api/itemApi';


export const Sidebar = ({ counts, onFilterChange, activeFilter, activeTab, onTabChange }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const userName = user?.name || "Jane Doe";
  const userRole = user?.faculty ? `${user.faculty} student` : "Engineering · Year 3";
  const userInitials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleSidebarClick = (e, tab, filter) => {
    e.preventDefault();
    if (onTabChange) onTabChange(tab);
    if (onFilterChange) onFilterChange(filter);
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-[260px] bg-white border-r border-gray-200 flex flex-col z-[300] hidden lg:flex">
      <div className="flex items-center gap-[12px] py-[24px] px-[24px]">
        <div className="flex items-center justify-center w-[36px] h-[36px] bg-[#4f46e5] rounded-[10px]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </div>
        <span className="text-[20px] font-bold text-[#1e1b4b]">UniVault</span>
      </div>
      
      <nav className="flex-1 py-[16px] px-[16px] overflow-y-auto flex flex-col gap-[2px]">
        <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-gray-400 px-[12px] pb-[8px]">Overview</div>
        
        <a href="#" onClick={(e) => handleSidebarClick(e, 'feed', 'All')} className={`flex items-center gap-[12px] py-[10px] px-[12px] rounded-[10px] text-[14px] font-semibold transition-colors no-underline ${activeTab === 'feed' && activeFilter === 'All' ? 'text-[#4f46e5] bg-[#4f46e5]/10' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
          <span className="flex items-center justify-center text-current w-[20px] h-[20px]">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </span>
          Dashboard
        </a>
        
        <a href="#" onClick={(e) => handleSidebarClick(e, 'feed', 'Lost')} className={`flex items-center gap-[12px] py-[10px] px-[12px] rounded-[10px] text-[14px] font-medium transition-colors no-underline ${activeTab === 'feed' && activeFilter === 'Lost' ? 'text-[#4f46e5] bg-[#4f46e5]/10' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
          <span className="flex items-center justify-center text-current w-[20px] h-[20px] opacity-70">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </span>
          Lost Items
          <span className="text-[11px] font-bold py-[2px] px-[8px] rounded-full ml-auto text-white bg-red-500">{counts?.lost || 0}</span>
        </a>
        
        <a href="#" onClick={(e) => handleSidebarClick(e, 'feed', 'Found')} className={`flex items-center gap-[12px] py-[10px] px-[12px] rounded-[10px] text-[14px] font-medium transition-colors no-underline ${activeTab === 'feed' && activeFilter === 'Found' ? 'text-[#4f46e5] bg-[#4f46e5]/10' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
          <span className="flex items-center justify-center text-current w-[20px] h-[20px] opacity-70">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          Found Items
          <span className="text-[11px] font-bold py-[2px] px-[8px] rounded-full ml-auto text-white bg-green-500">{counts?.found || 0}</span>
        </a>
        
        <a href="#" onClick={(e) => handleSidebarClick(e, 'feed', 'All')} className="flex items-center gap-[12px] py-[10px] px-[12px] rounded-[10px] text-[14px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline">
          <span className="flex items-center justify-center text-current w-[20px] h-[20px] opacity-70">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/><path d="M18.5 2.5l2 2L17 8"/></svg>
          </span>
          AI Matches
          <span className="text-[11px] font-bold py-[2px] px-[8px] rounded-full ml-auto text-white bg-blue-500">2</span>
        </a>
  
        <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-gray-400 px-[12px] pb-[8px] mt-[16px]">My Content</div>
        
        <a href="#" className="flex items-center gap-[12px] py-[10px] px-[12px] rounded-[10px] text-[14px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline">
          <span className="flex items-center justify-center text-current w-[20px] h-[20px] opacity-70">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
          </span>
          My Vault
        </a>
        
        <a href="#" className="flex items-center gap-[12px] py-[10px] px-[12px] rounded-[10px] text-[14px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline">
          <span className="flex items-center justify-center text-current w-[20px] h-[20px] opacity-70">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          </span>
          Campus Map
        </a>
        
        <a href="#" className="flex items-center gap-[12px] py-[10px] px-[12px] rounded-[10px] text-[14px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline">
          <span className="flex items-center justify-center text-current w-[20px] h-[20px] opacity-70">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </span>
          Notifications
          <span className="text-[11px] font-bold py-[2px] px-[8px] rounded-full ml-auto text-white bg-red-500">5</span>
        </a>
        
        <a href="#" className="flex items-center gap-[12px] py-[10px] px-[12px] rounded-[10px] text-[14px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline">
          <span className="flex items-center justify-center text-current w-[20px] h-[20px] opacity-70">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </span>
          Messages
        </a>
  
        <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-gray-400 px-[12px] pb-[8px] mt-[16px]">More</div>
        
        <a href="#" className="flex items-center gap-[12px] py-[10px] px-[12px] rounded-[10px] text-[14px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline">
          <span className="flex items-center justify-center text-current w-[20px] h-[20px] opacity-70">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </span>
          Marketplace
        </a>
        
        <a href="#" className="flex items-center gap-[12px] py-[10px] px-[12px] rounded-[10px] text-[14px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline">
          <span className="flex items-center justify-center text-current w-[20px] h-[20px] opacity-70">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/></svg>
          </span>
          Bidding
        </a>
        
        <a href="#" className="flex items-center gap-[12px] py-[10px] px-[12px] rounded-[10px] text-[14px] font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors no-underline">
          <span className="flex items-center justify-center text-current w-[20px] h-[20px] opacity-70">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </span>
          Settings
        </a>
      </nav>
      
      <div className="flex items-center gap-[12px] p-[20px] border-t border-gray-200 mt-auto">
        <div className="w-[40px] h-[40px] rounded-full bg-[#4f46e5] flex items-center justify-center text-[14px] text-white font-bold shrink-0">
          {userInitials}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-[14px] font-semibold text-gray-900 truncate">{userName}</div>
          <div className="text-[12px] text-gray-500 truncate">{userRole}</div>
        </div>
        <span className="text-[18px] text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-[4px]">⋯</span>
      </div>
    </aside>
  );
};

const bgImgCls = "absolute rounded-[18px] overflow-hidden shadow-[0_28px_60px_rgba(10,5,40,0.55),0_8px_24px_rgba(10,5,40,0.4)] border-2 border-white/20 pointer-events-auto cursor-pointer transition-transform hover:z-[6] hover:scale-105 hover:-translate-y-[10px] origin-center";
export const Topbar = ({ searchQuery, onSearchChange }) => (
  <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-[200px] lg:h-[310px] z-[200] overflow-hidden bg-gradient-to-br from-[#5b21b6] via-[#4338ca] via-[#4f46e5] via-[#2563eb] to-[#1d4ed8]">
    <div className="absolute inset-0 z-[1] pointer-events-none hidden lg:block">
      <div className={`${bgImgCls} w-[210px] h-[155px] top-[30px] left-[-20px] -rotate-[13deg] z-[3]`}><img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=360&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-[#4f46e5]/25 to-[#2563eb]/15 mix-blend-multiply pointer-events-none" /></div>
      <div className={`${bgImgCls} w-[82px] h-[152px] top-[-15px] left-[200px] rotate-[9deg] z-[4]`}><img src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=360&h=320&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-[#4f46e5]/25 to-[#2563eb]/15 mix-blend-multiply pointer-events-none" /></div>
      <div className={`${bgImgCls} w-[130px] h-[120px] top-[10px] left-[calc(50%-65px)] -rotate-[7deg] z-[2]`}><img src="https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=360&h=320&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-[#4f46e5]/25 to-[#2563eb]/15 mix-blend-multiply pointer-events-none" /></div>
      <div className={`${bgImgCls} w-[78px] h-[144px] top-[-18px] right-[240px] rotate-[13deg] z-[4]`}><img src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=260&h=480&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-[#4f46e5]/25 to-[#2563eb]/15 mix-blend-multiply pointer-events-none" /></div>
      <div className={`${bgImgCls} w-[200px] h-[160px] top-[30px] right-[-15px] -rotate-[11deg] z-[3]`}><img src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=480&h=380&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-[#4f46e5]/25 to-[#2563eb]/15 mix-blend-multiply pointer-events-none" /></div>
      <div className={`${bgImgCls} w-[138px] h-[106px] bottom-[22px] left-[55px] rotate-[15deg] z-[4]`}><img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=340&h=260&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-[#4f46e5]/25 to-[#2563eb]/15 mix-blend-multiply pointer-events-none" /></div>
      <div className={`${bgImgCls} w-[160px] h-[115px] bottom-[15px] left-[calc(50%-160px)] -rotate-[9deg] z-[3]`}><img src="https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=280&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-[#4f46e5]/25 to-[#2563eb]/15 mix-blend-multiply pointer-events-none" /></div>
      <div className={`${bgImgCls} w-[115px] h-[115px] bottom-[20px] left-[calc(50%+10px)] rotate-[11deg] z-[4]`}><img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=360&h=260&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-[#4f46e5]/25 to-[#2563eb]/15 mix-blend-multiply pointer-events-none" /></div>
      <div className={`${bgImgCls} w-[88px] h-[115px] top-[85px] left-[155px] -rotate-[18deg] z-[2]`}><img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=280&h=340&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-[#4f46e5]/25 to-[#2563eb]/15 mix-blend-multiply pointer-events-none" /></div>
      <div className={`${bgImgCls} w-[150px] h-[130px] bottom-[15px] right-[-10px] -rotate-[8deg] z-[3]`}><img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=320&h=280&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-[#4f46e5]/25 to-[#2563eb]/15 mix-blend-multiply pointer-events-none" /></div>
      <div className={`${bgImgCls} w-[130px] h-[95px] top-[90px] right-[280px] rotate-[6deg] z-[2]`}><img src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=320&h=240&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-[#4f46e5]/25 to-[#2563eb]/15 mix-blend-multiply pointer-events-none" /></div>
      <div className={`${bgImgCls} w-[95px] h-[95px] top-[95px] left-[calc(50%-10px)] -rotate-[14deg] z-[2]`}><img src="https://images.unsplash.com/photo-1544365558-35aa4af41144?w=280&h=280&fit=crop" className="w-full h-full object-cover" /><div className="absolute inset-0 rounded-[16px] bg-gradient-to-br from-[#4f46e5]/25 to-[#2563eb]/15 mix-blend-multiply pointer-events-none" /></div>
    </div>
    <div className="absolute inset-0 z-[2] pointer-events-none bg-[radial-gradient(ellipse_58%_100%_at_0%_50%,rgba(67,38,200,0.82)_0%,rgba(67,38,200,0.55)_35%,transparent_68%),linear-gradient(90deg,rgba(55,30,180,0.7)_0%,rgba(55,30,180,0.45)_38%,rgba(55,30,180,0.1)_58%,transparent_75%)]" />
    <div className="absolute top-[18px] right-[20px] flex items-center gap-[8px] z-[5]">
      <div className="w-[36px] h-[36px] rounded-[10px] bg-white/20 border border-white/30 flex items-center justify-center cursor-pointer text-[15px] transition-all hover:bg-white/30 relative">🔔<span className="absolute top-[6px] right-[6px] w-[7px] h-[7px] rounded-full bg-[#ef4444] border-[1.5px] border-transparent" /></div>
      <div className="w-[36px] h-[36px] rounded-[10px] bg-white/20 border border-white/30 flex items-center justify-center cursor-pointer text-[15px] transition-all hover:bg-white/30">⚙️</div>
      <div className="w-[36px] h-[36px] rounded-full bg-white/30 border-2 border-white/50 flex items-center justify-center text-[12px] text-white font-bold cursor-pointer">JD</div>
    </div>
    <div className="absolute inset-0 z-[3] flex flex-col justify-center px-[20px] lg:px-[48px] max-w-[580px]">
      <div className="flex items-center mb-[14px]">
        <div className="flex items-center gap-[9px] font-clash text-[15px] font-bold text-white"><span className="w-[8px] h-[8px] rounded-full bg-[#22c55e] shadow-[0_0_10px_#22c55e] animate-pulse" />UniVault · Lost & Found</div>
      </div>
      <div className="text-[10.5px] font-bold tracking-[0.18em] uppercase text-white/60 mb-[8px] flex items-center gap-[7px]">
        <span className="inline-block w-[20px] h-[2px] bg-white/50 rounded-[2px]" />CAMPUS LOST & FOUND DASHBOARD
      </div>
      <div className="font-clash text-[26px] lg:text-[42px] font-bold text-white leading-[1.05] tracking-[-0.03em] drop-shadow-[0_4px_32px_rgba(10,5,40,0.5)] mb-[10px]">Track & Recover<br /><em className="not-italic bg-gradient-to-r from-white via-[#bfdbfe] to-[#e9d5ff] bg-clip-text text-transparent">What Matters Most</em></div>
      <div className="text-[14px] text-white/75 leading-[1.6] max-w-[380px] mb-[20px]">Smart AI-powered campus hub to report, match and recover lost belongings.</div>
      <div className="flex items-center bg-white/20 backdrop-blur-[20px] border-[1.5px] border-white/40 rounded-[14px] p-[5px] pl-[16px] max-w-[420px] transition-all focus-within:bg-white/25 focus-within:border-white/65">
        <span className="text-white/65 text-[14px] shrink-0">🔍</span>
        <input 
          type="text" 
          placeholder="Search for items, locations, brands…" 
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-[14px] text-white font-epilogue py-[7px] px-[8px] placeholder:text-white/55" 
        />
        <button className="bg-white text-[#4f46e5] border-none rounded-[10px] font-epilogue text-[13px] font-bold py-[10px] px-[20px] cursor-pointer shadow-[0_3px_14px_rgba(10,5,40,0.22)] transition-transform hover:-translate-y-[1px] hover:shadow-[0_6px_22px_rgba(10,5,40,0.32)]">Search</button>
      </div>
    </div>
    <div className="absolute bottom-[20px] right-[20px] flex gap-[9px] z-[5] overflow-x-auto">
      <div className="flex items-center flex-shrink-0 gap-[7px] bg-white/95 backdrop-blur-[16px] border border-[#a5b4fc]/20 rounded-full py-[6px] px-[14px] pl-[6px] shadow-[0_4px_16px_rgba(10,5,40,0.18)]">
        <span className="font-clash text-[14px] font-bold text-white bg-gradient-to-br from-[#6366f1] to-[#4338ca] w-[26px] h-[26px] rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(79,70,229,0.45)]">3</span><span className="text-[11px] font-bold text-[#1e1b4b] whitespace-nowrap">Active Reports</span>
      </div>
      <div className="flex items-center flex-shrink-0 gap-[7px] bg-white/95 backdrop-blur-[16px] border border-[#a5b4fc]/20 rounded-full py-[6px] px-[14px] pl-[6px] shadow-[0_4px_16px_rgba(10,5,40,0.18)]">
        <span className="font-clash text-[14px] font-bold text-white bg-gradient-to-br from-[#6366f1] to-[#4338ca] w-[26px] h-[26px] rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(79,70,229,0.45)]">2</span><span className="text-[11px] font-bold text-[#1e1b4b] whitespace-nowrap">AI Matches</span>
      </div>
      <div className="flex items-center flex-shrink-0 gap-[7px] bg-white/95 backdrop-blur-[16px] border border-[#a5b4fc]/20 rounded-full py-[6px] px-[14px] pl-[6px] shadow-[0_4px_16px_rgba(10,5,40,0.18)]">
        <span className="font-clash text-[14px] font-bold text-white bg-gradient-to-br from-[#6366f1] to-[#4338ca] w-[26px] h-[26px] rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(79,70,229,0.45)]">7</span><span className="text-[11px] font-bold text-[#1e1b4b] whitespace-nowrap">Recovered</span>
      </div>
    </div>
  </header>
);
export const FeedPage = ({ openAdPopup, ads, selectedLostItemId, setSelectedLostItemId, setRefreshMatches, searchQuery, filter, setFilter }) => {
  // Use the filter and searchQuery passed from props

  const filteredIds = Object.keys(ads).filter(key => {
    const ad = ads[key];
    if (!ad) return false;
    
    // Type filter
    if (filter !== 'All' && ad.type !== filter.toUpperCase()) return false;
    
    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = ad.title?.toLowerCase().includes(q);
      const matchDesc = (ad.desc || ad.description)?.toLowerCase().includes(q);
      const matchLoc = ad.location?.toLowerCase().includes(q);
      const matchStudent = (ad.student || ad.studentId)?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc && !matchStudent) return false;
    }
    
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-[14px]">
      <div>
        <div className="bg-white/75 backdrop-blur-[18px] border-[1.5px] border-white/92 rounded-[20px] p-[14px] px-[16px] shadow-[0_4px_24px_rgba(79,70,229,0.07)] !px-0 !pb-0 overflow-hidden">
          <div className="flex justify-between items-start mb-[12px] px-[16px]">
            <div>
              <div className="text-[15px] font-bold text-[#1e1b4b]">📋 Campus Lost & Found Board</div>
              <div className="text-[11.5px] text-[#6b7280] mt-[2px]">All items reported by students</div>
            </div>
            <div className="flex gap-[6px]">
              {['All', 'Lost', 'Found'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-[12px] font-semibold py-[6px] px-[16px] rounded-full cursor-pointer border-[1.5px] font-epilogue transition-all ${filter === f ? 'bg-gradient-to-br from-[#4f46e5] to-[#6366f1] text-white border-transparent shadow-[0_3px_10px_rgba(79,70,229,0.28)]' : 'border-[#a5b4fc]/28 bg-white/60 text-[#6b7280] hover:border-[#818cf8] hover:text-[#4f46e5]'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px] px-[16px] pb-[16px]">
            {filteredIds.map((key, i) => {
              const ad = ads[key];
              if (!ad) return null;
              const initials = ad.student ? ad.student.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
              const badgeCls = ad.type === 'LOST' || ad.type === 'Lost' ? 'bg-[#ef4444]/11 text-[#dc2626] border-[#ef4444]/22' : 'bg-[#10b981]/11 text-[#059669] border-[#10b981]/22';

              return (
                <div key={key} onClick={() => openAdPopup(key)} className="bg-white/88 border-[1.5px] border-[#a5b4fc]/[0.18] rounded-[16px] overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_3px_16px_rgba(79,70,229,0.06)] hover:-translate-y-[5px] hover:shadow-[0_14px_40px_rgba(79,70,229,0.14)] hover:border-[#6366f1]/30 group">
                  <div className="relative h-[200px] lg:h-[240px] overflow-hidden">
                    <img src={ad.img || ad.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className={`absolute top-[10px] left-[10px] z-[2] text-[10px] font-bold py-[3px] px-[9px] rounded-[6px] tracking-[0.05em] uppercase border ${badgeCls}`}>{ad.type}</span>
                  </div>
                  <div className="p-[12px] px-[13px] pb-[13px]">
                    <div className="font-clash text-[14px] font-bold text-[#1e1b4b] mb-[8px] truncate">{ad.title}</div>
                    <div className="flex flex-wrap gap-[6px] mb-[10px]">
                      <span className="text-[11px] font-semibold py-[4px] px-[10px] rounded-[8px] inline-flex items-center gap-[4px] bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe]">📅 {new Date(ad.date).toLocaleDateString()}</span>
                      <span className="text-[11px] font-semibold py-[4px] px-[10px] rounded-[8px] inline-flex items-center gap-[4px] bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">📍 {ad.location}</span>
                    </div>
                    <div className="flex items-center gap-[7px] text-[11.5px] text-[#6b7280] font-semibold mb-[10px]">
                      <div className="w-[24px] h-[24px] rounded-full bg-[#4f46e5]/10 flex items-center justify-center text-[#4f46e5] text-[9px] font-bold shrink-0">{initials}</div>
                      <span>{ad.student || ad.studentId}</span>
                    </div>
                    <div className="flex gap-[7px]">
                      {ad.type === 'LOST' || ad.type === 'Lost'
                        ? <button className="flex-1 font-epilogue text-[11.5px] font-bold py-[7px] px-[10px] rounded-[9px] cursor-pointer transition-colors whitespace-nowrap bg-[#eef2ff] text-[#4f46e5] border-[1.5px] border-[#c7d2fe] hover:bg-[#e0e7ff] hover:border-[#818cf8]" onClick={(e) => e.stopPropagation()}>I Found It</button>
                        : <button className="flex-1 font-epilogue text-[11.5px] font-bold py-[7px] px-[10px] rounded-[9px] cursor-pointer transition-colors whitespace-nowrap bg-[#f0fdf4] text-[#166534] border-[1.5px] border-[#bbf7d0] hover:bg-[#dcfce7] hover:border-[#86efac]" onClick={(e) => e.stopPropagation()}>Claim Mine</button>}
                      
                      {(ad.type === 'LOST' || ad.type === 'Lost') && (
                        <button 
                          className={`flex-1 text-[11.5px] font-bold py-[7px] px-[10px] rounded-[9px] border-[1.5px] cursor-pointer transition-all font-epilogue ${selectedLostItemId === key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}
                          onClick={(e) => { e.stopPropagation(); setSelectedLostItemId(key); }}
                        >
                          {selectedLostItemId === key ? 'Selected' : 'Scan'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-[16px] pb-[14px]">
            <button className="flex items-center justify-center gap-[7px] w-full p-[11px] rounded-[12px] mt-[6px] bg-white/55 border-[1.5px] border-[#a5b4fc]/22 text-[13px] font-semibold text-[#4f46e5] cursor-pointer transition-all font-epilogue hover:border-[#818cf8] hover:bg-[#eef2ff]/90">⬇ Load More Items</button>
          </div>
        </div>
      </div>

      <div>
        <AIMatchesPanel 
          lostItemId={selectedLostItemId} 
          onUpdate={() => setRefreshMatches(prev => prev + 1)}
        />
        <div className="mt-4 bg-white/75 backdrop-blur-[18px] border-[1.5px] border-white/92 rounded-[20px] p-[14px] px-[16px] shadow-[0_4px_24px_rgba(79,70,229,0.07)]">
          <div className="flex justify-between items-start mb-[12px]">
            <div>
              <div className="text-[15px] font-bold text-[#1e1b4b]">🗺️ Nearby Items</div>
              <div className="text-[11.5px] text-[#6b7280] mt-[2px]">On campus this week</div>
            </div>
          </div>
          {[
            { img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=200&h=150&fit=crop', title: 'Dell XPS 15', loc: 'Library', type: 'FOUND' },
            { img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200&h=150&fit=crop', title: 'Samsung S23', loc: 'Cafeteria', type: 'LOST' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-[10px] py-[8px] border-b border-gray-100 last:border-0">
               <img src={item.img} className="w-[40px] h-[40px] rounded-lg object-cover" />
               <div className="flex-1 min-w-0">
                 <div className="text-[12px] font-bold truncate">{item.title}</div>
                 <div className="text-[10px] text-gray-500 truncate">📍 {item.loc}</div>
               </div>
               <span className={`text-[8px] font-bold px-2 py-1 rounded-md ${item.type === 'LOST' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{item.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const VaultPage = ({ openAdPopup, ads, selectedLostItemId, setSelectedLostItemId, setRefreshMatches }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) setCurrentUser(JSON.parse(user));
  }, []);

  const handleDelete = async (e, id, type) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    
    try {
      const endpoint = type === 'LOST' || type === 'Lost' ? '/api/lost-items' : '/api/found-items';
      await axios.delete(`http://localhost:5000${endpoint}/${id}`);
      toast.success("Post deleted successfully!");
      if (setRefreshMatches) setRefreshMatches(prev => prev + 1);
    } catch (err) {
      toast.error("Failed to delete post.");
    }
  };

  const handleEdit = (e, ad) => {
    e.stopPropagation();
    navigate('/report-item', { state: { editData: ad } });
  };

  const myAds = Object.keys(ads).filter(id => {
    const ad = ads[id];
    const adStudentId = ad?.studentId || ad?.sid;
    const currentStudentId = currentUser?.studentId || currentUser?._id;
    return ad && currentUser && (adStudentId === currentStudentId);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-[14px]">
      <div>
        <div className="bg-white/75 backdrop-blur-[18px] border-[1.5px] border-white/92 rounded-[20px] p-[14px] px-[16px] shadow-[0_4px_24px_rgba(79,70,229,0.07)]">
          <div className="flex justify-between items-start mb-[12px]">
            <div><div className="text-[15px] font-bold text-[#1e1b4b]">📢 My Posted Items</div><div className="text-[11.5px] text-[#6b7280] mt-[2px]">Items you've reported as lost or found</div></div>
            <button onClick={() => navigate('/report-item', { state: { type: 'lost' } })} className="bg-[#6366f1]/[0.08] text-[#4f46e5] text-[12px] font-semibold py-[8px] px-[16px] rounded-[9px] border border-[#6366f1]/20 cursor-pointer font-epilogue hover:bg-[#6366f1]/15">+ New Post</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
            {myAds.length === 0 ? (
              <div className="col-span-full py-[40px] text-center text-gray-500 text-[14px]">You haven't posted any items yet.</div>
            ) : (
              myAds.sort((a,b) => b.localeCompare(a)).map(v => {
                const ad = ads[v];
                if (!ad) return null;
                return (
                  <div key={v} onClick={() => openAdPopup(v)} className="bg-white border-[1.5px] border-[#a5b4fc]/22 rounded-[22px] overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_6px_28px_rgba(79,70,229,0.09)] hover:-translate-y-[7px] hover:shadow-[0_22px_56px_rgba(79,70,229,0.18)] hover:border-[#6366f1]/40 group">
                    <div className="relative h-[250px] lg:h-[300px] overflow-hidden">
                      <img src={ad.img || ad.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <span className={`absolute top-[14px] left-[14px] z-[2] text-[10.5px] font-bold py-[5px] px-[13px] rounded-[8px] tracking-[0.06em] uppercase backdrop-blur-[10px] ${ad.statusClass || (ad.type==='LOST'?'bg-red-500 text-white':'bg-green-500 text-white')}`}>{ad.status || 'Active'}</span>
                      <span className={`absolute bottom-[14px] left-[14px] z-[2] text-[10px] font-extrabold py-[4px] px-[11px] rounded-[7px] tracking-[0.08em] uppercase backdrop-blur-[10px] ${ad.typeClass || 'bg-white/40 text-white'}`}>{ad.type}</span>
                      <div className="absolute top-[14px] right-[14px] z-[10] flex gap-[6px] opacity-0 group-hover:opacity-100 transition-opacity translate-y-[10px] group-hover:translate-y-0 shadow-sm duration-300">
                        <button onClick={(e) => handleEdit(e, ad)} className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center text-[15px] border border-gray-100 hover:bg-gray-50">✏️</button>
                        <button onClick={(e) => handleDelete(e, ad._id, ad.type)} className="w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center text-[15px] border border-gray-100 hover:bg-red-50">🗑️</button>
                      </div>
                    </div>
                    <div className="p-[16px] px-[18px] pb-[18px]">
                      <div className="text-[16px] font-bold text-[#1e1b4b] mb-[6px] truncate">{ad.title}</div>
                      <div className="text-[12px] text-[#6b7280] leading-[1.5] mb-[10px] line-clamp-2">{ad.desc || ad.description}</div>
                      <div className="flex flex-col gap-[5px] mb-[12px]">
                        <div className="flex items-center gap-[8px] text-[12px] text-[#374151]"><span className="shrink-0 text-[11px]">📍</span><span>{ad.location}</span></div>
                        <div className="flex items-center gap-[8px] text-[12px] text-[#374151]"><span className="shrink-0 text-[11px]">📅</span><span>{new Date(ad.date).toLocaleDateString()}</span></div>
                      </div>
                      <div className="flex gap-[8px]">
                        <button className="flex-1 bg-indigo-50 text-indigo-600 text-[11.5px] font-bold py-[8px] rounded-xl border border-indigo-100" onClick={(e) => e.stopPropagation()}>Details</button>
                        {(ad.type === 'LOST' || ad.type === 'Lost') && (
                          <button className={`flex-1 text-[11.5px] font-bold py-[8px] rounded-xl border transition-all ${selectedLostItemId === v ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-200'}`} onClick={(e) => { e.stopPropagation(); setSelectedLostItemId(v); }}>
                            {selectedLostItemId === v ? 'Selected' : 'Scan'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="bg-white/75 backdrop-blur-[18px] border-[1.5px] border-white/92 rounded-[20px] p-[14px] px-[16px] shadow-[0_4px_24px_rgba(79,70,229,0.07)]">
          <div className="flex justify-between items-start mb-[12px]"><div className="text-[15px] font-bold text-[#1e1b4b]">🕐 Recent Activity</div></div>
          {[
            { icon: '🤖', bg: 'from-[#ede9fe] to-[#c4b5fd]', t: 'AI Match Found', s: '95% match for your Watch', time: '2m' },
            { icon: '✅', bg: 'from-[#dcfce7] to-[#86efac]', t: 'Post Updated', s: 'Item details saved', time: '10m' }
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-[10px] py-[10px] border-b border-gray-50 last:border-0 text-[12px]">
              <div className={`w-[28px] h-[28px] rounded-lg bg-gradient-to-br flex items-center justify-center ${a.bg}`}>{a.icon}</div>
              <div className="flex-1"><strong>{a.t}</strong><br/><span className="text-gray-500">{a.s}</span></div>
              <span className="text-[10px] text-gray-400">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export const AdPopupModal = ({ popupData, closePopup }) => (
  <div className="fixed inset-0 z-[1000] bg-[#0f0a28]/55 backdrop-blur-[6px] flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) closePopup(); }}>
    <div className="bg-white rounded-[26px] w-[94vw] lg:w-[680px] max-h-[90vh] overflow-y-auto shadow-[0_32px_80px_rgba(15,10,40,0.35)] transform transition-transform">
      <div className="relative">
        <img className="w-full h-[300px] object-cover rounded-t-[26px]" src={popupData.img} alt={popupData.title} />
        <div className="absolute top-[18px] left-[18px] flex gap-[8px]">
          <span className={`text-[10.5px] font-bold py-[5px] px-[13px] rounded-[8px] tracking-[0.06em] uppercase backdrop-blur-[10px] ${popupData.statusClass}`}>{popupData.status}</span>
          <span className={`text-[10px] font-extrabold py-[4px] px-[11px] rounded-[7px] tracking-[0.08em] uppercase backdrop-blur-[10px] ${popupData.typeClass}`}>{popupData.type}</span>
        </div>
      </div>
      <div className="p-[26px] px-[28px] pb-[30px]">
        <div className="flex items-start justify-between mb-[6px]">
          <div className="font-clash text-[22px] font-bold text-[#1e1b4b]">{popupData.title}</div>
          <button className="w-[34px] h-[34px] rounded-full bg-[#f1f5f9] border-none cursor-pointer text-[16px] flex items-center justify-center shrink-0 transition-colors text-[#374151] hover:bg-[#e2e8f0]" onClick={closePopup}>✕</button>
        </div>
        <p className="text-[13.5px] text-[#4b5563] leading-[1.65] mb-[18px]">{popupData.desc || popupData.description}</p>
        <div className="bg-[#f8fafc] rounded-[16px] py-[18px] px-[20px] mb-[20px] border border-[#e2e8f0]">
          <div className="text-[11px] font-extrabold tracking-[0.1em] uppercase text-[#94a3b8] mb-[14px]">Advertisement Details</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center text-[15px] shrink-0 bg-[#eef2ff]">👤</div>
              <div>
                <div className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-[0.05em]">Student</div>
                <div className="text-[13px] font-bold text-[#1e1b4b] mt-[1px] flex items-center gap-2">
                  {popupData.student || popupData.studentId}
                  {popupData.ownerTrust && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${
                      popupData.ownerTrust.levelClass === 'high' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      popupData.ownerTrust.levelClass === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                      TRUST: {popupData.ownerTrust.level}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-[10px]"><div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center text-[15px] shrink-0 bg-[#f0fdf4]">📞</div><div><div className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-[0.05em]">Contact</div><div className="text-[13px] font-bold text-[#1e1b4b] mt-[1px]">{popupData.phone || popupData.contactNumber || "N/A"}</div></div></div>
            <div className="flex items-center gap-[10px]"><div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center text-[15px] shrink-0 bg-[#fffbeb]">📍</div><div><div className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-[0.05em]">Location</div><div className="text-[13px] font-bold text-[#1e1b4b] mt-[1px]">{popupData.location}</div></div></div>
          </div>
        </div>
        <div className="flex gap-[10px]">
          {popupData.source === 'vault' && <button className="flex-1 py-[12px] px-[18px] rounded-[12px] cursor-pointer font-epilogue text-[13px] font-bold bg-[#eef2ff] text-[#4338ca] border-[1.5px] border-[#c7d2fe] transition-colors hover:bg-[#e0e7ff] hover:border-[#a5b4fc]">Contact Admin</button>}
          {popupData.source !== 'vault' && (
            <a 
              href={`https://wa.me/${(popupData.phone || popupData.contactNumber || '').replace(/\D/g, '')}`} 
              target="_blank" 
              className="flex-1 py-[12px] px-[18px] rounded-[12px] cursor-pointer font-epilogue text-[13px] font-bold bg-[#25d366] text-white border-none transition-all shadow-[0_4px_14px_rgba(37,211,102,0.35)] hover:bg-[#1ebe5d] hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)] hover:-translate-y-[1px] inline-flex items-center justify-center gap-[8px] no-underline"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.926a.5.5 0 0 0 .608.632l6.288-1.643A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 0 1-5.031-1.378l-.36-.214-3.733.976.999-3.648-.235-.374A9.861 9.861 0 0 1 2.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z" /></svg> WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  </div>
);
export const AlertBanner = () => {
  const [show, setShow] = useState(true);
  if (!show) return null;
  return (
    <div className="bg-gradient-to-br from-[#4f46e5]/[0.08] to-[#6366f1]/[0.05] border border-[#6366f1]/20 rounded-[14px] py-[12px] px-[18px] flex items-center gap-[12px] mb-[14px]">
      <div className="w-[8px] h-[8px] rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b] animate-pulse shrink-0" />
      <div className="text-[13px] text-[#3730a3] flex-1">Your advertisement for <strong>"MacBook Air"</strong> will expire in <strong>2 days</strong>. <span className="text-[#4f46e5] underline font-semibold cursor-pointer">Renew now →</span></div>
      <div className="text-[15px] text-[#6b7280] cursor-pointer shrink-0" onClick={() => setShow(false)}>✕</div>
    </div>
  );
};

const RF_CATS = [
  '💻 Laptops & Computers', '📱 Phones & Tablets', '🎧 Audio & Headphones',
  '⌚ Watches & Accessories', '👜 Bags & Backpacks', '🔑 Keys & Keychains',
  '👓 Eyewear', '📚 Books & Stationery', '🪪 ID Cards & Documents',
  '👗 Clothing & Apparel', '🎮 Electronics & Gadgets', '➕ Others',
];
const RF_ACCENT = {
  Lost: { from: '#4338ca', to: '#6366f1', shadow: 'rgba(67,56,202,0.42)' },
  Found: { from: '#7c3aed', to: '#a78bfa', shadow: 'rgba(124,58,237,0.42)' }
};

const ReportItemModal = ({ isOpen, onClose, initialType }) => {
  const [rfMode, setRfMode] = useState('Lost');
  const [rfStep, setRfStep] = useState(0);
  const [rfCat, setRfCat] = useState('');
  const [rfStatus, setRfStatus] = useState('Active');
  const [rfError, setRfError] = useState('');
  const [drag, setDrag] = useState(false);
  const [rfSubmitting, setRfSubmitting] = useState(0); // 0=none, 1=loading, 2=success

  const [form, setForm] = useState({
    name: '', sid: '', date: new Date().toISOString().split('T')[0],
    title: '', desc: '', loc: '', phone: '', wa: '', img: null
  });

  useEffect(() => {
    if (isOpen) {
      setRfMode(initialType === 'found' ? 'Found' : 'Lost');
      setRfStep(0); setRfCat(''); setRfStatus('Active'); setRfError('');
      setRfSubmitting(0);
      setForm(f => ({ ...f, name: '', sid: '', date: new Date().toISOString().split('T')[0], title: '', desc: '', loc: '', phone: '', wa: '', img: null }));
    }
  }, [isOpen, initialType]);

  const fileInputRef = React.useRef(null);

  if (!isOpen) return null;

  const A = RF_ACCENT[rfMode];
  const setV = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const validate = () => {
    if (rfStep === 0) {
      if (!form.name.trim()) return 'Full name is required';
      if (!form.sid.trim()) return 'Student ID is required';
      if (!form.date) return 'Date is required';
    }
    if (rfStep === 1) {
      if (!form.title.trim()) return 'Item title is required';
      if (!form.desc.trim()) return 'Description is required';
      if (!rfCat) return 'Please select a category';
      if (!form.loc) return 'Please select a location';
    }
    if (rfStep === 2) {
      if (!form.phone.trim()) return 'Contact number is required';
    }
    return null;
  };

  const goNext = () => {
    const err = validate();
    setRfError(err || '');
    if (!err) setRfStep(rfStep + 1);
  };
  const goBack = () => { setRfError(''); setRfStep(rfStep - 1); };

  const doSubmit = () => {
    const err = validate();
    setRfError(err || '');
    if (err) return;
    setRfSubmitting(1);
    setTimeout(() => {
      setRfSubmitting(2);
      setTimeout(onClose, 1200);
    }, 1500);
  };

  const buildWa = (p) => {
    const phone = p.replace(/\D/g, '');
    const t = form.title || 'your item';
    if (phone) setV('wa', `https://wa.me/${phone}?text=${encodeURIComponent(`Hi! I saw your UniVault post about "${t}". I'd like to help.`)}`);
  };

  const handleFile = (f) => {
    if (f) {
      const rd = new FileReader();
      rd.onload = e => setV('img', e.target.result);
      rd.readAsDataURL(f);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-[16px] bg-[#0a0623]/[0.68] backdrop-blur-[8px] transition-opacity" onClick={e => e.target === e.currentTarget && onClose()}>
      {/* Orbs */}
      <div className="absolute rounded-full blur-[80px] pointer-events-none transition-all duration-300 w-[380px] h-[380px] top-[5%] left-[8%] opacity-[0.18]" style={{ background: `radial-gradient(circle, ${A.from}, transparent)` }}></div>
      <div className="absolute rounded-full blur-[80px] pointer-events-none transition-all duration-300 w-[300px] h-[300px] bottom-[8%] right-[8%] opacity-[0.14]" style={{ background: `radial-gradient(circle, ${A.to}, transparent)` }}></div>

      <div className="relative w-full max-w-[600px] max-h-[92vh] rounded-[28px] flex flex-col overflow-hidden bg-white/[0.92] backdrop-blur-[40px] border-[1.5px] border-[#a5b4fc]/[0.32] shadow-[0_40px_100px_rgba(10,6,35,0.24),0_0_0_1px_rgba(255,255,255,0.85)] font-epilogue">
        {/* Header */}
        <div className="relative p-[26px] px-[28px] pb-[20px] shrink-0 overflow-hidden transition-all duration-350" style={{ background: `linear-gradient(135deg, ${A.from}, ${A.to})` }}>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/20 to-transparent via-transparent via-60%"></div>
          <button className="absolute top-[20px] right-[20px] w-[32px] h-[32px] rounded-full bg-white/[0.22] hover:bg-white/[0.38] text-white/85 text-[16px] flex items-center justify-center transition-all cursor-pointer border-none" onClick={onClose}>✕</button>

          <div className="flex gap-[8px] mb-[13px]">
            <button onClick={() => setRfMode('Lost')} className={`px-[18px] py-[6px] rounded-full text-[12px] font-bold cursor-pointer transition-all border-[1.5px] border-white/[0.42] ${rfMode === 'Lost' ? 'bg-white/[0.94] text-[${A.from}]' : 'bg-white/20 text-white'}`} style={rfMode === 'Lost' ? { color: A.from } : {}}>🔴 Lost Item</button>
            <button onClick={() => setRfMode('Found')} className={`px-[18px] py-[6px] rounded-full text-[12px] font-bold cursor-pointer transition-all border-[1.5px] border-white/[0.42] ${rfMode === 'Found' ? 'bg-white/[0.94] text-[${A.from}]' : 'bg-white/20 text-white'}`} style={rfMode === 'Found' ? { color: A.from } : {}}>🟢 Found Item</button>
          </div>
          <div className="font-clash text-[24px] font-bold text-white mb-[4px]">{rfMode === 'Lost' ? 'Report a Lost Item' : 'Post a Found Item'}</div>
          <div className="text-[13px] text-white/[0.72]">{rfMode === 'Lost' ? 'Fill in the details to help the community find your item' : 'Help someone reunite with their belonging'}</div>

          <div className="flex items-center gap-[8px] mt-[18px]">
            {[0, 1, 2].map(i => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-[7px]">
                  <div className="w-[24px] h-[24px] rounded-full flex items-center justify-center text-[11px] font-bold transition-all" style={{ background: i <= rfStep ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.25)', color: i <= rfStep ? A.from : 'rgba(255,255,255,0.65)' }}>{i < rfStep ? '✓' : i + 1}</div>
                  <span className="text-[11.5px] font-bold transition-colors" style={{ color: i <= rfStep ? '#fff' : 'rgba(255,255,255,0.5)' }}>{['Basic Info', 'Item Details', 'Contact & Image'][i]}</span>
                </div>
                {i < 2 && <div className="w-[28px] h-[1.5px] rounded-[2px] transition-colors" style={{ background: i < rfStep ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)' }}></div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-[24px] px-[28px] custom-scrollbar">
          {rfError && <div className="flex items-center gap-[8px] bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[13px] p-[12px] px-[16px] rounded-[12px] mb-[16px]"><span>⚠️</span><span>{rfError}</span></div>}

          {rfStep === 0 && (
            <div>
              <div className="mb-[18px]">
                <div className="flex items-center gap-[6px] mb-[8px] flex-wrap"><strong className="text-[13px] font-bold text-[#1e1b4b]">👤 Full Name</strong><span className="text-[#ef4444]">*</span></div>
                <input className="w-full p-[12px] px-[16px] rounded-[12px] text-[14px] border-[1.5px] border-[#a5b4fc]/35 bg-[#f8fafc]/90 text-[#1e1b4b] outline-none transition-all focus:bg-white" value={form.name} onChange={e => setV('name', e.target.value)} type="text" placeholder="e.g. Jane Doe" style={{ ':focus': { borderColor: A.from, boxShadow: `0 0 0 3px ${A.from}18` } }} onFocus={e => { e.target.style.borderColor = A.from; e.target.style.boxShadow = `0 0 0 3px ${A.from}18`; }} onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }} />
              </div>
              <div className="mb-[18px]">
                <div className="flex items-center gap-[6px] mb-[8px] flex-wrap"><strong className="text-[13px] font-bold text-[#1e1b4b]">🪪 Student ID</strong><span className="text-[#ef4444]">*</span></div>
                <input className="w-full p-[12px] px-[16px] rounded-[12px] text-[14px] border-[1.5px] border-[#a5b4fc]/35 bg-[#f8fafc]/90 text-[#1e1b4b] outline-none transition-all focus:bg-white" value={form.sid} onChange={e => setV('sid', e.target.value)} type="text" placeholder="e.g. IT21234567" onFocus={e => { e.target.style.borderColor = A.from; e.target.style.boxShadow = `0 0 0 3px ${A.from}18`; }} onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }} />
              </div>
              <div className="mb-[18px]">
                <div className="flex items-center gap-[6px] mb-[8px] flex-wrap"><strong className="text-[13px] font-bold text-[#1e1b4b]">📅 Date of Incident</strong><span className="text-[#ef4444]">*</span><span className="text-[11px] text-[#9ca3af]">— When did it happen?</span></div>
                <input className="w-full p-[12px] px-[16px] rounded-[12px] text-[14px] border-[1.5px] border-[#a5b4fc]/35 bg-[#f8fafc]/90 text-[#1e1b4b] outline-none transition-all focus:bg-white" value={form.date} onChange={e => setV('date', e.target.value)} type="date" onFocus={e => { e.target.style.borderColor = A.from; e.target.style.boxShadow = `0 0 0 3px ${A.from}18`; }} onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }} />
              </div>
              <div className="mb-[18px]">
                <div className="flex items-center gap-[6px] mb-[8px] flex-wrap"><strong className="text-[13px] font-bold text-[#1e1b4b]">📊 Status</strong></div>
                <div className="flex gap-[8px]">
                  <button onClick={() => setRfStatus('Active')} className="flex-1 p-[11px] rounded-[12px] text-[13px] font-bold cursor-pointer border-[1.5px] transition-all" style={rfStatus === 'Active' ? { background: `linear-gradient(135deg,${A.from},${A.to})`, boxShadow: `0 4px 12px ${A.shadow}`, color: '#fff', borderColor: 'transparent' } : { background: 'rgba(241,245,249,0.9)', color: '#64748b', borderColor: 'rgba(165,180,252,0.28)' }}>🟢 Active</button>
                  <button onClick={() => setRfStatus('Resolved')} className="flex-1 p-[11px] rounded-[12px] text-[13px] font-bold cursor-pointer border-[1.5px] transition-all" style={rfStatus === 'Resolved' ? { background: `linear-gradient(135deg,${A.from},${A.to})`, boxShadow: `0 4px 12px ${A.shadow}`, color: '#fff', borderColor: 'transparent' } : { background: 'rgba(241,245,249,0.9)', color: '#64748b', borderColor: 'rgba(165,180,252,0.28)' }}>✅ Resolved</button>
                </div>
              </div>
            </div>
          )}

          {rfStep === 1 && (
            <div>
              <div className="mb-[18px]">
                <div className="flex items-center gap-[6px] mb-[8px] flex-wrap"><strong className="text-[13px] font-bold text-[#1e1b4b]">🏷️ Item Title</strong><span className="text-[#ef4444]">*</span><span className="text-[11px] text-[#9ca3af]">— Short specific name</span></div>
                <input className="w-full p-[12px] px-[16px] rounded-[12px] text-[14px] border-[1.5px] border-[#a5b4fc]/35 bg-[#f8fafc]/90 text-[#1e1b4b] outline-none transition-all focus:bg-white" value={form.title} onChange={e => { setV('title', e.target.value); buildWa(form.phone); }} type="text" placeholder="e.g. MacBook Air Silver M1" onFocus={e => { e.target.style.borderColor = A.from; e.target.style.boxShadow = `0 0 0 3px ${A.from}18`; }} onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }} />
              </div>
              <div className="mb-[18px]">
                <div className="flex items-center gap-[6px] mb-[8px] flex-wrap"><strong className="text-[13px] font-bold text-[#1e1b4b]">📝 Description</strong><span className="text-[#ef4444]">*</span><span className="text-[11px] text-[#9ca3af]">— Colour, brand, unique marks</span></div>
                <textarea className="w-full p-[12px] px-[16px] rounded-[12px] text-[14px] border-[1.5px] border-[#a5b4fc]/35 bg-[#f8fafc]/90 text-[#1e1b4b] outline-none transition-all focus:bg-white resize-none" rows="4" value={form.desc} onChange={e => setV('desc', e.target.value)} placeholder="Describe the item in detail — colour, size, brand, any unique marks or stickers..." onFocus={e => { e.target.style.borderColor = A.from; e.target.style.boxShadow = `0 0 0 3px ${A.from}18`; }} onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}></textarea>
              </div>
              <div className="mb-[18px]">
                <div className="flex items-center gap-[6px] mb-[8px] flex-wrap"><strong className="text-[13px] font-bold text-[#1e1b4b]">🗂️ Category</strong><span className="text-[#ef4444]">*</span></div>
                <div className="grid grid-cols-2 gap-[8px]">
                  {RF_CATS.map(c => (
                    <button key={c} className="p-[10px] px-[12px] border-[1.5px] rounded-[12px] text-[12.5px] font-bold cursor-pointer text-left transition-all truncate" onClick={() => setRfCat(c)} style={rfCat === c ? { background: `linear-gradient(135deg,${A.from},${A.to})`, boxShadow: `0 4px 14px ${A.shadow}`, color: '#fff', borderColor: 'transparent' } : { background: 'rgba(248,250,252,0.9)', color: '#475569', borderColor: 'rgba(165,180,252,0.28)' }}>{c}</button>
                  ))}
                </div>
              </div>
              <div className="mb-[18px]">
                <div className="flex items-center gap-[6px] mb-[8px] flex-wrap"><strong className="text-[13px] font-bold text-[#1e1b4b]">📍 Location</strong><span className="text-[#ef4444]">*</span><span className="text-[11px] text-[#9ca3af]">— Where was it lost/found?</span></div>
                <div className="relative">
                  <select className="w-full p-[12px] px-[16px] rounded-[12px] text-[14px] border-[1.5px] border-[#a5b4fc]/35 bg-[#f8fafc]/90 text-[#1e1b4b] outline-none transition-all focus:bg-white appearance-none cursor-pointer" value={form.loc} onChange={e => setV('loc', e.target.value)} onFocus={e => { e.target.style.borderColor = A.from; e.target.style.boxShadow = `0 0 0 3px ${A.from}18`; }} onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }}>
                    <option value="">Select campus location...</option>
                    <option>Engineering Hall</option><option>CS Lab – Block A</option><option>CS Lab – Block B</option><option>Science Block</option><option>Main Library</option><option>Student Café</option><option>Sports Complex</option><option>Gym Block B</option><option>Lecture Hall 3B</option><option>Administration Block</option><option>Medical Centre</option><option>Hostel Block</option><option>Campus Entrance</option><option>Parking Area</option>
                  </select>
                  <span className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[#9ca3af] text-[12px] pointer-events-none">▾</span>
                </div>
              </div>
            </div>
          )}

          {rfStep === 2 && (
            <div>
              <div className="mb-[18px]">
                <div className="flex items-center gap-[6px] mb-[8px] flex-wrap"><strong className="text-[13px] font-bold text-[#1e1b4b]">📞 Contact Number</strong><span className="text-[#ef4444]">*</span></div>
                <input className="w-full p-[12px] px-[16px] rounded-[12px] text-[14px] border-[1.5px] border-[#a5b4fc]/35 bg-[#f8fafc]/90 text-[#1e1b4b] outline-none transition-all focus:bg-white" value={form.phone} onChange={e => { setV('phone', e.target.value); buildWa(e.target.value); }} type="tel" placeholder="+94 77 123 4567" onFocus={e => { e.target.style.borderColor = A.from; e.target.style.boxShadow = `0 0 0 3px ${A.from}18`; }} onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }} />
              </div>
              <div className="mb-[18px]">
                <div className="flex items-center gap-[6px] mb-[8px] flex-wrap"><strong className="text-[13px] font-bold text-[#1e1b4b]">💬 WhatsApp Link</strong><span className="text-[11px] text-[#9ca3af]">— Auto-generated, editable</span></div>
                <div className="relative">
                  <input className="w-full p-[12px] px-[16px] rounded-[12px] text-[14px] border-[1.5px] border-[#a5b4fc]/35 bg-[#f8fafc]/90 text-[#1e1b4b] outline-none transition-all focus:bg-white pr-[80px]" value={form.wa} onChange={e => setV('wa', e.target.value)} type="text" placeholder="https://wa.me/94771234567" onFocus={e => { e.target.style.borderColor = A.from; e.target.style.boxShadow = `0 0 0 3px ${A.from}18`; }} onBlur={e => { e.target.style.borderColor = ''; e.target.style.boxShadow = ''; }} />
                  {form.wa && <a href={form.wa} target="_blank" rel="noreferrer" className="absolute right-[10px] top-1/2 -translate-y-1/2 text-[11px] font-bold p-[5px] px-[11px] rounded-[8px] bg-[#25d366] text-white no-underline">Test ↗</a>}
                </div>
              </div>
              <div className="mb-[18px]">
                <div className="flex items-center gap-[6px] mb-[8px] flex-wrap"><strong className="text-[13px] font-bold text-[#1e1b4b]">🖼️ Item Image</strong><span className="text-[11px] text-[#9ca3af]">— Optional, helps identification</span></div>
                <div className="border-[2px] border-dashed rounded-[16px] min-h-[120px] flex flex-col items-center justify-center p-[24px] cursor-pointer text-center relative overflow-hidden transition-all duration-200" style={drag ? { borderColor: A.from, background: 'rgba(99,102,241,0.06)' } : { borderColor: 'rgba(165,180,252,0.45)', background: 'rgba(248,250,252,0.7)' }} onClick={() => fileInputRef.current?.click()} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}>
                  {!form.img && (
                    <div>
                      <div className="w-[52px] h-[52px] rounded-[16px] mx-auto mb-[10px] flex items-center justify-center text-[22px]" style={{ background: `linear-gradient(135deg,${A.from}22,${A.to}22)` }}>📷</div>
                      <div className="text-[13.5px] font-bold text-[#1e1b4b] mb-[3px]">Drag & drop or <span style={{ textDecoration: 'underline', cursor: 'pointer', color: A.from }}>browse</span></div>
                      <div className="text-[12px] text-[#9ca3af]">PNG, JPG or WEBP — max 5MB</div>
                    </div>
                  )}
                  {form.img && (
                    <div className="relative w-full">
                      <img src={form.img} className="w-full max-h-[180px] object-cover rounded-[14px]" />
                      <button className="absolute top-[8px] right-[8px] w-[28px] h-[28px] rounded-full bg-black/55 text-white flex items-center justify-center text-[13px] border-none cursor-pointer" onClick={(e) => { e.stopPropagation(); setV('img', null); }}>✕</button>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => handleFile(e.target.files[0])} />
              </div>

              <div className="rounded-[18px] p-[16px] mt-[4px]" style={{ background: `linear-gradient(135deg,${A.from}10,${A.to}08)`, border: `1px solid ${A.from}28` }}>
                <div className="text-[10.5px] font-extrabold uppercase tracking-[0.12em] mb-[12px]" style={{ color: A.from }}>📋 Submission Summary</div>
                <div className="grid grid-cols-2 gap-y-[10px] gap-x-[16px]">
                  {[
                    ['Type', rfMode], ['Name', form.name], ['ID', form.sid], ['Title', form.title],
                    ['Category', rfCat ? rfCat.split(' ').slice(1).join(' ') : ''], ['Location', form.loc],
                    ['Date', form.date], ['Contact', form.phone]
                  ].filter(([_, v]) => v).map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[10px] font-bold text-[#9ca3af] uppercase">{k}</div>
                      <div className="text-[12.5px] font-bold text-[#1e1b4b] whitespace-nowrap overflow-hidden text-ellipsis">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-[18px] px-[28px] flex items-center gap-[10px] shrink-0 border-t border-[#a5b4fc]/[0.18] bg-[#f8fafc]/75">
          {rfStep > 0 && <button className="p-[12px] px-[20px] rounded-[12px] text-[13px] font-bold cursor-pointer text-[#64748b] bg-[#f1f5f9]/90 border-[1.5px] border-[#a5b4fc]/[0.28] hover:bg-[#e2e8f0]/90 transition-all border-none" onClick={goBack}>← Back</button>}
          <button className="p-[12px] px-[20px] rounded-[12px] text-[13px] font-bold cursor-pointer text-[#64748b] bg-[#f1f5f9]/90 border-[1.5px] border-[#a5b4fc]/[0.28] hover:bg-[#e2e8f0]/90 transition-all border-none" onClick={onClose}>Cancel</button>
          <div className="flex-1"></div>
          <div className="flex gap-[6px] items-center">
            {[0, 1, 2].map(i => <div key={i} className="h-[6px] rounded-full transition-all duration-300" style={{ width: i === rfStep ? 20 : 6, background: i <= rfStep ? A.from : 'rgba(165,180,252,0.35)' }}></div>)}
          </div>
          {rfStep < 2 && <button className="p-[12px] px-[26px] rounded-[12px] text-[13px] font-bold text-white cursor-pointer border-none transition-all" style={{ background: `linear-gradient(135deg,${A.from},${A.to})`, boxShadow: `0 4px 16px ${A.shadow}` }} onClick={goNext}>Next →</button>}
          {rfStep === 2 && (
            <button className="p-[12px] px-[26px] rounded-[12px] text-[13px] font-bold text-white cursor-pointer border-none transition-all flex items-center justify-center" disabled={rfSubmitting > 0} style={rfSubmitting === 2 ? { background: 'linear-gradient(135deg,#059669,#34d399)', boxShadow: '0 4px 16px rgba(5,150,105,0.4)', opacity: 1 } : { background: `linear-gradient(135deg,${A.from},${A.to})`, boxShadow: `0 4px 16px ${A.shadow}`, opacity: rfSubmitting === 1 ? 0.6 : 1 }} onClick={doSubmit}>
              {rfSubmitting === 0 && '✓ Submit Report'}
              {rfSubmitting === 1 && <><div className="inline-block w-[15px] h-[15px] border-2 border-white/[0.35] border-t-white rounded-full animate-spin mr-[6px]"></div> Submitting…</>}
              {rfSubmitting === 2 && '✅ Submitted!'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function LostFoundDashboard({ ads }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('feed');
  const [popupData, setPopupData] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportModalType, setReportModalType] = useState('lost');
  const [selectedLostItemId, setSelectedLostItemId] = useState(null); // For scanning
  const [refreshMatches, setRefreshMatches] = useState(0);
  const [allAds, setAllAds] = useState(ads || {});
  const [searchQuery, setSearchQuery] = useState('');
  const [boardFilter, setBoardFilter] = useState('All');

  const lostCount = Object.values(allAds).filter(ad => ad.type === 'LOST').length;
  const foundCount = Object.values(allAds).filter(ad => ad.type === 'FOUND').length;

  useEffect(() => {
    const fetchRealItems = async () => {
      try {
        const [lostRes, foundRes] = await Promise.all([
          axios.get('http://localhost:5000/api/lost-items'),
          axios.get('http://localhost:5000/api/found-items')
        ]);

        const realAds = {};
        
        // Process lost items
        lostRes.data.forEach(item => {
          realAds[item._id] = {
            ...item,
            img: item.imageUrl,
            type: "LOST",
            status: "Active",
            statusClass: "bg-[rgba(239,68,68,0.88)] text-white",
            typeClass: "bg-[rgba(239,68,68,0.88)] text-white"
          };
        });

        // Process found items
        foundRes.data.forEach(item => {
          realAds[item._id] = {
            ...item,
            img: item.imageUrl,
            type: "FOUND",
            status: "Active",
            statusClass: "bg-[rgba(16,185,129,0.88)] text-white",
            typeClass: "bg-[rgba(16,185,129,0.88)] text-white"
          };
        });

        setAllAds(prev => ({ ...prev, ...realAds }));
      } catch (err) {
        console.error("Error fetching real items:", err);
      }
    };

    fetchRealItems();
  }, [refreshMatches]);

  const displayAds = allAds;

  const openAdPopup = async (id, source = 'feed') => {
    // Set initial data for immediate response
    const baseData = displayAds[id];
    setPopupData({ ...baseData, uid: id, source, loadingTrust: true });
    document.body.style.overflow = 'hidden';

    try {
      // Fetch detailed data with owner trust
      const isLost = baseData.type === 'LOST' || baseData.type === 'Lost';
      const response = await (isLost ? getLostItemById(id) : getFoundItemById(id));
      
      if (response.data) {
        setPopupData(prev => ({
          ...prev,
          ...response.data.item,
          ownerTrust: response.data.ownerTrust,
          loadingTrust: false
        }));
      }
    } catch (err) {
      console.error("Error fetching popup trust data:", err);
      setPopupData(prev => ({ ...prev, loadingTrust: false }));
    }
  };

  const closePopup = () => {
    setPopupData(null);
    document.body.style.overflow = '';
  };

  const openReportModal = (type) => {
    setReportModalType(type);
    setReportModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeReportModal = () => {
    setReportModalOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        closePopup();

      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="font-epilogue text-[#1e1b4b] bg-[radial-gradient(ellipse_80%_50%_at_10%_0%,rgba(196,181,253,0.55),transparent),radial-gradient(ellipse_70%_60%_at_90%_20%,rgba(147,197,253,0.45),transparent),radial-gradient(ellipse_60%_50%_at_50%_80%,rgba(167,139,250,0.3),transparent),radial-gradient(ellipse_50%_40%_at_80%_60%,rgba(191,219,254,0.35),transparent),radial-gradient(ellipse_40%_35%_at_20%_70%,rgba(216,180,254,0.25),transparent),linear-gradient(160deg,#f8f6ff_0%,#ede9fe_22%,#e8eeff_44%,#dbeafe_66%,#eff6ff_100%)] min-h-screen relative">
      <Sidebar 
        counts={{ lost: lostCount, found: foundCount }} 
        activeFilter={boardFilter} 
        onFilterChange={setBoardFilter}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <Topbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <main className="ml-0 lg:ml-[260px] pt-[200px] lg:pt-[310px]">
        <div className="p-[16px] lg:px-[20px] lg:pb-[36px] max-w-[1200px] mx-auto">
          <AlertBanner />
          {/* Removed redundant FeedPage/VaultPage rendering here */}

          {/* CTA ACTION CARDS — highlighted, prominent */}
          <div className="flex flex-col lg:flex-row gap-[14px] mb-[20px]">
            <div className="flex-1 flex items-center p-[18px] rounded-[22px] shadow-[0_8px_24px_rgba(79,70,229,0.15)] hover:-translate-y-[4px] transition-all cursor-pointer bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] pointer-events-none"></div>
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-[14px] bg-white/20 text-[26px] shrink-0 mr-[16px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] backdrop-blur-md relative z-10 transition-transform group-hover:scale-110">📋</div>
              <div className="flex-1 relative z-10">
                <div className="text-[17px] font-bold leading-[1.2] mb-[4px] font-clash tracking-wide drop-shadow-sm">Report Lost Item</div>
                <div className="text-[12px] text-indigo-100/90 leading-[1.3] font-medium">Describe & post your missing item</div>
              </div>
              <button onClick={() => navigate('/report-item', { state: { type: 'lost' } })} className="px-[16px] py-[10px] rounded-[10px] text-[13px] font-bold transition-all whitespace-nowrap ml-[12px] bg-white/20 hover:bg-white/30 border-2 border-white/20 hover:border-white/40 text-white shadow-sm font-epilogue relative z-10 backdrop-blur-sm cursor-pointer">Report Now →</button>
            </div>

            <div className="flex-1 flex items-center p-[18px] rounded-[22px] shadow-[0_8px_24px_rgba(168,85,247,0.15)] hover:-translate-y-[4px] transition-all cursor-pointer bg-gradient-to-br from-[#a855f7] to-[#8b5cf6] text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] pointer-events-none"></div>
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-[14px] bg-white/20 text-[26px] shrink-0 mr-[16px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] backdrop-blur-md relative z-10 transition-transform group-hover:scale-110">🔍</div>
              <div className="flex-1 relative z-10">
                <div className="text-[17px] font-bold leading-[1.2] mb-[4px] font-clash tracking-wide drop-shadow-sm">Post Found Item</div>
                <div className="text-[12px] text-purple-100/90 leading-[1.3] font-medium">Help reunite someone with their item</div>
              </div>
              <button onClick={() => navigate('/report-item', { state: { type: 'found' } })} className="px-[16px] py-[10px] rounded-[10px] text-[13px] font-bold transition-all whitespace-nowrap ml-[12px] bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 text-white shadow-sm font-epilogue relative z-10 backdrop-blur-sm cursor-pointer">Post Found →</button>
            </div>

            <div className="flex-1 flex items-center p-[18px] rounded-[22px] shadow-[0_8px_24px_rgba(59,130,246,0.15)] hover:-translate-y-[4px] transition-all cursor-pointer bg-gradient-to-br from-[#3b82f6] to-[#0ea5e9] text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] pointer-events-none"></div>
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-[14px] bg-white/20 text-[26px] shrink-0 mr-[16px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] backdrop-blur-md relative z-10 transition-transform group-hover:scale-110">🤖</div>
              <div className="flex-1 relative z-10">
                <div className="text-[17px] font-bold leading-[1.2] mb-[4px] font-clash tracking-wide drop-shadow-sm">AI Match Scan</div>
                <div className="text-[12px] text-blue-100/90 leading-[1.3] font-medium">Let AI find matches for your report</div>
              </div>
              <button onClick={() => {
                // For demo/UX: if no item selected, tell user to go to vault
                if (!selectedLostItemId) {
                  setActiveTab('vault');
                  toast.info("Please select one of your lost items to scan matches for.");
                } else {
                  // In a real flow, the scan is handled inside AIMatchesPanel
                  // This button could scroll there
                  document.querySelector('.ai-matches-panel')?.scrollIntoView({ behavior: 'smooth' });
                }
              }} className="px-[16px] py-[10px] rounded-[10px] text-[13px] font-bold transition-all whitespace-nowrap ml-[12px] bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 text-white shadow-sm font-epilogue relative z-10 backdrop-blur-sm cursor-pointer">Scan Now →</button>
            </div>
          </div>

          {/* Compact categories row */}
          <div className="flex flex-wrap gap-[10px] mb-[26px]">
            <button className="flex items-center gap-[8px] px-[16px] py-[9px] rounded-full text-[13.5px] font-semibold transition-all bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-white shadow-[0_4px_12px_rgba(99,102,241,0.25)] font-epilogue hover:shadow-[0_6px_16px_rgba(99,102,241,0.4)] hover:-translate-y-[1px]">
              📱 Electronics <span className="bg-white/25 text-white px-[7px] py-[2px] rounded-[6px] text-[11px] font-extrabold shadow-sm">142</span>
            </button>
            <button className="group flex items-center gap-[8px] px-[16px] py-[9px] rounded-full text-[13.5px] font-semibold transition-all bg-white/80 backdrop-blur-sm text-[#4b5563] border-[1.5px] border-[#e2e8f0] shadow-sm font-epilogue hover:bg-white hover:text-[#4f46e5] hover:border-[#a5b4fc] hover:-translate-y-[1px]">
              🪪 ID Cards <span className="bg-[#f1f5f9] text-[#64748b] px-[7px] py-[2px] rounded-[6px] text-[11px] font-extrabold group-hover:bg-[#e0e7ff] group-hover:text-[#4f46e5] transition-colors">38</span>
            </button>
            <button className="group flex items-center gap-[8px] px-[16px] py-[9px] rounded-full text-[13.5px] font-semibold transition-all bg-white/80 backdrop-blur-sm text-[#4b5563] border-[1.5px] border-[#e2e8f0] shadow-sm font-epilogue hover:bg-white hover:text-[#4f46e5] hover:border-[#a5b4fc] hover:-translate-y-[1px]">
              📚 Books <span className="bg-[#f1f5f9] text-[#64748b] px-[7px] py-[2px] rounded-[6px] text-[11px] font-extrabold group-hover:bg-[#e0e7ff] group-hover:text-[#4f46e5] transition-colors">76</span>
            </button>
            <button className="group flex items-center gap-[8px] px-[16px] py-[9px] rounded-full text-[13.5px] font-semibold transition-all bg-white/80 backdrop-blur-sm text-[#4b5563] border-[1.5px] border-[#e2e8f0] shadow-sm font-epilogue hover:bg-white hover:text-[#4f46e5] hover:border-[#a5b4fc] hover:-translate-y-[1px]">
              👜 Bags <span className="bg-[#f1f5f9] text-[#64748b] px-[7px] py-[2px] rounded-[6px] text-[11px] font-extrabold group-hover:bg-[#e0e7ff] group-hover:text-[#4f46e5] transition-colors">54</span>
            </button>
            <button className="group flex items-center gap-[8px] px-[16px] py-[9px] rounded-full text-[13.5px] font-semibold transition-all bg-white/80 backdrop-blur-sm text-[#4b5563] border-[1.5px] border-[#e2e8f0] shadow-sm font-epilogue hover:bg-white hover:text-[#4f46e5] hover:border-[#a5b4fc] hover:-translate-y-[1px]">
              ⌚ Accessories <span className="bg-[#f1f5f9] text-[#64748b] px-[7px] py-[2px] rounded-[6px] text-[11px] font-extrabold group-hover:bg-[#e0e7ff] group-hover:text-[#4f46e5] transition-colors">91</span>
            </button>
            <button className="group flex items-center gap-[8px] px-[16px] py-[9px] rounded-full text-[13.5px] font-semibold transition-all bg-white/80 backdrop-blur-sm text-[#4b5563] border-[1.5px] border-[#e2e8f0] shadow-sm font-epilogue hover:bg-white hover:text-[#4f46e5] hover:border-[#a5b4fc] hover:-translate-y-[1px]">
              🔑 Keys <span className="bg-[#f1f5f9] text-[#64748b] px-[7px] py-[2px] rounded-[6px] text-[11px] font-extrabold group-hover:bg-[#e0e7ff] group-hover:text-[#4f46e5] transition-colors">29</span>
            </button>
            <button className="group flex items-center gap-[8px] px-[16px] py-[9px] rounded-full text-[13.5px] font-semibold transition-all bg-white/80 backdrop-blur-sm text-[#4b5563] border-[1.5px] border-[#e2e8f0] shadow-sm font-epilogue hover:bg-white hover:text-[#4f46e5] hover:border-[#a5b4fc] hover:-translate-y-[1px]">
              👓 Eyewear <span className="bg-[#f1f5f9] text-[#64748b] px-[7px] py-[2px] rounded-[6px] text-[11px] font-extrabold group-hover:bg-[#e0e7ff] group-hover:text-[#4f46e5] transition-colors">17</span>
            </button>
            <button className="group flex items-center gap-[8px] px-[16px] py-[9px] rounded-full text-[13.5px] font-semibold transition-all bg-white/80 backdrop-blur-sm text-[#4b5563] border-[1.5px] border-[#e2e8f0] shadow-sm font-epilogue hover:bg-white hover:text-[#4f46e5] hover:border-[#a5b4fc] hover:-translate-y-[1px]">
              🎧 Headphones <span className="bg-[#f1f5f9] text-[#64748b] px-[7px] py-[2px] rounded-[6px] text-[11px] font-extrabold group-hover:bg-[#e0e7ff] group-hover:text-[#4f46e5] transition-colors">33</span>
            </button>
            <button className="group flex items-center gap-[8px] px-[16px] py-[9px] rounded-full text-[13.5px] font-semibold transition-all bg-white/80 backdrop-blur-sm text-[#4b5563] border-[1.5px] border-[#e2e8f0] shadow-sm font-epilogue hover:bg-white hover:text-[#4f46e5] hover:border-[#a5b4fc] hover:-translate-y-[1px]">
              💻 Laptops <span className="bg-[#f1f5f9] text-[#64748b] px-[7px] py-[2px] rounded-[6px] text-[11px] font-extrabold group-hover:bg-[#e0e7ff] group-hover:text-[#4f46e5] transition-colors">48</span>
            </button>
            <button className="group flex items-center gap-[8px] px-[16px] py-[9px] rounded-full text-[13.5px] font-semibold transition-all bg-white/80 backdrop-blur-sm text-[#4b5563] border-[1.5px] border-[#e2e8f0] shadow-sm font-epilogue hover:bg-white hover:text-[#4f46e5] hover:border-[#a5b4fc] hover:-translate-y-[1px]">
              ➕ Others <span className="bg-[#f1f5f9] text-[#64748b] px-[7px] py-[2px] rounded-[6px] text-[11px] font-extrabold group-hover:bg-[#e0e7ff] group-hover:text-[#4f46e5] transition-colors">205</span>
            </button>
          </div>

          {/* Page Tabs */}
          <div className="flex gap-[6px] mb-[14px] border-b-[2px] border-[#a5b4fc]/[0.18] pb-0 mt-[14px]">
            <button onClick={() => setActiveTab('feed')} className={`font-epilogue text-[13.5px] font-bold py-[9px] px-[22px] rounded-t-[10px] border-none cursor-pointer border-b-[2px] -mb-[2px] transition-colors ${activeTab === 'feed' ? 'text-[#4f46e5] border-b-[#4f46e5] bg-[#6366f1]/[0.07]' : 'text-[#6b7280] border-b-transparent bg-transparent hover:text-[#6366f1] hover:bg-[#6366f1]/[0.04]'}`}>🏛️ Community Board</button>
            <button onClick={() => setActiveTab('vault')} className={`font-epilogue text-[13.5px] font-bold py-[9px] px-[22px] rounded-t-[10px] border-none cursor-pointer border-b-[2px] -mb-[2px] transition-colors ${activeTab === 'vault' ? 'text-[#4f46e5] border-b-[#4f46e5] bg-[#6366f1]/[0.07]' : 'text-[#6b7280] border-b-transparent bg-transparent hover:text-[#6366f1] hover:bg-[#6366f1]/[0.04]'}`}>🗄️ My Vault</button>
          </div>

          {activeTab === 'feed' ? (
            <FeedPage 
              openAdPopup={openAdPopup} 
              ads={displayAds} 
              selectedLostItemId={selectedLostItemId} 
              setSelectedLostItemId={setSelectedLostItemId}
              setRefreshMatches={setRefreshMatches}
              searchQuery={searchQuery}
              filter={boardFilter}
              setFilter={setBoardFilter}
            />
          ) : (
            <VaultPage 
              openAdPopup={openAdPopup} 
              ads={displayAds} 
              selectedLostItemId={selectedLostItemId} 
              setSelectedLostItemId={setSelectedLostItemId} 
              setRefreshMatches={setRefreshMatches}
            />
          )}
        </div>
      </main>

      {/* Mobile Bot Nav */}
      <nav className="flex lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-[24px] border-t border-[#a5b4fc]/20 p-[10px] px-[16px] z-[300] justify-around">
        <div className="flex flex-col items-center gap-[3px] text-[10px] text-[#4f46e5] cursor-pointer"><span className="text-[20px]">🏠</span>Home</div>
        <div className="flex flex-col items-center gap-[3px] text-[10px] text-[#6b7280] cursor-pointer"><span className="text-[20px]">🔍</span>Explore</div>
        <div className="flex flex-col items-center gap-[3px] text-[10px] text-[#6b7280] cursor-pointer"><span className="text-[20px]">📋</span>Report</div>
      </nav>

      {popupData && <AdPopupModal popupData={popupData} closePopup={closePopup} />}

    </div>
  );
}
