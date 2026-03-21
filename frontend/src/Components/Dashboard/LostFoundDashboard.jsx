import React, { useState, useEffect } from 'react';

const adData = {
  comm1:{ img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=500&fit=crop', status:'Active', statusClass:'bg-[#10b981]/88 text-white', type:'LOST', typeClass:'bg-[#ef4444]/88 text-white', title:'MacBook Air (Silver)', desc:'13-inch MacBook Air, Apple M1, silver casing with a small sticker near the Apple logo. Last seen on the desk in Lecture Hall 3B.', tags:['💻 Electronics','Laptop','Apple'], student:'Jane Doe', year:'Year 3', phone:'+94 77 123 4567', location:'Engineering Hall, Lecture Hall 3B', date:'Oct 12, 2025', category:'Electronics – Laptop' },
  comm2:{ img:'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&h=500&fit=crop', status:'Active', statusClass:'bg-[#10b981]/88 text-white', type:'LOST', typeClass:'bg-[#ef4444]/88 text-white', title:'Samsung Galaxy A54', desc:'Black Samsung A54 in a blue silicone case with a yellow keychain.', tags:['📱 Electronics','Phone','Samsung'], student:'Ravi K.', year:'Year 2', phone:'+94 71 987 6543', location:'Science Block, Floor 2', date:'Oct 8, 2025', category:'Electronics – Phone' },
  comm3:{ img:'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&h=500&fit=crop', status:'Found', statusClass:'bg-[rgba(79,70,229,0.88)] text-white', type:'FOUND', typeClass:'bg-[rgba(16,185,129,0.88)] text-white', title:'AirPods Pro (with case)', desc:'White AirPods Pro with charging case found near the Sports Complex entrance.', tags:['🎧 Electronics','Earbuds','Apple'], student:'Amal M.', year:'Year 4', phone:'+94 76 234 5678', location:'Sports Complex', date:'Oct 11, 2025', category:'Electronics – Earbuds' },
  comm4:{ img:'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=500&fit=crop', status:'Active', statusClass:'bg-[#10b981]/88 text-white', type:'LOST', typeClass:'bg-[#ef4444]/88 text-white', title:'Apple Watch Series 7', desc:'Black Apple Watch Series 7, 45mm, with a midnight sport band.', tags:['⌚ Accessories','Smartwatch'], student:'Tom M.', year:'Year 2', phone:'+94 75 345 6789', location:'Gym Block B', date:'Oct 10, 2025', category:'Accessories – Smartwatch' },
  comm5:{ img:'https://images.unsplash.com/photo-1544365558-35aa4af41144?w=800&h=500&fit=crop', status:'Active', statusClass:'bg-[#10b981]/88 text-white', type:'LOST', typeClass:'bg-[#ef4444]/88 text-white', title:'Blue Binder (Biology 101)', desc:'A thick blue binder containing all my Biology notes for the semester.', tags:['📚 Academics','Stationery'], student:'Nisha F.', year:'Year 2', phone:'+94 72 456 7890', location:'Library', date:'Oct 9, 2025', category:'Academics' },
  comm6:{ img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop', status:'Active', statusClass:'bg-[#10b981]/88 text-white', type:'LOST', typeClass:'bg-[#ef4444]/88 text-white', title:'Water Bottle (HydroFlask)', desc:'Yellow 32oz HydroFlask with several coding stickers on it.', tags:['🥤 Accessories','Bottle'], student:'Kasun L.', year:'Year 3', phone:'+94 78 567 8901', location:'Café', date:'Oct 7, 2025', category:'Accessories' },
  ad1:{ img:'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=500&fit=crop', status:'Active', statusClass:'bg-[rgba(16,185,129,0.88)] text-white', type:'LOST', typeClass:'bg-[rgba(239,68,68,0.88)] text-white', title:'MacBook Air (Silver)', desc:'13-inch MacBook Air with Apple M1 chip, silver casing.', tags:['💻 Electronics','Laptop'], student:'Jane Doe', year:'Year 3', phone:'+94 77 123 4567', location:'Engineering Hall', date:'Oct 12, 2025', category:'Electronics – Laptop' },
  ad2:{ img:'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&h=500&fit=crop', status:'Matched!', statusClass:'bg-[rgba(79,70,229,0.88)] text-white', type:'LOST', typeClass:'bg-[rgba(239,68,68,0.88)] text-white', title:'HP EliteBook Laptop', desc:'Black HP EliteBook 840 G7, no stickers. Left near the power outlet row.', tags:['💻 Electronics','Laptop'], student:'Jane Doe', year:'Year 3', phone:'+94 77 123 4567', location:'CS Lab, Block B', date:'Oct 10, 2025', category:'Electronics – Laptop' },
};

export const Sidebar = () => (
<aside className="fixed top-0 left-0 bottom-0 w-[260px] bg-white/85 backdrop-blur-[28px] border-r-[1.5px] border-[#a5b4fc]/25 flex flex-col z-[300] shadow-[4px_0_36px_rgba(79,70,229,0.07)] hidden lg:flex">
  <div className="flex items-center gap-[10px] py-[22px] px-[20px] pb-[18px] border-b border-[#a5b4fc]/[0.18]">
    <div className="w-[38px] h-[38px] rounded-[11px] bg-gradient-to-br from-[#4f46e5] to-[#06b6d4] flex items-center justify-center text-[17px] shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
    </div>
    <span className="text-[20px] font-bold text-[#1e1b4b] tracking-[-0.02em]">UniVault</span>
  </div>
  <nav className="flex-1 py-[16px] px-[12px] overflow-y-auto">
    <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#818cf8] px-[10px] pb-[5px] mt-[6px]">Overview</div>
    <a href="#" className="flex items-center gap-[11px] py-[10px] px-[12px] rounded-[12px] text-[13.5px] font-semibold text-[#4f46e5] cursor-pointer transition-all duration-200 no-underline mb-[2px] relative bg-gradient-to-br from-[#4f46e5]/10 to-[#6366f1]/[0.07] border border-[#6366f1]/[0.18]">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[24px] bg-gradient-to-b from-[#4f46e5] to-[#6366f1] rounded-r-[3px]"></div>
      <span className="w-[30px] h-[30px] rounded-[8px] flex flex-shrink-0 items-center justify-center bg-[#e0e7ff] text-[#4338ca] transition-all duration-200">📊</span>
      Dashboard
    </a>
    <a href="#" className="flex items-center gap-[11px] py-[10px] px-[12px] rounded-[12px] text-[13.5px] font-medium text-[#6b7280] cursor-pointer transition-all duration-200 no-underline mb-[2px] hover:bg-[#6366f1]/[0.08] hover:text-[#4f46e5] group">
      <span className="w-[30px] h-[30px] rounded-[8px] flex flex-shrink-0 items-center justify-center bg-[#f8fafc] text-[#94a3b8] transition-all duration-200 group-hover:bg-[#e2e8f0] group-hover:text-[#475569]">🔍</span>
      Lost Items<span className="ml-auto text-[10px] font-bold py-[2px] px-[7px] rounded-full bg-gradient-to-br from-[#ef4444] to-[#dc2626] text-white">3</span>
    </a>
    <a href="#" className="flex items-center gap-[11px] py-[10px] px-[12px] rounded-[12px] text-[13.5px] font-medium text-[#6b7280] cursor-pointer transition-all duration-200 no-underline mb-[2px] hover:bg-[#6366f1]/[0.08] hover:text-[#4f46e5] group">
      <span className="w-[30px] h-[30px] rounded-[8px] flex flex-shrink-0 items-center justify-center bg-[#f0fdf4] text-[#6b7280] transition-all duration-200 group-hover:bg-[#e2e8f0] group-hover:text-[#475569]">✨</span>
      Found Items
    </a>
    <a href="#" className="flex items-center gap-[11px] py-[10px] px-[12px] rounded-[12px] text-[13.5px] font-medium text-[#6b7280] cursor-pointer transition-all duration-200 no-underline mb-[2px] hover:bg-[#6366f1]/[0.08] hover:text-[#4f46e5] group">
      <span className="w-[30px] h-[30px] rounded-[8px] flex flex-shrink-0 items-center justify-center bg-[#f8f8fb] text-[#7c7e9a] transition-all duration-200 group-hover:bg-[#e2e8f0] group-hover:text-[#475569]">🤖</span>
      AI Matches<span className="ml-auto text-[10px] font-bold py-[2px] px-[7px] rounded-full bg-gradient-to-br from-[#4f46e5] to-[#6366f1] text-white">2</span>
    </a>
    <div className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#818cf8] px-[10px] pb-[5px] mt-[6px]">My Content</div>
    <a href="#" className="flex items-center gap-[11px] py-[10px] px-[12px] rounded-[12px] text-[13.5px] font-medium text-[#6b7280] cursor-pointer transition-all duration-200 no-underline mb-[2px] hover:bg-[#6366f1]/[0.08] hover:text-[#4f46e5] group">
      <span className="w-[30px] h-[30px] rounded-[8px] flex flex-shrink-0 items-center justify-center bg-[#fafaf9] text-[#78716c] transition-all duration-200 group-hover:bg-[#e2e8f0] group-hover:text-[#475569]">🗄️</span>
      My Vault
    </a>
    <a href="#" className="flex items-center gap-[11px] py-[10px] px-[12px] rounded-[12px] text-[13.5px] font-medium text-[#6b7280] cursor-pointer transition-all duration-200 no-underline mb-[2px] hover:bg-[#6366f1]/[0.08] hover:text-[#4f46e5] group">
      <span className="w-[30px] h-[30px] rounded-[8px] flex flex-shrink-0 items-center justify-center bg-[#fef9f0] text-[#92400e] transition-all duration-200 group-hover:bg-[#e2e8f0] group-hover:text-[#475569]">🗺️</span>
      Campus Map
    </a>
  </nav>
  <div className="py-[14px] px-[16px] border-t border-[#a5b4fc]/[0.18] flex items-center gap-[11px]">
    <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-[#4f46e5] to-[#a78bfa] flex items-center justify-center text-[13px] text-white font-bold flex-shrink-0 shadow-[0_3px_10px_rgba(79,70,229,0.3)]">JD</div>
    <div>
      <div className="text-[13px] font-semibold text-[#1e1b4b]">Jane Doe</div>
      <div className="text-[11px] text-[#6b7280]">Engineering · Year 3</div>
    </div>
    <span className="ml-auto text-[15px] text-[#6b7280] cursor-pointer">⋯</span>
  </div>
</aside>
);

const bgImgCls = "absolute rounded-[18px] overflow-hidden shadow-[0_28px_60px_rgba(10,5,40,0.55),0_8px_24px_rgba(10,5,40,0.4)] border-2 border-white/20 pointer-events-auto cursor-pointer transition-transform hover:z-[6] hover:scale-105 hover:-translate-y-[10px] origin-center";
export const Topbar = () => (
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
      <input type="text" placeholder="Search for items, locations, brands…" className="flex-1 bg-transparent border-none outline-none text-[14px] text-white font-epilogue py-[7px] px-[8px] placeholder:text-white/55" />
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
export const FeedPage = ({ openAdPopup }) => (
<div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-[14px]">
  <div>
    <div className="bg-white/75 backdrop-blur-[18px] border-[1.5px] border-white/92 rounded-[20px] p-[14px] px-[16px] shadow-[0_4px_24px_rgba(79,70,229,0.07)] !px-0 !pb-0 overflow-hidden">
      <div className="flex justify-between items-start mb-[12px] px-[16px]">
        <div>
          <div className="text-[15px] font-bold text-[#1e1b4b]">📋 Campus Lost & Found Board</div>
          <div className="text-[11.5px] text-[#6b7280] mt-[2px]">All items reported by students</div>
        </div>
        <div className="flex gap-[6px]">
          <button className="text-[12px] font-semibold py-[6px] px-[16px] rounded-full cursor-pointer border border-transparent font-epilogue transition-all bg-gradient-to-br from-[#4f46e5] to-[#6366f1] text-white shadow-[0_3px_10px_rgba(79,70,229,0.28)]">All</button>
          <button className="text-[12px] font-semibold py-[6px] px-[16px] rounded-full cursor-pointer border-[1.5px] border-[#a5b4fc]/28 bg-white/60 text-[#6b7280] font-epilogue transition-all hover:border-[#818cf8] hover:text-[#4f46e5]">Lost</button>
          <button className="text-[12px] font-semibold py-[6px] px-[16px] rounded-full cursor-pointer border-[1.5px] border-[#a5b4fc]/28 bg-white/60 text-[#6b7280] font-epilogue transition-all hover:border-[#818cf8] hover:text-[#4f46e5]">Found</button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px] px-[16px] pb-[16px]">
        {[
          { id: 'comm1', bg: 'from-[#4f46e5] to-[#818cf8]', initials: 'JD', author: 'Jane Doe', year: '3', badgeStr: 'LOST', badgeCls: 'bg-[#ef4444]/11 text-[#dc2626] border-[#ef4444]/22', time: '9 min ago', date: 'Oct 12', loc: 'Engineering' },
          { id: 'comm2', bg: 'from-[#7c3aed] to-[#a78bfa]', initials: 'RK', author: 'Ravi K.', year: '2', badgeStr: 'LOST', badgeCls: 'bg-[#ef4444]/11 text-[#dc2626] border-[#ef4444]/22', time: '22 min ago', date: 'Oct 8', loc: 'Science Block' },
          { id: 'comm3', bg: 'from-[#059669] to-[#34d399]', initials: 'AM', author: 'Amal M.', year: '4', badgeStr: 'FOUND', badgeCls: 'bg-[#10b981]/11 text-[#059669] border-[#10b981]/22', time: '1 hr ago', date: 'Oct 11', loc: 'Sports Complex' },
          { id: 'comm4', bg: 'from-[#0ea5e9] to-[#38bdf8]', initials: 'TM', author: 'Tom M.', year: '2', badgeStr: 'LOST', badgeCls: 'bg-[#ef4444]/11 text-[#dc2626] border-[#ef4444]/22', time: '2 hr ago', date: 'Oct 10', loc: 'Gym B' },
          { id: 'comm5', bg: 'from-[#dc2626] to-[#f87171]', initials: 'NF', author: 'Nisha F.', year: '2', badgeStr: 'LOST', badgeCls: 'bg-[#ef4444]/11 text-[#dc2626] border-[#ef4444]/22', time: '3 hr ago', date: 'Oct 9', loc: 'Library' },
          { id: 'comm6', bg: 'from-[#4f46e5] to-[#818cf8]', initials: 'KL', author: 'Kasun L.', year: '3', badgeStr: 'LOST', badgeCls: 'bg-[#ef4444]/11 text-[#dc2626] border-[#ef4444]/22', time: '4 hr ago', date: 'Oct 7', loc: 'Café' }
        ].map((item, i) => {
           const ad = adData[item.id];
           return (
             <div key={i} onClick={() => openAdPopup(item.id)} className="bg-white/88 border-[1.5px] border-[#a5b4fc]/[0.18] rounded-[16px] overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_3px_16px_rgba(79,70,229,0.06)] hover:-translate-y-[5px] hover:shadow-[0_14px_40px_rgba(79,70,229,0.14)] hover:border-[#6366f1]/30 group">
               <div className="relative h-[200px] lg:h-[240px] overflow-hidden">
                 <img src={ad.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                 <span className={`absolute top-[10px] left-[10px] z-[2] text-[10px] font-bold py-[3px] px-[9px] rounded-[6px] tracking-[0.05em] uppercase border ${item.badgeCls}`}>{item.badgeStr}</span>
                 <span className="absolute bottom-[10px] right-[10px] z-[2] bg-black/55 backdrop-blur-[8px] text-white text-[10px] font-bold py-[3px] px-[9px] rounded-full">{item.time}</span>
               </div>
               <div className="p-[12px] px-[13px] pb-[13px]">
                 <div className="font-clash text-[14px] font-bold text-[#1e1b4b] mb-[8px] truncate">{ad.title}</div>
                 <div className="flex flex-wrap gap-[6px] mb-[10px]">
                   <span className="text-[11px] font-semibold py-[4px] px-[10px] rounded-[8px] inline-flex items-center gap-[4px] bg-[#eef2ff] text-[#4338ca] border border-[#c7d2fe]">📅 {item.date}</span>
                   <span className="text-[11px] font-semibold py-[4px] px-[10px] rounded-[8px] inline-flex items-center gap-[4px] bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">📍 {item.loc}</span>
                 </div>
                 <div className="flex items-center gap-[7px] text-[11.5px] text-[#6b7280] font-semibold mb-[10px]">
                   <div className={`w-[24px] h-[24px] rounded-full bg-gradient-to-br flex items-center justify-center text-white text-[9px] font-bold shrink-0 ${item.bg}`}>{item.initials}</div>
                   <span>{item.author} · Year {item.year}</span>
                 </div>
                 <div className="flex gap-[7px]">
                   {item.badgeStr === 'LOST' 
                     ? <button className="flex-1 font-epilogue text-[11.5px] font-bold py-[7px] px-[10px] rounded-[9px] cursor-pointer transition-colors whitespace-nowrap bg-[#eef2ff] text-[#4f46e5] border-[1.5px] border-[#c7d2fe] hover:bg-[#e0e7ff] hover:border-[#818cf8]" onClick={(e) => e.stopPropagation()}>I Found It →</button>
                     : <button className="flex-1 font-epilogue text-[11.5px] font-bold py-[7px] px-[10px] rounded-[9px] cursor-pointer transition-colors whitespace-nowrap bg-[#f0fdf4] text-[#166534] border-[1.5px] border-[#bbf7d0] hover:bg-[#dcfce7] hover:border-[#86efac]" onClick={(e) => e.stopPropagation()}>Claim Mine →</button>}
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
    <div className="bg-white/75 backdrop-blur-[18px] border-[1.5px] border-white/92 rounded-[20px] p-[14px] px-[16px] shadow-[0_4px_24px_rgba(79,70,229,0.07)] mb-[12px]">
      <div className="flex justify-between items-start mb-[12px]">
        <div><div className="text-[15px] font-bold text-[#1e1b4b]">🤖 AI Matches</div><div className="text-[11.5px] text-[#6b7280] mt-[2px]">Possible matches</div></div>
        <button className="bg-[#6366f1]/[0.08] text-[#4f46e5] text-[12px] font-semibold py-[8px] px-[16px] rounded-[9px] border border-[#6366f1]/20 cursor-pointer font-epilogue hover:bg-[#6366f1]/15 transition-colors">View All</button>
      </div>
      {(['1','2']).map(i => (
        <div key={i} className="bg-gradient-to-br from-[#4f46e5]/[0.06] to-[#8b5cf6]/[0.05] border-[1.5px] border-[#6366f1]/20 rounded-[16px] p-[15px] mb-[12px] last:mb-0 cursor-pointer transition-all hover:border-[#6366f1]/40 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(79,70,229,0.12)]">
          <div className="flex justify-between items-start mb-[11px]">
            <div><div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.06em]">Lost Report</div><div className="text-[13.5px] font-bold text-[#1e1b4b] mt-[2px]">{i==='1'?'Apple Watch Series 7':'Blue Folder (Bio 101)'}</div><div className="text-[11px] text-[#6b7280] mt-[2px]">📍 Library</div></div>
            <div className="font-clash text-[26px] font-bold text-[#4f46e5] leading-none text-right">{i==='1'?'95%':'78%'}<small className="text-[11px] text-[#6b7280] font-epilogue font-medium block">MATCH</small></div>
          </div>
          <div className="flex items-center gap-[8px] mb-[11px]">
            <img className="flex-1 h-[64px] rounded-[10px] object-cover border-[2px] border-[#a5b4fc]/30" src={i==='1' ? 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=130&fit=crop' : 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=200&h=130&fit=crop'} />
            <div className="text-[#818cf8] text-[18px] shrink-0">⟷</div>
            <img className="flex-1 h-[64px] rounded-[10px] object-cover border-[2px] border-[#a5b4fc]/30" src={i==='1' ? 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=130&fit=crop' : 'https://images.unsplash.com/photo-1600267185393-1b14be5afa09?w=200&h=130&fit=crop'} />
          </div>
          <div className="flex gap-[7px]">
            <button className="flex-1 text-[11.5px] font-semibold py-[7px] px-[10px] rounded-[8px] cursor-pointer font-epilogue bg-[#6366f1]/[0.09] text-[#4f46e5] border border-[#6366f1]/20 hover:bg-[#6366f1]/[0.18]">Compare</button>
            <button className="flex-1 text-[11.5px] font-semibold py-[7px] px-[10px] rounded-[8px] cursor-pointer font-epilogue bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white shadow-[0_2px_8px_rgba(79,70,229,0.28)] hover:shadow-[0_4px_14px_rgba(79,70,229,0.44)]">Verify Match →</button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
);
export const VaultPage = ({ openAdPopup }) => (
<div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-[14px]">
  <div>
    <div className="bg-white/75 backdrop-blur-[18px] border-[1.5px] border-white/92 rounded-[20px] p-[14px] px-[16px] shadow-[0_4px_24px_rgba(79,70,229,0.07)]">
      <div className="flex justify-between items-start mb-[12px]">
        <div><div className="text-[15px] font-bold text-[#1e1b4b]">📢 My Posted Items</div><div className="text-[11.5px] text-[#6b7280] mt-[2px]">Items you've reported as lost or found</div></div>
        <button className="bg-[#6366f1]/[0.08] text-[#4f46e5] text-[12px] font-semibold py-[8px] px-[16px] rounded-[9px] border border-[#6366f1]/20 cursor-pointer font-epilogue hover:bg-[#6366f1]/15">+ New Post</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[18px]">
        {['ad1','ad2'].map(v => {
          const ad = adData[v];
          return (
            <div key={v} onClick={() => openAdPopup(v)} className="bg-white border-[1.5px] border-[#a5b4fc]/22 rounded-[22px] overflow-hidden cursor-pointer transition-all duration-300 shadow-[0_6px_28px_rgba(79,70,229,0.09)] hover:-translate-y-[7px] hover:shadow-[0_22px_56px_rgba(79,70,229,0.18)] hover:border-[#6366f1]/40 group">
              <div className="relative h-[250px] lg:h-[300px] overflow-hidden">
                <img src={ad.img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className={`absolute top-[14px] left-[14px] z-[2] text-[10.5px] font-bold py-[5px] px-[13px] rounded-[8px] tracking-[0.06em] uppercase backdrop-blur-[10px] ${ad.statusClass}`}>{ad.status}</span>
                <span className={`absolute bottom-[14px] left-[14px] z-[2] text-[10px] font-extrabold py-[4px] px-[11px] rounded-[7px] tracking-[0.08em] uppercase backdrop-blur-[10px] ${ad.typeClass}`}>{ad.type}</span>
                {v === 'ad2' && <div className="absolute top-[14px] right-[14px] z-[2] bg-white/96 backdrop-blur-[10px] rounded-full py-[5px] px-[12px] text-[11.5px] font-bold text-[#4f46e5] flex items-center gap-[5px] shadow-[0_2px_8px_rgba(79,70,229,0.15)]">🤖 95% match</div>}
              </div>
              <div className="p-[16px] px-[18px] pb-[18px]">
                <div className="text-[16px] font-bold text-[#1e1b4b] mb-[6px] font-clash">{ad.title}</div>
                <div className="text-[12px] text-[#6b7280] leading-[1.55] mb-[10px] line-clamp-2">{ad.desc}</div>
                <div className="flex flex-col gap-[5px] mb-[12px]">
                   <div className="flex items-center gap-[8px] text-[12px] text-[#374151]"><span className="w-[22px] h-[22px] rounded-[6px] bg-[#f1f5f9] flex items-center justify-center text-[11px] shrink-0">📍</span><span>{ad.location}</span></div>
                   <div className="flex items-center gap-[8px] text-[12px] text-[#374151]"><span className="w-[22px] h-[22px] rounded-[6px] bg-[#f1f5f9] flex items-center justify-center text-[11px] shrink-0">📅</span><span>{ad.date}</span></div>
                </div>
                <div className="flex gap-[9px] mt-[4px]">
                  <button className="flex-1 bg-[#eef2ff] text-[#4f46e5] text-[12px] font-bold py-[8px] px-[16px] rounded-[9px] border-[1.5px] border-[#c7d2fe] cursor-pointer transition-all font-epilogue hover:bg-[#e0e7ff] hover:border-[#818cf8]" onClick={(e) => e.stopPropagation()}>Contact Admin</button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </div>
  <div>
    <div className="bg-white/75 backdrop-blur-[18px] border-[1.5px] border-white/92 rounded-[20px] p-[14px] px-[16px] shadow-[0_4px_24px_rgba(79,70,229,0.07)]">
      <div className="flex justify-between items-start mb-[12px]"><div className="text-[15px] font-bold text-[#1e1b4b]">🕐 Recent Activity</div></div>
      {[
        {icon:'🤖', bg:'from-[#ede9fe] to-[#c4b5fd]', t:'New match for Apple Watch', s:'AI matched 95% — verify now', time:'2m'},
        {icon:'✅', bg:'from-[#dcfce7] to-[#86efac]', t:'Samsung Phone returned!', s:'Claimed from Science Block', time:'1h'},
        {icon:'📢', bg:'from-[#fef3c7] to-[#fde68a]', t:'Ad expiring in 2 days', s:'MacBook Air — renew now', time:'3h'}
      ].map((a,i)=>(
         <div key={i} className="flex items-start gap-[10px] py-[10px] border-b border-[#a5b4fc]/10 last:border-b-0">
           <div className={`w-[33px] h-[33px] rounded-[9px] shrink-0 flex items-center justify-center text-[14px] bg-gradient-to-br ${a.bg}`}>{a.icon}</div>
           <div className="flex-1"><div className="text-[12.5px] font-semibold text-[#1e1b4b] leading-[1.4]">{a.t}</div><div className="text-[11px] text-[#6b7280] mt-[2px]">{a.s}</div></div>
           <div className="text-[10.5px] text-[#94a3b8] shrink-0 mt-[2px]">{a.time}</div>
         </div>
      ))}
    </div>
  </div>
</div>
);
export const AdPopupModal = ({ popupData, closePopup }) => (
<div className="fixed inset-0 z-[1000] bg-[#0f0a28]/55 backdrop-blur-[6px] flex items-center justify-center" onClick={(e) => { if(e.target === e.currentTarget) closePopup(); }}>
  <div className="bg-white rounded-[26px] w-[94vw] lg:w-[680px] max-h-[90vh] overflow-y-auto shadow-[0_32px_80px_rgba(15,10,40,0.35)] transform transition-transform">
    <div className="relative">
      <img className="w-full h-[300px] object-cover rounded-t-[26px]" src={popupData.img} alt={popupData.title}/>
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
      <p className="text-[13.5px] text-[#4b5563] leading-[1.65] mb-[18px]">{popupData.desc}</p>
      <div className="bg-[#f8fafc] rounded-[16px] py-[18px] px-[20px] mb-[20px] border border-[#e2e8f0]">
        <div className="text-[11px] font-extrabold tracking-[0.1em] uppercase text-[#94a3b8] mb-[14px]">Advertisement Details</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
          <div className="flex items-center gap-[10px]"><div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center text-[15px] shrink-0 bg-[#eef2ff]">👤</div><div><div className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-[0.05em]">Student</div><div className="text-[13px] font-bold text-[#1e1b4b] mt-[1px]">{popupData.student}</div></div></div>
          <div className="flex items-center gap-[10px]"><div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center text-[15px] shrink-0 bg-[#f5f3ff]">🎓</div><div><div className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-[0.05em]">Year</div><div className="text-[13px] font-bold text-[#1e1b4b] mt-[1px]">{popupData.year}</div></div></div>
          <div className="flex items-center gap-[10px]"><div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center text-[15px] shrink-0 bg-[#f0fdf4]">📞</div><div><div className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-[0.05em]">Contact</div><div className="text-[13px] font-bold text-[#1e1b4b] mt-[1px]">{popupData.phone}</div></div></div>
          <div className="flex items-center gap-[10px]"><div className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center text-[15px] shrink-0 bg-[#fffbeb]">📍</div><div><div className="text-[10px] text-[#94a3b8] font-semibold uppercase tracking-[0.05em]">Location</div><div className="text-[13px] font-bold text-[#1e1b4b] mt-[1px]">{popupData.location}</div></div></div>
        </div>
      </div>
      <div className="flex gap-[10px]">
        {popupData.uid && popupData.uid.startsWith('ad') && <button className="flex-1 py-[12px] px-[18px] rounded-[12px] cursor-pointer font-epilogue text-[13px] font-bold bg-[#eef2ff] text-[#4338ca] border-[1.5px] border-[#c7d2fe] transition-colors hover:bg-[#e0e7ff] hover:border-[#a5b4fc]">Contact Admin</button>}
        <a href={`https://wa.me/${popupData.phone.replace(/\D/g,'')}`} target="_blank" className="flex-1 py-[12px] px-[18px] rounded-[12px] cursor-pointer font-epilogue text-[13px] font-bold bg-[#25d366] text-white border-none transition-all shadow-[0_4px_14px_rgba(37,211,102,0.35)] hover:bg-[#1ebe5d] hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)] hover:-translate-y-[1px] inline-flex items-center justify-center gap-[8px] no-underline">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.855L.057 23.926a.5.5 0 0 0 .608.632l6.288-1.643A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 0 1-5.031-1.378l-.36-.214-3.733.976.999-3.648-.235-.374A9.861 9.861 0 0 1 2.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/></svg> WhatsApp
        </a>
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

export default function LostFoundDashboard() {
  const [activeTab, setActiveTab] = useState('feed');
  const [popupData, setPopupData] = useState(null);

  const openAdPopup = (id) => {
    setPopupData({ ...adData[id], uid: id });
    document.body.style.overflow = 'hidden';
  };
  
  const closePopup = () => {
    setPopupData(null);
    document.body.style.overflow = '';
  };
  
  useEffect(() => {
    const handleKey = (e) => { if(e.key === 'Escape') closePopup(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="font-epilogue text-[#1e1b4b] bg-[radial-gradient(ellipse_80%_50%_at_10%_0%,rgba(196,181,253,0.55),transparent),radial-gradient(ellipse_70%_60%_at_90%_20%,rgba(147,197,253,0.45),transparent),radial-gradient(ellipse_60%_50%_at_50%_80%,rgba(167,139,250,0.3),transparent),radial-gradient(ellipse_50%_40%_at_80%_60%,rgba(191,219,254,0.35),transparent),radial-gradient(ellipse_40%_35%_at_20%_70%,rgba(216,180,254,0.25),transparent),linear-gradient(160deg,#f8f6ff_0%,#ede9fe_22%,#e8eeff_44%,#dbeafe_66%,#eff6ff_100%)] min-h-screen relative">
      <Sidebar />
      <Topbar />
      <main className="ml-0 lg:ml-[260px] pt-[200px] lg:pt-[310px]">
        <div className="p-[16px] lg:px-[20px] lg:pb-[36px] max-w-[1200px] mx-auto">
          <AlertBanner />
          
          {/* CTA ACTION CARDS — highlighted, prominent */}
          <div className="flex flex-col lg:flex-row gap-[14px] mb-[20px]">
            <div className="flex-1 flex items-center p-[18px] rounded-[22px] shadow-[0_8px_24px_rgba(79,70,229,0.15)] hover:-translate-y-[4px] transition-all cursor-pointer bg-gradient-to-br from-[#6366f1] to-[#4f46e5] text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] pointer-events-none"></div>
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-[14px] bg-white/20 text-[26px] shrink-0 mr-[16px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] backdrop-blur-md relative z-10 transition-transform group-hover:scale-110">📋</div>
              <div className="flex-1 relative z-10">
                <div className="text-[17px] font-bold leading-[1.2] mb-[4px] font-clash tracking-wide drop-shadow-sm">Report Lost Item</div>
                <div className="text-[12px] text-indigo-100/90 leading-[1.3] font-medium">Describe & post your missing item</div>
              </div>
              <button className="px-[16px] py-[10px] rounded-[10px] text-[13px] font-bold transition-all whitespace-nowrap ml-[12px] bg-white/20 hover:bg-white/30 border-2 border-white/20 hover:border-white/40 text-white shadow-sm font-epilogue relative z-10 backdrop-blur-sm">Report Now →</button>
            </div>
            
            <div className="flex-1 flex items-center p-[18px] rounded-[22px] shadow-[0_8px_24px_rgba(168,85,247,0.15)] hover:-translate-y-[4px] transition-all cursor-pointer bg-gradient-to-br from-[#a855f7] to-[#8b5cf6] text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] pointer-events-none"></div>
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-[14px] bg-white/20 text-[26px] shrink-0 mr-[16px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] backdrop-blur-md relative z-10 transition-transform group-hover:scale-110">🔍</div>
              <div className="flex-1 relative z-10">
                <div className="text-[17px] font-bold leading-[1.2] mb-[4px] font-clash tracking-wide drop-shadow-sm">Post Found Item</div>
                <div className="text-[12px] text-purple-100/90 leading-[1.3] font-medium">Help reunite someone with their item</div>
              </div>
              <button className="px-[16px] py-[10px] rounded-[10px] text-[13px] font-bold transition-all whitespace-nowrap ml-[12px] bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 text-white shadow-sm font-epilogue relative z-10 backdrop-blur-sm">Post Found →</button>
            </div>
            
            <div className="flex-1 flex items-center p-[18px] rounded-[22px] shadow-[0_8px_24px_rgba(59,130,246,0.15)] hover:-translate-y-[4px] transition-all cursor-pointer bg-gradient-to-br from-[#3b82f6] to-[#0ea5e9] text-white overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] pointer-events-none"></div>
              <div className="w-[52px] h-[52px] flex items-center justify-center rounded-[14px] bg-white/20 text-[26px] shrink-0 mr-[16px] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] backdrop-blur-md relative z-10 transition-transform group-hover:scale-110">🤖</div>
              <div className="flex-1 relative z-10">
                <div className="text-[17px] font-bold leading-[1.2] mb-[4px] font-clash tracking-wide drop-shadow-sm">AI Match Scan</div>
                <div className="text-[12px] text-blue-100/90 leading-[1.3] font-medium">Let AI find matches for your report</div>
              </div>
              <button className="px-[16px] py-[10px] rounded-[10px] text-[13px] font-bold transition-all whitespace-nowrap ml-[12px] bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/40 text-white shadow-sm font-epilogue relative z-10 backdrop-blur-sm">Scan Now →</button>
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
          
          {activeTab === 'feed' ? <FeedPage openAdPopup={openAdPopup} /> : <VaultPage openAdPopup={openAdPopup} />}
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
