import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { getItemById } from '../../../api/itemApi';
import Sidebar from '../components/Sidebar';
import ItemForm from '../components/ItemForm';

const ItemDetails = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [copiedAccount, setCopiedAccount] = useState(false);
    const [copiedBranch, setCopiedBranch] = useState(false);
    const [item, setItem] = useState(null);
    const [ownerTrust, setOwnerTrust] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showItemForm, setShowItemForm] = useState(false);
    const [activeNav, setActiveNav] = useState('Home');

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                setLoading(true);
                if (location.state?.item) {
                    const s = location.state.item;
                    const raw = s.rawItem || s;
                    
                    // Defensive mapping to handle various API response formats
                    const mappedItem = {
                        ...raw,
                        _id: raw._id || s._id || raw.id || s.id,
                        item_name: raw.item_name || s.title || raw.title || s.item_name || 'Untitled Item',
                        price: (raw.price && typeof raw.price === 'number') ? raw.price : (typeof s.price === 'string' ? parseFloat(s.price.replace('$', '').replace('LKR ', '').replace(',', '')) : (raw.price || s.price || 0)),
                        description: raw.description || s.description || s.desc || raw.desc || '',
                        item_condition: raw.item_condition || s.item_condition || s.badge || s.cond || raw.cond || 'used',
                        category: raw.category || s.category || s.cat || raw.cat || 'General',
                        brand: raw.brand || s.brand,
                        colour: raw.colour || s.colour || s.color,
                        quantity: raw.quantity || s.quantity || 1,
                        item_image: raw.item_image || s.item_image || s.image,
                        createdAt: raw.createdAt || s.createdAt || s.date,
                        payment_details: raw.payment_details || s.payment_details || {
                            bank_name: raw.bankName || s.bankName,
                            account_name: raw.accHolder || s.accHolder || raw.account_name,
                            account_number: raw.accNumber || s.accNumber || raw.account_number,
                            branch_code: raw.branch || s.branch || raw.branch_code
                        },
                        userId: raw.userId || s.userId || raw.owner
                    };
                    setItem(mappedItem);
                    if (!id) setLoading(false);
                }

                if (id && id.length === 24) {
                    const response = await getItemById(id);
                    if (response.data) {
                        setItem(response.data.item);
                        setOwnerTrust(response.data.ownerTrust);
                    }
                } else if (!location.state?.item) {
                    setItem({
                        item_name: "Borosilicate Beaker 500ml",
                        category: "Laboratory",
                        item_condition: "NEW",
                        item_type: "FOR SALE",
                        availability_status: "available",
                        brand: "Pyrex",
                        colour: "Clear Blue",
                        quantity: 24,
                        price: 48.00,
                        description: "High-quality borosilicate glass beaker suitable for laboratory use. Heat resistant up to 500°C. Graduated markings for accurate measurement. Ideal for chemical mixing, heating, and storage applications in research and educational settings.",
                        createdAt: new Date().toISOString(),
                        _id: "GLS-00124",
                        item_image: "https://p1.jm.vc/800/800/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1.jpg",
                        payment_details: {
                            bank_name: "Commercial Bank of Ceylon",
                            account_name: "Arjun Karunarathna",
                            account_number: "8801 2347 4782",
                            branch_code: "010",
                            currency: "LKR / USD"
                        },
                        userId: {
                            name: "Arjun Karunarathna",
                            location: "Colombo, LK",
                            email: "arjun.k@glassworks.lk",
                            phone: "+94 77 234 5678",
                            whatsapp: "+94 77 234 5678",
                            studentId: "IT22184874"
                        }
                    });
                }
            } catch (err) {
                console.error('Error fetching item details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id, location.state]);

    const handleCopy = (text, type) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            if (type === 'account') {
                setCopiedAccount(true);
                setTimeout(() => setCopiedAccount(false), 2000);
            } else {
                setCopiedBranch(true);
                setTimeout(() => setCopiedBranch(false), 2000);
            }
        });
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

    const handleAddItem = (newItem) => {
        setShowItemForm(false);
        navigate('/marketplace', { state: { newItem } });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f0ebff]">
                <div className="w-12 h-12 border-4 border-[#6d28d9] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0ebff]">
                <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
                <button onClick={() => navigate('/marketplace')} className="bg-[#6d28d9] text-white px-6 py-2 rounded-lg">Return to Marketplace</button>
            </div>
        );
    }

    const owner = item.userId;
    const itemImageUrl = item.item_image ? (
        item.item_image.startsWith('http') || item.item_image.startsWith('data:') 
        ? item.item_image 
        : `http://localhost:5000${item.item_image.startsWith('/') ? '' : '/'}${item.item_image}`
    ) : null;

    return (
        <div className="id-page-root font-['Sora',sans-serif] bg-[#f0ebff] min-h-screen relative overflow-hidden">
            {/* ANNOUNCEMENT BAR */}
            <div className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#6366F1] text-white flex flex-wrap items-center justify-center gap-4 py-2 px-6 text-[12.5px] font-medium font-inter shadow-sm sticky top-0 z-[60]">
                <div className="flex items-center gap-2">
                    <span className="text-base">🎓</span>
                    <span><strong>Campus Marketplace</strong> — Buy & sell items within your university</span>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <span className="opacity-40">|</span>
                    <span className="bg-white/10 border border-white/20 rounded-full py-0.5 px-3 text-[11px] font-semibold whitespace-nowrap">Earn XP on every sale 🏆</span>
                    <span className="bg-white/10 border border-white/20 rounded-full py-0.5 px-3 text-[11px] font-semibold whitespace-nowrap">2,450 students active this week</span>
                </div>
            </div>

            {/* NAVBAR */}
            <nav className="bg-white border-b border-gray-200 px-8 flex items-center h-[66px] sticky top-[33px] z-50">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="mr-5 p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-btn transition-all group"
                    title="Open Menu"
                >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="group-hover:scale-110 transition-transform">
                        <path d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <div className="flex items-center gap-2.5 flex-shrink-0 mr-7 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-[38px] h-[38px] rounded-lg bg-gradient-to-br from-indigo-800 to-indigo-btn flex items-center justify-center font-syne font-extrabold text-[13px] text-white shadow-md shadow-indigo-100">UV</div>
                    <div className="font-syne font-bold text-xl text-gray-900">UniVault</div>
                </div>

                <div className="flex-1"></div>

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
                </div>
            </nav>

            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 10% 10%, #6d28d9 0%, transparent 40%), radial-gradient(circle at 90% 90%, #6d28d9 0%, transparent 40%)'
            }}></div>
            <div className="fixed inset-0 z-0 pointer-events-none opacity-30" style={{
                backgroundImage: 'linear-gradient(#e4d9f7 1px, transparent 1px), linear-gradient(90deg, #e4d9f7 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            <div className="max-w-[1200px] mx-auto relative z-10 p-4 md:p-10">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-semibold">
                    <button onClick={() => navigate('/marketplace')} className="hover:text-[#6d28d9] transition-colors">Dashboard</button>
                    <span>/</span>
                    <span className="text-[#6d28d9]">{item.category || 'Items'}</span>
                    <span>/</span>
                    <span className="text-gray-500">Item details</span>
                </div>

                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center gap-2 bg-white border border-[#e4d9f7] px-4 py-2 rounded-lg text-sm font-bold text-[#1f1b5b] shadow-sm hover:bg-[#f8f9ff] transition-all mb-8 w-fit"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    Back to list
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Side (8 cols) */}
                    <div className="lg:col-span-8 flex flex-col gap-6">
                        
                        {/* Main Item Card */}
                        <div className="bg-white rounded-3xl border border-[#e4d9f7] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                            {/* Image Section */}
                            <div className="bg-[#f8f9ff] h-[450px] relative flex items-center justify-center border-b border-[#e4d9f7] overflow-hidden">
                                <div className="absolute top-6 left-6 flex gap-2 z-20">
                                    <span className="bg-white px-3 py-1.5 rounded-md border border-[#e4d9f7] text-[10px] font-bold text-[#6d28d9] tracking-widest uppercase shadow-sm">{item.category}</span>
                                    <span className="bg-white px-3 py-1.5 rounded-md border border-[#e4d9f7] text-[10px] font-bold text-[#166534] tracking-widest uppercase shadow-sm">{item.item_condition || 'NEW'}</span>
                                </div>
                                
                                <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                                    <div className="absolute w-64 h-64 bg-[#6d28d908] rounded-full blur-3xl"></div>
                                    {itemImageUrl ? (
                                        <img src={itemImageUrl} alt={item.item_name} className="w-full h-full object-cover relative z-10 transition-transform hover:scale-105 duration-700" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-300">
                                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                            <p className="text-sm font-medium">No image uploaded</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-[#f0f2ff] px-2.5 py-1 rounded-md text-[10px] font-bold text-[#4f46e5] border border-[#e0e7ff] uppercase">{item.category?.toUpperCase() || 'MARKETPLACE'}</span>
                                    <span className="text-xs font-mono text-gray-300">#{item._id?.slice(-8).toUpperCase() || 'GLS-00124'}</span>
                                </div>
                                <h1 className="text-3xl font-bold text-[#1f1b5b] mb-2 font-['Lora',serif]">{item.item_name}</h1>
                                <div className="flex items-center gap-1.5 text-sm mb-6">
                                    <span className="text-gray-400">Brand:</span> <span className="font-bold text-[#1f1b5b]">{item.brand || 'Pyrex'}</span>
                                    <span className="text-gray-200 mx-2">•</span>
                                    <span className="text-gray-400">Color:</span> <span className="font-bold text-[#1f1b5b]">{item.colour || 'Clear Blue'}</span>
                                    <span className="text-gray-200 mx-2">•</span>
                                    <span className="text-gray-400">Added:</span> <span className="font-bold text-[#1f1b5b]">{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '23 Mar 2026'}</span>
                                </div>

                                <div className="flex gap-2 mb-8">
                                    <span className="bg-[#dcfce7] px-3 py-1.5 rounded-full text-[10px] font-bold text-[#166534] border border-[#bbf7d0]">{item.item_condition || 'NEW'}</span>
                                    <span className="bg-[#f0f2ff] px-3 py-1.5 rounded-full text-[10px] font-bold text-[#4f46e5] border border-[#e0e7ff]">{item.item_type || 'FOR SALE'}</span>
                                    <span className="bg-[#dcfce7] px-3 py-1.5 rounded-full text-[10px] font-bold text-[#166534] border border-[#bbf7d0]">{item.availability_status?.toUpperCase() || 'AVAILABLE'}</span>
                                </div>

                                <div className="bg-[#f8f9ff] border border-[#e4d9f7] rounded-2xl p-6 text-sm text-[#4b2c7a] leading-relaxed">
                                    {item.description}
                                </div>
                            </div>
                        </div>

                        {/* Details Grid Card */}
                        <div className="bg-white rounded-3xl border border-[#e4d9f7] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                            <div className="p-6 border-b border-[#f0f2ff] flex items-center gap-3">
                                <span className="w-5 h-5 flex items-center justify-center bg-[#f0f2ff] rounded text-[#4f46e5]">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                </span>
                                <h3 className="text-xs font-black text-[#1f1b5b] tracking-widest uppercase">ITEM DETAILS</h3>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-1 gap-y-4">
                                    {[
                                        { label: 'Item ID', value: item._id?.slice(-8).toUpperCase() || 'N/A' },
                                        { label: 'Item name', value: item.item_name },
                                        { label: 'Category', value: item.category },
                                        { label: 'Brand', value: item.brand || 'Generic' },
                                        { label: 'Color', value: item.colour || 'N/A', color: true },
                                        { label: 'Condition', value: item.item_condition, badge: 'green' },
                                        { label: 'Listing type', value: item.item_type, badge: 'purple' },
                                        { label: 'Availability', value: item.availability_status, badge: 'green' },
                                        { label: 'Price', value: `LKR ${Number(item.price || 0).toLocaleString()}`, highlight: true },
                                        { label: 'Quantity', value: `${item.quantity || 1} units` },
                                        { label: 'Listed on', value: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '23 Mar 2026' }
                                    ].map((row, i) => (
                                        <div key={i} className="flex justify-between items-center pb-4 border-b border-[#f8f9ff] last:border-0 last:pb-0">
                                            <span className="text-xs font-medium text-gray-400">{row.label}</span>
                                            <div className="flex items-center gap-2">
                                                {row.color && <span className="w-2.5 h-2.5 rounded-full bg-[#93c5fd]"></span>}
                                                {row.badge === 'green' ? (
                                                    <span className="bg-[#dcfce7] text-[#166534] text-[10px] font-bold px-2 py-0.5 rounded border border-[#bbf7d0] uppercase">{row.value}</span>
                                                ) : row.badge === 'purple' ? (
                                                    <span className="bg-[#f0f2ff] text-[#4f46e5] text-[10px] font-bold px-2 py-0.5 rounded border border-[#e0e7ff] uppercase">{row.value}</span>
                                                ) : (
                                                    <span className={`text-[13px] font-bold ${row.highlight ? 'text-[#6366f1]' : 'text-[#1f1b5b]'}`}>{row.value}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24">
                        <div className="bg-white rounded-3xl border border-[#e4d9f7] shadow-[0_15px_40px_rgb(99,102,241,0.08)] p-8">
                            <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2 block">CURRENT BID</span>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-4xl font-black text-[#1f1b5b]">LKR {Number(item.price ? item.price * 0.8 : 0).toLocaleString()}</span>
                            </div>

                            <button onClick={() => navigate('/delivery', { state: { item } })} className="w-full bg-[#1a0040] text-white py-4 rounded-xl font-black hover:opacity-90 transition-all mb-4 shadow-xl shadow-[#1a00401a]">
                                Place Bid
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-px bg-gray-100 flex-1"></div>
                                <span className="text-[10px] font-bold text-gray-300 uppercase">OR</span>
                                <div className="h-px bg-gray-100 flex-1"></div>
                            </div>

                            <button onClick={() => navigate('/delivery', { state: { item } })} className="w-full bg-white border-2 border-[#e0e7ff] text-[#6366f1] py-4 rounded-xl font-black hover:bg-[#f8f9ff] transition-all mb-6">
                                Buy Now for LKR {Number(item.price || 0).toLocaleString()}
                            </button>

                            <div className="flex justify-between items-center text-xs font-bold pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-2 text-[#b45309]">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b45309] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b45309]"></span>
                                    </span>
                                    Ends in 2d 14h 32m
                                </div>
                                <div className="text-right">
                                    <span className="text-gray-300">Total bids</span> <br/>
                                    <span className="text-[#1f1b5b] font-black text-sm">18</span>
                                </div>
                            </div>
                        </div>

                        {owner && (
                            <div className="bg-white rounded-3xl border border-[#e4d9f7] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-8 cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate(`/user/${owner._id || owner.id}`)}>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white text-xl font-black shadow-lg">
                                        {owner.profileImage ? (
                                             <img src={owner.profileImage.startsWith('http') ? owner.profileImage : `http://localhost:5000${owner.profileImage.startsWith('/') ? '' : '/'}${owner.profileImage}`} className="w-full h-full rounded-full object-cover" alt="" />
                                        ) : (
                                            owner.name?.slice(0, 2).toUpperCase() || 'UV'
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[#1f1b5b] text-lg">{owner.name || 'Anonymous Seller'}</h4>
                                        <p className="text-xs text-gray-400 font-medium mb-2">
                                            {owner.type || 'Private seller'} - {owner.location || 'Registered Campus User'}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border flex items-center gap-1 w-fit ${ownerTrust?.score >= 50 ? 'bg-[#dcfce7] text-[#166534] border-[#bbf7d0]' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                {ownerTrust?.level || 'Verified Seller'}
                                            </span>
                                            {ownerTrust?.score && (
                                                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-full border border-indigo-200">
                                                    Trust: {ownerTrust.score}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-dashed border-gray-200 uppercase text-[9px] font-black text-gray-400 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-all group">
                                        View seller activity & feedback
                                        <span className="ml-auto group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {item.payment_details && (
                            <div className="bg-white rounded-3xl border border-[#e4d9f7] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[#4f46e5]">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                        </span>
                                        <h3 className="text-xs font-black text-[#1f1b5b] tracking-widest uppercase">BANK DETAILS</h3>
                                    </div>
                                    <button className="bg-[#f0f2ff] text-[#6366f1] text-[10px] font-bold px-3 py-1 rounded-full border border-[#e0e7ff] uppercase">Settlement info</button>
                                </div>

                                <div className="w-full h-44 bg-gradient-to-br from-[#1a0040] via-[#4c1d95] to-[#7c3aed] rounded-2xl p-6 text-white relative overflow-hidden mb-8 shadow-xl shadow-[#4c1d954d]">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full -ml-12 -mb-12 blur-2xl"></div>
                                    <div className="flex justify-between items-start mb-10 relative z-10">
                                        <div className="w-10 h-8 bg-amber-200/20 rounded border border-amber-200/50 backdrop-blur-md"></div>
                                        <div className="flex gap-0.5">
                                            <div className="w-1 h-1 rounded-full bg-white"></div>
                                            <div className="w-1 h-1 rounded-full bg-white"></div>
                                            <div className="w-1 h-1 rounded-full bg-white opacity-40"></div>
                                        </div>
                                    </div>
                                    <div className="text-lg tracking-[0.2em] font-mono mb-4 relative z-10">•••• •••• •••• {item.payment_details.account_number?.slice(-4) || '4782'}</div>
                                    <div className="flex justify-between items-end relative z-10">
                                        <div>
                                            <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest mb-0.5">CARD HOLDER</p>
                                            <p className="text-xs font-bold uppercase tracking-wide truncate">{item.payment_details.account_name || 'N/A'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest mb-0.5">Expires</p>
                                            <p className="text-xs font-bold font-mono flex items-center gap-1 justify-end">08/11 <span className="w-3 h-3 rounded-full bg-[#ef4444] border-2 border-white/20"></span></p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-medium">Bank name</span>
                                        <span className="text-[#1f1b5b] font-black">{item.payment_details.bank_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-medium">Account name</span>
                                        <span className="text-[#1f1b5b] font-black">{item.payment_details.account_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-400 font-medium">Account no.</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[#1f1b5b] font-mono font-bold tracking-tighter">{item.payment_details.account_number || 'N/A'}</span>
                                            <button onClick={() => handleCopy(item.payment_details.account_number, 'account')} className="bg-[#f8f9ff] px-2 py-1 rounded text-[10px] font-bold text-gray-400 hover:text-[#6366f1] transition-colors border border-gray-50">📋</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#fffbeb] border border-[#fef3c7] p-4 rounded-xl flex gap-3 items-start">
                                    <span className="text-[#d97706] mt-0.5 text-sm font-bold">ⓘ</span>
                                    <p className="text-[10px] text-[#92400e] leading-relaxed font-medium">
                                        Bank details are confidential. Only share payment after verifying the seller's identity. UniVault is not responsible for third-party transactions.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {showItemForm && <ItemForm onClose={() => setShowItemForm(false)} onAddItem={handleAddItem} />}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                navLinks={navLinks}
                activeNav={activeNav}
                setActiveNav={setActiveNav}
                navigate={navigate}
            />

            <style jsx>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .id-page-root { animation: fadeInUp 0.6s ease-out; }
            `}</style>
        </div>
    );
};

export default ItemDetails;
