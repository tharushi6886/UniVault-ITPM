import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const INITIAL_ITEMS = [
  { id: 1, name: "Borosilicate Beaker 500ml", cat: "Laboratory", brand: "Pyrex", cond: "new", listing: "sell", avail: "available", price: 48, qty: 24, desc: "High-quality borosilicate glass beaker. Heat resistant to 500°C with graduated markings.", color: "Clear Blue", date: "23 Mar 2026", bid: 1240, buyNow: 1650 },
  { id: 2, name: "Crystal Wine Decanter", cat: "Decorative", brand: "Riedel", cond: "new", listing: "sell", avail: "available", price: 120, qty: 5, desc: "Handcrafted lead-free crystal decanter with elegant design for premium wine aeration.", color: "Clear", date: "21 Mar 2026", bid: 320, buyNow: 450 },
  { id: 3, name: "Glass Measuring Cylinder", cat: "Laboratory", brand: "Borosil", cond: "used", listing: "sell", avail: "available", price: 22, qty: 10, desc: "100ml borosilicate glass measuring cylinder with blue graduation markings.", color: "Clear", date: "19 Mar 2026", bid: null, buyNow: null },
  { id: 4, name: "Art Deco Vase Set", cat: "Decorative", brand: "Arc International", cond: "new", listing: "found", avail: "available", price: 0, qty: 1, desc: "A set of three art deco style glass vases found on campus near the library.", color: "Amber", date: "17 Mar 2026", bid: null, buyNow: null },
  { id: 5, name: "Lab Flask Erlenmeyer", cat: "Laboratory", brand: "Schott", cond: "damaged", listing: "lost", avail: "not_available", price: 0, qty: 1, desc: "250ml Erlenmeyer flask with cracked neck. Last seen in Chemistry Lab B2.", color: "Clear", date: "15 Mar 2026", bid: null, buyNow: null },
  { id: 6, name: "Cobalt Blue Tumblers", cat: "Kitchenware", brand: "Libbey", cond: "used", listing: "sell", avail: "not_available", price: 35, qty: 8, desc: "Set of 8 cobalt blue glass tumblers in good condition, minor scratches on base.", color: "Cobalt Blue", date: "12 Mar 2026", bid: null, buyNow: null },
];

