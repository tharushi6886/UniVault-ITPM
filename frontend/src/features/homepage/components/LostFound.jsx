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

const LOST_ITEMS = [
    { emoji: '👜', name: 'Blue Leather Wallet', loc: 'Student Center Gym', time: 'Reported 20 mins ago', avatar: 'AK', user: '@alex_k', imgClass: 'bg-gradient-to-br from-[#ede9fe] via-[#c4b5fd] to-[#a78bfa]' },
    { emoji: '💻', name: 'HP Spectre Laptop', loc: 'CS Lab, Block B', time: 'Reported 1h ago', avatar: 'SR', user: '@sara_r', imgClass: 'bg-gradient-to-br from-[#ddd6fe] via-[#c4b5fd] to-[#818cf8]' },
    { emoji: '🎒', name: 'Black Nike Backpack', loc: 'Library, 2nd Floor', time: 'Reported 3h ago', avatar: 'MJ', user: '@mike_j', imgClass: 'bg-gradient-to-br from-[#e0e7ff] via-[#c7d2fe] to-[#818cf8]' },
    { emoji: '📱', name: 'iPhone 13 Pro Max', loc: 'Cafeteria Table 7', time: 'Reported 5h ago', avatar: 'NF', user: '@nadia_f', imgClass: 'bg-gradient-to-br from-[#f3e8ff] via-[#e9d5ff] to-[#d8b4fe]' },
    { emoji: '🔑', name: 'Car Keys (Toyota)', loc: 'Parking Lot C', time: 'Reported 6h ago', avatar: 'TO', user: '@tom_o', imgClass: 'bg-gradient-to-br from-[#ede9fe] via-[#ddd6fe] to-[#c4b5fd]' },
    { emoji: '🎧', name: 'AirPods Pro (Case)', loc: 'Sports Complex', time: 'Reported 8h ago', avatar: 'PL', user: '@priya_l', imgClass: 'bg-gradient-to-br from-[#ede9fe] via-[#c4b5fd] to-[#a78bfa]' },
    { emoji: '📓', name: 'Purple Notebook', loc: 'Lecture Hall 204', time: 'Reported 10h ago', avatar: 'EW', user: '@emma_w', imgClass: 'bg-gradient-to-br from-[#e0e7ff] via-[#c7d2fe] to-[#818cf8]' },
    { emoji: '⌚', name: 'Apple Watch Series 8', loc: 'Swimming Pool', time: 'Reported 12h ago', avatar: 'KS', user: '@kai_s', imgClass: 'bg-gradient-to-br from-[#ddd6fe] via-[#c4b5fd] to-[#818cf8]' },
];

const FOUND_ITEMS = [
    { emoji: '⌚', name: 'Casio G-Shock Watch', loc: 'Basketball Court B', time: 'Verified 5 mins ago', avatar: 'DM', user: '@dan_m', imgClass: 'bg-gradient-to-br from-[#dbeafe] via-[#bfdbfe] to-[#93c5fd]', badge: 'bg-[#10b981]/15 text-[#059669] border-[#10b981]/30 backdrop-blur-sm', badgeText: 'FOUND' },
    { emoji: '📗', name: 'Chemistry Textbook', loc: 'Main Plaza Lawn', time: 'Verified 43 mins ago', avatar: 'LN', user: '@luna_n', imgClass: 'bg-gradient-to-br from-[#e0e7ff] via-[#c7d2fe] to-[#a5b4fc]', badge: 'bg-[#10b981]/15 text-[#059669] border-[#10b981]/30 backdrop-blur-sm', badgeText: 'FOUND' },
    { emoji: '🔑', name: 'Keychain with 3 Keys', loc: 'Cafeteria Entrance', time: 'Verified 1h ago', avatar: 'RS', user: '@ravi_s', imgClass: 'bg-gradient-to-br from-[#cffafe] via-[#a5f3fc] to-[#67e8f9]', badge: 'bg-[#10b981]/15 text-[#059669] border-[#10b981]/30 backdrop-blur-sm', badgeText: 'FOUND' },
    { emoji: '👓', name: 'Blue Ray-Ban Glasses', loc: 'Auditorium Row 4', time: 'Verified 2h ago', avatar: 'YK', user: '@yara_k', imgClass: 'bg-gradient-to-br from-[#dbeafe] via-[#93c5fd] to-[#60a5fa]', badge: 'bg-[#10b981]/15 text-[#059669] border-[#10b981]/30 backdrop-blur-sm', badgeText: 'FOUND' },
    { emoji: '🪪', name: 'Student ID Card', loc: 'Administration Block', time: 'Verified 3h ago', avatar: 'OB', user: '@omar_b', imgClass: 'bg-gradient-to-br from-[#e0e7ff] via-[#bfdbfe] to-[#93c5fd]', badge: 'bg-[#10b981]/15 text-[#059669] border-[#10b981]/30 backdrop-blur-sm', badgeText: 'FOUND' },
    { emoji: '💳', name: 'Debit Card (HSBC)', loc: 'ATM Near Block A', time: 'Verified 4h ago', avatar: 'CL', user: '@chloe_l', imgClass: 'bg-gradient-to-br from-[#dbeafe] via-[#bfdbfe] to-[#93c5fd]', badge: 'bg-[#6366f1]/15 text-[#4f46e5] border-[#6366f1]/30 backdrop-blur-sm', badgeText: 'CLAIMED' },
    { emoji: '🎽', name: 'Sports Jersey #9', loc: 'Locker Room 3B', time: 'Verified 6h ago', avatar: 'JA', user: '@james_a', imgClass: 'bg-gradient-to-br from-[#cffafe] via-[#a5f3fc] to-[#67e8f9]', badge: 'bg-[#10b981]/15 text-[#059669] border-[#10b981]/30 backdrop-blur-sm', badgeText: 'FOUND' },
    { emoji: '🖊️', name: 'Pencil Case (Purple)', loc: 'Drawing Studio', time: 'Verified 7h ago', avatar: 'FH', user: '@fatima_h', imgClass: 'bg-gradient-to-br from-[#e0e7ff] via-[#c7d2fe] to-[#a5b4fc]', badge: 'bg-[#10b981]/15 text-[#059669] border-[#10b981]/30 backdrop-blur-sm', badgeText: 'FOUND' },
];

