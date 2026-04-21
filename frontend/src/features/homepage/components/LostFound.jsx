import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllLostItems, getAllFoundItems } from '../../../api/itemApi';

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
    if (!url) return 'https://images.unsplash.com/photo-1544365558-35aa4af41144?w=800&h=500&fit=crop';
    if (url.startsWith('data:') || url.startsWith('http')) return url;
    return `http://localhost:5000${url.startsWith('/') ? '' : '/'}${url}`;
};

const getRelativeTime = (dateString) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const daysDifference = Math.round((new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24));

    if (daysDifference === 0) return 'Today';
    return rtf.format(daysDifference, 'day');
};

const SectionHeader = ({ title, accentLabel, accentClassName, link, linkClassName, description }) => (
    <div className="px-16 mb-9 relative z-[2]">
        <div className="flex items-center justify-between mb-2">
            <h2 className="font-clash text-3xl font-bold tracking-[-0.02em] text-white">
                {title} <span className={accentClassName}>{accentLabel}</span>
            </h2>
            <Link to={link} className={`font-epilogue text-[13px] font-bold flex items-center gap-1.5 transition-colors ${linkClassName}`}>
                View Database <span className="text-[10px]">-&gt;</span>
            </Link>
        </div>
        <p className="font-epilogue text-[15px] text-white/60">{description}</p>
    </div>
);

const LostCard = ({ item }) => (
    <Link
        to={`/lost-items?id=${item._id}`}
        className="shrink-0 w-[240px] bg-[#1A103C]/80 backdrop-blur-xl border border-white/10 rounded-[22px] overflow-hidden transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)] hover:-translate-y-2 hover:shadow-[0_15px_45px_rgba(0,217,255,0.15)] hover:border-[#00D9FF]/40 group"
    >
        <div className="h-[140px] relative overflow-hidden bg-gradient-to-br from-[#120B2E] to-[#1A103C]">
            <span className="absolute top-3 left-3 z-[10] text-[10px] font-bold py-1 px-2.5 rounded text-white tracking-widest bg-[#ef4444]/90 shadow-lg">
                MISSING
            </span>
            {item.imageUrl ? (
                <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.itemName || item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">🔍</div>
            )}
        </div>
        <div className="p-5">
            <div className="font-clash text-[15px] font-semibold text-white mb-1.5 line-clamp-1 group-hover:text-[#00D9FF] transition-colors">
                {item.itemName || item.title}
            </div>
            <div className="font-epilogue text-[12px] text-white/50 mb-3 flex items-center gap-1.5 line-clamp-1">
                <span className="text-[#00D9FF] shrink-0">📍</span> {item.location || 'Unknown'}
            </div>
            <div className="flex items-center justify-between text-[11px] font-epilogue text-white/30 pt-3 border-t border-white/5">
                <span>{getRelativeTime(item.createdAt)}</span>
                <span className="text-[#8B5CF6] font-medium group-hover:text-[#00D9FF] transition-colors uppercase tracking-wider">
                    {item.category || 'General'}
                </span>
            </div>
        </div>
    </Link>
);

