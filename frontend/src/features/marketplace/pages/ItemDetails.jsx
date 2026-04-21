import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { getItemById } from '../../../api/itemApi';

const ItemDetails = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [copiedAccount, setCopiedAccount] = useState(false);
    const [copiedBranch, setCopiedBranch] = useState(false);
    const [item, setItem] = useState(null);
    const [ownerTrust, setOwnerTrust] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPaymentInfo, setShowPaymentInfo] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                setLoading(true);
                // First check if we have item in location state
                if (location.state?.item) {
                    setItem(location.state.item);
                    setLoading(false);
                }

                // If id is a valid MongoId (24 chars), fetch from API
                if (id && id.length === 24) {
                    const response = await getItemById(id);
                    if (response.data) {
                        setItem(response.data.item);
                        setOwnerTrust(response.data.ownerTrust);
                    }
                } else if (!location.state?.item) {
                    // Fallback mock data for testing if no state and invalid ID
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
                        item_image: "https://p1.jm.vc/800/800/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1/1.jpg", // Sample beaker image
                        createdAt: new Date().toISOString(),
                        _id: "GLS-00124",
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
    const itemImageUrl = item.item_image ? (item.item_image.startsWith('http') ? item.item_image : `http://localhost:5000${item.item_image}`) : null;

    return (
        <div className="id-page-root p-4 md:p-10 pt-24 bg-[#f0ebff] font-['Sora',sans-serif] min-h-screen relative overflow-hidden">
            {/* Background Decorations */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 10% 10%, #6d28d9 0%, transparent 40%), radial-gradient(circle at 90% 90%, #6d28d9 0%, transparent 40%)'
            }}></div>
            <div className="fixed inset-0 z-0 pointer-events-none opacity-30" style={{
                backgroundImage: 'linear-gradient(#e4d9f7 1px, transparent 1px), linear-gradient(90deg, #e4d9f7 1px, transparent 1px)',
                backgroundSize: '40px 40px'
            }}></div>

            <div className="max-w-[1200px] mx-auto relative z-10">
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
                            <div className="bg-[#f8f9ff] h-[400px] relative flex items-center justify-center p-10 border-b border-[#e4d9f7]">
                                <div className="absolute top-6 left-6 flex gap-2 z-20">
                                    <span className="bg-white px-3 py-1.5 rounded-md border border-[#e4d9f7] text-[10px] font-bold text-[#6d28d9] tracking-widest uppercase shadow-sm">{item.category}</span>
                                    <span className="bg-white px-3 py-1.5 rounded-md border border-[#e4d9f7] text-[10px] font-bold text-[#166534] tracking-widest uppercase shadow-sm">{item.item_condition || 'NEW'}</span>
                                </div>
                                
                                <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                                    {/* Subtle background glow for image */}
                                    <div className="absolute w-64 h-64 bg-[#6d28d908] rounded-full blur-3xl"></div>
                                    
                                    {itemImageUrl ? (
                                        <img src={itemImageUrl} alt={item.item_name} className="max-h-[85%] max-w-[85%] object-contain relative z-10 drop-shadow-2xl transition-transform hover:scale-105 duration-500" />
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
                                    <span className="bg-[#f0f2ff] px-2.5 py-1 rounded-md text-[10px] font-bold text-[#4f46e5] border border-[#e0e7ff] uppercase">LABORATORY</span>
                                    <span className="text-xs font-mono text-gray-300">#GLS-00124</span>
                                </div>
                                <h1 className="text-3xl font-bold text-[#1f1b5b] mb-2 font-['Lora',serif]">{item.item_name}</h1>
                                <div className="flex items-center gap-1.5 text-sm mb-6">
                                    <span className="text-gray-400">Brand:</span> <span className="font-bold text-[#1f1b5b]">{item.brand || 'Pyrex'}</span>
                                    <span className="text-gray-200 mx-2">•</span>
                                    <span className="text-gray-400">Color:</span> <span className="font-bold text-[#1f1b5b]">{item.colour || 'Clear Blue'}</span>
                                    <span className="text-gray-200 mx-2">•</span>
                                    <span className="text-gray-400">Added:</span> <span className="font-bold text-[#1f1b5b]">23 Mar 2026</span>
                                </div>

                                <div className="flex gap-2 mb-8">
                                    <span className="bg-[#dcfce7] px-3 py-1.5 rounded-full text-[10px] font-bold text-[#166534] border border-[#bbf7d0]">NEW</span>
                                    <span className="bg-[#f0f2ff] px-3 py-1.5 rounded-full text-[10px] font-bold text-[#4f46e5] border border-[#e0e7ff]">FOR SALE</span>
                                    <span className="bg-[#dcfce7] px-3 py-1.5 rounded-full text-[10px] font-bold text-[#166534] border border-[#bbf7d0]">AVAILABLE</span>
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
                                        { label: 'Item ID', value: 'GLS-00124' },
                                        { label: 'Item name', value: item.item_name },
                                        { label: 'Category', value: item.category },
                                        { label: 'Brand', value: item.brand || 'Pyrex' },
                                        { label: 'Color', value: item.colour || 'Clear Blue', color: true },
                                        { label: 'Condition', value: 'NEW', badge: 'green' },
                                        { label: 'Listing type', value: 'SELL', badge: 'purple' },
                                        { label: 'Availability', value: 'AVAILABLE', badge: 'green' },
                                        { label: 'Price', value: `$${Number(item.price || 0).toFixed(2)} USD`, highlight: true },
                                        { label: 'Quantity', value: `${item.quantity || 1} units` },
                                        { label: 'Listed on', value: '23 Mar 2026' }
                                    ].map((row, i) => (
                                        <div key={i} className="flex justify-between items-center pb-4 border-b border-[#f8f9ff] last:border-0 last:pb-0">
                                            <span className="text-xs font-medium text-gray-400">{row.label}</span>
                                            <div className="flex items-center gap-2">
                                                {row.color && <span className="w-2.5 h-2.5 rounded-full bg-[#93c5fd]"></span>}
                                                {row.badge === 'green' ? (
                                                    <span className="bg-[#dcfce7] text-[#166534] text-[10px] font-bold px-2 py-0.5 rounded border border-[#bbf7d0]">{row.value}</span>
                                                ) : row.badge === 'purple' ? (
                                                    <span className="bg-[#f0f2ff] text-[#4f46e5] text-[10px] font-bold px-2 py-0.5 rounded border border-[#e0e7ff]">{row.value}</span>
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
                        
                        {/* Bid Card */}
                        <div className="bg-white rounded-3xl border border-[#e4d9f7] shadow-[0_15px_40px_rgb(99,102,241,0.08)] p-8">
                            <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase mb-2 block">CURRENT BID</span>
                            <div className="flex items-baseline gap-2 mb-8">
                                <span className="text-4xl font-black text-[#1f1b5b]">$1,240</span>
                                <span className="text-sm font-bold text-gray-300">USD</span>
                            </div>

                            <button className="w-full bg-[#1a0040] text-white py-4 rounded-xl font-black hover:opacity-90 transition-all mb-4 shadow-xl shadow-[#1a00401a]">
                                Place Bid
                            </button>

                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-px bg-gray-100 flex-1"></div>
                                <span className="text-[10px] font-bold text-gray-300 uppercase">OR</span>
                                <div className="h-px bg-gray-100 flex-1"></div>
                            </div>

                            <button className="w-full bg-white border-2 border-[#e0e7ff] text-[#6366f1] py-4 rounded-xl font-black hover:bg-[#f8f9ff] transition-all mb-6">
                                Buy Now for $1,650
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

                        {/* Owner Card */}
                        <div className="bg-white rounded-3xl border border-[#e4d9f7] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                            <div className="p-6 border-b border-[#f0f2ff] flex items-center gap-3">
                                <span className="text-[#4f46e5]">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </span>
                                <h3 className="text-xs font-black text-[#1f1b5b] tracking-widest uppercase">OWNER DETAILS</h3>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white text-xl font-black shadow-lg">
                                        AK
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[#1f1b5b] text-lg">{owner?.name || 'Arjun Karunarathna'}</h4>
                                        <p className="text-xs text-gray-400 font-medium mb-2">Private seller - Colombo, LK</p>
                                        <span className="bg-[#dcfce7] text-[#166534] text-[10px] font-bold px-2 py-1 rounded-full border border-[#bbf7d0] flex items-center gap-1 w-fit">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            Verified seller
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#f8f9ff] transition-all cursor-pointer">
                                        <div className="w-10 h-10 rounded-xl bg-[#f0f2ff] flex items-center justify-center text-[#6366f1]">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-300 uppercase">Email</p>
                                            <p className="text-xs font-bold text-[#1f1b5b]">{owner?.email || 'arjun.k@glassworks.lk'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#f8f9ff] transition-all cursor-pointer">
                                        <div className="w-10 h-10 rounded-xl bg-[#f0f2ff] flex items-center justify-center text-[#6366f1]">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-300 uppercase">Phone</p>
                                            <p className="text-xs font-bold text-[#1f1b5b]">{owner?.phone || '+94 77 234 5678'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#f8f9ff] transition-all cursor-pointer">
                                        <div className="w-10 h-10 rounded-xl bg-[#dcfce7] flex items-center justify-center text-[#166534]">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14h.8A11 11 0 0 1 21 11.5z"></path></svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-300 uppercase">WhatsApp</p>
                                            <p className="text-xs font-bold text-[#1f1b5b]">{owner?.whatsapp || '+94 77 234 5678'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bank Card */}
                        <div className="bg-white rounded-3xl border border-[#e4d9f7] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="text-[#4f46e5]">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                    </span>
                                    <h3 className="text-xs font-black text-[#1f1b5b] tracking-widest uppercase">BANK DETAILS</h3>
                                </div>
                                <button className="bg-[#f0f2ff] text-[#6366f1] text-[10px] font-bold px-3 py-1 rounded-full border border-[#e0e7ff] uppercase">Payment info</button>
                            </div>

                            {/* Credit Card Visual */}
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
                                <div className="text-lg tracking-[0.2em] font-mono mb-4 relative z-10">•••• •••• •••• 4782</div>
                                <div className="flex justify-between items-end relative z-10">
                                    <div>
                                        <p className="text-[8px] font-bold text-white/50 uppercase tracking-widest mb-0.5">CARD HOLDER</p>
                                        <p className="text-xs font-bold uppercase tracking-wide truncate">{item.payment_details?.account_name || 'Arjun Karunarthna'}</p>
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
                                    <span className="text-[#1f1b5b] font-black text-right max-w-[150px]">{item.payment_details?.bank_name || 'Commercial Bank of Ceylon'}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-medium">Account name</span>
                                    <span className="text-[#1f1b5b] font-black">{item.payment_details?.account_name || 'Arjun Karunarathna'}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-medium">Account no.</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#1f1b5b] font-mono font-bold tracking-tighter">8801 2347 4782</span>
                                        <button onClick={() => handleCopy(item.payment_details?.account_number, 'account')} className="bg-[#f8f9ff] px-2 py-1 rounded text-[10px] font-bold text-gray-400 hover:text-[#6366f1] transition-colors border border-gray-50">Copy</button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-medium">Branch den</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#1f1b5b] font-mono font-bold">010</span>
                                        <button onClick={() => handleCopy(item.payment_details?.branch_code, 'branch')} className="bg-[#f8f9ff] px-2 py-1 rounded text-[10px] font-bold text-gray-400 hover:text-[#6366f1] transition-colors border border-gray-50">Copy</button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-gray-400 font-medium">Currency</span>
                                    <span className="text-[#1f1b5b] font-black">LKR / USD</span>
                                </div>
                            </div>

                            <div className="bg-[#fffbeb] border border-[#fef3c7] p-4 rounded-xl flex gap-3 items-start">
                                <span className="text-[#d97706] mt-0.5 text-sm font-bold">ⓘ</span>
                                <p className="text-[10px] text-[#92400e] leading-relaxed font-medium">
                                    Bank details are confidential. Only share payment after verifying the seller's identity. Glassworks is not responsible for third-party transactions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
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