const CarouselSection = ({ id, sectionClass, fadeLeft, fadeRight, labelText, title, subtitle, btnText, children }) => {
    const wrapRef = useRef(null);
    useCarouselDrag(wrapRef);
    return (
        <section className={`relative overflow-hidden pt-[60px] pb-[70px] ${sectionClass}`} id={id}>
            <div className="px-16 mb-7 relative z-[2]">
                <div className="flex justify-between items-end flex-wrap gap-5">
                    <div>
                        <span className="block font-epilogue text-xs font-bold tracking-[0.15em] uppercase text-i2 mb-3 reveal">{labelText}</span>
                        <h2 className="font-clash text-[clamp(26px,3vw,40px)] tracking-[-0.03em] font-bold text-text mb-3 reveal">{title}</h2>
                        <p className="font-epilogue text-[14px] text-muted leading-[1.7] reveal">{subtitle}</p>
                    </div>
                    <button className="bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white border-none font-epilogue font-semibold text-sm py-2.5 px-6 rounded-xl cursor-pointer shadow-[0_4px_14px_rgba(79,70,229,0.3)] transition-all duration-200 hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] hover:-translate-y-[1px] reveal whitespace-nowrap">
                        {btnText}
                    </button>
                </div>
            </div>
            <div className="relative z-[2] overflow-x-auto overflow-y-hidden cursor-grab scrollbar-hide" ref={wrapRef}>
                <div className={`absolute top-0 bottom-0 left-0 w-[100px] z-[3] pointer-events-none bg-gradient-to-r ${fadeLeft} to-transparent`} />
                <div className={`absolute top-0 bottom-0 right-0 w-[100px] z-[3] pointer-events-none bg-gradient-to-l ${fadeRight} to-transparent`} />

                <div className="flex gap-6 w-max px-16 pb-8 pt-4">
                    {children}
                </div>
            </div>
        </section>
    );
};

