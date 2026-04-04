import React, { useEffect, useRef } from 'react';

const NODE_DATA = [
    { id: 'node1', wave: 0, t: 0.18, iconClass: 'bg-gradient-to-br from-[#4f46e5] to-[#6366f1] shadow-[0_4px_12px_rgba(79,70,229,0.4)]', icon: '🔍', label: 'LOST ITEM SEARCH', sub: 'Scanning 12K+ records...', badgeClass: 'bg-[#e0e7ff] text-[#3730a3] border border-[#c7d2fe]', badge: 'LIVE' },
    { id: 'node2', wave: 1, t: 0.42, iconClass: 'bg-gradient-to-br from-[#10b981] to-[#34d399] shadow-[0_4px_12px_rgba(16,185,129,0.35)]', icon: '✅', label: 'VERIFIED CLAIM', sub: 'iPhone 14 · Cafeteria', badgeClass: 'bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]', badge: 'MATCHED' },
    { id: 'node3', wave: 0, t: 0.60, iconClass: 'bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] shadow-[0_4px_12px_rgba(245,158,11,0.35)]', icon: '🔨', label: 'BIDDING ACTIVE', sub: '3 bids · Physics Textbook', badgeClass: 'bg-[#fff7ed] text-[#c2410c] border border-[#fed7aa]', badge: 'HOT' },
    { id: 'node4', wave: 1, t: 0.74, iconClass: 'bg-gradient-to-br from-[#06b6d4] to-[#22d3ee] shadow-[0_4px_12px_rgba(6,182,212,0.35)]', icon: '🛒', label: 'MARKETPLACE', sub: 'MacBook Air M1 · $850', badgeClass: 'bg-[#cffafe] text-[#0e7490] border border-[#a5f3fc]', badge: 'NEW' },
    { id: 'node5', wave: 0, t: 0.88, iconClass: 'bg-gradient-to-br from-[#8b5cf6] to-[#a78bfa] shadow-[0_4px_12px_rgba(139,92,246,0.35)]', icon: '📍', label: 'LOCATION PING', sub: 'Science Library · 2h ago', badgeClass: 'bg-[#f3e8ff] text-[#7e22ce] border border-[#e9d5ff]', badge: 'ALERT' },
];

const STATS = [
    { num: '12', suffix: 'K+', label: 'Items Recovered' },
    { num: '50', suffix: '+', label: 'Universities' },
    { num: '98', suffix: '%', label: 'Satisfaction Rate' },
    { num: '1.5', suffix: 'K', label: 'Students Online' },
];

