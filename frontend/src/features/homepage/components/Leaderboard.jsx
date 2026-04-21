import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getTrustLeaderboard } from '../../../api/userApi';

const getImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
};

const CrownIcon = () => (
    <div className="mb-2">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="12" cy="4" r="1.2" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.8"/>
            <circle cx="3" cy="5" r="1" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.8"/>
            <circle cx="21" cy="5" r="1" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.8"/>
        </svg>
    </div>
);

const RANK_CONFIG = {
    0: { // Rank 1
        label: 'RANK 1',
        borderColor: 'border-amber-400',
        ringColor: 'ring-amber-400',
        avatarSize: 'w-24 h-24',
        nameSize: 'text-xl',
        statSize: 'text-2xl',
        padding: 'p-7 pt-9',
        width: 'max-w-[320px]',
        cardBg: 'bg-gradient-to-br from-white via-amber-50/50 to-amber-100/20',
        statBg: 'bg-amber-50/50 border-amber-100/30',
        pillBg: 'bg-amber-100/40 border-amber-200/50 text-amber-700',
        isWinner: true
    },
    1: { // Rank 2
        label: 'RANK 2',
        borderColor: 'border-indigo-300',
        ringColor: 'ring-indigo-300',
        avatarSize: 'w-22 h-22',
        nameSize: 'text-lg',
        statSize: 'text-xl',
        padding: 'p-6 pt-8',
        width: 'max-w-[280px]',
        cardBg: 'bg-gradient-to-br from-white via-indigo-50/50 to-indigo-100/20',
        statBg: 'bg-indigo-50/50 border-indigo-100/30',
        pillBg: 'bg-indigo-100/40 border-indigo-200/50 text-indigo-700',
        isWinner: false
    },
    2: { // Rank 3
        label: 'RANK 3',
        borderColor: 'border-orange-300',
        ringColor: 'ring-orange-300',
        avatarSize: 'w-22 h-22',
        nameSize: 'text-lg',
        statSize: 'text-xl',
        padding: 'p-6 pt-8',
        width: 'max-w-[280px]',
        cardBg: 'bg-gradient-to-br from-white via-orange-50/50 to-orange-100/20',
        statBg: 'bg-orange-50/50 border-orange-100/30',
        pillBg: 'bg-orange-100/40 border-orange-200/50 text-orange-700',
        isWinner: false
    }
};

