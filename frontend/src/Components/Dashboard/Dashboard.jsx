import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toppicImg from '../../assets/toppic.jpg';
import ItemForm from './ItemForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('Home');
  const [activeCat, setActiveCat] = useState('Textbooks');
  const [showItemForm, setShowItemForm] = useState(false);

  const [items, setItems] = useState([
    { emoji: '🎧', title: 'Sony WH-1000XM4', price: '$180', old: '$350', desc: 'Noise cancelling headphones in perfect condition. Used for one semester only.', cat: 'Electronics', catColor: 'bg-purple-50', badge: 'SALE', badgeColor: 'bg-red-100 text-red-600', stars: 5 },
    { emoji: '📘', title: 'Calculus Early Trans.', price: '$45', old: '$120', desc: '8th edition James Stewart. Includes unused webassign access code inside.', cat: 'Books', catColor: 'bg-blue-50', badge: '', badgeColor: '', stars: 4 },
    { emoji: '🪑', title: 'Ergonomic Desk Chair', price: '$65', old: '$110', desc: 'IKEA Markus chair, black mesh back. Must pick up from North Campus.', cat: 'Dorm', catColor: 'bg-green-50', badge: 'HOT', badgeColor: 'bg-yellow-100 text-amber-600', stars: 5 },
    { emoji: '🔬', title: 'Chemistry Lab Kit', price: '$22', old: '$45', desc: 'Goggles, coat (size M) and lab notebook with 50 blank pages left.', cat: 'Lab', catColor: 'bg-teal-50', badge: '', badgeColor: '', stars: 4 },
    { emoji: '🔌', title: 'Anker USB-C Hub', price: '$28', old: '$50', desc: '7-in-1 adapter with HDMI, SD card reader, and power delivery.', cat: 'Electronics', catColor: 'bg-amber-50', badge: 'NEW', badgeColor: 'bg-emerald-100 text-emerald-600', stars: 5 },
    { emoji: '🚲', title: 'Commuter Bicycle', price: '$110', old: '$250', desc: 'Trek FX1 hybrid bike. recently tuned up. Comes with U-lock and lights.', cat: 'Vehicle', catColor: 'bg-yellow-50', badge: '', badgeColor: '', stars: 5 },
  ]);

  const handleAddItem = (newItem) => {
    setItems(prev => [newItem, ...prev]);
    setShowItemForm(false);
  };

  const navLinks = [
    { name: 'Home', icon: <path d="M3 12L12 3l9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />, badge: null },
    { name: 'My Items', icon: <><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></>, badge: null },
    { name: 'Orders', icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />, badge: { count: 7, color: 'bg-red-500' } },
    { name: 'Biddings', icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />, badge: { count: 4, color: 'bg-orange-500' } },
    { name: 'Messages', icon: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />, badge: { count: 12, color: 'bg-indigo-btn' } },
    { name: 'Notifications', icon: <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />, badge: { count: 3, color: 'bg-indigo-500' } },
    { name: 'Map', icon: <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />, badge: null },
    { name: 'Contact', icon: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />, badge: null },
  ];

  const categories = [
    { name: 'Textbooks', count: 428 },
    { name: 'Electronics', count: 156 },
    { name: 'Dorm Essentials', count: 284 },
    { name: 'Lab Equipment', count: 82 },
    { name: 'Notes & Study', count: 519 },
    { name: 'Services', count: 47 },
  ];

  return (
    <div className="font-sans bg-surface text-gray-900 min-h-screen">
      {/* ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-btn text-white flex flex-wrap items-center justify-center gap-5 py-2.5 px-6 text-[12.5px] font-medium font-inter">
        <span>🛍️ <strong>Campus Marketplace</strong> — Buy & sell items within your university</span>
        <span className="opacity-40 hidden sm:inline">|</span>
        <span className="bg-white/20 border border-white/30 rounded-full py-[3px] px-3 text-xs font-semibold">2,450 students active this week 🎓</span>
        <span className="opacity-40 hidden md:inline">|</span>
        <span className="hidden md:inline">Free listings for verified students ✓</span>
      </div>

      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 px-8 flex items-center h-[66px] sticky top-0 z-50">
        <div className="flex items-center gap-2.5 flex-shrink-0 mr-7">
          <div className="w-[38px] h-[38px] rounded-lg bg-gradient-to-br from-indigo-800 to-indigo-btn flex items-center justify-center font-syne font-extrabold text-[13px] text-white">UV</div>
          <div className="font-syne font-bold text-xl text-gray-900 hidden lg:block">UniVault</div>
        </div>

        <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => link.name === 'My Items' ? navigate('/myitems') : setActiveNav(link.name)}
              className={`relative flex items-center gap-1.5 py-2 px-3 rounded-lg text-[13.5px] transition-all whitespace-nowrap 
                ${activeNav === link.name ? 'bg-purple-100 text-indigo-btn font-semibold nav-link active' : 'text-gray-600 font-medium hover:bg-purple-50 hover:text-indigo-btn nav-link'}`}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={`w-[15px] h-[15px] flex-shrink-0 ${activeNav === link.name ? 'opacity-100' : 'opacity-70'}`}>
                {link.icon}
              </svg>
              {link.name}
              {link.badge && (
                <span className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold leading-none text-white animate-badgePop pulse ${link.badge.color}`}>
                  {link.badge.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 ml-auto pl-4 border-l border-gray-200">
          <button
            onClick={() => setShowItemForm(true)}
            className="flex items-center gap-1.5 bg-gradient-to-br from-indigo-800 to-indigo-btn text-white border-none py-2 px-4 rounded-lg text-[13px] font-semibold shadow-[0_2px_10px_rgba(91,33,182,0.28)] transition-all hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(91,33,182,0.4)] whitespace-nowrap"
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="hidden sm:inline">Post Item</span>
          </button>
          <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-indigo-800 to-indigo-400 flex items-center justify-center font-syne text-[13px] font-bold text-white cursor-pointer flex-shrink-0 transition hover:shadow-[0_0_0_3px_rgba(124,58,237,0.25)]" title="Academic Curator">
            AC
          </div>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-purple-100 to-gray-100 min-h-[420px] flex items-center px-10 lg:px-20 py-10">
        {/* Animated bg circles */}
        <div className="absolute right-[28%] top-1/2 -translate-y-1/2 w-[380px] h-[380px] rounded-full bg-gradient-to-br from-purple-200 to-purple-300 animate-pulse z-0" style={{ animationDuration: '7s' }}></div>
        <div className="absolute right-[calc(28%-30px)] top-1/2 -translate-y-1/2 w-[430px] h-[430px] rounded-full border-2 border-dashed border-indigo-btn/25 animate-[spin_18s_linear_infinite] z-0"></div>
        <div className="absolute right-[calc(28%-60px)] top-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border-[1.5px] border-dashed border-purple-400/15 animate-[spin_28s_linear_infinite_reverse] z-0"></div>

        <div className="relative z-10 flex-1 max-w-[480px]">
          <div className="flex items-center gap-2.5 mb-4.5 animate-slideInL">
            <div className="inline-flex items-center gap-1.5 bg-indigo-600/10 border border-indigo-600/20 rounded-full py-1 px-3.5 text-xs font-semibold text-indigo-700">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-btn animate-pulse"></span> UniVault Campus Marketplace
            </div>
          </div>
          <h1 className="font-syne text-[46px] font-extrabold text-[#1E1B4B] leading-[1.1] mb-4 tracking-[-1.5px] animate-slideInL" style={{ animationDelay: '0.1s' }}>
            Buy & sell campus<br />essentials with ease
          </h1>
          <p className="text-[14px] text-gray-500 leading-[1.7] max-w-[360px] mb-7 animate-slideInL" style={{ animationDelay: '0.2s' }}>
            Your trusted peer-to-peer marketplace for textbooks, lab equipment, electronics and dorm supplies — all within your university community. Safe, simple and student-first.
          </p>
          <div className="flex items-center gap-5 mt-6 animate-slideInL" style={{ animationDelay: '0.35s' }}>
            <div className="flex flex-col gap-0.5">
              <span className="font-syne text-[22px] font-extrabold text-indigo-800 leading-none">2.4k+</span>
              <span className="text-[11px] text-gray-500 font-medium tracking-[0.3px]">Active Listings</span>
            </div>
            <div className="w-[1px] h-8 bg-indigo-btn/20"></div>
            <div className="flex flex-col gap-0.5">
              <span className="font-syne text-[22px] font-extrabold text-indigo-800 leading-none">840+</span>
              <span className="text-[11px] text-gray-500 font-medium tracking-[0.3px]">Verified Sellers</span>
            </div>
            <div className="w-[1px] h-8 bg-indigo-btn/20"></div>
            <div className="flex flex-col gap-0.5">
              <span className="font-syne text-[22px] font-extrabold text-indigo-800 leading-none">$48k</span>
              <span className="text-[11px] text-gray-500 font-medium tracking-[0.3px]">Total Traded</span>
            </div>
          </div>
        </div>

        {/* Hero Visual side (hidden on small screens) */}
        <div className="relative z-10 flex-shrink-0 w-[460px] h-[420px] hidden md:block">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[400px] rounded-[50%_50%_0_0/40%_40%_0_0] overflow-hidden shadow-[0_20px_60px_rgba(124,58,237,0.25)] animate-slideInL" style={{ animationDuration: '0.9s', animationDelay: '0.1s' }}>
            <img src={toppicImg} alt="Student" className="w-full h-full object-cover object-top block" />
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-700/10 to-indigo-900/5 pointer-events-none"></div>
          </div>
          {/* Floating Cards */}
          {/* Card 1: 50+ Online Courses */}
          <div className="absolute bg-white rounded-2xl py-3 px-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex items-center gap-3.5 top-[5%] -left-[12%] animate-[node-float_0.8s_both_0.5s] hover:-translate-y-1 transition duration-300 z-20">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center text-xl flex-shrink-0">🎓</div>
            <div>
              <div className="font-syne text-[22px] font-black text-gray-900 leading-none tracking-tight">50+</div>
              <div className="text-[12px] text-gray-400 font-medium mt-1">Online Courses</div>
            </div>
          </div>

          {/* Card 2: 10k+ Online Students */}
          <div className="absolute bg-white rounded-2xl py-3 px-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex items-center gap-5 top-[15%] -right-[15%] animate-[node-float_0.8s_both_0.7s] hover:-translate-y-1 transition duration-300 z-20">
            <div>
              <div className="font-syne text-[22px] font-black text-gray-900 leading-none tracking-tight">10k+</div>
              <div className="text-[12px] text-gray-400 font-medium mt-1">Online Students</div>
            </div>
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-[12px] z-[4] shadow-sm">😊</div>
              <div className="w-7 h-7 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-[12px] z-[3] shadow-sm">😍</div>
              <div className="w-7 h-7 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[12px] z-[2] shadow-sm">🤩</div>
              <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-[12px] z-[1] shadow-sm">😎</div>
            </div>
          </div>

          {/* Card 3: UI Design Class */}
          <div className="absolute bg-white rounded-2xl py-4 px-4 shadow-[0_12px_40px_rgba(0,0,0,0.08)] flex items-start gap-4 bottom-[15%] -left-[20%] animate-[node-float_0.8s_both_0.9s] hover:-translate-y-1 transition duration-300 z-20 min-w-[220px]">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-lg flex-shrink-0 mt-0.5">🎨</div>
            <div>
              <div className="font-syne text-[17px] font-extrabold text-gray-900 leading-none mb-1.5 tracking-tight">UI Design Class</div>
              <div className="text-[12px] text-gray-400 font-medium mb-3">Starts Monday &mdash; Free</div>
              <button className="bg-indigo-600 text-white text-[11px] font-bold py-1.5 px-3.5 rounded-md hover:bg-indigo-700 transition tracking-wide shadow-sm">
                Join Now &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH BAR ROW */}
      <div className="bg-white border-b border-gray-200 py-4 px-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="font-syne text-lg font-bold text-gray-900 whitespace-nowrap hidden lg:block">What are you looking for?</div>
        <div className="flex flex-1 w-full max-w-[580px] mx-auto">
          <div className="flex-1 relative">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search textbooks, electronics, dorm decor..." className="w-full py-2.5 pl-10 pr-3.5 border-2 border-gray-200 border-r-0 rounded-l-lg font-inter text-sm text-gray-700 outline-none bg-surface transition focus:border-indigo-400 focus:bg-white placeholder-gray-400" />
          </div>
          <button className="py-2.5 px-6 bg-gradient-to-br from-indigo-800 to-indigo-btn text-white border-none rounded-r-lg font-inter text-sm font-semibold cursor-pointer transition hover:from-indigo-900 hover:to-indigo-700">Search</button>
        </div>
      </div>

      {/* PAGE WRAP */}
      <div className="max-w-[1320px] mx-auto px-10">
        {/* BREADCRUMB */}
        <div className="py-3.5 text-[13px] text-gray-500 flex items-center gap-1.5">
          <a href="#" className="hover:text-indigo-btn transition">Home</a>
          <span>/</span>
          <span className="text-indigo-btn font-medium">Marketplace</span>
        </div>

        {/* MAIN BODY */}
        <div className="flex flex-col md:flex-row gap-7 pb-12">

          {/* SIDEBAR */}
          <div className="w-full md:w-[220px] flex-shrink-0">
            {/* Categories */}
            <div className="mb-6.5">
              <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-gray-500 mb-3">Categories</div>
              {categories.map(cat => (
                <div
                  key={cat.name}
                  onClick={() => setActiveCat(cat.name)}
                  className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-[13.5px] cursor-pointer transition-all mb-0.5 
                    ${activeCat === cat.name ? 'bg-purple-100 text-indigo-btn font-semibold' : 'text-gray-700 hover:bg-purple-50 hover:text-indigo-btn'}`}
                >
                  {cat.name}
                  <span className={`text-xs px-1.5 py-0.5 rounded-md ${activeCat === cat.name ? 'bg-indigo-btn/10 text-indigo-btn' : 'bg-surface text-gray-400'}`}>
                    {cat.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="mb-6.5">
              <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-gray-500 mb-3">Price Range</div>
              <div className="relative h-1 bg-gray-200 rounded-sm my-3.5">
                <div className="absolute left-[15%] right-[5%] h-full bg-gradient-to-r from-indigo-btn to-indigo-400 rounded-sm"></div>
                <div className="absolute w-4 h-4 rounded-full bg-indigo-btn top-1/2 -translate-y-1/2 -translate-x-1/2 left-[15%] border-[2.5px] border-white shadow-[0_1px_6px_rgba(91,33,182,0.4)] cursor-pointer"></div>
                <div className="absolute w-4 h-4 rounded-full bg-indigo-btn top-1/2 -translate-y-1/2 translate-x-1/2 right-[5%] border-[2.5px] border-white shadow-[0_1px_6px_rgba(91,33,182,0.4)] cursor-pointer"></div>
              </div>
              <div className="flex justify-between text-[13px] text-gray-700 font-medium mt-2">
                <span>$15</span>
                <span>$850</span>
              </div>
            </div>

            {/* Condition */}
            <div className="mb-6.5">
              <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-gray-500 mb-3">Condition</div>
              {['New/Sealed', 'Like New', 'Good', 'Fair'].map((cond, i) => (
                <div key={cond} className="flex items-center gap-2.5 text-[13.5px] text-gray-700 cursor-pointer py-1.5 transition hover:text-indigo-btn group">
                  <div className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition flex-shrink-0 ${i === 1 ? 'bg-indigo-btn border-indigo-btn' : 'bg-white border-gray-300 group-hover:border-indigo-btn'}`}>
                    {i === 1 && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  {cond}
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="mb-6">
              <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-gray-500 mb-3">Popular Tags</div>
              <div className="flex flex-wrap gap-2">
                {['#MATH101', '#Apple', '#Bio', '#DormLife', '#Furniture', '#Chargers'].map(tag => (
                  <div key={tag} className="py-1 px-3 rounded-full text-xs text-gray-700 border border-gray-200 bg-white cursor-pointer transition hover:border-indigo-btn hover:text-indigo-btn hover:bg-purple-50">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 min-w-0">
            {/* PROMO BANNER */}
            <div className="bg-gradient-to-br from-[#1E1B4B] via-[#3730A3] to-[#5B21B6] rounded-2xl py-8 px-10 flex flex-col sm:flex-row items-center justify-between relative overflow-hidden mb-6">
              <div className="absolute -top-16 right-[200px] w-[250px] h-[250px] rounded-full bg-white/5"></div>

              <div className="relative z-10 text-center sm:text-left mb-6 sm:mb-0">
                <div className="inline-flex border-[1.5px] border-white/30 text-white/85 rounded-full py-1 px-3.5 text-[11px] font-semibold tracking-[1.5px] uppercase mb-3.5">
                  Freshman Bundle
                </div>
                <div className="font-syne text-[34px] font-extrabold text-white leading-[1.1] mb-3">
                  Back to School <span className="text-cyan-400">Sale</span>
                </div>
                <div className="text-[14px] text-white/65 mb-5 max-w-[300px]">
                  Get everything you need for the new semester up to 40% off retail prices.
                </div>
                <button className="inline-flex items-center gap-2 bg-green-500 text-white py-3 px-6 rounded-xl border-none text-sm font-bold shadow-[0_4px_16px_rgba(34,197,94,0.4)] cursor-pointer transition hover:bg-green-600 hover:-translate-y-[1px]">
                  Shop Deals Now
                </button>
              </div>

              <div className="relative z-10 flex-shrink-0 w-[180px] h-[140px] flex items-center justify-center">
                <div className="w-[120px] h-[90px] bg-white/10 rounded-xl border-2 border-white/20 flex items-center justify-center text-[50px] shadow-[0_8px_30px_rgba(0,0,0,0.3)] backdrop-blur-sm">💻</div>
                <div className="absolute bottom-0 left-0 w-[70px] h-[90px] bg-purple-500/40 rounded-lg border-2 border-white/15 flex items-center justify-center text-[28px] backdrop-blur-md">📚</div>
              </div>
            </div>

            {/* PRODUCTS HEADER */}
            <div className="flex items-center justify-between py-3.5 px-5 bg-white border border-gray-200 border-b-0 rounded-t-xl">
              <div className="flex items-center">
                <span className="font-syne text-[17px] font-bold text-gray-900">Recommended For You</span>
                <span className="text-[13px] text-gray-500 ml-2.5">24 Items</span>
              </div>
              <div className="flex items-center gap-2.5">
                <select className="py-1.5 px-3 pr-8 border border-gray-200 rounded-lg font-inter text-[13px] text-gray-700 bg-white outline-none cursor-pointer appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}>
                  <option>Sort by: Popular</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </div>
            </div>

            {/* PRODUCTS GRID */}
            <div className="bg-white border border-gray-200 rounded-b-xl p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item, i) => (
                  <div key={i} className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(91,33,182,0.1)] bg-white animate-fadeUp flex flex-col" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className={`h-[165px] relative overflow-hidden flex items-center justify-center text-[70px] ${item.catColor}`}>
                      <div className="absolute top-2.5 left-2.5 py-[3px] px-2.5 rounded-md text-[10px] font-bold tracking-[1px] uppercase text-gray-500 border border-gray-200 bg-white z-10">{item.cat}</div>
                      {item.badge && <div className={`absolute top-2.5 right-2.5 py-[3px] px-2 rounded-md text-[10px] font-bold tracking-[0.5px] uppercase z-10 ${item.badgeColor}`}>{item.badge}</div>}
                      <div className="w-full h-full flex items-center justify-center transition-transform duration-400 hover:scale-[1.03]">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
                        ) : (
                          <span className="transition-transform duration-400 hover:scale-110">{item.emoji}</span>
                        )}
                      </div>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="text-amber-400 text-[13px] mb-1.5 tracking-[1px]">{'★★★★★'.substring(0, item.stars)}{'☆☆☆☆☆'.substring(0, 5 - item.stars)}</div>
                      <div className="font-syne text-[14.5px] font-bold text-gray-900 mb-1 leading-[1.3]">{item.title}</div>
                      <div className="mt-1">
                        <span className="text-lg font-bold text-indigo-btn">{item.price}</span>
                        {item.old && <span className="text-[13px] text-gray-400 line-through ml-1.5">{item.old}</span>}
                      </div>
                      <div className="text-[12.5px] text-gray-500 leading-[1.55] my-2 line-clamp-2 min-h-[38px]">{item.desc}</div>
                      <button onClick={() => navigate(`/item/${i}`, { state: { item } })} className="mt-auto w-full py-2.5 bg-gradient-to-br from-indigo-800 to-indigo-btn text-white border-none rounded-lg text-[13.5px] font-semibold shadow-[0_2px_10px_rgba(91,33,182,0.25)] transition hover:from-indigo-900 hover:to-indigo-700 hover:shadow-[0_4px_16px_rgba(91,33,182,0.35)] hover:-translate-y-[1px]">
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PAGINATION */}
            <div className="flex items-center justify-between mt-7 px-1">
              <div className="text-sm text-indigo-btn font-medium cursor-pointer flex items-center gap-1 transition hover:text-indigo-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg> Previous
              </div>
              <div className="flex gap-1.5 items-center">
                <div className="w-9 h-9 rounded-lg text-sm font-medium text-white border border-indigo-btn bg-indigo-btn flex items-center justify-center cursor-pointer shadow-[0_2px_10px_rgba(91,33,182,0.3)]">1</div>
                <div className="w-9 h-9 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 bg-white flex items-center justify-center cursor-pointer transition hover:border-indigo-400 hover:text-indigo-btn">2</div>
                <div className="w-9 h-9 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 bg-white flex items-center justify-center cursor-pointer transition hover:border-indigo-400 hover:text-indigo-btn">3</div>
                <div className="text-gray-400 text-sm px-0.5">...</div>
                <div className="w-9 h-9 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 bg-white flex items-center justify-center cursor-pointer transition hover:border-indigo-400 hover:text-indigo-btn">8</div>
              </div>
              <div className="text-sm text-indigo-btn font-medium cursor-pointer flex items-center gap-1 transition hover:text-indigo-600">
                Next <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>

          </div>
        </div>

        {/* NOTIFY BANNER */}
        <div className="bg-gradient-to-br from-[#1E1B4B] via-[#3730A3] to-[#4338CA] rounded-2xl py-12 px-14 flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="text-center md:text-left">
            <h2 className="font-syne text-[32px] font-extrabold text-white leading-[1.2] mb-2">Can't find <span className="text-green-500">it?</span></h2>
            <p className="text-sm text-white/60">Set an alert and we'll notify you when someone posts a matching item.</p>
          </div>
          <div className="flex flex-shrink-0 w-full md:w-auto">
            <input type="text" placeholder="e.g. iPad Pro 11-inch" className="py-3 px-5 border-none rounded-l-xl text-sm text-gray-700 w-full md:w-[300px] outline-none bg-white/95 placeholder-gray-400" />
            <button className="py-3 px-6 border-none bg-green-500 text-white rounded-r-xl text-sm font-bold cursor-pointer transition hover:bg-green-600 whitespace-nowrap">Create Alert</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white/70 pt-12 pb-8 px-10">
        <div className="max-w-[1320px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            <div className="lg:col-span-1 border-r-0 lg:border-r border-white/10 pr-0 lg:pr-8">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-800 to-indigo-btn flex items-center justify-center font-syne font-extrabold text-[13px] text-white">UV</div>
                <div className="font-syne font-bold text-lg text-white">UniVault</div>
              </div>
              <p className="text-[13px] leading-[1.7] max-w-[260px]">The premier campus marketplace for college students. Safe, verified, and strictly local to your university community.</p>
            </div>

            <div>
              <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-white/90 mb-3.5">Categories</div>
              <p className="block text-[13.5px] text-white/55 mb-2.5 transition cursor-pointer hover:text-white">Textbooks</p>
              <p className="block text-[13.5px] text-white/55 mb-2.5 transition cursor-pointer hover:text-white">Electronics</p>
              <p className="block text-[13.5px] text-white/55 mb-2.5 transition cursor-pointer hover:text-white">Dorm Furniture</p>
              <p className="block text-[13.5px] text-white/55 mb-2.5 transition cursor-pointer hover:text-white">Tutoring Services</p>
            </div>

            <div>
              <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-white/90 mb-3.5">Information</div>
              <p className="block text-[13.5px] text-white/55 mb-2.5 transition cursor-pointer hover:text-white">How it Works</p>
              <p className="block text-[13.5px] text-white/55 mb-2.5 transition cursor-pointer hover:text-white">Safety & Trust</p>
              <p className="block text-[13.5px] text-white/55 mb-2.5 transition cursor-pointer hover:text-white">Help Center</p>
              <p className="block text-[13.5px] text-white/55 mb-2.5 transition cursor-pointer hover:text-white">Terms of Service</p>
            </div>

            <div>
              <div className="text-[11px] font-bold tracking-[1.5px] uppercase text-white/90 mb-3.5">Campus Updates</div>
              <div className="flex gap-3 items-start mb-3.5 pb-3.5 border-b border-white/10">
                <div className="w-9 h-9 rounded-lg bg-indigo-btn flex items-center justify-center text-base flex-shrink-0">📢</div>
                <div>
                  <div className="text-[10px] text-white/40 mb-1 tracking-[0.5px]">OCT 24, 2026</div>
                  <div className="text-[12.5px] text-white/65 leading-[1.5]">Midterm season prep! Check out the study guide exchange.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between text-[12.5px] text-white/40 gap-4">
            <div>&copy; 2026 UniVault Inc. All rights reserved.</div>
            <div className="flex gap-4">
              <span className="cursor-pointer hover:text-white">Privacy Policy</span>
              <span className="cursor-pointer hover:text-white">Security</span>
              <span className="cursor-pointer hover:text-white">Sitemap</span>
            </div>
          </div>
        </div>
      </footer>

      {showItemForm && <ItemForm onClose={() => setShowItemForm(false)} onAddItem={handleAddItem} />}
    </div>
  );
};

export default Dashboard;
