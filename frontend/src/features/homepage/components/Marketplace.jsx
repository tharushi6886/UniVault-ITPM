import React, { useEffect, useRef } from 'react';

// Hooks
function useCarouselDrag(ref) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let isDown = false, startX, scrollLeft;
        const onDown = e => { isDown = true; el.classList.add('cursor-grabbing'); startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; };
        const onLeave = () => { isDown = false; el.classList.remove('cursor-grabbing'); };
        const onUp = () => { isDown = false; el.classList.remove('cursor-grabbing'); };
        const onMove = e => { if (!isDown) return; e.preventDefault(); el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.4; };
        el.addEventListener('mousedown', onDown); el.addEventListener('mouseleave', onLeave);
        el.addEventListener('mouseup', onUp); el.addEventListener('mousemove', onMove);
        return () => {
            el.removeEventListener('mousedown', onDown); el.removeEventListener('mouseleave', onLeave);
            el.removeEventListener('mouseup', onUp); el.removeEventListener('mousemove', onMove);
        };
    }, [ref]);
}

const MP_ITEMS = [
    { emoji: '💻', name: 'MacBook Pro 13"', meta: 'Apple M2 · 256GB · Space Grey', price: '$899', stars: 5, rating: '4.9 (172)', badge: 'bg-[#6366f1]/90 text-white', badgeText: 'NEW', imgClass: 'bg-gradient-to-br from-[#f3f0ff] via-[#e9e4ff] to-[#ddd6fe]' },
    { emoji: '🎧', name: 'Sony WH-1000XM4', meta: 'Noise Cancelling · Black', price: '$190', stars: 4, rating: '4.7 (8)', badge: 'bg-[#ef4444]/90 text-white', badgeText: 'HOT', imgClass: 'bg-gradient-to-br from-[#ede9fe] via-[#e4dfff] to-[#d8d0fe]' },
    { emoji: '📚', name: 'Organic Chemistry Bundle', meta: '5 Books · 3rd Edition', price: '$45', stars: 5, rating: '5.0 (24)', badge: 'bg-[#10b981]/90 text-white', badgeText: 'SALE', imgClass: 'bg-gradient-to-br from-[#f5f3ff] via-[#ede9fe] to-[#e0d9ff]' },
    { emoji: '👟', name: 'Limited Edition Sneakers', meta: 'Nike Air Max · Size 10', price: '$219', stars: 5, rating: '4.8 (5)', badge: 'bg-[#f59e0b]/90 text-white', badgeText: 'BID', imgClass: 'bg-gradient-to-br from-[#eee8ff] via-[#e4dcfe] to-[#d8ccfd]' },
    { emoji: '📷', name: 'Canon EOS M50', meta: 'Mirrorless · 24MP · Kit Lens', price: '$320', stars: 5, rating: '4.9 (11)', badge: 'bg-[#6366f1]/90 text-white', badgeText: 'NEW', imgClass: 'bg-gradient-to-br from-[#f0ecff] via-[#e6e0ff] to-[#ddd5fe]' },
    { emoji: '🖥️', name: 'Dell 27" 4K Monitor', meta: 'IPS Panel · USB-C · 2022', price: '$450', stars: 4, rating: '4.6 (7)', badge: 'bg-[#ef4444]/90 text-white', badgeText: 'HOT', imgClass: 'bg-gradient-to-br from-[#ede8ff] via-[#e2daff] to-[#d5ccfe]' },
    { emoji: '🎮', name: 'Nintendo Switch OLED', meta: 'With 3 Games · White', price: '$280', stars: 5, rating: '5.0 (19)', badge: 'bg-[#10b981]/90 text-white', badgeText: 'SALE', imgClass: 'bg-gradient-to-br from-[#f3efff] via-[#ebe4ff] to-[#dfd6fe]' },
    { emoji: '⌚', name: 'Apple Watch Series 7', meta: '41mm · Aluminium · GPS', price: '$175', stars: 5, rating: '4.8 (32)', badge: 'bg-[#6366f1]/90 text-white', badgeText: 'NEW', imgClass: 'bg-gradient-to-br from-[#efeaff] via-[#e5ddff] to-[#d9d0fe]' },
];

const Stars = ({ count }) => <span className="text-xs text-[#f59e0b]">{('★'.repeat(count) + '☆'.repeat(5 - count))}</span>;

