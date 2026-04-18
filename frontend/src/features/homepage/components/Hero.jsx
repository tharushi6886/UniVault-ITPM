import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicSystemStats } from '../../../api/userApi';

const NODE_DATA = [
    { id: 'node1', wave: 0, t: 0.18, iconClass: 'bg-gradient-to-br from-[#00D9FF] to-[#34D399] shadow-[0_4px_12px_rgba(0,217,255,0.24)] text-black', icon: 'L', label: 'LOST ITEM SEARCH', sub: 'Scanning records...', badgeClass: 'bg-[#00D9FF]/20 text-[#00D9FF] border border-[#00D9FF]/40', badge: 'LIVE', path: '/lost-items' },
    { id: 'node2', wave: 1, t: 0.42, iconClass: 'bg-gradient-to-br from-[#8B5CF6] to-[#00D9FF] shadow-[0_4px_12px_rgba(139,92,246,0.22)]', icon: 'F', label: 'FOUND ITEMS', sub: 'Campus claims', badgeClass: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border border-[#8B5CF6]/40', badge: 'MATCHED', path: '/found-items' },
    { id: 'node3', wave: 0, t: 0.60, iconClass: 'bg-gradient-to-br from-[#10B981] to-[#34D399] shadow-[0_4px_12px_rgba(16,185,129,0.20)]', icon: 'B', label: 'BIDDING ACTIVE', sub: 'Ongoing auctions', badgeClass: 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40', badge: 'HOT', path: '/bidding' },
    { id: 'node4', wave: 1, t: 0.74, iconClass: 'bg-gradient-to-br from-[#EC4899] to-[#F472B6] shadow-[0_4px_12px_rgba(236,72,153,0.20)]', icon: 'M', label: 'MARKETPLACE', sub: 'Buy & Sell', badgeClass: 'bg-[#EC4899]/20 text-[#EC4899] border border-[#EC4899]/40', badge: 'NEW', path: '/marketplace' },
    { id: 'node5', wave: 0, t: 0.88, iconClass: 'bg-gradient-to-br from-[#00D9FF] to-[#8B5CF6] shadow-[0_4px_12px_rgba(0,217,255,0.20)]', icon: 'R', label: 'REPORT LOST', sub: 'File a claim', badgeClass: 'bg-[#8B5CF6]/20 text-[#00D9FF] border border-[#00D9FF]/40', badge: 'ALERT', path: '/report-item' },
];

const Hero = () => {
    const canvasRef = useRef(null);
    const stageRef = useRef(null);
    const phaseRef = useRef(0);
    const rafRef = useRef(null);
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        studentsCount: 0,
        itemsRecovered: 0,
        marketplaceListingsCount: 0,
        activeReports: 0,
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('lost-and-found');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await getPublicSystemStats();
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch public stats');
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const stage = stageRef.current;
        if (!canvas || !stage) return;

        const ctx = canvas.getContext('2d');
        let W;
        let H;

        const resize = () => {
            W = stage.offsetWidth;
            H = stage.offsetHeight;
            canvas.width = W;
            canvas.height = H;
        };

        const waveY = (x, amp, freq, pOff) => H * 0.5 + amp * Math.sin((x / W) * freq * Math.PI * 2 + pOff);
        const getPt = (t, amp, freq, pOff) => ({ x: t * W, y: waveY(t * W, amp, freq, pOff) });

        const drawWave = (amp, freq, pOff, color, alpha, lw) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = lw;
            ctx.lineCap = 'round';
            for (let px = 0; px <= W; px += 2) {
                const y = waveY(px, amp, freq, pOff);
                px === 0 ? ctx.moveTo(px, y) : ctx.lineTo(px, y);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
        };

        const positionNodes = (phase) => {
            NODE_DATA.forEach((node) => {
                const el = document.getElementById(node.id);
                if (!el) return;
                const amp = node.wave === 0 ? H * 0.3 : H * 0.28;
                const freq = node.wave === 0 ? 1.0 : 1.2;
                const pOff = node.wave === 0 ? phase : phase * 1.1 + Math.PI * 0.6;
                const { x, y } = getPt(node.t, amp, freq, pOff);
                el.style.left = `${Math.max(8, Math.min(W - el.offsetWidth - 8, x - el.offsetWidth / 2))}px`;
                el.style.top = `${Math.max(8, Math.min(H - el.offsetHeight - 8, y - el.offsetHeight - 16))}px`;
            });
        };

        const drawDots = (phase) => {
            NODE_DATA.forEach((node) => {
                const amp = node.wave === 0 ? H * 0.3 : H * 0.28;
                const freq = node.wave === 0 ? 1.0 : 1.2;
                const pOff = node.wave === 0 ? phase : phase * 1.1 + Math.PI * 0.6;
                const { x, y } = getPt(node.t, amp, freq, pOff);
                const grd = ctx.createRadialGradient(x, y, 0, x, y, 14);
                grd.addColorStop(0, node.wave === 0 ? 'rgba(125, 211, 252, 0.35)' : 'rgba(96, 165, 250, 0.30)');
                grd.addColorStop(1, 'transparent');
                ctx.beginPath();
                ctx.fillStyle = grd;
                ctx.arc(x, y, 14, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fillStyle = node.wave === 0 ? '#00D9FF' : '#8B5CF6';
                ctx.fill();
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.stroke();
            });
        };

        const draw = () => {
            const p = phaseRef.current;
            ctx.clearRect(0, 0, W, H);
            drawWave(H * 0.3, 1.0, p, '#dbeafe', 0.32, 2.5);
            drawWave(H * 0.3, 1.0, p, '#7dd3fc', 0.88, 2.5);
            drawWave(H * 0.28, 1.2, p * 1.1 + Math.PI * 0.6, '#bfdbfe', 0.26, 2.5);
            drawWave(H * 0.28, 1.2, p * 1.1 + Math.PI * 0.6, '#60a5fa', 0.82, 2.5);
            drawDots(p);
            positionNodes(p);
            phaseRef.current += 0.006;
            rafRef.current = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
        };
    }, []);

    const handleSearch = () => {
        if (searchType === 'marketplace') {
            navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
        } else {
            navigate(`/lost-items?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <section className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center pt-[130px] pb-[160px] md:pb-[220px] px-16 bg-[#0F0A2E]" id="home">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_72%_60%_at_15%_10%,rgba(0,217,255,0.18),transparent),radial-gradient(ellipse_52%_58%_at_85%_18%,rgba(139,92,246,0.15),transparent),linear-gradient(135deg,#040112_0%,#0F0A2E_45%,#0F0A2E_100%)] opacity-95" />
            
            <div className="absolute rounded-full pointer-events-none blur-[120px] w-[500px] h-[500px] -top-[100px] -left-[100px] bg-[#00D9FF]/20 animate-blob-drift" />
            <div className="absolute rounded-full pointer-events-none blur-[120px] w-[500px] h-[500px] -bottom-[100px] -right-[100px] bg-[#8B5CF6]/20 animate-blob-drift-rev" />
            <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-b from-transparent via-[#0F0A2E]/80 to-[#F0F9FF] z-0 pointer-events-none" />

            <div className="relative z-10 text-center max-w-[760px] mx-auto mt-[-50px]">
                <div className="inline-flex items-center gap-2 bg-white/18 backdrop-blur-xl border border-white/28 rounded-full py-1.5 px-4 text-xs text-white font-bold tracking-[0.05em] mb-6 shadow-[0_6px_24px_rgba(44,86,122,0.12)] font-epilogue transition-all duration-500">
                    <span className="w-[7px] h-[7px] bg-[#6ee7f9] rounded-full shadow-[0_0_10px_rgba(110,231,249,0.8)] inline-block animate-pulse-fast" />
                    TRUSTED BY {stats.studentsCount > 0 ? `${stats.studentsCount}+ STUDENTS` : '50+ UNIVERSITIES'}
                </div>

                <h1 className="text-[clamp(40px,5.5vw,72px)] leading-[1.05] tracking-[-0.04em] font-bold text-white mb-[18px] font-clash drop-shadow-[0_8px_24px_rgba(0,0,0,0.3)]">
                    Find What <em className="not-italic bg-gradient-to-r from-[#00D9FF] to-[#34D399] text-transparent bg-clip-text">Matters</em> Most
                </h1>

                <p className="font-epilogue text-[17px] text-cyan-50/90 leading-[1.75] max-w-[540px] mx-auto mb-[34px] drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                    The ultimate campus platform for item recovery and student marketplace. <span className="text-cyan-400 font-semibold">Secure, verified, and community-driven.</span>
                </p>

                <div className="max-w-[640px] mx-auto mb-[34px] relative group">
                    {/* Mode Toggle */}
                    <div className="flex justify-center mb-5">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-1 rounded-xl flex gap-1 shadow-lg">
                            {['lost-and-found', 'marketplace'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setSearchType(type)}
                                    className="relative px-5 py-2 rounded-lg font-epilogue text-xs font-bold transition-all duration-300 whitespace-nowrap z-10"
                                >
                                    {searchType === type && (
                                        <motion.div 
                                            layoutId="active-pill"
                                            className="absolute inset-0 bg-[#00D9FF] rounded-lg shadow-[0_4px_12px_rgba(0,217,255,0.4)]"
                                            transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                                        />
                                    )}
                                    <span className={`relative z-20 ${searchType === type ? 'text-[#0F0A2E]' : 'text-white/60 hover:text-white'}`}>
                                        {type === 'lost-and-found' ? '🔍 LOST & FOUND' : '🛍️ MARKETPLACE'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Search Bar */}
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row items-center gap-2 bg-white/90 backdrop-blur-3xl border-[1.5px] border-white/40 rounded-2xl p-2.5 shadow-[0_22px_50px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.1)] focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,217,255,0.2),0_22px_50px_rgba(0,0,0,0.4)] transition-all duration-500"
                    >
                        <div className="flex-1 flex items-center w-full px-3">
                            <span className="text-cyan-500 mr-3 animate-pulse">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder={searchType === 'marketplace' ? 'Search textbooks, electronics, dorm gear...' : 'Search for keys, student IDs, phones...'}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSearch();
                                }}
                                className="bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 font-epilogue text-[15px] font-medium w-full py-2.5"
                            />
                        </div>

                        <button
                            onClick={handleSearch}
                            className="bg-gradient-to-r from-[#00D9FF] to-[#34D399] text-[#0F0A2E] font-epilogue font-bold text-sm px-8 py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_25px_rgba(0,217,255,0.4)] w-full sm:w-auto flex items-center justify-center gap-2 shrink-0 group/btn"
                        >
                            <span>Search</span>
                            <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                        </button>
                    </motion.div>

                    {/* Quick Categories */}
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={searchType}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="flex gap-2.5 justify-center mt-6 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"
                        >
                            {(searchType === 'lost-and-found' 
                                ? ['📱 Phone', '🪪 ID Card', '🔑 Keys', '📚 Books', '🎒 Bag'] 
                                : ['📖 Textbooks', '💻 Laptops', '🎧 Gadgets', '👗 Fashion', '🛋️ Dorm']
                            ).map((cat) => (
                                <motion.button
                                    key={cat}
                                    whileHover={{ y: -3, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        const val = cat.split(' ')[1];
                                        setSearchQuery(val);
                                    }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:bg-[#00D9FF]/20 hover:border-[#00D9FF]/40 px-4 py-1.5 rounded-full text-[12px] font-medium font-epilogue transition-colors"
                                >
                                    {cat}
                                </motion.button>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex gap-3 justify-center flex-wrap">
                    <Link to="/report-item" className="flex items-center gap-2 bg-[#8B5CF6] text-white font-epilogue text-[14px] font-bold py-[12px] px-6 rounded-xl shadow-[0_10px_24px_rgba(139,92,246,0.3)] transition-all duration-300 hover:bg-[#7e56db] hover:-translate-y-1 no-underline">
                        Report Lost Item
                    </Link>
                    <Link to="/marketplace" className="flex items-center gap-2 bg-transparent backdrop-blur-xl border border-[#00D9FF]/40 text-[#00D9FF] font-epilogue text-[14px] font-bold py-[12px] px-6 rounded-xl shadow-[0_10px_24px_rgba(0,217,255,0.1)] transition-all duration-300 hover:border-[#00D9FF] hover:bg-white/5 hover:-translate-y-1 no-underline">
                        Explore Marketplace
                    </Link>
                </div>
            </div>

            <div className="relative w-full h-[300px] mt-[60px] shrink-0" ref={stageRef}>
                <canvas className="absolute inset-0 w-full h-full" ref={canvasRef} />
                {NODE_DATA.map((node) => (
                    <Link
                        to={node.path}
                        className="absolute flex items-center gap-3 bg-white/55 backdrop-blur-2xl border border-white/70 rounded-2xl py-[11px] px-[18px] shadow-[0_18px_34px_rgba(56,87,116,0.14)] whitespace-nowrap cursor-pointer z-20 transition-all duration-300 hover:scale-105 hover:bg-white/72 hover:border-cyan-200 no-underline"
                        id={node.id}
                        key={node.id}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <div className={`w-[38px] h-[38px] rounded-lg flex items-center justify-center text-[17px] font-bold shrink-0 ${node.iconClass}`}>
                            {node.icon}
                        </div>
                        <div>
                            <div className="text-[13px] font-semibold text-white tracking-[0.02em] font-clash">{node.label}</div>
                            <div className="text-[11px] text-white/50 mt-[1px]">{node.sub}</div>
                        </div>
                        <span className={`ml-1.5 text-[10px] font-bold py-[2px] px-2 rounded-[5px] tracking-[0.05em] font-epilogue ${node.badgeClass} opacity-90`}>
                            {node.badge}
                        </span>
                    </Link>
                ))}
            </div>

            <div className="flex relative z-30 bg-[#1A103C]/80 backdrop-blur-xl border border-white/10 rounded-[20px] py-[26px] px-10 shadow-[0_26px_60px_rgba(0,0,0,0.5)] mt-10 mx-auto w-fit hidden md:flex hover:border-[#00D9FF]/30 transition-colors">
                <div className="px-9 text-center border-r border-white/10">
                    <div className="text-[28px] font-bold text-white leading-none font-clash">{stats.itemsRecovered}<span className="text-[#00D9FF]">+</span></div>
                    <div className="text-xs text-white/50 mt-1 font-epilogue">Items Recovered</div>
                </div>
                <div className="px-9 text-center border-r border-white/10">
                    <div className="text-[28px] font-bold text-white leading-none font-clash">{stats.studentsCount}<span className="text-[#8B5CF6]">+</span></div>
                    <div className="text-xs text-white/50 mt-1 font-epilogue">Students</div>
                </div>
                <div className="px-9 text-center border-r border-white/10">
                    <div className="text-[28px] font-bold text-white leading-none font-clash">{stats.marketplaceListingsCount}<span className="text-[#34D399]">+</span></div>
                    <div className="text-xs text-white/50 mt-1 font-epilogue">Active Listings</div>
                </div>
                <div className="px-9 text-center">
                    <div className="text-[28px] font-bold text-white leading-none font-clash">{stats.activeReports}<span className="text-[#EC4899]">+</span></div>
                    <div className="text-xs text-white/50 mt-1 font-epilogue">Reports</div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
