import React, { useState, useEffect, useRef } from 'react';

const Feedback = () => {
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const [toast, setToast] = useState({ visible: false, message: '' });
  const toastTimeout = useRef(null);

  // Form states
  const [priority, setPriority] = useState('Medium');
  const [rating, setRating] = useState(4);
  const [modalRating, setModalRating] = useState(4);
  const [nps, setNps] = useState(8);
  const [selectedChips, setSelectedChips] = useState(['Buying Experience']);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Outfit:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 4000);
  };

  const toggleChip = (chip) => {
    if (selectedChips.includes(chip)) {
      setSelectedChips(selectedChips.filter(c => c !== chip));
    } else {
      setSelectedChips([...selectedChips, chip]);
    }
  };

  const handleSubmitTicket = () => {
    setTicketModalOpen(false);
    showToast('🎫 Ticket submitted! We\'ll respond within 2 hours.');
  };

  const handleSubmitFeedback = () => {
    setFeedbackModalOpen(false);
    showToast('💬 Thank you for your feedback!');
  };

  const faqs = [
    { q: "How do I track my order?", a: "Go to My Orders from the top navigation. Each order shows its current status — Pending, In Transit, or Delivered. For courier deliveries, a live tracking link is available." },
    { q: "What happens if my bid is outbid?", a: "You'll receive an instant notification via email and in-app when someone outbids you. You can then place a higher bid before the auction ends." },
    { q: "How does Buyer Protection work?", a: "Funds are held in escrow by UniMarket and only released to the seller once you confirm delivery. If an issue arises, raise a ticket and our team will investigate." },
    { q: "Can I cancel an order or bid?", a: "Orders can be cancelled before the seller confirms. Bids can be retracted up to 24 hours after placement if the auction end date is more than 48 hours away." },
    { q: "How do I dispute a transaction?", a: "Raise a ticket under the 'Seller Dispute' category with your Order ID and a description of the issue. Our team will mediate within 24 hours." },
    { q: "How are marketplace fees calculated?", a: "UniMarket charges a 3% marketplace fee on the final transaction amount. This covers payment processing, buyer protection, and platform maintenance." },
  ];

  return (
    <div className="min-h-screen font-['Outfit',_sans-serif] text-[#1E1035] bg-gradient-to-br from-[#EEE8FB] via-[#E3D8F7] to-[#F0F4FF] bg-fixed relative overflow-hidden">

      <style>
        {`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(18px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulseGreen {
            0%, 100% { box-shadow: 0 0 0 4px rgba(90,204,106,0.2); }
            50% { box-shadow: 0 0 0 8px rgba(90,204,106,0.08); }
          }
          @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>

      {/* No Nav block because you can wrap this in App layout */}

      {/* HERO */}
      <div className="bg-white pt-16 pb-20 px-10 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-[110px] pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 110' preserveAspectRatio='none'%3E%3Cpath d='M0,60 C200,110 400,10 600,55 C800,100 1000,20 1200,50 C1300,65 1380,45 1440,55 L1440,110 L0,110 Z' fill='%23EEE8FB' opacity='0.7'/%3E%3Cpath d='M0,80 C180,30 360,90 540,60 C720,30 900,80 1080,55 C1200,38 1360,70 1440,60 L1440,110 L0,110 Z' fill='%23D8EEF8' opacity='0.5'/%3E%3Cpath d='M0,90 C240,50 480,100 720,75 C960,50 1200,90 1440,70 L1440,110 L0,110 Z' fill='%23DFF5E8' opacity='0.4'/%3E%3C/svg%3E\")",
          backgroundSize: "100% 100%"
        }} />
        <div className="font-['Space_Mono'] text-[10px] font-bold tracking-[2.5px] uppercase text-[#4c00b0]/60 mb-3 relative z-10">Help Center</div>
        <h1 className="font-['Playfair_Display'] text-[38px] font-semibold text-[#1E1035] tracking-[-0.5px] leading-[1.15] mb-2.5 relative z-10">How can we help you?</h1>
        <div className="text-[15px] text-[#8A7AAA] mb-[30px] relative z-10">Search our knowledge base or raise a support ticket</div>

        <div className="flex items-center bg-white rounded-[14px] max-w-[520px] mx-auto shadow-[0_8px_32px_rgba(180,160,240,0.25),_0_1px_4px_rgba(196,181,253,0.3)] border-[1.5px] border-[#C4B5FD]/40 relative z-10 overflow-hidden">
          <div className="px-4 text-[18px] text-[#8A7AAA]">🔍</div>
          <input type="text" placeholder="Search for answers, topics, or ticket IDs…" className="flex-1 py-[15px] border-none outline-none font-['Outfit'] text-[14px] text-[#1E1035] bg-transparent placeholder-[#C0B8D8]" />
          <button className="px-6 py-2.5 mx-1.5 bg-[#4c00b0] hover:bg-[#3a0085] text-white border-none rounded-[10px] font-bold text-[13px] transition-colors cursor-pointer">Search</button>
        </div>
      </div>

      {/* PAGE BODY */}
      <div className="max-w-[1100px] mx-auto px-8 pt-10 pb-[60px] relative z-10">

        {/* Status Banner */}
        <div className="bg-white border-[1.5px] border-[#E0D8F5] rounded-[16px] px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 mb-10 animate-[fadeUp_0.4s_ease_0.25s_both]">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#5ACC6A]" style={{ animation: 'pulseGreen 2s infinite' }} />
              <div className="text-[14px] font-bold text-[#1E1035]">All Systems Operational</div>
            </div>
            <div className="text-[12.5px] text-[#8A7AAA] mt-px">UniMarket platform is running normally · Last checked 2 mins ago</div>
          </div>
          <div className="hidden md:flex gap-6">
            <div className="text-center">
              <div className="font-['Space_Mono'] text-[18px] font-bold text-[#4c00b0]">98.9%</div>
              <div className="text-[11px] text-[#8A7AAA] mt-px">Uptime</div>
            </div>
            <div className="text-center">
              <div className="font-['Space_Mono'] text-[18px] font-bold text-[#4c00b0]">~2h</div>
              <div className="text-[11px] text-[#8A7AAA] mt-px">Avg. Response</div>
            </div>
            <div className="text-center">
              <div className="font-['Space_Mono'] text-[18px] font-bold text-[#4c00b0]">4.8★</div>
              <div className="text-[11px] text-[#8A7AAA] mt-px">Support Rating</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-5">
          <div className="font-['Playfair_Display'] text-[22px] font-semibold text-[#1E1035] mb-1">How would you like to get help?</div>
          <div className="text-[13px] text-[#8A7AAA]">Choose the best way to reach us or share your thoughts</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 animate-[fadeUp_0.4s_ease_0.05s_both]">
          <div className="bg-white border-[1.5px] border-[#E0D8F5] hover:border-[#C9B3F5] rounded-[16px] p-6 hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(76,0,176,0.12)] transition-all cursor-pointer relative overflow-hidden group" onClick={() => setTicketModalOpen(true)}>
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#4c00b0]" />
            <div className="w-11 h-11 rounded-xl bg-[#EDE9FE] flex items-center justify-center text-[22px] mb-2.5">🎫</div>
            <div className="text-[15px] font-bold text-[#1E1035]">Raise a Ticket</div>
            <div className="text-[12.5px] text-[#8A7AAA] leading-relaxed mt-1 mb-1">Submit a support request and our team will respond within 2 hours on business days.</div>
            <div className="text-[12.5px] font-bold text-[#4c00b0] mt-auto pt-2 flex items-center gap-1">Open a ticket →</div>
          </div>

          <div className="bg-white border-[1.5px] border-[#E0D8F5] hover:border-[#F59E0B]/50 rounded-[16px] p-6 hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(245,158,11,0.1)] transition-all cursor-pointer relative overflow-hidden group" onClick={() => setFeedbackModalOpen(true)}>
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#F59E0B]" />
            <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] flex items-center justify-center text-[22px] mb-2.5">💬</div>
            <div className="text-[15px] font-bold text-[#1E1035]">Share Feedback</div>
            <div className="text-[12.5px] text-[#8A7AAA] leading-relaxed mt-1 mb-1">Rate your experience, suggest improvements, or let us know what you love about UniMarket.</div>
            <div className="text-[12.5px] font-bold text-[#F59E0B] mt-auto pt-2 flex items-center gap-1">Give feedback →</div>
          </div>

          <div className="bg-white border-[1.5px] border-[#E0D8F5] hover:border-[#48C0E8]/50 rounded-[16px] p-6 hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(72,192,232,0.1)] transition-all cursor-pointer relative overflow-hidden group">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#48C0E8]" />
            <div className="w-11 h-11 rounded-xl bg-[#E0F7F8] flex items-center justify-center text-[22px] mb-2.5">💡</div>
            <div className="text-[15px] font-bold text-[#1E1035]">Knowledge Base</div>
            <div className="text-[12.5px] text-[#8A7AAA] leading-relaxed mt-1 mb-1">Browse guides, FAQs, and tutorials to solve common issues on your own instantly.</div>
            <div className="text-[12.5px] font-bold text-[#48C0E8] mt-auto pt-2 flex items-center gap-1">Browse articles →</div>
          </div>
        </div>

        {/* TWO COLUMN PANELS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* TICKET PANEL */}
          <div className="bg-white border-[1.5px] border-[#E0D8F5] rounded-[18px] overflow-hidden animate-[fadeUp_0.4s_ease_0.1s_both]">
            <div className="px-6 py-[18px] border-b-[1.5px] border-[#E0D8F5] flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#EDE9FE] flex items-center justify-center text-[18px]">🎫</div>
              <div>
                <div className="text-[15.5px] font-bold text-[#1E1035]">Raise a Support Ticket</div>
                <div className="text-[12px] text-[#8A7AAA] mt-px">We'll get back to you within 2 hours</div>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">Subject</label>
                <input type="text" placeholder="Brief description of your issue" className="px-3.5 py-2.5 bg-[#FAF7FF] border-[1.5px] border-[#E0D8F5] focus:border-[#C4B5FD] rounded-lg text-sm outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,0,176,0.07)]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">Category</label>
                <select className="px-3.5 py-2.5 bg-[#FAF7FF] border-[1.5px] border-[#E0D8F5] focus:border-[#C4B5FD] rounded-lg text-sm outline-none transition-all appearance-none cursor-pointer text-[#1E1035]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%238A7AAA' d='M5 7L0 2h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "30px" }}>
                  <option value="">Select a category</option>
                  <option>Order & Delivery Issue</option>
                  <option>Payment / Billing</option>
                  <option>Account Access</option>
                  <option>Seller Dispute</option>
                  <option>Bid / Auction Problem</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">Priority</label>
                <div className="flex gap-2">
                  <button onClick={() => setPriority('Low')} className={`flex-1 py-2 px-2.5 rounded-lg border-[1.5px] font-semibold text-xs transition-colors ${priority === 'Low' ? 'border-[#5ACC6A] bg-[#D1FAE5] text-[#065F46]' : 'border-[#E0D8F5] bg-[#FAF7FF] text-[#8A7AAA] hover:border-[#C9B3F5]'}`}>🟢 Low</button>
                  <button onClick={() => setPriority('Medium')} className={`flex-1 py-2 px-2.5 rounded-lg border-[1.5px] font-semibold text-xs transition-colors ${priority === 'Medium' ? 'border-[#F59E0B] bg-[#FEF3C7] text-[#92400E]' : 'border-[#E0D8F5] bg-[#FAF7FF] text-[#8A7AAA] hover:border-[#C9B3F5]'}`}>🟡 Medium</button>
                  <button onClick={() => setPriority('High')} className={`flex-1 py-2 px-2.5 rounded-lg border-[1.5px] font-semibold text-xs transition-colors ${priority === 'High' ? 'border-[#EF4444] bg-[#FEE2E2] text-[#991B1B]' : 'border-[#E0D8F5] bg-[#FAF7FF] text-[#8A7AAA] hover:border-[#C9B3F5]'}`}>🔴 High</button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">Description</label>
                <textarea placeholder="Describe your issue in detail. Include order ID if relevant…" className="px-3.5 py-2.5 bg-[#FAF7FF] border-[1.5px] border-[#E0D8F5] focus:border-[#C4B5FD] rounded-lg text-sm outline-none transition-all resize-none h-[88px] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,0,176,0.07)]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">Attachment (Optional)</label>
                <label className="border-2 border-dashed border-[#E0D8F5] hover:border-[#C4B5FD] hover:bg-[#EDE9FE] bg-[#FAF7FF] rounded-lg p-4 text-center cursor-pointer transition-colors text-[12.5px] text-[#8A7AAA] flex flex-col items-center">
                  <span className="text-xl mb-1">📎</span>
                  Drop a screenshot here, or click to browse
                  <input type="file" className="hidden" accept=".jpg,.png,.pdf,.txt" />
                </label>
              </div>

              <button onClick={handleSubmitTicket} className="w-full mt-2 py-[13px] bg-[#4c00b0] hover:bg-[#3a0085] hover:-translate-y-px text-white font-bold text-sm rounded-xl shadow-[0_4px_18px_rgba(76,0,176,0.3)] transition-all">
                Submit Ticket →
              </button>
            </div>
          </div>

          {/* FEEDBACK PANEL */}
          <div className="bg-white border-[1.5px] border-[#E0D8F5] rounded-[18px] overflow-hidden animate-[fadeUp_0.4s_ease_0.15s_both]">
            <div className="px-6 py-[18px] border-b-[1.5px] border-[#E0D8F5] flex items-center gap-3">
              <div className="w-9 h-9 rounded-[10px] bg-[#FEF3C7] flex items-center justify-center text-[18px]">💬</div>
              <div>
                <div className="text-[15.5px] font-bold text-[#1E1035]">Share Your Feedback</div>
                <div className="text-[12px] text-[#8A7AAA] mt-px">Help us improve UniMarket</div>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">Overall Experience</label>
                <div className="flex justify-center gap-2 my-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} onClick={() => setRating(star)} className={`text-[32px] cursor-pointer transition-transform hover:scale-120 hover:grayscale-0 ${star <= rating ? 'grayscale-0 opacity-100' : 'grayscale opacity-40'}`}>⭐</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">What are you rating?</label>
                <div className="flex flex-wrap gap-2">
                  {['Buying Experience', 'Delivery', 'Seller Quality', 'Platform UI', 'Support Team', 'Pricing'].map(chip => (
                    <div key={chip} onClick={() => toggleChip(chip)} className={`px-3.5 py-1.5 rounded-full border-[1.5px] text-[12.5px] font-semibold cursor-pointer transition-colors ${selectedChips.includes(chip) ? 'bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]' : 'bg-[#FAF7FF] border-[#E0D8F5] text-[#8A7AAA] hover:border-[#F59E0B] hover:text-[#F59E0B]'}`}>
                      {chip}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">How likely are you to recommend UniMarket? (0–10)</label>
                <div className="flex gap-1.5 mb-1 justify-between">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                    <button key={n} onClick={() => setNps(n)} className={`flex-1 py-2 rounded-lg border-[1.5px] font-['Space_Mono'] text-xs font-bold transition-colors text-center ${nps === n ? 'bg-[#4c00b0] border-[#4c00b0] text-white' : 'bg-[#FAF7FF] border-[#E0D8F5] text-[#8A7AAA] hover:border-[#C9B3F5] hover:text-[#1E1035]'}`}>
                      {n}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10.5px] text-[#C0B8D8]">
                  <span>Not likely</span>
                  <span>Very likely</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">Your Comments</label>
                <textarea placeholder="Tell us what went well, what could be better…" className="px-3.5 py-2.5 bg-[#FAF7FF] border-[1.5px] border-[#E0D8F5] focus:border-[#C4B5FD] rounded-lg text-sm outline-none transition-all resize-none h-[88px] focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,0,176,0.07)]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">Your Name (Optional)</label>
                <input type="text" placeholder="Alex Rivera" className="px-3.5 py-2.5 bg-[#FAF7FF] border-[1.5px] border-[#E0D8F5] focus:border-[#C4B5FD] rounded-lg text-sm outline-none transition-all focus:bg-white focus:shadow-[0_0_0_3px_rgba(76,0,176,0.07)]" />
              </div>

              <button onClick={handleSubmitFeedback} className="w-full mt-2 py-[13px] bg-[#F59E0B] hover:bg-[#D97706] hover:-translate-y-px text-white font-bold text-sm rounded-xl shadow-[0_4px_18px_rgba(245,158,11,0.3)] transition-all">
                Submit Feedback ✨
              </button>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="animate-[fadeUp_0.4s_ease_0.2s_both]">
          <div className="mb-5">
            <div className="font-['Playfair_Display'] text-[22px] font-semibold text-[#1E1035] mb-1">Frequently Asked Questions</div>
            <div className="text-[13px] text-[#8A7AAA]">Quick answers to common questions</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`bg-white border-[1.5px] border-[#E0D8F5] hover:shadow-[0_4px_20px_rgba(76,0,176,0.08)] rounded-[14px] overflow-hidden transition-all duration-200 ${openFaq === idx ? 'pb-[18px]' : ''}`}>
                <div className="flex items-center justify-between p-4 px-5 cursor-pointer text-sm font-semibold text-[#1E1035] gap-3" onClick={() => setOpenFaq(idx === openFaq ? -1 : idx)}>
                  {faq.q}
                  <span className={`text-[#C0B8D8] text-xs transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-[#4c00b0]' : ''}`}>∨</span>
                </div>
                {openFaq === idx && (
                  <div className="px-5 pt-3.5 mt-[-4px] border-t border-dashed border-[#E0D8F5] text-[13.5px] text-[#8A7AAA] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* QUICK TICKET MODAL */}
      <div className={`fixed inset-0 bg-[#1e1035]/40 backdrop-blur-md flex justify-center items-center z-[200] transition-opacity duration-250 ${ticketModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) setTicketModalOpen(false) }}>
        <div className={`bg-white border-[1.5px] border-[#C9B3F5] rounded-[22px] p-8 w-full max-w-[480px] shadow-[0_28px_70px_rgba(44,53,68,0.22)] relative overflow-hidden transition-transform duration-300 ${ticketModalOpen ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#4c00b0]" />
          <div className="flex items-center justify-between mb-5">
            <div className="font-['Playfair_Display'] text-[21px] font-semibold text-[#1E1035]">🎫 Raise a Ticket</div>
            <button onClick={() => setTicketModalOpen(false)} className="w-8 h-8 rounded-lg bg-[#FAF7FF] border-[1.5px] border-[#E0D8F5] text-[#8A7AAA] hover:bg-[#EDE9FE] hover:border-[#C4B5FD] hover:text-[#4c00b0] flex justify-center items-center transition-all">✕</button>
          </div>
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">Subject</label>
              <input type="text" placeholder="Brief description of your issue" className="px-3.5 py-2.5 bg-[#FAF7FF] border-[1.5px] border-[#E0D8F5] focus:border-[#C4B5FD] rounded-lg text-sm outline-none transition-all " />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">Category</label>
              <select className="px-3.5 py-2.5 bg-[#FAF7FF] border-[1.5px] border-[#E0D8F5] focus:border-[#C4B5FD] rounded-lg text-sm outline-none transition-all appearance-none cursor-pointer text-[#1E1035]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%238A7AAA' d='M5 7L0 2h10z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: "30px" }}>
                <option>Order & Delivery Issue</option>
                <option>Payment / Billing</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">Description</label>
              <textarea placeholder="Describe your issue in detail…" className="px-3.5 py-2.5 bg-[#FAF7FF] border-[1.5px] border-[#E0D8F5] focus:border-[#C4B5FD] rounded-lg text-sm outline-none transition-all resize-none h-[88px]" />
            </div>
          </div>
          <div className="flex gap-2.5 mt-6">
            <button onClick={() => setTicketModalOpen(false)} className="flex-1 py-[11px] bg-transparent text-[#8A7AAA] border-[1.5px] border-[#E0D8F5] hover:border-[#C9B3F5] hover:text-[#1E1035] rounded-xl font-semibold text-sm transition-all">Cancel</button>
            <button onClick={handleSubmitTicket} className="flex-[2] py-[11px] bg-[#4c00b0] hover:bg-[#3a0085] hover:-translate-y-px text-white rounded-xl shadow-[0_4px_16px_rgba(76,0,176,0.28)] font-bold text-sm transition-all">Submit Ticket →</button>
          </div>
        </div>
      </div>

      {/* QUICK FEEDBACK MODAL */}
      <div className={`fixed inset-0 bg-[#1e1035]/40 backdrop-blur-md flex justify-center items-center z-[200] transition-opacity duration-250 ${feedbackModalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={(e) => { if (e.target === e.currentTarget) setFeedbackModalOpen(false) }}>
        <div className={`bg-white border-[1.5px] border-[#C9B3F5] rounded-[22px] p-8 w-full max-w-[480px] shadow-[0_28px_70px_rgba(44,53,68,0.22)] relative overflow-hidden transition-transform duration-300 ${feedbackModalOpen ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}`}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#F59E0B]" />
          <div className="flex items-center justify-between mb-5">
            <div className="font-['Playfair_Display'] text-[21px] font-semibold text-[#1E1035]">💬 Quick Feedback</div>
            <button onClick={() => setFeedbackModalOpen(false)} className="w-8 h-8 rounded-lg bg-[#FAF7FF] border-[1.5px] border-[#E0D8F5] text-[#8A7AAA] hover:bg-[#EDE9FE] hover:border-[#C4B5FD] hover:text-[#4c00b0] flex justify-center items-center transition-all">✕</button>
          </div>
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-1.5">
              <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">Overall Rating</label>
              <div className="flex gap-2 my-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} onClick={() => setModalRating(star)} className={`text-[30px] cursor-pointer transition-transform hover:scale-120 hover:grayscale-0 ${star <= modalRating ? 'grayscale-0 opacity-100' : 'grayscale opacity-40'}`}>⭐</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#C0B8D8]">Comments</label>
              <textarea placeholder="Share your thoughts…" className="px-3.5 py-2.5 bg-[#FAF7FF] border-[1.5px] border-[#E0D8F5] focus:border-[#C4B5FD] rounded-lg text-sm outline-none transition-all resize-none h-[88px]" />
            </div>
          </div>
          <div className="flex gap-2.5 mt-6">
            <button onClick={() => setFeedbackModalOpen(false)} className="flex-1 py-[11px] bg-transparent text-[#8A7AAA] border-[1.5px] border-[#E0D8F5] hover:border-[#C9B3F5] hover:text-[#1E1035] rounded-xl font-semibold text-sm transition-all">Cancel</button>
            <button onClick={handleSubmitFeedback} className="flex-[2] py-[11px] bg-[#F59E0B] hover:bg-[#D97706] hover:-translate-y-px text-white rounded-xl shadow-[0_4px_16px_rgba(245,158,11,0.3)] font-bold text-sm transition-all">Send Feedback ✨</button>
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-7 right-7 bg-white border-[1.5px] border-[#5ACC6A]/30 border-l-[4px] border-l-[#5ACC6A] rounded-xl p-3.5 pr-4 flex items-center gap-3 shadow-[0_6px_28px_rgba(44,53,68,0.14)] z-[400] transition-all duration-300 ${toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 pointer-events-none'}`}>
        <span className="text-xl">✅</span>
        <span className="text-[13.5px] font-semibold text-[#1E1035]">{toast.message}</span>
      </div>

    </div>
  );
};

export default Feedback;