const FoundCard = ({ item }) => {
    const isClaimed = item.status === 'claimed' || item.status === 'resolved';
    const badgeStyle = isClaimed ? 'bg-slate-400 text-white' : 'bg-emerald-500 text-white';

    return (
        <Link
            to={`/found-items?id=${item._id}`}
            className="shrink-0 w-[240px] bg-white border border-slate-200 rounded-[22px] overflow-hidden transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(16,185,129,0.12)] hover:border-emerald-200 group"
        >
            <div className="h-[140px] relative overflow-hidden bg-gradient-to-br from-emerald-50 to-indigo-50">
                <span className={`absolute top-3 left-3 z-[10] text-[10px] font-bold py-1 px-2.5 rounded tracking-widest shadow-sm ${badgeStyle}`}>
                    {isClaimed ? 'CLAIMED' : 'FOUND'}
                </span>
                {item.imageUrl ? (
                    <img src={getImageUrl(item.imageUrl)} alt={item.itemName || item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">✨</div>
                )}
            </div>
            <div className="p-5">
                <div className="font-clash text-[15px] font-bold text-slate-800 mb-1.5 line-clamp-1 group-hover:text-emerald-600 transition-colors">{item.itemName || item.title}</div>
                <div className="font-epilogue text-[12px] text-slate-500 mb-3 flex items-center gap-1.5 line-clamp-1">
                    <span className="text-emerald-500 shrink-0">📍</span> {item.location || "Unknown"}
                </div>
                <div className="flex items-center justify-between text-[11px] font-epilogue text-slate-400 pt-3 border-t border-slate-100">
                    <span>{getRelativeTime(item.createdAt)}</span>
                    <span className="text-emerald-600 font-bold group-hover:text-emerald-700 transition-colors uppercase tracking-wider">{item.category || "General"}</span>
                </div>
            </div>
        </Link>
    );
};

export const LostCarousel = () => {
    const wrapRef = useRef(null);
    const [items, setItems] = useState([]);

    useCarouselDrag(wrapRef);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await getAllLostItems();
                setItems(res.data.slice(0, 10));
            } catch (err) {
                console.error(err);
            }
        };

        fetchItems();
    }, []);

    return (
        <section className="relative overflow-hidden pt-[80px] pb-[70px] bg-[#0F0A2E] border-t border-white/10">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_100%_0%,rgba(0,217,255,0.08),transparent),radial-gradient(ellipse_50%_60%_at_0%_100%,rgba(139,92,246,0.05),transparent)] pointer-events-none" />
            <div className="px-16 mb-9 relative z-[2]">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-clash text-3xl font-bold tracking-[-0.02em] text-white">Recently <span className="text-[#00D9FF]">Lost Near You</span></h2>
                    <Link to="/lost-items" className="font-epilogue text-[13px] font-bold text-[#00D9FF] hover:text-[#34D399] flex items-center gap-1.5 transition-colors no-underline">
                        View Database <span className="text-[10px]">➔</span>
                    </Link>
                </div>
                <p className="font-epilogue text-[15px] text-white/50">Help your peers by checking if you've seen these items.</p>
            </div>
            
            <div className="relative z-[2] overflow-x-auto overflow-y-hidden cursor-grab scrollbar-hide" ref={wrapRef}>
                <div className="absolute top-0 bottom-0 left-0 w-[100px] z-[3] pointer-events-none bg-gradient-to-r from-[#0F0A2E] to-transparent" />
                <div className="absolute top-0 bottom-0 right-0 w-[100px] z-[3] pointer-events-none bg-gradient-to-l from-[#0F0A2E] to-transparent" />

                <div className="flex gap-5 w-max px-16 pb-8 pt-4">
                    {items.map((item) => (
                        <LostCard item={item} key={item._id} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export const FoundCarousel = () => {
    const wrapRef = useRef(null);
    const [items, setItems] = useState([]);

    useCarouselDrag(wrapRef);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await getAllFoundItems();
                setItems(res.data.slice(0, 10));
            } catch (err) {
                console.error(err);
            }
        };

        fetchItems();
    }, []);

    return (
        <section className="relative overflow-hidden pt-[50px] pb-[90px] bg-[#F0F9FF] border-t border-slate-200">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_0%,rgba(16,185,129,0.06),transparent)] pointer-events-none" />
            <div className="px-16 mb-9 relative z-[2]">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="font-clash text-3xl font-bold tracking-[-0.02em] text-slate-900">Recently <span className="text-emerald-600">Found & Waiting</span></h2>
                    <Link to="/found-items" className="font-epilogue text-[13px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 transition-colors no-underline">
                        View Database <span className="text-[10px]">➔</span>
                    </Link>
                </div>
                <p className="font-epilogue text-[15px] text-slate-500">Good Samaritans dropped these off. Is one yours?</p>
            </div>
            
            <div className="relative z-[2] overflow-x-auto overflow-y-hidden cursor-grab scrollbar-hide" ref={wrapRef}>
                <div className="absolute top-0 bottom-0 left-0 w-[100px] z-[3] pointer-events-none bg-gradient-to-r from-[#F0F9FF] to-transparent" />
                <div className="absolute top-0 bottom-0 right-0 w-[100px] z-[3] pointer-events-none bg-gradient-to-l from-[#F0F9FF] to-transparent" />

                <div className="flex gap-5 w-max px-16 pb-8 pt-4">
                    {items.map((item) => (
                        <FoundCard item={item} key={item._id} />
                    ))}
                </div>
            </div>
        </section>
    );
};