export const LostCarousel = () => (
    <CarouselSection id="lost" sectionClass="bg-[radial-gradient(ellipse_60%_70%_at_10%_20%,rgba(129,140,248,0.2),transparent),radial-gradient(ellipse_50%_60%_at_90%_80%,rgba(239,68,68,0.08),transparent),radial-gradient(ellipse_40%_55%_at_50%_50%,rgba(196,181,253,0.15),transparent),linear-gradient(145deg,#f0eeff_0%,#e8e4ff_30%,#eef2ff_60%,#ede9fe_100%)] border-t border-[#818cf8]/20"
        fadeLeft="from-[#f0eeff]" fadeRight="from-[#ede9fe]" labelText="Campus Lost Items" title="Recently Lost Near You" subtitle="Help return lost belongings to their owners." btnText="View All Lost Items →">
        {LOST_ITEMS.map((item, i) => (
            <div className="shrink-0 w-[290px] bg-white/75 backdrop-blur-[18px] border-[1.5px] border-white/95 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer shadow-[0_6px_28px_rgba(79,70,229,0.1),inset_0_1px_0_rgba(255,255,255,0.85)] hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_22px_56px_rgba(79,70,229,0.18)] hover:border-[#818cf8]/40 group" key={i}>
                <div className={`h-[200px] flex items-center justify-center relative overflow-hidden ${item.imgClass}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(255,255,255,0.28),transparent)] pointer-events-none" />
                    <span className="absolute top-3 left-3 z-[2] text-[10px] font-bold py-[3px] px-2.5 rounded-md tracking-[0.06em] uppercase font-epilogue bg-[#ef4444]/15 text-[#dc2626] border border-[#ef4444]/30 backdrop-blur-sm">MISSING</span>
                    <span className="text-[76px] drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)] z-[1] transition-transform duration-300 group-hover:scale-[1.14] group-hover:-translate-y-1">{item.emoji}</span>
                </div>
                <div className="pt-[18px] px-5 pb-5">
                    <div className="font-clash text-[15px] font-semibold text-text mb-1.5 tracking-[-0.01em]">{item.name}</div>
                    <div className="font-epilogue text-xs text-muted mb-1 flex items-center gap-1">📍 {item.loc}</div>
                    <div className="font-epilogue text-[11px] text-[#94a3b8]">{item.time}</div>
                    <div className="flex justify-between items-center mt-3.5">
                        <div className="flex items-center gap-1.5">
                            <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#818cf8] to-[#6366f1] flex items-center justify-center text-[11px] text-white font-semibold">{item.avatar}</div>
                            <span className="font-epilogue text-[11px] text-[#94a3b8]">by {item.user}</span>
                        </div>
                        <button className="font-epilogue text-[12px] font-semibold py-[7px] px-4 rounded-[9px] cursor-pointer transition-all duration-200 bg-[#ef4444]/10 text-[#dc2626] border border-[#ef4444]/20 hover:bg-[#ef4444]/20">I Found It</button>
                    </div>
                </div>
            </div>
        ))}
    </CarouselSection>
);

export const FoundCarousel = () => (
    <CarouselSection id="found" sectionClass="bg-[radial-gradient(ellipse_60%_70%_at_90%_20%,rgba(129,140,248,0.2),transparent),radial-gradient(ellipse_50%_60%_at_10%_80%,rgba(16,185,129,0.08),transparent),radial-gradient(ellipse_40%_55%_at_50%_50%,rgba(147,197,253,0.15),transparent),linear-gradient(145deg,#e8eeff_0%,#dbeafe_30%,#ede9fe_60%,#e0e7ff_100%)] border-t border-[#818cf8]/15"
        fadeLeft="from-[#e8eeff]" fadeRight="from-[#e0e7ff]" labelText="Campus Found Items" title="Recently Found & Waiting" subtitle="Recognise something? Claim it before someone else does." btnText="View All Found Items →">
        {FOUND_ITEMS.map((item, i) => (
            <div className="shrink-0 w-[290px] bg-white/75 backdrop-blur-[18px] border-[1.5px] border-white/95 rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer shadow-[0_6px_28px_rgba(79,70,229,0.1),inset_0_1px_0_rgba(255,255,255,0.85)] hover:-translate-y-2.5 hover:scale-[1.02] hover:shadow-[0_22px_56px_rgba(79,70,229,0.18)] hover:border-[#818cf8]/40 group" key={i}>
                <div className={`h-[200px] flex items-center justify-center relative overflow-hidden ${item.imgClass}`}>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(255,255,255,0.28),transparent)] pointer-events-none" />
                    <span className={`absolute top-3 left-3 z-[2] text-[10px] font-bold py-[3px] px-2.5 rounded-md tracking-[0.06em] uppercase font-epilogue border ${item.badge}`}>{item.badgeText}</span>
                    <span className="text-[76px] drop-shadow-[0_8px_20px_rgba(0,0,0,0.12)] z-[1] transition-transform duration-300 group-hover:scale-[1.14] group-hover:-translate-y-1">{item.emoji}</span>
                </div>
                <div className="pt-[18px] px-5 pb-5">
                    <div className="font-clash text-[15px] font-semibold text-text mb-1.5 tracking-[-0.01em]">{item.name}</div>
                    <div className="font-epilogue text-xs text-muted mb-1 flex items-center gap-1">📍 {item.loc}</div>
                    <div className="font-epilogue text-[11px] text-[#94a3b8]">{item.time}</div>
                    <div className="flex justify-between items-center mt-3.5">
                        <div className="flex items-center gap-1.5">
                            <div className="w-[26px] h-[26px] rounded-full bg-gradient-to-br from-[#818cf8] to-[#6366f1] flex items-center justify-center text-[11px] text-white font-semibold">{item.avatar}</div>
                            <span className="font-epilogue text-[11px] text-[#94a3b8]">by {item.user}</span>
                        </div>
                        <button className="font-epilogue text-[12px] font-semibold py-[7px] px-4 rounded-[9px] cursor-pointer transition-all duration-200 bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white shadow-[0_3px_10px_rgba(79,70,229,0.28)] hover:shadow-[0_5px_16px_rgba(79,70,229,0.4)] hover:-translate-y-[1px]">Claim →</button>
                    </div>
                </div>
            </div>
        ))}
    </CarouselSection>
);
