import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
=======
import { motion } from 'framer-motion';
>>>>>>> develop
import { getTrustLeaderboard } from '../../../api/userApi';

const getImageUrl = (url) => {
    if (!url) return null;
    return url.startsWith('http') ? url : `http://localhost:5000${url}`;
};

<<<<<<< HEAD
const RANK_STYLES = [
    {
        label: '1',
        shadow: 'shadow-[0_24px_50px_rgba(251,191,36,0.22)]',
        border: 'border-amber-400',
        gradient: 'from-amber-400/30 via-amber-200/5 to-transparent',
        cardBg: 'bg-gradient-to-b from-white to-amber-50',
        text: 'text-amber-600',
        medalTag: 'bg-amber-400 text-white shadow-[0_4px_12px_rgba(217,119,6,0.3)]',
        accent: 'bg-amber-100',
        icon: '👑'
    },
    {
        label: '2',
        shadow: 'shadow-[0_18px_40px_rgba(148,163,184,0.14)]',
        border: 'border-slate-300',
        gradient: 'from-slate-300/20 via-slate-100/5 to-transparent',
        cardBg: 'bg-gradient-to-b from-white to-slate-50',
        text: 'text-slate-500',
        medalTag: 'bg-slate-500 text-white shadow-[0_4px_12px_rgba(100,116,139,0.2)]',
        accent: 'bg-slate-100',
        icon: '🥈'
    },
    {
        label: '3',
        shadow: 'shadow-[0_18px_40px_rgba(180,103,77,0.12)]',
        border: 'border-orange-200',
        gradient: 'from-orange-200/20 via-orange-100/5 to-transparent',
        cardBg: 'bg-gradient-to-b from-white to-orange-50',
        text: 'text-orange-600',
        medalTag: 'bg-orange-600 text-white shadow-[0_4px_12px_rgba(234,88,12,0.2)]',
        accent: 'bg-orange-100',
        icon: '🥉'
    },
];

const Crown = () => (
    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-[30] animate-bounce-slow drop-shadow-[0_6px_12px_rgba(251,191,36,0.45)]">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" strokeLinejoin="round"/>
            <circle cx="12" cy="4" r="2" fill="#FEF3C7" stroke="#D97706" strokeWidth="1"/>
            <circle cx="3" cy="5" r="1.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1"/>
            <circle cx="21" cy="5" r="1.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1"/>
=======
const CrownIcon = () => (
    <div className="mb-2">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md">
            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" strokeLinejoin="round"/>
            <circle cx="12" cy="4" r="1.2" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.8"/>
            <circle cx="3" cy="5" r="1" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.8"/>
            <circle cx="21" cy="5" r="1" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.8"/>
>>>>>>> develop
        </svg>
    </div>
);

<<<<<<< HEAD
const LeaderboardCard = ({ user, style, isWinner }) => (
    <div
        className={`flex-1 max-w-[320px] ${style.cardBg} border border-slate-200 rounded-[32px] p-7 flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-3 group relative overflow-visible ${style.shadow} ${isWinner ? 'md:-translate-y-12 md:scale-110 z-10 ring-4 ring-amber-200/40' : 'z-0'}`}
    >
        {isWinner && <Crown />}
        
        <div className={`absolute top-0 left-0 right-0 h-40 bg-gradient-to-b ${style.gradient} pointer-events-none rounded-t-[32px]`} />

        <div className={`absolute top-6 left-6 px-3.5 py-1.5 rounded-full ${style.medalTag} text-[11px] font-black tracking-widest uppercase z-[25] shadow-lg flex items-center gap-1.5`}>
            <span>{style.icon}</span> <span>RANK {style.label}</span>
        </div>

        <div className={`w-[104px] h-[104px] mt-6 mb-6 rounded-full overflow-hidden border-[5px] ${style.border} relative z-10 shadow-2xl bg-white flex items-center justify-center transition-transform group-hover:rotate-6`}>
            {user.profileImage ? (
                <img src={getImageUrl(user.profileImage)} alt={user.name} className="w-full h-full object-cover" />
            ) : (
                <span className={`text-4xl ${style.text} font-black font-clash`}>
                    {user.name.substring(0, 1).toUpperCase()}
=======
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
>>>>>>> develop
                </span>
            )}
        </div>

<<<<<<< HEAD
        <div className="w-full relative z-10">
            {isWinner && (
                <span className="inline-block text-[10px] font-black text-amber-600 tracking-[0.2em] uppercase mb-1 drop-shadow-sm animate-pulse">
                    🏆 Top Samaritan
                </span>
            )}
            <h3 className="font-clash text-xl font-bold text-slate-900 mb-1 truncate group-hover:text-amber-600 transition-colors">
                {user.name}
            </h3>
            <p className="font-epilogue text-[13px] font-bold text-indigo-500/80 truncate mb-5">
                @{user.studentId}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-2">
                <div className={`${style.accent} rounded-2xl py-3.5 border border-white/50 flex flex-col items-center shadow-inner`}>
                    <span className="font-epilogue text-[10px] text-slate-500 font-bold uppercase tracking-[0.05em] mb-1">Trust Score</span>
                    <span className="font-clash text-2xl font-bold text-slate-900">
                        {user.trustScore}
                    </span>
                </div>
                <div className={`${style.accent} rounded-2xl py-3.5 border border-white/50 flex flex-col items-center shadow-inner`}>
                    <span className="font-epilogue text-[10px] text-slate-500 font-bold uppercase tracking-[0.05em] mb-1">Recoveries</span>
                    <span className={`font-clash text-2xl font-bold ${isWinner ? 'text-emerald-600' : 'text-slate-900'}`}>
                        {user.itemsRecovered}
                    </span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="font-epilogue text-[12px] text-slate-400 line-clamp-1">
                    {user.faculty || 'UniVault Member'}
                </span>
            </div>
=======
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
>>>>>>> develop
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
<<<<<<< HEAD

=======
>>>>>>> develop
        fetchLeaders();
    }, []);

    if (loading || leaders.length === 0) return null;

