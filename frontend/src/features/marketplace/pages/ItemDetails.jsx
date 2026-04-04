import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const ItemDetails = () => {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedBranch, setCopiedBranch] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const item = location.state?.item;

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

  return (
    <div className="font-['Sora',sans-serif] bg-[#f0ebff] min-h-screen p-4 md:p-8 pb-12 relative z-0">
      {/* Background decorations */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 900px 600px at -5% -5%, #7c3aed2a 0%, transparent 55%), radial-gradient(ellipse 600px 500px at 105% 105%, #5b21b62a 0%, transparent 55%)'
      }}></div>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(#e4d9f730 1px, transparent 1px), linear-gradient(90deg, #e4d9f730 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      {!item ? (
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-[#1a0040] mb-4">Item Not Found</h2>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-[#6d28d9] text-white rounded-lg font-semibold hover:bg-[#5b21b6]">Return Dashboard</button>
        </div>
      ) : (
      <div className="relative z-10 max-w-[1080px] mx-auto animate-fade-in-up">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-[#b8a0d4] mb-5">
          <button onClick={() => navigate('/')} className="text-[#6d28d9] font-medium hover:underline cursor-pointer">Dashboard</button>
          <span className="text-[#e4d9f7]">/</span>
          <span className="text-[#6d28d9] font-medium">{item.cat}</span>
          <span className="text-[#e4d9f7]">/</span>
          <span>{item.title}</span>
        </div>

        {/* Topbar */}
        <div className="flex items-center justify-between mb-[1.4rem] flex-wrap gap-2.5">
          <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-[13px] font-medium text-[#4b2c7a] bg-white border-[1.5px] border-[#cfbfed] rounded-lg px-3.5 py-[7px] cursor-pointer transition-all shadow-[0_2px_8px_rgba(46,0,96,0.07)] hover:bg-[#f5f3ff] hover:border-[#a78bfa] hover:text-[#6d28d9]">
            <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Back to list
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-5 items-start">
          
          {/* Left Column */}
          <div>
            {/* Image Card */}
            <div className="bg-white rounded-2xl border-[1.5px] border-[#e4d9f7] shadow-[0_4px_20px_rgba(46,0,96,0.07),0_1px_4px_rgba(46,0,96,0.04)] overflow-hidden mb-5">
              <div className="bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] min-h-[260px] flex items-center justify-center border-b border-[#e4d9f7] relative">
                <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, rgba(109,40,217,0.07) 1px, transparent 1px)', backgroundSize: '18px 18px'}}></div>
                <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                  <span className="bg-white/90 border border-[#e4d9f7] rounded-md px-2.5 py-1 text-[10px] font-semibold text-[#6d28d9] tracking-wider uppercase">Laboratory</span>
                  <span className="bg-white/90 border border-[#e4d9f7] rounded-md px-2.5 py-1 text-[10px] font-semibold text-[#166534] tracking-wider uppercase">New</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2.5 text-[#c4b5fd] relative z-10 w-full h-full">
                  <span className="text-[80px] leading-none drop-shadow-md">{item.emoji}</span>
                </div>
              </div>

              <div className="p-[1.4rem] pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-[#ede9fe] text-[#6d28d9] border-[#c4b5fd]">{item.cat}</span>
                  <span className="text-[11px] text-[#b8a0d4] font-mono">#UV-{id?.padStart(4, '0')}</span>
                </div>
                <h1 className="font-['Lora',serif] text-[22px] font-medium text-[#1a0040] leading-tight mb-1.5">{item.title}</h1>
                <p className="text-[12.5px] text-[#7c5aa6] mb-4">
                  Condition: <strong className="text-[#4b2c7a]">{item.badge || 'Pre-owned'}</strong> &nbsp;&bull;&nbsp; Rating: <strong className="text-[#4b2c7a]">{item.stars} Stars</strong> &nbsp;&bull;&nbsp; Added: <strong className="text-[#4b2c7a]">Today</strong>
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-[#dcfce7] text-[#166534] border-[#4ade80]">{item.badge || 'Used'}</span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-[#ede9fe] text-[#6d28d9] border-[#c4b5fd]">For sale</span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-[#d1fae5] text-[#065f46] border-[#6ee7b7]">Available</span>
                </div>
              </div>

              <div className="text-[13px] text-[#7c5aa6] leading-relaxed px-4 py-3.5 bg-[#f5f3ff] rounded-[10px] border border-[#e4d9f7] mx-[1.4rem] mb-[1.2rem]">
                {item.desc}
              </div>
            </div>

            {/* Item Details Card */}
            <div className="bg-white rounded-2xl border-[1.5px] border-[#e4d9f7] shadow-[0_4px_20px_rgba(46,0,96,0.07),0_1px_4px_rgba(46,0,96,0.04)] overflow-hidden">
              <div className="px-[1.4rem] py-4 border-b border-[#e4d9f7] flex items-center justify-between">
                <div className="flex items-center gap-[7px] text-[11px] font-semibold text-[#6d28d9] tracking-[0.08em] uppercase">
                  <svg viewBox="0 0 13 13" fill="none" className="w-[13px] h-[13px]">
                    <rect x="1" y="1" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M4 4h5M4 6.5h5M4 9h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  Item details
                </div>
              </div>
              <div className="p-[1.4rem]">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-[#e4d9f7]">
                      <td className="py-2 text-[12px] text-[#7c5aa6] w-[44%] pr-2 align-middle">Item ID</td>
                      <td className="py-2 text-[12px] font-medium text-[#1a0040] text-right font-mono align-middle">UV-{id?.padStart(4, '0')}</td>
                    </tr>
                    <tr className="border-b border-[#e4d9f7]">
                      <td className="py-2 text-[12px] text-[#7c5aa6] w-[44%] pr-2 align-middle">Item name</td>
                      <td className="py-2 text-[12.5px] font-medium text-[#1a0040] text-right align-middle">{item.title}</td>
                    </tr>
                    <tr className="border-b border-[#e4d9f7]">
                      <td className="py-2 text-[12px] text-[#7c5aa6] w-[44%] pr-2 align-middle">Category</td>
                      <td className="py-2 text-[12.5px] font-medium text-[#1a0040] text-right align-middle">{item.cat}</td>
                    </tr>
                    <tr className="border-b border-[#e4d9f7]">
                      <td className="py-2 text-[12px] text-[#7c5aa6] w-[44%] pr-2 align-middle">Condition</td>
                      <td className="py-2 text-[12.5px] font-medium text-[#1a0040] text-right align-middle"><span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-[2px] rounded-full border bg-[#dcfce7] text-[#166534] border-[#4ade80]">{item.badge || 'Used'}</span></td>
                    </tr>
                    <tr className="border-b border-[#e4d9f7]">
                      <td className="py-2 text-[12px] text-[#7c5aa6] w-[44%] pr-2 align-middle">Listing type</td>
                      <td className="py-2 text-[12.5px] font-medium text-[#1a0040] text-right align-middle"><span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-[2px] rounded-full border bg-[#ede9fe] text-[#6d28d9] border-[#c4b5fd]">Sell</span></td>
                    </tr>
                    <tr className="border-b border-[#e4d9f7]">
                      <td className="py-2 text-[12px] text-[#7c5aa6] w-[44%] pr-2 align-middle">Availability</td>
                      <td className="py-2 text-[12.5px] font-medium text-[#1a0040] text-right align-middle"><span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-[2px] rounded-full border bg-[#d1fae5] text-[#065f46] border-[#6ee7b7]">Available</span></td>
                    </tr>
                    <tr className="border-b border-[#e4d9f7]">
                      <td className="py-2 text-[12px] text-[#7c5aa6] w-[44%] pr-2 align-middle">Price</td>
                      <td className="py-2 text-[12.5px] font-semibold text-[#6d28d9] text-right align-middle">{item.price} {item.old && <span className="line-through text-gray-400 text-xs ml-1">{item.old}</span>}</td>
                    </tr>
                    <tr className="border-b border-[#e4d9f7]">
                      <td className="py-2 text-[12px] text-[#7c5aa6] w-[44%] pr-2 align-middle">Quantity</td>
                      <td className="py-2 text-[12.5px] font-medium text-[#1a0040] text-right align-middle">1 unit</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-[12px] text-[#7c5aa6] w-[44%] pr-2 align-middle border-b-0">Listed on</td>
                      <td className="py-2 text-[12.5px] font-medium text-[#1a0040] text-right align-middle border-b-0">Today</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Bid Card */}
            <div className="bg-white rounded-2xl border-[1.5px] border-[#e4d9f7] shadow-[0_4px_20px_rgba(46,0,96,0.09)] overflow-hidden mb-5">
              <div className="p-[1.4rem] pb-0">
                <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#7c5aa6] mb-1">Current bid</div>
                <div className="flex items-baseline gap-1.5 mb-[1.2rem]">
                  <span className="text-[38px] font-bold text-[#1a0040] leading-none">{item.price}</span>
                  <span className="text-[14px] font-semibold text-[#7c5aa6]">USD</span>
                </div>
                <button className="w-full p-3 rounded-[10px] font-['Sora',sans-serif] text-[15px] font-semibold cursor-pointer border-none bg-[#1a0040] text-white transition-all shadow-[0_4px_14px_rgba(26,0,64,0.25)] hover:bg-[#2e0060] hover:shadow-[0_6px_20px_rgba(26,0,64,0.35)] active:scale-95">Place Bid</button>
                <div className="flex items-center gap-2.5 py-4 text-[#b8a0d4] text-[11px] font-semibold tracking-[0.08em]">
                  <div className="flex-1 h-[1px] bg-[#e4d9f7]"></div>
                  OR
                  <div className="flex-1 h-[1px] bg-[#e4d9f7]"></div>
                </div>
                <button onClick={() => navigate('/delivery', { state: { item } })} className="w-full p-3 rounded-[10px] font-['Sora',sans-serif] text-[14px] font-semibold cursor-pointer border-[1.5px] border-[#c4b5fd] bg-[#f5f3ff] text-[#6d28d9] transition-all hover:bg-[#ede9fe] hover:border-[#a78bfa] hover:shadow-[0_4px_12px_rgba(109,40,217,0.18)] active:scale-95">Buy Now for {item.price}</button>
                <div className="h-[1.2rem]"></div>
              </div>
              <div className="py-3.5 px-[1.4rem] border-t border-[#e4d9f7] flex items-center justify-between bg-[#f5f3ff]">
                <div className="text-[11px] text-[#b8a0d4]">
                  <div>Ends in</div>
                  <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#991b1b]">
                    <svg viewBox="0 0 13 13" fill="none" className="w-[13px] h-[13px]">
                      <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M6.5 3.5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    2d 14h 32m
                  </div>
                </div>
                <div className="text-[11px] text-[#b8a0d4] text-right">
                  <div>Total bids</div>
                  <div className="text-[14px] font-bold text-[#1a0040] mt-[2px]">18</div>
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
                    <span className="inline-flex items-center gap-[3px] text-[10px] text-[#166534] bg-[#dcfce7] border border-[#4ade80] rounded-full px-[7px] py-[1px] mt-[3px]">
                      <svg viewBox="0 0 9 9" fill="none" className="w-[9px] h-[9px]">
                        <circle cx="4.5" cy="4.5" r="4" stroke="#166534" strokeWidth="1"/>
                        <path d="M2.5 4.5l1.5 1.5 2.5-2.5" stroke="#166534" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Verified seller
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1.5 border-b border-[#e4d9f7]">
                  <div className="w-7 h-7 rounded-[7px] bg-[#f5f3ff] border border-[#e4d9f7] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 13 13" fill="none" className="text-[#6d28d9] w-[13px] h-[13px]">
                      <rect x="1" y="3" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M1 4l5.5 4L12 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10.5px] text-[#b8a0d4] mb-[1px]">Email</div>
                    <div className="text-[12.5px] font-medium text-[#1a0040]"><a href="mailto:arjun@example.com" className="hover:underline">arjun@example.com</a></div>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1.5 border-b border-[#e4d9f7]">
                  <div className="w-7 h-7 rounded-[7px] bg-[#f5f3ff] border border-[#e4d9f7] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 13 13" fill="none" className="text-[#6d28d9] w-[13px] h-[13px]">
                      <rect x="3" y="1" width="7" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                      <circle cx="6.5" cy="9.5" r=".8" fill="currentColor"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10.5px] text-[#b8a0d4] mb-[1px]">Phone</div>
                    <div className="text-[12.5px] font-medium text-[#1a0040]">+94 77 234 5678</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 py-1.5">
                  <div className="w-7 h-7 rounded-[7px] bg-[#f5f3ff] border border-[#e4d9f7] flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 13 13" fill="none" className="text-[#6d28d9] w-[13px] h-[13px]">
                      <path d="M6.5 1C3.5 1 1 3.5 1 6.5c0 1 .3 2 .8 2.8L1 12l2.8-.8c.8.5 1.7.8 2.7.8C9.5 12 12 9.5 12 6.5S9.5 1 6.5 1Z" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M4.5 5s.2-.3.5-.3c.1 0 .2 0 .3.1l.5 1.2c0 .1 0 .2-.1.3l-.3.3c.3.6.8 1.1 1.4 1.4l.3-.3c.1-.1.2-.1.3-.1L8.5 8c.1.1.1.2.1.3 0 .3-.3.5-.3.5C7.5 9.3 5 8 4.5 5Z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-[10.5px] text-[#b8a0d4] mb-[1px]">WhatsApp</div>
                    <div className="text-[12.5px] font-medium text-[#1a0040]">+94 77 234 5678</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Details Card */}
            <div className="bg-white rounded-2xl border-[1.5px] border-[#e4d9f7] shadow-[0_4px_20px_rgba(46,0,96,0.07),0_1px_4px_rgba(46,0,96,0.04)] overflow-hidden">
              <div className="px-[1.4rem] py-4 border-b border-[#e4d9f7] flex items-center justify-between">
                <div className="flex items-center gap-[7px] text-[11px] font-semibold text-[#6d28d9] tracking-[0.08em] uppercase">
                  <svg viewBox="0 0 13 13" fill="none" className="w-[13px] h-[13px]">
                    <rect x="1" y="3" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M1 6h11" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M4 8.5h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  Bank details
                </div>
                <span className="text-[10px] bg-[#f5f3ff] text-[#6d28d9] border border-[#c4b5fd] rounded-full px-2 py-[2px] font-semibold">Payment info</span>
              </div>
              <div className="p-[1.4rem]">
                
                {/* Visual Bank Card */}
                <div className="bg-gradient-to-br from-[#2e0060] via-[#6d28d9] to-[#8b5cf6] rounded-[14px] p-5 mb-[1.1rem] relative overflow-hidden">
                  <div className="absolute -top-[30px] -right-[30px] w-[120px] h-[120px] rounded-full bg-white/5"></div>
                  <div className="absolute -bottom-[40px] -left-[20px] w-[140px] h-[140px] rounded-full bg-white/5"></div>
                  
                  <div className="w-[30px] h-[22px] bg-gradient-to-br from-[#f0d060] to-[#c89820] rounded mb-[0.8rem] relative z-10"></div>
                  <div className="text-[14px] font-semibold text-white/90 tracking-[0.15em] mb-[0.7rem] font-mono relative z-10">•••• •••• •••• 4782</div>
                  
                  <div className="flex justify-between items-end relative z-10">
                    <div>
                      <div className="text-[11px] text-white/60 uppercase tracking-[0.06em]">Card holder</div>
                      <div className="text-[13px] font-semibold text-white mt-[2px]">Arjun Karunarathna</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/50 text-right">Expires</div>
                      <div className="text-[13px] font-semibold text-white text-right mt-[2px]">08 / 28</div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-3.5 right-3.5 opacity-90">
                    <svg viewBox="0 0 36 22" fill="none" className="w-[36px] h-[22px]">
                      <circle cx="14" cy="11" r="10" fill="#eb001b" opacity=".9"/>
                      <circle cx="22" cy="11" r="10" fill="#f79e1b" opacity=".9"/>
                      <path d="M18 5.5a10 10 0 010 11" stroke="#ff5f00" strokeWidth="2" fill="none"/>
                    </svg>
                  </div>
                </div>

                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-[#e4d9f7]">
                      <td className="py-1.5 text-[12px] text-[#7c5aa6] w-[45%] align-middle">Bank name</td>
                      <td className="py-1.5 text-[12.5px] font-medium text-[#1a0040] text-right align-middle">Commercial Bank of Ceylon</td>
                    </tr>
                    <tr className="border-b border-[#e4d9f7]">
                      <td className="py-1.5 text-[12px] text-[#7c5aa6] w-[45%] align-middle">Account name</td>
                      <td className="py-1.5 text-[12.5px] font-medium text-[#1a0040] text-right align-middle">Arjun Karunarathna</td>
                    </tr>
                    <tr className="border-b border-[#e4d9f7]">
                      <td className="py-1.5 text-[12px] text-[#7c5aa6] w-[45%] align-middle">Account no.</td>
                      <td className="py-1.5 text-[11.5px] font-medium text-[#1a0040] text-right font-mono align-middle">
                        8801 2347 4782
                        <button 
                          onClick={() => handleCopy('880123474782', 'account')}
                          className={`ml-2 px-2 py-0.5 text-[10px] font-['Sora',sans-serif] rounded-[5px] border cursor-pointer transition-all ${copiedAccount ? 'bg-[#dcfce7] text-[#166534] border-[#4ade80]' : 'bg-[#f5f3ff] border-[#e4d9f7] text-[#6d28d9] hover:bg-[#ede9fe] hover:border-[#a78bfa]'}`}
                        >
                          {copiedAccount ? 'Copied!' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-[#e4d9f7]">
                      <td className="py-1.5 text-[12px] text-[#7c5aa6] w-[45%] align-middle">Branch den</td>
                      <td className="py-1.5 text-[11.5px] font-medium text-[#1a0040] text-right font-mono align-middle">
                        010
                        <button 
                          onClick={() => handleCopy('010', 'branch')}
                          className={`ml-2 px-2 py-0.5 text-[10px] font-['Sora',sans-serif] rounded-[5px] border cursor-pointer transition-all ${copiedBranch ? 'bg-[#dcfce7] text-[#166534] border-[#4ade80]' : 'bg-[#f5f3ff] border-[#e4d9f7] text-[#6d28d9] hover:bg-[#ede9fe] hover:border-[#a78bfa]'}`}
                        >
                          {copiedBranch ? 'Copied!' : 'Copy'}
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-1.5 text-[12px] text-[#7c5aa6] w-[45%] align-middle border-b-0">Currency</td>
                      <td className="py-1.5 text-[12.5px] font-medium text-[#1a0040] text-right align-middle border-b-0">LKR / USD</td>
                    </tr>
                  </tbody>
                </table>

                <div className="flex items-start gap-2 bg-[#fffbeb] border border-[#fbbf24] rounded-lg px-3.5 py-3 mt-3.5 text-[11.5px] text-[#92400e] leading-relaxed">
                  <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5 shrink-0 mt-[1px]">
                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M7 5v3M7 9.5v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  Bank details are confidential. Only share payment after verifying the seller's identity. Glassworks is not responsible for third-party transactions.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default ItemDetails;
