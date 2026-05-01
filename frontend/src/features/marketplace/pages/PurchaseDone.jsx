import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';

export default function PurchaseDone() {
  const navigate = useNavigate();
  const location = useLocation();
  const { order, item } = location.state || {};
  const canvasRef = useRef(null);
  const receiptRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadFlash, setDownloadFlash] = useState(false);

  useEffect(() => {
    if (!order || !item) {
      console.warn("No order data found, redirecting...");
      navigate('/marketplace');
    }
    window.scrollTo(0, 0);
  }, [order, item, navigate]);

  // Confetti Animation Setup
  useEffect(() => {
    if (!order || !item) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
  }, [order, item]);

  const handleDownload = async () => {
    if (!receiptRef.current) return;
    setDownloading(true);
    setDownloadFlash(true);

    setTimeout(() => {
      setDownloadFlash(false);
    }, 150);

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(receiptRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#ffffff',
          logging: false,
          scrollX: 0,
          scrollY: 0
        });

        const orderId = order._id?.slice(-8).toUpperCase() || 'ORD-UMK';
        const link = document.createElement('a');
        link.download = `UniMarket-Receipt-UMK-${orderId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error("Download failed:", err);
      } finally {
        setTimeout(() => setDownloading(false), 1000);
      }
    }, 300);
  };

  if (!order || !item) return null;

  const subtotal = Number(item.price) || 0;
  const platformFee = Number((subtotal * 0.03).toFixed(2));
  const deliveryFee = Number(order.deliveryFee) || 0;
  const totalPrice = Number(order.totalPrice) || (subtotal + platformFee + deliveryFee);
  
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  }) : new Date().toLocaleDateString('en-US', {
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const widths = [1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 2, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 2];
  const heights = [32, 20, 28, 32, 18, 25, 32, 22, 30, 18, 32, 24, 28, 20, 32, 18, 28, 22, 32, 20, 25, 32, 18, 28, 32, 20, 24, 30, 18, 32];

  return (
    <div className="font-['Plus_Jakarta_Sans',sans-serif] bg-[#F5F3FF] text-[#1E1035] min-h-screen flex flex-col items-center justify-center p-6 relative">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      <div className={`fixed inset-0 bg-white/60 pointer-events-none z-[999] transition-opacity duration-150 ${downloadFlash ? 'opacity-100' : 'opacity-0'}`} />

      <div className="flex flex-col items-center gap-5 w-full max-w-[480px] relative z-10 animate-[fadeUp_0.5s_ease_both]">

        {/* Success Branding */}
        <div className="text-center mb-2">
           <div className="text-5xl mb-3">🎉</div>
           <div className="font-['Lora',serif] text-[26px] font-bold text-[#1E1035] mb-1">Order Confirmed!</div>
           <div className="text-[14px] text-[#7C6FA0]">Your purchase receipt is ready for download.</div>
        </div>

        {/* Classic White Receipt Card */}
        <div
          ref={receiptRef}
          className="bg-white rounded-[24px] border border-[#DDD6FE] shadow-[0_12px_48px_rgba(109,40,217,0.12)] w-full overflow-hidden"
        >
          {/* Top Brand Stripe */}
          <div className="bg-[#6D28D9] px-6 pt-[22px] pb-6 flex items-center justify-between">
            <div className="font-['Lora',serif] text-xl font-bold text-white">UniMarket</div>
            <div className="flex items-center gap-2 bg-white/20 px-3.5 py-1.5 rounded-full text-[11px] font-black text-white uppercase tracking-wider">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Verified
            </div>
          </div>

          {/* Zigzag Visual (Styled for canvas) */}
          <div className="h-1.5 bg-[#6D28D9] relative">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-white" style={{
              backgroundImage: 'radial-gradient(circle, #6D28D9 70%, transparent 72%)',
              backgroundSize: '10px 10px',
              backgroundPosition: '0 4px',
              backgroundRepeat: 'repeat-x'
            }}></div>
          </div>

          <div className="p-7 pt-9">
            {/* Header Details */}
            <div className="flex flex-col items-center text-center mb-7">
               <div className="text-[10px] font-black uppercase tracking-[2px] text-[#A297C2] mb-1">Official Receipt</div>
               <div className="text-[13px] font-black text-[#6D28D9]">#{order._id?.slice(-8).toUpperCase() || 'UNIV-ORD'}</div>
            </div>

            {/* Item Card Simple */}
            <div className="bg-[#F8F7FF] rounded-2xl p-4 border border-[#F0EDFF] flex items-center gap-4 mb-7">
              <div className="w-16 h-16 rounded-xl bg-white border border-[#E9E4FF] flex items-center justify-center overflow-hidden shrink-0">
                {item.item_image ? (
                  <img src={item.item_image} alt="item" crossOrigin="anonymous" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">📦</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-black text-[#1E1035] truncate">{item.item_name || item.title}</div>
                <div className="text-[11px] text-[#8B7CA8] font-bold uppercase">{item.category}</div>
              </div>
              <div className="font-['Lora',serif] text-[16px] font-black text-[#1E1035]">LKR {subtotal.toLocaleString()}</div>
            </div>

            {/* Details Rows */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#8B7CA8] font-bold">Transaction Date</span>
                <span className="text-[#1E1035] font-black">{orderDate}</span>
              </div>
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#8B7CA8] font-bold">Delivery Mode</span>
                <span className="text-[#6D28D9] font-black uppercase">{order.deliveryMethod || 'PICKUP'}</span>
              </div>
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#8B7CA8] font-bold">Location</span>
                <span className="text-[#1E1035] font-black text-right">{order.building} · {order.room}</span>
              </div>
              
              <div className="pt-4 border-t border-dashed border-[#E9E4FF]"></div>

              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#8B7CA8] font-bold">Subtotal</span>
                <span className="text-[#1E1035] font-black">LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#8B7CA8] font-bold">Platform Fee (3%)</span>
                <span className="text-[#1E1035] font-black">LKR {platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-[13.5px]">
                <span className="text-[#8B7CA8] font-bold">Delivery Fee</span>
                <span className="text-[#10B981] font-black">{deliveryFee > 0 ? `LKR ${deliveryFee}` : 'FREE'}</span>
              </div>
            </div>

            {/* Total Block */}
            <div className="mt-8 bg-[#1E0B3C] rounded-2xl p-5 flex justify-between items-center shadow-lg shadow-[#1e0b3c20]">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white/50 uppercase tracking-[1px]">Total Paid</span>
                <span className="font-['Lora',serif] text-2xl font-bold text-white leading-tight">LKR {totalPrice.toLocaleString()}</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                 <div className="w-5 h-5 border-2 border-white/20 rounded-sm"></div>
              </div>
            </div>
          </div>

          {/* Barcode Footer Section */}
          <div className="bg-[#F9F8FF] px-7 pb-8 pt-6 flex flex-col items-center">
            <div className="flex justify-center gap-[1.5px] items-end h-9 mb-3 opacity-60">
              {widths.map((w, i) => (
                <div key={i} className="bg-[#1E1035] rounded-full" style={{ width: `${w}px`, height: `${heights[i]}px` }} />
              ))}
            </div>
            <div className="text-[9px] tracking-[5px] text-[#A297C2] font-black uppercase ml-1">
              UMK-{order._id?.slice(-8).toUpperCase()}
            </div>
            <div className="mt-4 text-[11px] text-[#8B7CA8] italic text-center font-medium">
               "Thank you for being part of UniMarket!"
            </div>
          </div>
        </div>

        {/* Buttons (Fixed to Screen Style) */}
        <div className="flex w-full gap-4 mt-1">
           <button
             onClick={handleDownload}
             disabled={downloading}
             className="flex-[2] py-4.5 bg-[#6D28D9] text-white rounded-3xl font-black text-[14px] flex items-center justify-center gap-2.5 shadow-xl shadow-[#6d28d926] transition-all hover:bg-[#5B21B6] active:scale-95 uppercase tracking-widest"
           >
             {downloading ? '✅ Saved!' : '⬇ Download Receipt'}
           </button>
           <button onClick={() => navigate('/marketplace')} className="flex-[1] py-4.5 bg-white text-[#1E0E3D] border border-[#E9E4FF] rounded-3xl font-black text-[14px] transition-all hover:border-[#6D28D9] active:scale-95 shadow-sm uppercase tracking-widest">
              Market
           </button>
        </div>

      </div>
    </div>
  );
}