<<<<<<< HEAD
    return (
        <section className="relative overflow-hidden py-[90px] px-16 bg-[#F0F9FF] border-t border-slate-200">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,rgba(79,134,239,0.05),transparent)] pointer-events-none" />

            <div className="max-w-[1080px] mx-auto relative z-[1]">
                <div className="text-center mb-12">
                    <span className="inline-block px-3 py-1 bg-white border border-indigo-100 rounded-full font-epilogue text-[11px] font-bold tracking-[0.2em] uppercase text-indigo-600 mb-4 shadow-sm">
                        Hall of Fame
                    </span>
                    <h2 className="font-clash text-[clamp(28px,4vw,46px)] tracking-[-0.03em] font-bold text-slate-900 mb-4">
                        Campus Good Samaritans
                    </h2>
                    <p className="font-epilogue text-[15px] text-slate-500 leading-[1.7] max-w-[500px] mx-auto">
                        Recognizing the most helpful verified students who make our university a safer place by actively returning lost items.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row justify-center items-end gap-6 md:gap-8 pt-8">
                    {[1, 0, 2].map((idx) => {
                        const user = leaders[idx];
                        if (!user) return null;

                        const style = RANK_STYLES[idx];
                        const isWinner = idx === 0;

=======
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
                        
>>>>>>> develop
                        return (
                            <Link 
                                key={user.id || user._id || user.studentId}
                                to={`/user/${user._id || user.id}`}
<<<<<<< HEAD
                                className="flex-1 max-w-[320px] transition-all hover:scale-[1.02] active:scale-95"
                            >
                                <LeaderboardCard
                                    user={user}
                                    style={style}
                                    isWinner={isWinner}
                                />
=======
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
>>>>>>> develop
                            </Link>
                        );
                    })}
                </div>
            </div>
<<<<<<< HEAD

            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translate(-50%, 0); }
                    50% { transform: translate(-50%, -10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
                .shimmer {
                    position: relative;
                    overflow: hidden;
                }
                .shimmer::after {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: linear-gradient(
                        to bottom right,
                        rgba(255,255,255,0) 0%,
                        rgba(255,255,255,0.4) 50%,
                        rgba(255,255,255,0) 100%
                    );
                    transform: rotate(45deg);
                    animation: shimmer 3s infinite;
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%) rotate(45deg); }
                    100% { transform: translateX(100%) rotate(45deg); }
=======
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
>>>>>>> develop
                }
            `}</style>
        </section>
    );
};

export default Leaderboard;