export default function Myitems() {
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />, badge: null },
    { name: 'My Items', icon: <><path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></>, badge: null },
    { name: 'Orders', icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />, badge: { count: 7, color: 'bg-red-500' } },
    { name: 'Biddings', icon: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />, badge: { count: 4, color: 'bg-orange-500' } },
    { name: 'Messages', icon: <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />, badge: { count: 12, color: 'bg-violet-600' } },
    { name: 'Notifications', icon: <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />, badge: { count: 3, color: 'bg-indigo-500' } },
    { name: 'Map', icon: <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />, badge: null },
    { name: 'Contact', icon: <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />, badge: null },
  ];
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [condFilter, setCondFilter] = useState('');
  
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', cat: '', brand: '', cond: '', listing: '', avail: 'available', price: '', qty: '', desc: '', color: '', image: null, bankName: '', accHolder: '', branch: '', accNumber: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Stats
  const totalItems = items.length;
  const availItems = items.filter(i => i.avail === 'available').length;
  const saleItems = items.filter(i => i.listing === 'sell').length;
  const totalValue = items.reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0);

  // Derived state
  const filteredItems = items.filter(i => {
    if (filterTab !== 'all' && i.listing !== filterTab) return false;
    if (condFilter && i.cond !== condFilter) return false;
    if (searchQuery && !i.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const selectedItem = items.find(i => i.id === selectedItemId);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Item name is required";
    if (!formData.cat) errs.cat = "Category is required";
    if (!formData.cond) errs.cond = "Condition is required";
    if (!formData.listing) errs.listing = "Listing type is required";
    if (formData.price < 0) errs.price = "Price cannot be negative";
    if (formData.qty < 0) errs.qty = "Quantity cannot be negative";
    
    if (!formData.bankName.trim()) errs.bankName = "Bank name is required";
    if (!formData.accHolder.trim()) errs.accHolder = "Account holder name is required";
    if (!formData.branch.trim()) errs.branch = "Branch is required";
    if (!formData.accNumber.trim()) errs.accNumber = "Account number is required";
    else if (!/^\d+$/.test(formData.accNumber.trim())) errs.accNumber = "Account number must be numeric";

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const price = parseFloat(formData.price) || 0;
    const qty = parseInt(formData.qty) || 0;

    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, ...formData, price, qty } : i));
      showToast('Item updated successfully!');
    } else {
      const newItem = {
        ...formData,
        price, qty,
        id: Date.now(),
        color: 'Clear',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        bid: null, buyNow: null
      };
      setItems([newItem, ...items]);
      showToast('Item added successfully!');
    }
    setIsModalOpen(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const openForm = (item = null, e = null) => {
    if (e) e.stopPropagation();
    setFormErrors({});
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name, cat: item.cat, brand: item.brand, cond: item.cond, 
        listing: item.listing, avail: item.avail, price: item.price, qty: item.qty, desc: item.desc,
        color: item.color || '', image: item.image || null, bankName: item.bankName || '', 
        accHolder: item.accHolder || '', branch: item.branch || '', accNumber: item.accNumber || ''
      });
    } else {
      setEditingItem(null);
      setFormData({ name: '', cat: '', brand: '', cond: '', listing: '', avail: 'available', price: '', qty: '', desc: '', color: '', image: null, bankName: '', accHolder: '', branch: '', accNumber: '' });
    }
    setIsModalOpen(true);
  };

  const deleteItem = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems(items.filter(i => i.id !== id));
      setIsPanelOpen(false);
      showToast('Item deleted.');
    }
  };

  const repostItem = (id, e) => {
    if (e) e.stopPropagation();
    setItems(items.map(i => i.id === id ? { 
      ...i, 
      avail: 'available', 
      date: new Date().toLocaleDateString('en-GB') 
    } : i));
    showToast('Item reposted!');
  };

  return (
    <div className="font-['Sora',sans-serif] bg-[#f0ebff] min-h-screen pt-[104px] relative scroll-smooth text-gray-900">
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse 900px 600px at -5% 10%, #7c3aed1e 0%, transparent 55%), radial-gradient(ellipse 600px 500px at 105% 90%, #5b21b61e 0%, transparent 55%)' }} />
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#e4d9f725 1px, transparent 1px), linear-gradient(90deg, #e4d9f725 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* TOPBAR */}
      <div className="fixed top-0 inset-x-0 h-[40px] bg-[#4f46e5] flex items-center justify-center z-[101] hidden sm:flex">
        <div className="max-w-[1400px] w-full px-8 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-[12px] font-medium text-white whitespace-nowrap">
            <span className="text-[14px]">🏪</span> <strong>Campus Marketplace</strong> — Buy & sell glass items within your university
          </div>
          <div className="w-px h-[18px] bg-white/25 hidden md:block"></div>
          <div className="hidden md:flex items-center gap-1.5 bg-white/15 border border-white/30 rounded-full px-3 py-1 text-[11px] font-semibold text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_0_0_rgba(129,140,248,0.6)]"></span>
            2,450 students active this week 🎓
          </div>
          <div className="w-px h-[18px] bg-white/25 hidden lg:block"></div>
          <div className="hidden lg:block text-[12px] text-indigo-100 font-medium">Free listings for verified students <span className="text-indigo-300">✓</span></div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 sm:top-[40px] inset-x-0 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center h-[66px] z-50">
        <div className="flex items-center gap-2.5 flex-shrink-0 mr-7">
          <div className="w-[38px] h-[38px] rounded-lg bg-gradient-to-br from-indigo-800 to-indigo-600 flex items-center justify-center font-[700] text-[13px] text-white">UV</div>
          <div className="font-[700] text-xl text-gray-900 hidden lg:block tracking-tight text-indigo-950">UniVault</div>
        </div>

        <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-hide">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => link.name === 'Home' ? navigate('/') : null}
              className={`relative flex items-center gap-1.5 py-2 px-3 rounded-lg text-[13.5px] transition-all whitespace-nowrap 
                ${link.name === 'My Items' ? 'bg-purple-100 text-indigo-700 font-semibold' : 'text-gray-600 font-medium hover:bg-purple-50 hover:text-indigo-700'}`}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className={`w-[15px] h-[15px] flex-shrink-0 ${link.name === 'My Items' ? 'opacity-100' : 'opacity-70'}`}>
                {link.icon}
              </svg>
              {link.name}
              {link.badge && (
                <span className={`absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold leading-none text-white animate-pulse shadow-sm ${link.badge.color}`}>
                  {link.badge.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 ml-auto pl-4 border-l border-gray-200">
          <div className="w-[36px] h-[36px] rounded-full bg-gradient-to-br from-indigo-800 to-indigo-400 flex items-center justify-center text-[13px] font-bold text-white cursor-pointer flex-shrink-0 transition hover:shadow-[0_0_0_3px_rgba(124,58,237,0.25)] ml-1" title="User Profile">
            AK
          </div>
        </div>
      </nav>

      {/* PAGE BODY */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-8 pb-12">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-7 animate-fade-in-up">
          <div>
            <h1 className="font-['Lora',serif] text-2xl font-medium text-purple-950">My Items</h1>
            <p className="text-[13px] text-[#7c5aa6] mt-1">Manage and track all glass items you have listed</p>
          </div>
          <button onClick={(e) => openForm(null, e)} className="flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-semibold bg-violet-700 text-white rounded-lg hover:bg-violet-800 transition shadow-[0_3px_10px_rgba(109,40,217,0.25)] hover:-translate-y-[1px]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Add New Item
          </button>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <div className="bg-white rounded-xl border-[1.5px] border-[#e4d9f7] p-4 shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-[#b8a0d4] tracking-widest uppercase">Total items</span>
            <span className="text-2xl font-bold text-purple-950 leading-none">{totalItems}</span>
            <span className="text-[11px] text-[#b8a0d4]">All listings</span>
          </div>
          <div className="bg-white rounded-xl border-[1.5px] border-[#e4d9f7] p-4 shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-[#b8a0d4] tracking-widest uppercase">Available</span>
            <span className="text-2xl font-bold text-violet-700 leading-none">{availItems}</span>
            <span className="text-[11px] text-[#b8a0d4]">Active listings</span>
          </div>
          <div className="bg-white rounded-xl border-[1.5px] border-[#e4d9f7] p-4 shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-[#b8a0d4] tracking-widest uppercase">For sale</span>
            <span className="text-2xl font-bold text-purple-950 leading-none">{saleItems}</span>
            <span className="text-[11px] text-[#b8a0d4]">Sell listings</span>
          </div>
          <div className="bg-white rounded-xl border-[1.5px] border-[#e4d9f7] p-4 shadow-sm flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-[#b8a0d4] tracking-widest uppercase">Total value</span>
            <span className="text-2xl font-bold text-violet-700 leading-none">${totalValue.toLocaleString()}</span>
            <span className="text-[11px] text-[#b8a0d4]">Est. worth</span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex gap-1 bg-white border-[1.5px] border-[#e4d9f7] rounded-xl p-1 shadow-sm">
            {['all', 'sell', 'lost', 'found'].map(t => (
              <button key={t} onClick={() => setFilterTab(t)} className={`px-3.5 py-1.5 text-[12.5px] font-medium rounded-lg transition-all ${filterTab === t ? 'bg-violet-700 text-white shadow-md' : 'text-[#7c5aa6] hover:bg-violet-50 hover:text-violet-700'}`}>
                {t === 'all' ? 'All items' : t === 'sell' ? 'For sale' : t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <svg viewBox="0 0 13 13" fill="none" className="w-[13px] h-[13px] text-[#b8a0d4] absolute left-3 top-1/2 -translate-y-1/2"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3"/><path d="M10 10l-2-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
              <input type="text" placeholder="Search items…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="bg-white border-[1.5px] border-[#cfbfed] rounded-lg py-1.5 pl-8 pr-3 text-[12.5px] text-purple-950 outline-none focus:border-violet-500 w-full sm:w-80 shadow-sm transition-all" />
            </div>
            <select value={condFilter} onChange={e => setCondFilter(e.target.value)} className="bg-white border-[1.5px] border-[#cfbfed] rounded-lg py-1.5 pl-3 pr-8 text-[12.5px] text-purple-900 outline-none focus:border-violet-500 appearance-none shadow-sm cursor-pointer" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23b8a0d4' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '10px' }}>
              <option value="">All conditions</option>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="damaged">Damaged</option>
            </select>
          </div>
        </div>

        {/* ITEMS GRID */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
             <svg viewBox="0 0 64 64" fill="none" className="w-16 h-16 mx-auto opacity-30 mb-4"><rect x="4" y="4" width="56" height="56" rx="10" stroke="#b8a0d4" strokeWidth="2"/><path d="M20 44l8-12 8 9 6-8 10 11" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="22" cy="22" r="6" stroke="#b8a0d4" strokeWidth="2"/></svg>
             <h3 className="text-lg font-semibold text-purple-950 mb-1">No items found</h3>
             <p className="text-[13px] text-[#7c5aa6]">Try adjusting your filters or add a new item.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            {filteredItems.map(item => (
              <div key={item.id} onClick={() => { setSelectedItemId(item.id); setIsPanelOpen(true); }} className="bg-white border-[1.5px] border-[#e4d9f7] rounded-2xl shadow-[0_3px_14px_rgba(46,0,96,0.07)] overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(46,0,96,0.13)] cursor-pointer flex flex-col group">
                <div className="h-40 bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] relative flex items-center justify-center border-b border-[#e4d9f7]">
                  <div className="absolute inset-0 z-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(109,40,217,0.06) 1px, transparent 1px)', backgroundSize: '14px 14px' }}></div>
                  <div className="absolute top-2 left-2 flex gap-1 z-10">
                    {item.cond === 'new' && <span className="bg-white/95 border border-[#e4d9f7] text-[#166534] text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded shadow-sm">New</span>}
                    {item.cond === 'used' && <span className="bg-white/95 border border-[#e4d9f7] text-[#854d0e] text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded shadow-sm">Used</span>}
                    {item.cond === 'damaged' && <span className="bg-white/95 border border-[#e4d9f7] text-[#991b1b] text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded shadow-sm">Damaged</span>}
                  </div>
                  <div className="absolute top-2 right-2 z-10 w-2.5 h-2.5 rounded-full border-[1.5px] border-white shadow-sm" style={{ background: item.avail === 'available' ? '#22c55e' : '#94a3b8' }}></div>
                  <svg viewBox="0 0 52 52" fill="none" className="w-10 h-10 opacity-40 z-10 group-hover:scale-110 transition-transform duration-300"><rect x="3" y="3" width="46" height="46" rx="8" stroke="#c4b5fd" strokeWidth="2"/><path d="M10 38l10-13 8 9 6-7 8 11" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18" cy="18" r="5" stroke="#c4b5fd" strokeWidth="2"/><path d="M26 10v8M22 14h8" stroke="#8b5cf6" strokeWidth="2.2" strokeLinecap="round"/></svg>
                </div>
                <div className="p-4 flex-1">
                  <div className="text-[10px] font-semibold text-violet-700 tracking-widest uppercase mb-1">{item.cat}</div>
                  <div className="text-sm font-semibold text-purple-950 leading-tight mb-1 truncate">{item.name}</div>
                  <div className="text-[11.5px] text-[#7c5aa6] mb-2">{item.brand || 'No brand'} &bull; {item.color || 'No color'}</div>
                  {item.price > 0 ? (
                    <div><div className="text-base font-bold text-violet-700">${item.price.toFixed(2)}</div><div className="text-[10.5px] text-[#b8a0d4]">Per unit</div></div>
                  ) : (
                    <div className="text-[13px] font-bold text-[#7c5aa6] uppercase tracking-wider">{item.listing === 'lost' ? 'Lost' : item.listing === 'found' ? 'Found' : 'For sale'}</div>
                  )}
                </div>
                <div className="px-4 py-2.5 border-t border-[#e4d9f7] bg-[#f5f3ff] flex items-center justify-between">
                  <div className="text-[10.5px] text-[#b8a0d4] font-medium">{item.date}</div>
                  <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                    <button onClick={(e) => openForm(item, e)} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#e4d9f7] rounded-md text-[11px] font-medium text-[#4b2c7a] hover:bg-[#ede9fe] hover:border-[#a78bfa] hover:text-[#6d28d9] transition shadow-sm">
                      <svg viewBox="0 0 11 11" fill="none" className="w-3 h-3"><path d="M7 1.5l2.5 2.5L3 10.5H.5V8L7 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
                    </button>
                    <button onClick={(e) => repostItem(item.id, e)} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-green-400 rounded-md text-[11px] font-medium text-green-800 hover:bg-green-100 transition shadow-sm">
                      <svg viewBox="0 0 11 11" fill="none" className="w-3 h-3"><path d="M1 5.5A4.5 4.5 0 005.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M10 5.5A4.5 4.5 0 005.5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M3.5 1L5.5 3l-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <button onClick={(e) => deleteItem(item.id, e)} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-red-400 rounded-md text-[11px] font-medium text-red-800 hover:bg-red-50 transition shadow-sm">
                      <svg viewBox="0 0 11 11" fill="none" className="w-3 h-3"><path d="M1.5 3h8M4 3V2a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M4.5 5v3.5M6.5 5v3.5M2 3l.5 6.5h6L9 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL & PANEL AT CONCLUSION */}
      {/* ADD/EDIT MODAL STRIPPED AND CONVERTED TO TAILWIND */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] bg-purple-950/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <h2 className="text-base font-semibold text-purple-950">{editingItem ? 'Edit item' : 'Add new item'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-lg border-[1.5px] border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition">
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><path d="M1 1l10 10M11 1l-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11.5px] font-medium text-purple-900 tracking-wide">Item name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Borosilicate Beaker" className="text-[13px] bg-violet-50 border-[1.5px] border-[#cfbfed] rounded-lg px-3 py-2 outline-none focus:border-violet-700 focus:bg-white transition" />
                  {formErrors.name && <span className="text-[10px] text-red-600 font-semibold">{formErrors.name}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11.5px] font-medium text-purple-900 tracking-wide">Category *</label>
                  <select value={formData.cat} onChange={e => setFormData({...formData, cat: e.target.value})} className="text-[13px] bg-violet-50 border-[1.5px] border-[#cfbfed] rounded-lg px-3 py-2 outline-none focus:border-violet-700 focus:bg-white transition appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23b8a0d4' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '10px' }}>
                    <option value="">Select…</option>
                    <option>Laboratory</option><option>Decorative</option><option>Kitchenware</option><option>Industrial</option><option>Optical</option><option>Architectural</option><option>Other</option>
                  </select>
                  {formErrors.cat && <span className="text-[10px] text-red-600 font-semibold">{formErrors.cat}</span>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11.5px] font-medium text-purple-900 tracking-wide">Condition *</label>
                  <select value={formData.cond} onChange={e => setFormData({...formData, cond: e.target.value})} className="text-[13px] bg-violet-50 border-[1.5px] border-[#cfbfed] rounded-lg px-3 py-2 outline-none focus:border-violet-700 focus:bg-white transition appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23b8a0d4' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '10px' }}>
                    <option value="">Select…</option><option value="new">New</option><option value="used">Used</option><option value="damaged">Damaged</option>
                  </select>
                  {formErrors.cond && <span className="text-[10px] text-red-600 font-semibold">{formErrors.cond}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11.5px] font-medium text-purple-900 tracking-wide">Listing type *</label>
                  <select value={formData.listing} onChange={e => setFormData({...formData, listing: e.target.value})} className="text-[13px] bg-violet-50 border-[1.5px] border-[#cfbfed] rounded-lg px-3 py-2 outline-none focus:border-violet-700 focus:bg-white transition appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23b8a0d4' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '10px' }}>
                    <option value="">Select…</option><option value="sell">Sell</option><option value="lost">Lost</option><option value="found">Found</option>
                  </select>
                  {formErrors.listing && <span className="text-[10px] text-red-600 font-semibold">{formErrors.listing}</span>}
                </div>
              </div>
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-[11.5px] font-medium text-purple-900 tracking-wide">Item Image</label>
                <div className="flex items-center gap-4">
                  {formData.image && (
                    <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="text-[12px] text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[12px] file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11.5px] font-medium text-purple-900 tracking-wide">Price (USD)</label>
                  <input type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} placeholder="0.00" className="text-[13px] bg-violet-50 border-[1.5px] border-[#cfbfed] rounded-lg px-3 py-2 outline-none focus:border-violet-700 focus:bg-white transition" />
                  {formErrors.price && <span className="text-[10px] text-red-600 font-semibold">{formErrors.price}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11.5px] font-medium text-purple-900 tracking-wide">Quantity</label>
                  <input type="number" min="0" value={formData.qty} onChange={e => setFormData({...formData, qty: e.target.value})} placeholder="0" className="text-[13px] bg-violet-50 border-[1.5px] border-[#cfbfed] rounded-lg px-3 py-2 outline-none focus:border-violet-700 focus:bg-white transition" />
                  {formErrors.qty && <span className="text-[10px] text-red-600 font-semibold">{formErrors.qty}</span>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[11.5px] font-medium text-purple-900 tracking-wide">Color</label>
                  <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} placeholder="e.g. Clear Blue" className="text-[13px] bg-violet-50 border-[1.5px] border-[#cfbfed] rounded-lg px-3 py-2 outline-none focus:border-violet-700 focus:bg-white transition" />
                </div>
              </div>
              <div className="flex flex-col gap-1 mb-4">
                <label className="text-[11.5px] font-medium text-purple-900 tracking-wide">Description</label>
                <textarea rows="3" value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} placeholder="Describe the item…" className="text-[13px] bg-violet-50 border-[1.5px] border-[#cfbfed] rounded-lg px-3 py-2 outline-none focus:border-violet-700 focus:bg-white transition min-h-[80px]" />
              </div>
              <div className="mt-6 mb-2">
                <div className="text-[11px] font-bold text-violet-700 tracking-wider uppercase flex items-center gap-1.5 pb-2 border-b border-[#e4d9f7] mb-4">
                  Bank Details *
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11.5px] font-medium text-purple-900 tracking-wide">Bank Name *</label>
                    <input type="text" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} placeholder="e.g. Chase Bank" className="text-[13px] bg-violet-50 border-[1.5px] border-[#cfbfed] rounded-lg px-3 py-2 outline-none focus:border-violet-700 focus:bg-white transition" />
                    {formErrors.bankName && <span className="text-[10px] text-red-600 font-semibold">{formErrors.bankName}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11.5px] font-medium text-purple-900 tracking-wide">Account Holder Name *</label>
                    <input type="text" value={formData.accHolder} onChange={e => setFormData({...formData, accHolder: e.target.value})} placeholder="John Doe" className="text-[13px] bg-violet-50 border-[1.5px] border-[#cfbfed] rounded-lg px-3 py-2 outline-none focus:border-violet-700 focus:bg-white transition" />
                    {formErrors.accHolder && <span className="text-[10px] text-red-600 font-semibold">{formErrors.accHolder}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11.5px] font-medium text-purple-900 tracking-wide">Branch *</label>
                    <input type="text" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} placeholder="Downtown Branch" className="text-[13px] bg-violet-50 border-[1.5px] border-[#cfbfed] rounded-lg px-3 py-2 outline-none focus:border-violet-700 focus:bg-white transition" />
                    {formErrors.branch && <span className="text-[10px] text-red-600 font-semibold">{formErrors.branch}</span>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11.5px] font-medium text-purple-900 tracking-wide">Account Number *</label>
                    <input type="text" value={formData.accNumber} onChange={e => setFormData({...formData, accNumber: e.target.value})} placeholder="XXXXXXXX" className="text-[13px] bg-violet-50 border-[1.5px] border-[#cfbfed] rounded-lg px-3 py-2 outline-none focus:border-violet-700 focus:bg-white transition" />
                    {formErrors.accNumber && <span className="text-[10px] text-red-600 font-semibold">{formErrors.accNumber}</span>}
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-violet-50 flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-lg bg-white border-[1.5px] border-[#cfbfed] text-purple-900 text-[13px] font-medium hover:bg-violet-100 transition">Cancel</button>
              <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-violet-700 border-[1.5px] border-violet-800 text-white text-[13px] font-semibold hover:bg-violet-800 transition shadow-[0_3px_10px_rgba(109,40,217,0.25)]">Save item</button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL PANEL EXTRACTED AND STYLED */}
      {isPanelOpen && selectedItem && (
        <div className="fixed inset-0 z-[200] bg-purple-950/30 backdrop-blur-sm flex justify-end" onClick={() => setIsPanelOpen(false)}>
          <div className="w-full max-w-[600px] bg-white h-full shadow-[-8px_0_40px_rgba(46,0,96,0.18)] flex flex-col transition-transform duration-300 transform translate-x-0" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
              <span className="text-sm font-semibold text-purple-950">Item details</span>
              <button onClick={() => setIsPanelOpen(false)} className="w-[34px] h-[34px] border-[1.5px] border-[#e4d9f7] rounded-lg flex items-center justify-center text-purple-900 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition">
                <svg viewBox="0 0 13 13" fill="none" className="w-[14px] h-[14px]"><path d="M2 2l9 9M11 2l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="h-56 bg-gradient-to-br from-violet-50 to-violet-100 border-b border-violet-200 relative flex items-center justify-center">
                <div className="absolute inset-0 z-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(109,40,217,0.07) 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                <div className="absolute top-3 left-3 flex gap-2 z-10">
                  <span className="bg-white/95 border border-violet-200 text-violet-700 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md shadow-sm">{selectedItem.cat}</span>
                  <span className={`bg-white/95 border border-violet-200 text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-md shadow-sm ${selectedItem.cond === 'new' ? 'text-green-800' : selectedItem.cond === 'used' ? 'text-yellow-800' : 'text-red-800'}`}>{selectedItem.cond}</span>
                </div>
                <svg viewBox="0 0 52 52" fill="none" className="w-14 h-14 opacity-30 z-10"><rect x="3" y="3" width="46" height="46" rx="8" stroke="#c4b5fd" strokeWidth="2"/><path d="M10 38l10-13 8 9 6-7 8 11" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="18" cy="18" r="5" stroke="#c4b5fd" strokeWidth="2"/><path d="M26 10v8M22 14h8" stroke="#8b5cf6" strokeWidth="2.2" strokeLinecap="round"/></svg>
              </div>
              <div className="p-6">
                <div className="text-[11px] font-bold text-violet-700 tracking-wider uppercase mb-1">{selectedItem.cat}</div>
                <h2 className="font-['Lora',serif] text-2xl font-medium text-purple-950 mb-1">{selectedItem.name}</h2>
                <div className="text-[13px] text-[#7c5aa6] mb-4">Brand: <strong className="text-purple-900">{selectedItem.brand || 'N/A'}</strong> &bull; Color: <strong className="text-purple-900">{selectedItem.color}</strong> &bull; Added: <strong className="text-purple-900">{selectedItem.date}</strong></div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  <span className={`px-2.5 py-1 box-border border rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedItem.cond === 'new' ? 'bg-green-100 text-green-800 border-green-400' : selectedItem.cond === 'used' ? 'bg-yellow-100 text-yellow-800 border-yellow-400' : 'bg-red-100 text-red-800 border-red-400'}`}>{selectedItem.cond}</span>
                  <span className="px-2.5 py-1 box-border border rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-100 text-violet-700 border-violet-300">{selectedItem.listing}</span>
                  <span className={`px-2.5 py-1 box-border border rounded-full text-[10px] font-bold uppercase tracking-wider ${selectedItem.avail === 'available' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-300'}`}>{selectedItem.avail}</span>
                </div>
                {selectedItem.desc && (
                  <div className="text-[13px] text-[#7c5aa6] leading-relaxed p-4 bg-violet-50 border border-[#e4d9f7] rounded-xl mb-6">
                    {selectedItem.desc}
                  </div>
                )}
                
                <div className="flex gap-2 mb-6">
                  <button onClick={() => { openForm(selectedItem); setIsPanelOpen(false); }} className="flex-1 flex items-center justify-center gap-1.5 bg-violet-700 text-white border-[1.5px] border-violet-800 py-2.5 rounded-lg text-[13px] font-medium shadow-[0_3px_10px_rgba(109,40,217,0.25)] hover:bg-violet-800 transition">
                    <svg viewBox="0 0 13 13" fill="none" className="w-[13px] h-[13px]"><path d="M8.5 1.5l3 3-6.5 6.5H2v-3l6.5-6.5Z" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round"/></svg>
                    Edit item
                  </button>
                  <button onClick={() => { repostItem(selectedItem.id); setIsPanelOpen(false); }} className="flex-1 flex items-center justify-center gap-1.5 bg-green-100 text-green-800 border-[1.5px] border-green-400 py-2.5 rounded-lg text-[13px] font-medium hover:bg-green-200 transition">
                    <svg viewBox="0 0 13 13" fill="none" className="w-[13px] h-[13px]"><path d="M2 6.5A5 5 0 006.5 11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M11 6.5A5 5 0 006.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M4 2L6.5 4.5l-2.5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Repost
                  </button>
                  <button onClick={() => { deleteItem(selectedItem.id); }} className="flex-1 flex items-center justify-center gap-1.5 bg-red-100 text-red-800 border-[1.5px] border-red-400 py-2.5 rounded-lg text-[13px] font-medium hover:bg-red-200 transition">
                    <svg viewBox="0 0 13 13" fill="none" className="w-[13px] h-[13px]"><path d="M2 4h9M4.5 4V2.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V4M5 6v4M8 6v4M2.5 4l.5 7.5h7l.5-7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Delete
                  </button>
                </div>

                <div className="mb-6">
                  <div className="text-[11px] font-semibold text-violet-700 tracking-wider uppercase flex items-center gap-1.5 pb-2 border-b border-[#e4d9f7] mb-2">
                    <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><rect x="1" y="1" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M3.5 4h5M3.5 6h5M3.5 8h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    Item information
                  </div>
                  <table className="w-full text-[13px]">
                    <tbody>
                      <tr className="border-b border-[#e4d9f7]"><td className="py-2 text-[#7c5aa6] w-[45%]">Category</td><td className="py-2 text-right font-medium text-purple-950">{selectedItem.cat}</td></tr>
                      <tr className="border-b border-[#e4d9f7]"><td className="py-2 text-[#7c5aa6] w-[45%]">Brand</td><td className="py-2 text-right font-medium text-purple-950">{selectedItem.brand}</td></tr>
                      <tr className="border-b border-[#e4d9f7]"><td className="py-2 text-[#7c5aa6] w-[45%]">Color</td><td className="py-2 text-right font-medium text-purple-950"><span className="inline-block w-3 h-3 border border-gray-200 rounded-[3px] bg-blue-200 mr-1.5 align-middle"></span>{selectedItem.color}</td></tr>
                      <tr className="border-b border-[#e4d9f7]"><td className="py-2 text-[#7c5aa6] w-[45%]">Listing type</td><td className="py-2 text-right font-medium text-purple-950 capitalize">{selectedItem.listing}</td></tr>
                      <tr className="border-b border-[#e4d9f7]"><td className="py-2 text-[#7c5aa6] w-[45%]">Availability</td><td className="py-2 text-right font-medium text-purple-950">{selectedItem.avail === 'available' ? 'Available' : 'Not available'}</td></tr>
                      {selectedItem.price > 0 && <tr className="border-b border-[#e4d9f7]"><td className="py-2 text-[#7c5aa6] w-[45%]">Price</td><td className="py-2 text-right font-semibold text-violet-700">${selectedItem.price.toFixed(2)} USD</td></tr>}
                      {selectedItem.qty > 0 && <tr className="border-b border-[#e4d9f7]"><td className="py-2 text-[#7c5aa6] w-[45%]">Quantity</td><td className="py-2 text-right font-medium text-purple-950">{selectedItem.qty} units</td></tr>}
                      <tr><td className="py-2 text-[#7c5aa6] w-[45%]">Listed on</td><td className="py-2 text-right font-medium text-purple-950">{selectedItem.date}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-6 right-6 z-[500] bg-white border-[1.5px] border-green-400 rounded-xl px-5 py-3.5 shadow-[0_8px_24px_rgba(46,0,96,0.14)] flex items-center gap-2.5 font-medium text-[13.5px] text-green-800 transition-all duration-300 ease-[cubic-bezier(.22,.68,0,1.2)] ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <svg viewBox="0 0 16 16" fill="none" className="w-[18px] h-[18px] shrink-0"><circle cx="8" cy="8" r="7" fill="#22c55e"/><path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        {toastMessage}
      </div>

    </div>
  );
}