const Marketplace = () => {
    const wrapRef = useRef(null);
    useCarouselDrag(wrapRef);
    return (
        <section className="relative overflow-hidden pt-[60px] pb-[70px] bg-[radial-gradient(ellipse_70%_60%_at_0%_0%,rgba(167,139,250,0.4),transparent),radial-gradient(ellipse_60%_55%_at_100%_0%,rgba(99,102,241,0.3),transparent),radial-gradient(ellipse_50%_60%_at_50%_100%,rgba(147,197,253,0.3),transparent),radial-gradient(ellipse_40%_45%_at_80%_50%,rgba(196,181,253,0.25),transparent),linear-gradient(135deg,#ddd6fe_0%,#c4b5fd_25%,#e0e7ff_55%,#bfdbfe_80%,#ede9fe_100%)] border-t border-[#a78bfa]/25" id="marketplace">
            <div className="px-16 mb-7 relative z-[2]">
                <div className="flex justify-between items-end flex-wrap gap-5">
                    <div>
                        <span className="block font-epilogue text-[12px] font-bold tracking-[0.15em] uppercase text-[#c4b5fd] mb-3 reveal">Popular Marketplace Listings</span>
                        <h2 className="font-clash text-[clamp(26px,3vw,40px)] tracking-[-0.03em] font-bold text-white mb-3 reveal">Shop Safe From Fellow Students</h2>
                        <p className="font-epilogue text-[14px] text-white/55 leading-[1.7] mt-1 reveal">All sellers are identity-verified. Zero scams guaranteed.</p>
                    </div>
                    <button className="bg-white/15 backdrop-blur-md border-[1.5px] border-white/30 text-white font-epilogue font-semibold text-[14px] py-2.5 px-6 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:-translate-y-[1px] reveal whitespace-nowrap">
                        Explore Full Marketplace →
                    </button>
                </div>
            </div>
            <div className="relative z-[2] overflow-x-auto overflow-y-hidden cursor-grab scrollbar-hide" ref={wrapRef}>
                <div className="absolute top-0 bottom-0 left-0 w-[100px] z-[3] pointer-events-none bg-gradient-to-r from-[#ddd6fe] to-transparent" />
                <div className="absolute top-0 bottom-0 right-0 w-[100px] z-[3] pointer-events-none bg-gradient-to-l from-[#ede9fe] to-transparent" />

                <div className="flex gap-6 w-max px-16 pb-8 pt-4">
                    {MP_ITEMS.map((item, i) => (
                        <div className="shrink-0 w-[280px] bg-white/85 backdrop-blur-[18px] border-[1.5px] border-[#c4b5fd]/30 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer shadow-[0_6px_28px_rgba(109,40,217,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_24px_60px_rgba(109,40,217,0.18)] hover:border-[#a78bfa]/50 group" key={i}>
                            <div className={`h-[220px] flex items-center justify-center relative overflow-hidden ${item.imgClass}`}>
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(255,255,255,0.22),transparent)] pointer-events-none" />
                                <span className={`absolute top-3.5 left-3.5 z-[2] text-[10px] font-bold py-[3px] px-[9px] rounded-md tracking-[0.06em] uppercase font-epilogue ${item.badge}`}>{item.badgeText}</span>
                                <span className="absolute top-3.5 right-3.5 z-[2] bg-white/95 backdrop-blur-md text-text text-[14px] font-extrabold py-1 px-3 rounded-xl shadow-[0_2px_10px_rgba(109,40,217,0.15)]">{item.price}</span>
                                <span className="text-[80px] drop-shadow-[0_8px_24px_rgba(0,0,0,0.15)] z-[1] transition-transform duration-300 group-hover:scale-[1.12] group-hover:-translate-y-1">{item.emoji}</span>
                            </div>
                            <div className="pt-[18px] px-5 pb-5">
                                <div className="font-clash text-[15px] font-semibold text-text mb-1 tracking-[-0.01em]">{item.name}</div>
                                <div className="font-epilogue text-[12px] text-muted mb-2.5">{item.meta}</div>
                                <div className="flex items-center gap-1"><Stars count={item.stars} /> <span className="text-[#9ca3af] text-[11px]">{item.rating}</span></div>
                                <div className="flex justify-between items-center mt-3.5">
                                    <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#c4b5fd]/25 border border-[#a78bfa]/30 text-[#7c3aed] cursor-pointer text-base transition-all duration-200 hover:bg-[#ef4444]/10 hover:border-[#ef4444]/30 hover:text-[#ef4444]">♡</button>
                                    <button className="font-epilogue text-[13px] font-bold py-[9px] px-5 rounded-xl cursor-pointer transition-all duration-200 bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white shadow-[0_4px_12px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.45)] hover:-translate-y-[1px]">Buy Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Marketplace;