const LeaderboardCard = ({ user, config }) => (
    <div className={`flex-1 ${config.width} ${config.cardBg} rounded-[36px] ${config.padding} flex flex-col items-center text-center relative shadow-xl shadow-indigo-500/5 group border border-slate-100 border-t-4 ${config.borderColor} transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/15`}>
        
        {/* Rank Badge */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 rounded-full bg-white border ${config.borderColor} shadow-lg z-20 group-hover:scale-110 transition-transform duration-300`}>
            <span className={`text-[10px] font-black tracking-widest ${config.borderColor.replace('border-', 'text-')} whitespace-nowrap`}>
                {config.label}
            </span>
        </div>

        {/* Winner Treatments */}
        {config.isWinner && (
            <div className="flex flex-col items-center w-full">
                <div className="animate-bounce-slow">
                    <CrownIcon />
                </div>
                <div className="flex items-center gap-1.5 bg-amber-400 text-white px-4 py-1 rounded-full mb-3 shadow-lg shadow-amber-400/30 transition-all duration-300 group-hover:px-6">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    <span className="text-[9px] font-black tracking-wider font-epilogue uppercase">Top Samaritan</span>
                </div>
            </div>
        )}

        {/* Avatar */}
        <div className={`shrink-0 ${config.avatarSize} rounded-full border-4 border-white ring-4 ${config.ringColor.replace('ring-', 'ring-offset-2 ring-')} overflow-hidden shadow-2xl mb-4 transition-all duration-500 group-hover:scale-105 group-hover:rotate-3 bg-slate-50 flex items-center justify-center relative`}>
            <div className="absolute inset-0 shadow-[inner_0_0_15px_rgba(0,0,0,0.1)] z-10 rounded-full pointer-events-none" />
            {user.profileImage ? (
                <img src={getImageUrl(user.profileImage)} alt={user.name} className="w-full h-full object-cover" />
            ) : (
                <span className="text-3xl font-black text-slate-300 font-clash">
                    {user.name?.charAt(0).toUpperCase()}
                </span>
            )}
        </div>

        {/* Identity */}
        <div className="w-full mb-5">
            <h3 className={`font-clash ${config.nameSize} font-bold text-slate-900 mb-0.5 truncate px-2 group-hover:text-indigo-600 transition-colors`}>
                {user.name}
            </h3>
            <p className="font-epilogue text-[12px] font-medium text-slate-400 group-hover:text-slate-500 transition-colors">
                @{user.studentId}
            </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-5">
            <div className={`${config.statBg} border rounded-2xl py-3.5 flex flex-col items-center transition-all duration-300 group-hover:bg-white group-hover:shadow-md`}>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Trust Score</span>
                <span className={`font-clash ${config.statSize} font-bold text-slate-900`}>{user.trustScore}</span>
            </div>
            <div className={`${config.statBg} border rounded-2xl py-3.5 flex flex-col items-center transition-all duration-300 group-hover:bg-white group-hover:shadow-md`}>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Recoveries</span>
                <span className={`font-clash ${config.statSize} font-bold text-slate-900`}>{user.itemsRecovered}</span>
            </div>
        </div>

        {/* Faculty Pill */}
        <div className={`${config.pillBg} border px-5 py-2 rounded-full transition-all duration-300 group-hover:bg-white group-hover:border-indigo-200`}>
            <span className="text-[10px] font-black font-epilogue text-center leading-tight block uppercase tracking-wide truncate max-w-[140px]">
                {user.faculty || 'UniVault Member'}
            </span>
        </div>
    </div>
);

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const res = await getTrustLeaderboard();
                if (res.data) setLeaders(res.data);
            } catch (err) {
                console.error('Leaderboard fetch error', err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaders();
    }, []);

    if (loading || leaders.length === 0) return null;

    const podiumOrder = [1, 0, 2];

    return (
        <section className="relative py-20 px-8 md:px-16 bg-white overflow-hidden border-t border-slate-100">
            {/* Soft Light Background Accent */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(79,134,239,0.02),transparent)] pointer-events-none" />

            <div className="max-w-[1100px] mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-indigo-100 rounded-full mb-4 shadow-sm">
                        <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.15em] uppercase text-indigo-600 font-epilogue">Hall of Fame</span>
                    </div>
                    <h2 className="font-clash text-[clamp(28px,4vw,42px)] font-bold text-slate-900 mb-3 tracking-tight">
                        Campus Good Samaritans
                    </h2>
                    <p className="font-epilogue text-[15px] text-slate-500 leading-relaxed max-w-[500px] mx-auto">
                        Celebrating the student community who prioritize <br className="hidden md:block" /> integrity and unity through helpful returns.
                    </p>
                </div>

                {/* Podium Layout */}
                <div className="flex flex-col md:flex-row items-end justify-center gap-5 md:gap-6">
                    {podiumOrder.map((rankIdx) => {
                        const user = leaders[rankIdx];
                        if (!user) return null;
                        
                        return (
                            <Link 
                                key={user.id || user._id || user.studentId}
                                to={`/user/${user._id || user.id}`}
                                className="flex-1 w-full md:max-w-none no-underline block"
                            >
                                <motion.div
                                    whileHover={{ y: -8, scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <LeaderboardCard 
                                        user={user} 
                                        config={RANK_CONFIG[rankIdx]} 
                                    />
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }
                .animate-blob-drift {
                    animation: blob-drift 20s infinite alternate ease-in-out;
                }
                .animate-blob-drift-rev {
                    animation: blob-drift-rev 25s infinite alternate ease-in-out;
                }
            `}</style>
        </section>
    );
};

export default Leaderboard;
