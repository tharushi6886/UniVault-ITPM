import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getItems } from '../../../api/itemApi';

function useCarouselDrag(ref) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        const onDown = (e) => {
            isDown = true;
            el.classList.add('cursor-grabbing');
            startX = e.pageX - el.offsetLeft;
            scrollLeft = el.scrollLeft;
        };

        const onLeave = () => {
            isDown = false;
            el.classList.remove('cursor-grabbing');
        };

        const onUp = () => {
            isDown = false;
            el.classList.remove('cursor-grabbing');
        };

        const onMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.4;
        };

        el.addEventListener('mousedown', onDown);
        el.addEventListener('mouseleave', onLeave);
        el.addEventListener('mouseup', onUp);
        el.addEventListener('mousemove', onMove);

        return () => {
            el.removeEventListener('mousedown', onDown);
            el.removeEventListener('mouseleave', onLeave);
            el.removeEventListener('mouseup', onUp);
            el.removeEventListener('mousemove', onMove);
        };
    }, [ref]);
}

const getImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
};

const Stars = ({ count }) => (
    <span className="text-xs text-[#f59e0b]">{`${'★'.repeat(count)}${'☆'.repeat(5 - count)}`}</span>
);

const Marketplace = () => {
    const wrapRef = useRef(null);
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    useCarouselDrag(wrapRef);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await getItems();
                const activeItems = res.data
                    .filter((item) => item.listing_type === 'sell' && item.availability_status === 'available')
                    .slice(0, 10);

                setItems(activeItems.length ? activeItems : res.data.slice(0, 10));
            } catch (err) {
                console.error(err);
            }
        };

        fetchItems();
    }, []);

    return (
        <section className="relative overflow-hidden pt-[60px] pb-[78px] bg-[#0F0A2E] border-t border-white/10" id="marketplace">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_0%_0%,rgba(0,217,255,0.06),transparent),radial-gradient(ellipse_60%_55%_at_100%_0%,rgba(139,92,246,0.08),transparent),radial-gradient(ellipse_50%_60%_at_50%_100%,rgba(16,185,129,0.05),transparent)] pointer-events-none" />
            <div className="px-16 mb-7 relative z-[2]">
                <div className="flex justify-between items-end flex-wrap gap-5">
                    <div>
                        <span className="block font-epilogue text-xs font-bold tracking-[0.15em] uppercase text-[#00D9FF] mb-3 reveal">
                            Student Marketplace
                        </span>
                        <h2 className="font-clash text-[clamp(26px,3vw,40px)] tracking-[-0.03em] font-bold text-white mb-3 reveal">
                            Buy & Sell Textbooks and More
                        </h2>
                        <p className="font-epilogue text-[15px] text-white/60 leading-[1.7] reveal">
                            Verified students, zero scams. Safe campus trading.
                        </p>
                    </div>
                    <Link to="/marketplace" className="inline-block bg-[#1A103C]/80 backdrop-blur-md border border-white/10 text-white font-epilogue font-semibold text-[14px] py-2.5 px-6 rounded-xl cursor-pointer transition-all duration-200 hover:bg-[#1A103C] hover:border-[#00D9FF]/40 hover:-translate-y-[1px] reveal whitespace-nowrap no-underline shadow-[0_10px_24px_rgba(0,0,0,0.3)]">
                        Explore Full Marketplace -&gt;
                    </Link>
                </div>
            </div>

            <div className="relative z-[2] overflow-x-auto overflow-y-hidden cursor-grab scrollbar-hide" ref={wrapRef}>
                <div className="absolute top-0 bottom-0 left-0 w-[100px] z-[3] pointer-events-none bg-gradient-to-r from-[#0F0A2E] to-transparent" />
                <div className="absolute top-0 bottom-0 right-0 w-[100px] z-[3] pointer-events-none bg-gradient-to-l from-[#0F0A2E] to-transparent" />

                <div className="flex gap-6 w-max px-16 pb-8 pt-4">
                    {items.map((item, index) => {
                        const conditionStr = (item.item_condition || 'NEW').toUpperCase();
                        const isHot = conditionStr === 'NEW';
                        const badgeStyle = isHot ? 'bg-[#ef4444]/90 text-white' : 'bg-[#6366f1]/90 text-white';

                        return (
                            <div
                                onClick={() => navigate(`/marketplace/${item._id}`)}
                                className="shrink-0 w-[260px] bg-[#1A103C]/80 backdrop-blur-xl border border-white/10 rounded-[24px] overflow-hidden transition-all duration-300 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:-translate-y-2 hover:shadow-[0_18px_45px_rgba(139,92,246,0.14)] hover:border-[#8B5CF6]/40 group"
                                key={item._id || index}
                            >
                                <div className="h-[180px] flex items-center justify-center relative overflow-hidden bg-[linear-gradient(135deg,#0F0A2E_0%,#1A103C_100%)]">
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(0,217,255,0.08),transparent)] pointer-events-none z-[2]" />
                                    <span className={`absolute top-3 left-3 z-[10] text-[10px] font-bold py-1 px-2.5 rounded tracking-widest uppercase font-epilogue shadow-lg ${badgeStyle}`}>
                                        {conditionStr}
                                    </span>
                                    <span className="absolute top-3 right-3 z-[10] bg-[#1A103C]/90 backdrop-blur-md border border-white/10 text-[#00D9FF] text-[13px] font-bold py-1.5 px-3 rounded-lg shadow-lg">
                                        Rs. {item.price || 0}
                                    </span>

                                    {item.item_image ? (
                                        <img
                                            src={getImageUrl(item.item_image)}
                                            alt={item.item_name}
                                            className="w-full h-full object-cover mix-blend-multiply z-[1] opacity-70 transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <span className="text-[60px] drop-shadow-xl z-[1] opacity-20 transition-transform duration-300 group-hover:scale-[1.12]">
                                            🛒
                                        </span>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="font-clash text-[16px] font-bold text-white mb-1.5 line-clamp-1 group-hover:text-[#00D9FF] transition-colors">
                                        {item.item_name || "Unknown Item"}
                                    </div>
                                    <div className="font-epilogue text-[12px] text-white/50 mb-3.5 line-clamp-1">
                                        {(item.brand && item.brand !== 'null' ? item.brand : '') + (item.category ? ` · ${item.category}` : '') || 'General'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Stars count={5} />
                                        <span className="text-[#8B5CF6] text-[11px] ml-1">5.0 (0)</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-white/70 cursor-pointer text-base transition-all duration-200 hover:bg-[#ef4444]/15 hover:border-[#ef4444]/40 hover:text-[#ef4444]">
                                            ♡
                                        </button>
                                        <button className="font-epilogue text-[12px] font-bold py-2.5 px-5 rounded-xl cursor-pointer transition-all duration-200 bg-gradient-to-br from-[#8B5CF6] to-[#00D9FF] text-white shadow-[0_8px_20px_rgba(139,92,246,0.2)] hover:shadow-[0_12px_28px_rgba(139,92,246,0.3)] hover:-translate-y-[1px]">
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Marketplace;
