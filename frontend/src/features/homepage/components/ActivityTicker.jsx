import React, { useEffect, useState } from 'react';
import { getPublicSystemStats } from '../../../api/userApi';

const DEFAULT_TICKERS = [
    { type: 'claim', text: '@sarah_k just recovered their missing laptop!' },
    { type: 'market', text: 'New heavily discounted textbook listed in Marketplace' },
    { type: 'lost', text: 'A student ID was just found near the Main Library' },
    { type: 'safety', text: 'Reminder: Always meet in verified campus safe zones' },
    { type: 'claim', text: 'An iPhone 13 was successfully returned to its owner 10 mins ago' },
    { type: 'market', text: '@alex_m sold a TI-84 Calculator' },
];

const ActivityTicker = () => {
    const [tickers, setTickers] = useState(DEFAULT_TICKERS);

    useEffect(() => {
        const fetchSystemStatus = async () => {
            try {
                const res = await getPublicSystemStats();
                if (res.data) {
                    setTickers([
                        ...DEFAULT_TICKERS,
                        { type: 'stats', text: `Live: ${res.data.itemsRecovered}+ items successfully recovered so far!` },
                        { type: 'stats', text: `Join ${res.data.studentsCount}+ students actively using UniVault today` },
                    ]);
                }
            } catch (err) {
                console.error('Ticker fetch error', err);
            }
        };

        fetchSystemStatus();
    }, []);

    const getIcon = (type) => {
        switch (type) {
            case 'claim': return '•';
            case 'market': return '•';
            case 'lost': return '•';
            case 'safety': return '•';
            case 'stats': return '•';
            default: return '•';
        }
    };

    return (
        <div className="w-full bg-[#040112] border-y border-white/5 py-3 overflow-hidden flex whitespace-nowrap relative z-20 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <div className="absolute left-0 top-0 bottom-0 w-[100px] bg-gradient-to-r from-[#040112] to-transparent z-[2]" />
            <div className="absolute right-0 top-0 bottom-0 w-[100px] bg-gradient-to-l from-[#040112] to-transparent z-[2]" />

            <div className="animate-marquee inline-flex flex-nowrap gap-12 pl-12 items-center">
                {[...tickers, ...tickers, ...tickers].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 font-epilogue text-[13px] font-semibold text-white/70 transition-colors hover:text-[#00D9FF] cursor-default">
                        <span className="text-[14px] text-[#00D9FF]">{getIcon(item.type)}</span>
                        <span>{item.text}</span>
                    </div>
                ))}
            </div>

            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-marquee {
                    animation: marquee 35s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default ActivityTicker;
