import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';

export default function PurchaseDone() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const receiptRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadFlash, setDownloadFlash] = useState(false);

  // Confetti Animation Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener('resize', setSize);

    const colors = ['#6D28D9', '#A78BFA', '#C4B5FD', '#7C3AED', '#EC4899', '#DDD6FE'];
    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 4,
      speed: Math.random() * 3 + 2,
      drift: (Math.random() - 0.5) * 1.5,
    }));

    let animationFrameId;
    let isAnimating = true;

    const animate = () => {
      if (!isAnimating) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      pieces.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot * Math.PI / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        
        p.y += p.speed;
        p.x += p.drift;
        p.rot += p.rotSpeed;
        
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const timeoutId = setTimeout(() => {
      isAnimating = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 4000);

    return () => {
      window.removeEventListener('resize', setSize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    setDownloadFlash(true);
    
    setTimeout(() => {
      setDownloadFlash(false);
    }, 150);

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        borderRadius: 20,
      });
      
      const link = document.createElement('a');
      link.download = 'UniMarket-Receipt-UMK2026-08341.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Failed to download receipt:", err);
    } finally {
      setTimeout(() => setDownloading(false), 2000);
    }
  };

  // Generate barcode bars
  const widths = [1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 2];
  const heights = [32, 20, 28, 32, 18, 25, 32, 22, 30, 18, 32, 24, 28, 20, 32, 18, 28, 22, 32, 20, 25, 32, 18, 28, 32, 20, 24, 30, 18, 32];

  return (
    <div className="font-['Plus_Jakarta_Sans',sans-serif] bg-[#F5F3FF] text-[#1E1035] min-h-screen flex flex-col items-center justify-center p-6 relative">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      
      <div className={`fixed inset-0 bg-white/60 pointer-events-none z-[999] transition-opacity duration-150 ${downloadFlash ? 'opacity-100' : 'opacity-0'}`} />

      <div className="flex flex-col items-center gap-5 w-full max-w-[480px] relative z-10">
        
        {/* Success Message */}
        <div className="text-center animate-[fadeUp_0.5s_ease_both]">
          <div className="text-5xl mb-2.5">🎉</div>
          <div className="font-['Lora',serif] text-[28px] font-semibold text-[#1E1035] mb-1.5 tracking-[-0.5px]">Purchase Successful!</div>
          <div className="text-[14px] text-[#7C6FA0] leading-relaxed">
            Your order has been confirmed.<br />Download your receipt card below.
          </div>
        </div>

        {/* Receipt Card */}
        <div 
          ref={receiptRef}
          className="bg-white rounded-[20px] border-[1.5px] border-[#DDD6FE] shadow-[0_12px_48px_rgba(0,0,0,0.10)] w-full overflow-hidden animate-[fadeUp_0.5s_ease_0.15s_both]"
        >
          {/* Top Band */}
          <div className="bg-[#6D28D9] px-6 pt-[22px] pb-5 flex items-center justify-between">
            <div className="font-['Lora',serif] text-xl font-semibold text-white">UniMarket</div>
            <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full text-[11.5px] font-bold text-white tracking-[0.3px]">
              <div className="w-[7px] h-[7px] rounded-full bg-[#C4B5FD]" />
              CONFIRMED
            </div>
          </div>

          {/* Top Zigzag */}
          <div 
            className="h-4 bg-[#6D28D9] relative overflow-hidden"
            style={{
              clipPath: 'polygon(0% 100%, 2.5% 0%, 5% 100%, 7.5% 0%, 10% 100%, 12.5% 0%, 15% 100%, 17.5% 0%, 20% 100%, 22.5% 0%, 25% 100%, 27.5% 0%, 30% 100%, 32.5% 0%, 35% 100%, 37.5% 0%, 40% 100%, 42.5% 0%, 45% 100%, 47.5% 0%, 50% 100%, 52.5% 0%, 55% 100%, 57.5% 0%, 60% 100%, 62.5% 0%, 65% 100%, 67.5% 0%, 70% 100%, 72.5% 0%, 75% 100%, 77.5% 0%, 80% 100%, 82.5% 0%, 85% 100%, 87.5% 0%, 90% 100%, 92.5% 0%, 95% 100%, 97.5% 0%, 100% 100%)'
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-white" />
          </div>

          {/* Body */}
          <div className="p-6 pt-5">
            <div className="text-center text-[11px] font-bold uppercase tracking-[1px] text-[#7C6FA0] mb-4">
              Order ID: <span className="text-[#6D28D9] text-[12px] ml-1">#UMK-2026-08341</span>
            </div>

            {/* Item */}
            <div className="flex items-center gap-3.5 bg-[#F5F3FF] rounded-xl p-3.5 mb-5">
              <div className="w-12 h-12 rounded-[10px] bg-[#EDE9FE] flex items-center justify-center text-[22px] shrink-0">🎧</div>
              <div>
                <div className="text-[13.5px] font-bold mb-0.5">Advanced Calculator 12th Edition</div>
                <div className="text-[12px] text-[#7C6FA0]">Seller: Golden Sato</div>
              </div>
              <div className="ml-auto shrink-0 font-['Lora',serif] text-base font-semibold">$43.01</div>
            </div>

            {/* Info Rows */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center py-[9px] border-b border-dashed border-[#DDD6FE] text-[13px]">
                <span className="text-[#7C6FA0] font-medium">Buyer</span>
                <span className="font-semibold text-[#1E1035]">Alex Rivera</span>
              </div>
              <div className="flex justify-between items-center py-[9px] border-b border-dashed border-[#DDD6FE] text-[13px]">
                <span className="text-[#7C6FA0] font-medium">Date</span>
                <span className="font-semibold text-[#1E1035]">March 20, 2026</span>
              </div>
              <div className="flex justify-between items-center py-[9px] border-b border-dashed border-[#DDD6FE] text-[13px]">
                <span className="text-[#7C6FA0] font-medium">Delivery Method</span>
                <span className="font-semibold text-[#1E1035]">Direct Pickup</span>
              </div>
              <div className="flex justify-between items-center py-[9px] border-b border-dashed border-[#DDD6FE] text-[13px]">
                <span className="text-[#7C6FA0] font-medium">Location</span>
                <span className="font-semibold text-[#1E1035]">Main Building · A3011</span>
              </div>
              <div className="flex justify-between items-center py-[9px] border-b border-dashed border-[#DDD6FE] text-[13px]">
                <span className="text-[#7C6FA0] font-medium">Subtotal</span>
                <span className="font-semibold text-[#1E1035]">$43.80</span>
              </div>
              <div className="flex justify-between items-center py-[9px] border-b border-dashed border-[#DDD6FE] text-[13px]">
                <span className="text-[#7C6FA0] font-medium">Marketplace Fee (3%)</span>
                <span className="font-semibold text-[#1E1035]">$1.55</span>
              </div>
              <div className="flex justify-between items-center py-[9px] text-[13px]">
                <span className="text-[#7C6FA0] font-medium">Delivery Fee</span>
                <span className="font-bold text-[#7C3AED]">FREE</span>
              </div>
            </div>

            {/* Total */}
            <div className="mt-4 bg-[#6D28D9] rounded-xl px-4 py-3.5 flex justify-between items-center">
              <span className="text-[13px] font-bold text-white/80">Total Paid</span>
              <span className="font-['Lora',serif] text-2xl font-semibold text-white tracking-[-0.5px]">$46.35</span>
            </div>
          </div>

          {/* Bottom Zigzag */}
          <div 
            className="h-4 bg-white relative overflow-hidden"
          >
             <div className="absolute top-0 left-0 right-0 h-4 bg-[#F5F3FF]" style={{ clipPath: 'polygon(0% 0%, 2.5% 100%, 5% 0%, 7.5% 100%, 10% 0%, 12.5% 100%, 15% 0%, 17.5% 100%, 20% 0%, 22.5% 100%, 25% 0%, 27.5% 100%, 30% 0%, 32.5% 100%, 35% 0%, 37.5% 100%, 40% 0%, 42.5% 100%, 45% 0%, 47.5% 100%, 50% 0%, 52.5% 100%, 55% 0%, 57.5% 100%, 60% 0%, 62.5% 100%, 65% 0%, 67.5% 100%, 70% 0%, 72.5% 100%, 75% 0%, 77.5% 100%, 80% 0%, 82.5% 100%, 85% 0%, 87.5% 100%, 90% 0%, 92.5% 100%, 95% 0%, 97.5% 100%, 100% 0%)' }} />
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 pt-4 text-center bg-[#F5F3FF]">
            <div className="text-[11.5px] text-[#7C6FA0] leading-relaxed mb-2.5">
              Thank you for shopping on UniMarket!<br />Keep this receipt as proof of purchase.
            </div>
            <div className="flex justify-center gap-0.5 items-end h-8 mb-1.5">
              {widths.map((w, i) => (
                <div key={i} className="bg-[#1E1035] rounded-[1px]" style={{ width: `${w}px`, height: `${heights[i]}px` }} />
              ))}
            </div>
            <div className="text-[10px] tracking-[3px] text-[#7C6FA0] font-semibold">UMK 2026 08341</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full gap-2.5 animate-[fadeUp_0.5s_ease_0.3s_both]">
          <button 
            onClick={downloadReceipt}
            disabled={downloading}
            className="flex-[2] py-3.5 bg-[#6D28D9] text-white rounded-xl font-[inherit] text-sm font-bold flex items-center justify-center gap-2 transition-all hover:bg-[#5B21B6] hover:-translate-y-px disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {downloading ? '✅ Downloaded!' : '⬇ Download Receipt Card'}
          </button>
          <button onClick={() => navigate('/')} className="flex-[1] py-3.5 bg-white text-[#1E1035] border-[1.5px] border-[#DDD6FE] rounded-xl font-[inherit] text-sm font-semibold transition-all hover:border-[#6D28D9] hover:-translate-y-px">
            🏠 Home
          </button>
        </div>

      </div>
    </div>
  );
}
