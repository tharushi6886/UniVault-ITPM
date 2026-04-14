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
  
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        if (location.state?.item) {
          setItem(location.state.item);
        }

        const response = await getItemById(id);
        if (response.data) {
          setItem(response.data.item);
          setOwnerTrust(response.data.ownerTrust);
        }
      } catch (err) {
        console.error("Error fetching item details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, location.state]);

  const handleCopy = (text, type) => {
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

  // Adjust based on the populated structure { _id, name, profileImage }
  const owner = item?.userId;
  const ownerName = owner?.name || 'University Member';
  const nameInitial = ownerName.charAt(0).toUpperCase();
  const ownerAvatar = owner?.profileImage 
    ? (owner.profileImage.startsWith('http') ? owner.profileImage : `http://localhost:5000${owner.profileImage}`)
    : null;

  return (
    <div className="font-['Sora',sans-serif] bg-[#f0ebff] min-h-screen p-4 md:p-8 pb-12 relative z-0 pt-24">
      {/* Background decorations */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 900px 600px at -5% -5%, #7c3aed2a 0%, transparent 55%), radial-gradient(ellipse 600px 500px at 105% 105%, #5b21b62a 0%, transparent 55%)'
      }}></div>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#e4d9f730 1px, transparent 1px), linear-gradient(90deg, #e4d9f730 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      {!item && !loading ? (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-[#1a0040] mb-4">Item Not Found</h2>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-[#6d28d9] text-white rounded-lg font-semibold hover:bg-[#5b21b6]">Return Dashboard</button>
        </div>
      ) : loading ? (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
           <div className="w-12 h-12 border-4 border-[#6d28d9] border-t-transparent rounded-full animate-spin"></div>
           <p className="mt-4 text-[#6d28d9] font-medium">Securing module records...</p>
        </div>
      ) : (
        <div className="relative z-10 max-w-[1080px] mx-auto animate-fade-in-up">

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-[#b8a0d4] mb-5">
            <button onClick={() => navigate('/')} className="text-[#6d28d9] font-medium hover:underline cursor-pointer">Dashboard</button>
            <span className="text-[#e4d9f7]">/</span>
            <span className="text-[#6d28d9] font-medium">{item.category || 'Marketplace'}</span>
            <span className="text-[#e4d9f7]">/</span>
            <span>{item.item_name}</span>
          </div>

          {/* Topbar */}
          <div className="flex items-center justify-between mb-[1.4rem] flex-wrap gap-2.5">
            <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[13px] font-medium text-[#4b2c7a] bg-white border-[1.5px] border-[#cfbfed] rounded-lg px-3.5 py-[7px] cursor-pointer transition-all shadow-[0_2px_8px_rgba(46,0,96,0.07)] hover:bg-[#f5f3ff] hover:border-[#a78bfa] hover:text-[#6d28d9]">
              <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Go Back
            </button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-5 items-start">

            {/* Left Column */}
            <div className="space-y-5">
              {/* Image Card */}
              <div className="bg-white rounded-2xl border-[1.5px] border-[#e4d9f7] shadow-[0_4px_20px_rgba(46,0,96,0.07),0_1px_4px_rgba(46,0,96,0.04)] overflow-hidden">
                <div className="bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] min-h-[320px] flex items-center justify-center border-b border-[#e4d9f7] relative">
                  <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(109,40,217,0.07) 1px, transparent 1px)', backgroundSize: '18px 18px' }}></div>
                  <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                    <span className="bg-white/90 border border-[#e4d9f7] rounded-md px-2.5 py-1 text-[10px] font-semibold text-[#6d28d9] tracking-wider uppercase">{item.category}</span>
                    <span className="bg-white/90 border border-[#e4d9f7] rounded-md px-2.5 py-1 text-[10px] font-semibold text-[#166534] tracking-wider uppercase">{item.item_condition}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-2.5 text-[#c4b5fd] relative z-10 w-full h-full">
                    {item.item_image ? (
                      <img src={item.item_image} alt={item.item_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[80px] leading-none drop-shadow-md">📦</span>
                    )}
                  </div>
                </div>

                <div className="p-[1.4rem]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-[#ede9fe] text-[#6d28d9] border-[#c4b5fd]">{item.item_type || 'Listing'}</span>
                    <span className="text-[11px] text-[#b8a0d4] font-mono">ID: {item._id?.slice(-6).toUpperCase()}</span>
                  </div>
                  <h1 className="font-['Lora',serif] text-3xl font-bold text-[#1a0040] leading-tight mb-1.5">{item.item_name}</h1>
                  <p className="text-[12.5px] text-[#7c5aa6] mb-4">
                    Condition: <strong className="text-[#4b2c7a] capitalize">{item.item_condition}</strong> &nbsp;&bull;&nbsp; Global Trust Required
                  </p>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-[#ede9fe] text-[#6d28d9] border-[#c4b5fd]">{item.item_type}</span>
                    <span className={`text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border ${item.availability_status === 'available' ? 'bg-[#d1fae5] text-[#065f46] border-[#6ee7b7]' : 'bg-red-50 text-red-600 border-red-100'}`}>
                      {item.availability_status}
                    </span>
                  </div>
                </div>

                <div className="text-[14px] text-[#4b2c7a] leading-relaxed px-5 py-4 bg-[#f8f7ff] rounded-xl border border-[#e4d9f7] mx-[1.4rem] mb-[1.4rem]">
                  {item.description || "No description provided for this item."}
                </div>
              </div>

              {/* Item Specs Table */}
              <div className="bg-white rounded-2xl border-[1.5px] border-[#e4d9f7] shadow-[0_4px_20px_rgba(46,0,96,0.07)] p-[1.4rem]">
                 <h3 className="text-sm font-bold text-[#1f1b5b] mb-4 flex items-center gap-2 uppercase tracking-widest">
                   <span className="w-1.5 h-1.5 bg-[#4f46e5] rounded-full"></span> Details Grid
                 </h3>
                 <div className="grid grid-cols-2 gap-y-4">
                    <div className="text-xs text-gray-400">Category</div>
                    <div className="text-xs font-bold text-[#1f1b5b] text-right">{item.category}</div>
                    <div className="text-xs text-gray-400">Brand / Model</div>
                    <div className="text-xs font-bold text-[#1f1b5b] text-right">{item.brand || 'Generic'}</div>
                    <div className="text-xs text-gray-400">Colour</div>
                    <div className="text-xs font-bold text-[#1f1b5b] text-right">{item.colour || 'N/A'}</div>
                    <div className="text-xs text-gray-400">Quantity</div>
                    <div className="text-xs font-bold text-[#1f1b5b] text-right">{item.quantity || 1}</div>
                 </div>
              </div>
            </div>

            {/* Owner Details Card */}
            <div className="bg-white rounded-2xl border-[1.5px] border-[#e4d9f7] shadow-[0_4px_20px_rgba(46,0,96,0.07),0_1px_4px_rgba(46,0,96,0.04)] overflow-hidden mb-5">
              <div className="px-[1.4rem] py-4 border-b border-[#e4d9f7] flex items-center justify-between">
                <div className="flex items-center gap-[7px] text-[11px] font-semibold text-[#6d28d9] tracking-[0.08em] uppercase">
                  <svg viewBox="0 0 13 13" fill="none" className="w-[13px] h-[13px]">
                    <circle cx="6.5" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M2 11c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  Owner details
                </div>
              </div>
              <div className="p-[1.4rem]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-[46px] h-[46px] rounded-full shrink-0 bg-gradient-to-br from-[#6d28d9] to-[#a78bfa] flex items-center justify-center text-[16px] font-bold text-white border-2 border-[#c4b5fd]">AK</div>
                  <div>
                    <div className="text-[14px] font-semibold text-[#1a0040]">Arjun Karunarathna</div>
                    <div className="text-[11px] text-[#b8a0d4] mt-[1px]">Private seller · Colombo, LK</div>
                    
                    {/* Dynamic Trust Badge */}
                    <div className="mt-2.5">
                      {loading ? (
                        <div className="h-5 w-24 bg-gray-100 animate-pulse rounded-full"></div>
                      ) : ownerTrust ? (
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                          ownerTrust.levelClass === 'high' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          ownerTrust.levelClass === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          <svg viewBox="0 0 12 12" fill="none" className="w-[11px] h-[11px]">
                            <path d="M6 1L7.5 4H10.5L8 6.5L9 9.5L6 8L3 9.5L4 6.5L1.5 4H4.5L6 1Z" fill="currentColor"/>
                          </svg>
                          Trust: {ownerTrust.level} ({ownerTrust.score})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-[3px] text-[10px] text-[#b8a0d4] bg-gray-50 border border-gray-200 rounded-full px-[7px] py-[1px]">
                          Unranked
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="space-y-5">
              {/* Action Card */}
              <div className="bg-white rounded-2xl border-[1.5px] border-[#e4d9f7] shadow-[0_10px_30px_rgba(79,70,229,0.1)] overflow-hidden">
                <div className="p-6">
                  <div className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#7c5aa6] mb-1">Estimated Value</div>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-black text-[#1f1b5b]">LKR {item.price?.toLocaleString() || '0'}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <button onClick={() => navigate('/delivery', { state: { item } })} className="w-full py-3.5 rounded-xl font-bold transition-all bg-[#4f46e5] text-white hover:bg-[#3f37c9] shadow-lg shadow-indigo-200">
                      I'm Interested
                    </button>
                    <button className="w-full py-3.5 rounded-xl font-bold transition-all border-2 border-[#e0ddff] text-[#4f46e5] hover:bg-[#f0efff]">
                      Add to Watchlist
                    </button>
                  </div>
                </div>
                <div className="bg-[#f8f9ff] px-6 py-4 border-t border-[#e9e7ff] text-[11px] text-gray-500 font-medium">
                  Verified listings only. Contact seller for exact details.
                </div>
              </div>

              {/* Owner Trust Card */}
              {owner && (
                <Link 
                  to={`/user/${owner._id}`} 
                  className="block bg-white rounded-2xl border-[1.5px] border-[#e4d9f7] shadow-[0_4px_20px_rgba(46,0,96,0.07)] p-6 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(79,70,229,0.15)] transition-all cursor-pointer group relative overflow-hidden"
                >
                  {/* Subtle Background Glow */}
                  <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl -mr-12 -mt-12 transition-colors ${ownerTrust?.score >= 80 ? 'bg-amber-400/20' : 'bg-indigo-400/10'}`}></div>

                  <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gradient-to-br from-[#4f46e5] to-[#8b5cf6] flex items-center justify-center text-lg font-black text-white shrink-0 shadow-lg group-hover:rotate-6 transition-transform">
                        {ownerAvatar ? <img src={ownerAvatar} alt={ownerName} className="w-full h-full object-cover" /> : nameInitial}
                      </div>
                      <div>
                        <h4 className="font-epilogue font-bold text-[#1f1b5b] group-hover:text-[#4f46e5] transition-colors">{ownerName}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Verified Seller</span>
                           <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                           <span className="text-[9px] font-bold text-slate-400">@{owner.studentId || 'Member'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className={`p-4 rounded-2xl border transition-colors ${ownerTrust?.score >= 80 ? 'bg-amber-50 border-amber-200' : 'bg-[#f0f9ff] border-[#bae6fd]'}`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${ownerTrust?.score >= 80 ? 'text-amber-700' : 'text-sky-700'}`}>
                          Trust Protocol
                        </span>
                        <div className="flex items-center gap-1">
                           <span className="text-sm font-black text-slate-900">{ownerTrust?.score || 0}%</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Integrity</span>
                        </div>
                      </div>
                      
                      <div className="w-full h-1.5 bg-white/60 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full transition-all duration-1000 ${ownerTrust?.score >= 80 ? 'bg-amber-500' : 'bg-sky-500'}`} 
                          style={{ width: `${ownerTrust?.score || 0}%` }}
                        ></div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                         <div className="flex items-center gap-1">
                            <span className="text-sm">⭐</span>
                            <span className="text-xs font-black text-slate-700">{ownerTrust?.avgRating || '0.0'}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Avg</span>
                         </div>
                         <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/50 px-2 py-0.5 rounded-lg border border-white">
                           {ownerTrust?.level || 'Improving'}
                         </div>
                      </div>
                    </div>

                    <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest group-hover:text-indigo-500 transition-colors">
                      View full reputation ledger →
                    </p>
                  </div>
                </Link>
              )}

              {/* Payment Info */}
              {item.payment_details && (
                <div className="bg-white rounded-2xl border-[1.5px] border-[#e4d9f7] shadow-[0_4px_20px_rgba(46,0,96,0.07)] p-6">
                   <h3 className="text-xs font-bold text-[#4f46e5] mb-4 uppercase tracking-[0.2em]">Settlement Info</h3>
                   <div className="space-y-3">
                      <div>
                        <p className="text-[10px] text-gray-400 lowercase">Bank</p>
                        <p className="text-sm font-bold text-[#1f1b5b]">{item.payment_details.bank_name || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 lowercase">Account Name</p>
                        <p className="text-sm font-bold text-[#1f1b5b]">{item.payment_details.account_name || 'N/A'}</p>
                      </div>
                      <div className="flex justify-between items-center group">
                        <div>
                          <p className="text-[10px] text-gray-400 lowercase">Account Number</p>
                          <p className="text-sm font-mono font-bold text-[#1f1b5b] tracking-tighter">{item.payment_details.account_number || '•••• ••••'}</p>
                        </div>
                        <button 
                          onClick={() => handleCopy(item.payment_details.account_number, 'account')}
                          className="p-2 rounded-lg bg-gray-50 hover:bg-[#eef2ff] transition-colors"
                        >
                          {copiedAccount ? '✅' : '📋'}
                        </button>
                      </div>
                   </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
