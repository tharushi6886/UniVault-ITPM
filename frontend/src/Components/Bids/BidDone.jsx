import React, { useState, useEffect } from 'react';

const BidDone = () => {
  const [toastVisible, setToastVisible] = useState(true);

  useEffect(() => {
    // Add fonts if not already loaded globally
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,400&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); }
  }, []);

  useEffect(() => {
    // Dismiss toast after 5s
    const timer = setTimeout(() => {
      setToastVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Confetti effect
    const colors = ['#4c00b0', '#7c3aed', '#C4B5FD', '#a855f7', '#6EE7B7', '#FCD34D', '#F0ABFC'];
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.inset = '0';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '400';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 55; i++) {
      const el = document.createElement('div');
      el.style.position = 'absolute';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = '-10px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.width = (Math.random() * 7 + 5) + 'px';
      el.style.height = (Math.random() * 7 + 5) + 'px';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.animation = `confettiFall ${Math.random() * 2 + 2}s linear ${Math.random() * 1}s forwards`;
      confettiContainer.appendChild(el);
    }

    const cleanup = setTimeout(() => {
      if (document.body.contains(confettiContainer)) {
        document.body.removeChild(confettiContainer);
      }
    }, 5000);

    return () => {
      clearTimeout(cleanup);
      if (document.body.contains(confettiContainer)) {
        document.body.removeChild(confettiContainer);
      }
    };
  }, []);

  return (
    <div className="min-h-screen relative font-['Outfit',_sans-serif] bg-[#F5F0FF] text-[#1E1040] overflow-x-hidden flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(76,0,176,0.1) 1px, transparent 1px)",
        backgroundSize: "28px 28px"
      }}>

      <style>
        {`
          @keyframes slideIn {
            from { transform: translateX(120%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes progress {
            from { width: 100%; }
            to { width: 0%; }
          }
          @keyframes fadeUp {
            from { transform: translateY(28px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes ringPulse {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.45); opacity: 0; }
          }
          @keyframes checkPop {
            from { transform: scale(0) rotate(-20deg); opacity: 0; }
            to { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes livepulse {
            0%,100% { box-shadow: 0 0 0 2px #D1FAE5; }
            50% { box-shadow: 0 0 0 4px rgba(5,150,105,0.15); }
          }
          @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            80% { opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          
          .animate-fadeUp { animation: fadeUp 0.5s cubic-bezier(0.34,1.2,0.64,1) both; }
          .animate-fadeUp-delay-1 { animation: fadeUp 0.5s ease 0.15s both; }
          .animate-fadeUp-delay-2 { animation: fadeUp 0.5s ease 0.25s both; }
          .animate-fadeUp-delay-3 { animation: fadeUp 0.5s ease 0.35s both; }
          .animate-fadeUp-delay-4 { animation: fadeUp 0.5s ease 0.45s both; }
          .animate-fadeUp-delay-5 { animation: fadeUp 0.5s ease 0.55s both; }
        `}
      </style>

      {/* Ambient backgrounds */}
      <div className="fixed top-[-80px] right-[-60px] w-[500px] h-[400px] rounded-full blur-[70px] pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(76,0,176,0.15), transparent 70%)' }} />
      <div className="fixed bottom-0 left-[-80px] w-[400px] h-[350px] rounded-full blur-[70px] pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent 70%)' }} />

      {/* TOAST NOTIFICATION */}
      <div
        className="fixed top-[74px] right-[24px] bg-white border-[1.5px] border-[#059669]/25 border-l-[4px] border-l-[#059669] rounded-[14px] p-3.5 pr-4 flex items-center gap-3 shadow-[0_8px_30px_rgba(76,0,176,0.1),_0_2px_8px_rgba(0,0,0,0.06)] min-w-[300px] max-w-[360px] z-[300] overflow-hidden transition-all duration-400"
        style={{
          animation: toastVisible ? 'slideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both' : 'none',
          opacity: toastVisible ? 1 : 0,
          transform: toastVisible ? 'translateX(0)' : 'translateX(120%)',
          pointerEvents: toastVisible ? 'auto' : 'none'
        }}
      >
        <div className="w-[38px] h-[38px] rounded-[11px] bg-[#D1FAE5] flex items-center justify-center text-[18px] shrink-0">✅</div>
        <div className="flex-1">
          <div className="text-[13.5px] font-bold text-[#1E1040]">Bid Confirmed!</div>
          <div className="text-[12px] text-[#7C6FA0] mt-0.5 leading-[1.4]">Your bid of <strong>$175.00</strong> has been placed.</div>
        </div>
        <button onClick={() => setToastVisible(false)} className="bg-transparent border-none cursor-pointer text-[13px] text-[#B0A0CC] hover:text-[#1E1040] transition-colors p-0.5">✕</button>
        <div className="absolute bottom-0 left-0 h-[3px] bg-[#059669]" style={{ animation: toastVisible ? 'progress 5s linear forwards' : 'none' }} />
      </div>

      {/* SUCCESS CARD */}
      <div className="bg-white rounded-[28px] border-[1.5px] border-[#E5D9FF] px-11 py-[50px] w-full max-w-[530px] text-center shadow-[0_8px_40px_rgba(76,0,176,0.1),_0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden z-10 animate-fadeUp">

        <div className="absolute top-0 left-0 right-0 h-1 bg-[#4c00b0]" />
        <div className="absolute -bottom-[60px] -right-[60px] w-[200px] h-[200px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(76,0,176,0.07), transparent 70%)' }} />

        {/* CHECKMARK */}
        <div className="w-[88px] h-[88px] bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-7 relative">
          <div className="absolute inset-[-5px] rounded-full border-[3px] border-[#6EE7B7]" style={{ animation: 'ringPulse 2s ease-out infinite' }} />
          <div className="absolute inset-[-12px] rounded-full border-[2px] border-[#6EE7B7]/30" style={{ animation: 'ringPulse 2s ease-out 0.3s infinite' }} />
          <svg className="w-[38px] h-[38px]" style={{ animation: 'checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both' }} viewBox="0 0 38 38" fill="none">
            <polyline points="7,20 15,28 31,12" stroke="#059669" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="42" strokeDashoffset="0" />
          </svg>
        </div>

        <div className="font-['Playfair_Display'] text-[30px] font-semibold text-[#1E1040] mb-2.5 animate-fadeUp-delay-1">Bid Placed Successfully!</div>
        <div className="text-[14.5px] text-[#7C6FA0] leading-[1.7] mb-8 animate-fadeUp-delay-2">
          You're currently the highest bidder on<br />
          <strong className="text-[#1E1040] font-semibold">Premium Noise-Cancelling Headphones</strong>.<br />
          We'll notify you if someone outbids you.
        </div>

        {/* BID SUMMARY */}
        <div className="bg-[#FAF7FF] rounded-[18px] border-[1.5px] border-[#E5D9FF] px-[26px] py-[22px] mb-7 text-left relative overflow-hidden animate-fadeUp-delay-3">
          <div className="absolute -top-[30px] -left-[30px] w-[100px] h-[100px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(76,0,176,0.08), transparent 70%)' }} />

          <div className="font-['Space_Mono'] text-[10px] font-bold uppercase tracking-[1.2px] text-[#B0A0CC] mb-4 relative z-10">Bid Summary</div>

          <div className="flex justify-between items-center py-2.5 border-b border-[#E5D9FF] text-[13.5px] relative z-10">
            <span className="text-[#7C6FA0] font-medium flex items-center gap-[7px]">
              <span className="text-[14px] w-[26px] h-[26px] rounded-lg bg-[#4c00b0]/5 flex items-center justify-center">🎧</span> Item
            </span>
            <span className="font-semibold text-[#1E1040]">Noise-Cancelling Headphones</span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-[#E5D9FF] text-[13.5px] relative z-10">
            <span className="text-[#7C6FA0] font-medium flex items-center gap-[7px]">
              <span className="text-[14px] w-[26px] h-[26px] rounded-lg bg-[#4c00b0]/5 flex items-center justify-center">💜</span> Your Bid
            </span>
            <span className="font-['Playfair_Display'] text-[22px] font-semibold text-[#4c00b0] tracking-[-0.5px]">$175.00</span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-[#E5D9FF] text-[13.5px] relative z-10">
            <span className="text-[#7C6FA0] font-medium flex items-center gap-[7px]">
              <span className="text-[14px] w-[26px] h-[26px] rounded-lg bg-[#4c00b0]/5 flex items-center justify-center">👤</span> Bidder
            </span>
            <span className="font-semibold text-[#1E1040]">Alex Rivera</span>
          </div>

          <div className="flex justify-between items-center py-2.5 border-b border-[#E5D9FF] text-[13.5px] relative z-10">
            <span className="text-[#7C6FA0] font-medium flex items-center gap-[7px]">
              <span className="text-[14px] w-[26px] h-[26px] rounded-lg bg-[#4c00b0]/5 flex items-center justify-center">🕐</span> Bid Time
            </span>
            <span className="font-semibold text-[#1E1040]">Today, 3:42 PM</span>
          </div>

          <div className="flex justify-between items-center pt-2.5 text-[13.5px] relative z-10">
            <span className="text-[#7C6FA0] font-medium flex items-center gap-[7px]">
              <span className="text-[14px] w-[26px] h-[26px] rounded-lg bg-[#4c00b0]/5 flex items-center justify-center">✅</span> Status
            </span>
            <span className="inline-flex items-center gap-1.5 bg-[#D1FAE5] text-[#065F46] text-[12px] font-bold px-3 py-[5px] rounded-full tracking-[0.3px] border-[1.5px] border-[#059669]/20">
              <div className="w-1.5 h-1.5 rounded-full bg-[#059669]" style={{ animation: 'livepulse 1.5s infinite' }} />
              Highest Bidder
            </span>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-2.5 animate-fadeUp-delay-4">
          <button className="flex-[2] p-3.5 bg-[#4c00b0] hover:bg-[#3a0085] text-white border-none rounded-[13px] font-bold text-[14.5px] shadow-[0_4px_18px_rgba(76,0,176,0.3)] hover:shadow-[0_8px_24px_rgba(76,0,176,0.42)] hover:-translate-y-0.5 transition-all">
            View Auction →
          </button>
          <button className="flex-1 p-3.5 bg-transparent text-[#7C6FA0] border-[1.5px] border-[#E5D9FF] hover:border-[#C9B3F5] hover:text-[#4c00b0] hover:bg-[#4c00b0]/5 rounded-[13px] font-semibold text-[14px] transition-all">
            Browse More
          </button>
        </div>

        {/* REMINDER */}
        <div className="mt-4 bg-[#FFF7ED] border-[1.5px] border-[#FCD34D] rounded-[14px] p-3.5 flex items-start gap-2.5 text-left animate-fadeUp-delay-5">
          <span className="text-[16px] shrink-0 mt-0.5">⚠️</span>
          <div className="text-[12.5px] color-[#92400E] leading-[1.6] font-medium text-[#92400E]">
            <strong className="font-bold">Reminder:</strong> By placing a bid, you commit to purchasing this item if your bid is accepted. Please review the{' '}
            <a href="#" className="font-bold text-[#92400E] hover:underline">UniMarket Safety Guidelines</a> for more information.
          </div>
        </div>

      </div>

    </div>
  );
};

export default BidDone;