const Hero = () => {
    const canvasRef = useRef(null);
    const stageRef = useRef(null);
    const phaseRef = useRef(0);
    const rafRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const stage = stageRef.current;
        if (!canvas || !stage) return;
        const ctx = canvas.getContext('2d');
        let W, H;

        const resize = () => { W = stage.offsetWidth; H = stage.offsetHeight; canvas.width = W; canvas.height = H; };
        const waveY = (x, amp, freq, pOff) => H * 0.5 + amp * Math.sin((x / W) * freq * Math.PI * 2 + pOff);
        const getPt = (t, amp, freq, pOff) => ({ x: t * W, y: waveY(t * W, amp, freq, pOff) });
        const drawWave = (amp, freq, pOff, color, alpha, lw) => {
            ctx.beginPath(); ctx.strokeStyle = color; ctx.globalAlpha = alpha; ctx.lineWidth = lw; ctx.lineCap = 'round';
            for (let px = 0; px <= W; px += 2) { const y = waveY(px, amp, freq, pOff); px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y); }
            ctx.stroke(); ctx.globalAlpha = 1;
        };
        const positionNodes = phase => {
            NODE_DATA.forEach(nd => {
                const el = document.getElementById(nd.id);
                if (!el) return;
                const amp = nd.wave === 0 ? H * 0.30 : H * 0.28;
                const freq = nd.wave === 0 ? 1.0 : 1.2;
                const pOff = nd.wave === 0 ? phase : phase * 1.1 + Math.PI * 0.6;
                const { x, y } = getPt(nd.t, amp, freq, pOff);
                el.style.left = `${Math.max(8, Math.min(W - el.offsetWidth - 8, x - el.offsetWidth / 2))}px`;
                el.style.top = `${Math.max(8, Math.min(H - el.offsetHeight - 8, y - el.offsetHeight - 16))}px`;
            });
        };
        const drawDots = phase => {
            NODE_DATA.forEach(nd => {
                const amp = nd.wave === 0 ? H * 0.30 : H * 0.28;
                const freq = nd.wave === 0 ? 1.0 : 1.2;
                const pOff = nd.wave === 0 ? phase : phase * 1.1 + Math.PI * 0.6;
                const { x, y } = getPt(nd.t, amp, freq, pOff);
                const grd = ctx.createRadialGradient(x, y, 0, x, y, 14);
                grd.addColorStop(0, nd.wave === 0 ? 'rgba(99,102,241,0.3)' : 'rgba(167,139,250,0.3)');
                grd.addColorStop(1, 'transparent');
                ctx.beginPath(); ctx.fillStyle = grd; ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fillStyle = nd.wave === 0 ? '#6366f1' : '#a78bfa'; ctx.fill();
                ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
            });
        };
        const draw = () => {
            const p = phaseRef.current;
            ctx.clearRect(0, 0, W, H);
            drawWave(H * 0.30, 1.0, p, '#93c5fd', 0.25, 2.5); drawWave(H * 0.30, 1.0, p, '#6366f1', 0.85, 2.5);
            drawWave(H * 0.28, 1.2, p * 1.1 + Math.PI * 0.6, '#d8b4fe', 0.20, 2.5); drawWave(H * 0.28, 1.2, p * 1.1 + Math.PI * 0.6, '#a78bfa', 0.80, 2.5);
            drawDots(p); positionNodes(p);
            phaseRef.current += 0.006; rafRef.current = requestAnimationFrame(draw);
        };
        window.addEventListener('resize', resize); resize(); draw();
        return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', resize); };
    }, []);

    return (
        <section className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center pt-[130px] pb-20 px-16 bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(196,181,253,0.45),transparent),radial-gradient(ellipse_70%_55%_at_100%_0%,rgba(147,197,253,0.4),transparent),radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(165,180,252,0.35),transparent),radial-gradient(ellipse_50%_45%_at_20%_60%,rgba(221,214,254,0.3),transparent),radial-gradient(ellipse_45%_40%_at_80%_50%,rgba(191,219,254,0.3),transparent),linear-gradient(160deg,#f5f3ff_0%,#ede9fe_25%,#e8eeff_50%,#dbeafe_75%,#eff6ff_100%)]" id="home">
            <div className="absolute rounded-full pointer-events-none blur-[72px] w-[500px] h-[500px] -top-[150px] -left-[100px] bg-[radial-gradient(circle,rgba(196,181,253,0.6),transparent_65%)] animate-blob-drift" />
            <div className="absolute rounded-full pointer-events-none blur-[72px] w-[420px] h-[420px] -bottom-[100px] -right-[80px] bg-[radial-gradient(circle,rgba(147,197,253,0.55),transparent_65%)] animate-blob-drift-rev" />
            <div className="absolute rounded-full pointer-events-none blur-[72px] w-[320px] h-[320px] top-[45%] left-[48%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(221,214,254,0.5),transparent_65%)] animate-blob-drift-fast" />

            <div className="relative z-10 text-center max-w-[720px] mx-auto">
                <div className="inline-flex items-center gap-2 bg-white/85 backdrop-blur-md border border-[#a5b4fc]/40 rounded-full py-1.5 px-4 text-xs text-i1 font-bold tracking-[0.05em] mb-6 shadow-[0_2px_12px_rgba(79,70,229,0.1)] font-epilogue">
                    <span className="w-[7px] h-[7px] bg-[#22c55e] rounded-full shadow-[0_0_7px_#22c55e] inline-block animate-pulse-fast" />
                    TRUSTED BY 50+ UNIVERSITIES
                </div>
                <h1 className="text-[clamp(40px,5.5vw,72px)] leading-[1.05] tracking-[-0.04em] font-bold text-text mb-[18px] font-clash">
                    Find What <em className="not-italic bg-gradient-to-r from-[#4f46e5] via-[#a78bfa] to-[#06b6d4] text-transparent bg-clip-text">Matters</em> Most
                </h1>
                <p className="font-epilogue text-[17px] text-muted leading-[1.75] max-w-[500px] mx-auto mb-[34px]">
                    The ultimate campus platform for item recovery and student marketplace. Secure, verified, and community-driven.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                    <a href="#lost" className="flex items-center gap-2 bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white border-none font-epilogue text-[15px] font-semibold py-[13px] px-7 rounded-xl shadow-[0_6px_24px_rgba(79,70,229,0.4)] transition-all duration-250 hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(79,70,229,0.52)] no-underline">
                        🔍 Report Lost Item
                    </a>
                    <a href="#marketplace" className="flex items-center gap-2 bg-white/85 backdrop-blur-md border-[1.5px] border-[#a5b4fc]/40 text-text font-epilogue text-[15px] font-semibold py-[13px] px-7 rounded-xl shadow-[0_2px_10px_rgba(79,70,229,0.08)] transition-all duration-250 hover:border-i4 hover:text-i2 hover:-translate-y-0.5 no-underline">
                        🛍️ Explore Marketplace
                    </a>
                </div>
            </div>

            <div className="relative w-full h-[300px] mt-[60px] shrink-0" ref={stageRef}>
                <canvas className="absolute inset-0 w-full h-full" ref={canvasRef} />
                {NODE_DATA.map(nd => (
                    <div className="absolute flex items-center gap-3 bg-white/90 backdrop-blur-md border border-white/95 rounded-2xl py-[11px] px-[18px] shadow-[0_8px_32px_rgba(79,70,229,0.14)] whitespace-nowrap pointer-events-none animate-node-float" id={nd.id} key={nd.id}>
                        <div className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center text-[17px] shrink-0 ${nd.iconClass}`}>
                            {nd.icon}
                        </div>
                        <div>
                            <div className="text-[13px] font-semibold text-text tracking-[0.02em] font-clash">{nd.label}</div>
                            <div className="text-[11px] text-muted mt-[1px]">{nd.sub}</div>
                        </div>
                        <span className={`ml-1.5 text-[10px] font-bold py-[2px] px-2 rounded-[5px] tracking-[0.05em] font-epilogue ${nd.badgeClass}`}>
                            {nd.badge}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex relative z-10 bg-white/85 backdrop-blur-md border border-[#a5b4fc]/30 rounded-[20px] py-[26px] px-10 shadow-[0_4px_28px_rgba(79,70,229,0.1)] mt-10 mx-auto w-fit">
                {STATS.map((s, idx) => (
                    <div className={`px-9 text-center ${idx !== STATS.length - 1 ? 'border-r border-[#a5b4fc]/30' : ''}`} key={s.label}>
                        <div className="text-[28px] font-bold text-text leading-none font-clash">{s.num}<span className="text-i2">{s.suffix}</span></div>
                        <div className="text-xs text-muted mt-1 font-epilogue">{s.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Hero;
