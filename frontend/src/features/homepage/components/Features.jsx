import React from 'react';

const FEATURES = [
    {
        icon: 'L',
        title: 'Lost & Found',
        desc: 'AI-powered matching and location tracking help students reconnect with important belongings faster.',
        accent: 'from-[#00D9FF] to-[#04aced]',
        glow: 'shadow-[0_18px_45px_rgba(0,217,255,0.12)]',
        border: 'border-[#00D9FF]/20',
    },
    {
<<<<<<< HEAD
        icon: 'M',
=======
        icon: 'B&S',
>>>>>>> develop
        title: 'Buy & Sell',
        desc: 'A secure student-only marketplace for textbooks, devices, and essentials with lower scam risk.',
        accent: 'from-[#8B5CF6] to-[#a78bfa]',
        glow: 'shadow-[0_18px_45px_rgba(139,92,246,0.12)]',
        border: 'border-[#8B5CF6]/20',
    },
    {
        icon: 'B',
        title: 'Bidding',
        desc: 'Auction high-demand items in real time and let campus demand decide the best value.',
        accent: 'from-[#EC4899] to-[#f472b6]',
        glow: 'shadow-[0_18px_45px_rgba(236,72,153,0.12)]',
        border: 'border-[#EC4899]/20',
    },
    {
        icon: 'T',
        title: 'Feedback',
        desc: 'Community trust grows through reviews, successful recoveries, and verified student profiles.',
        accent: 'from-[#10B981] to-[#34D399]',
        glow: 'shadow-[0_18px_45px_rgba(16,185,129,0.12)]',
        border: 'border-[#10B981]/20',
    },
];

const Features = () => (
    <section className="relative overflow-visible pb-[96px] px-8 md:px-16 bg-[#F0F9FF]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_42%_38%_at_10%_10%,rgba(0,217,255,0.08),transparent),radial-gradient(ellipse_30%_32%_at_88%_18%,rgba(139,92,246,0.08),transparent),radial-gradient(ellipse_34%_28%_at_50%_100%,rgba(16,185,129,0.06),transparent)]" />
        <div className="absolute left-[8%] top-[18%] h-40 w-40 rounded-full bg-[#00D9FF]/8 blur-3xl pointer-events-none" />
        <div className="absolute right-[10%] bottom-[14%] h-48 w-48 rounded-full bg-[#8B5CF6]/8 blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto relative z-[10] -mt-24 md:-mt-36 lg:-mt-48">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center mb-14">
                <div className="reveal">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-[#00D9FF]/40 text-[#007FFF] shadow-[0_12px_30px_rgba(0,0,0,0.05)] text-[12px] font-bold tracking-[0.18em] uppercase">
                        <span className="w-2 h-2 rounded-full bg-[#00D9FF]" />
                        Powerful Features For Campus
                    </span>
                    <h2 className="font-clash text-[clamp(36px,5vw,72px)] tracking-[-0.05em] font-bold text-slate-900 mt-6 leading-[0.98] drop-shadow-sm">
<<<<<<< HEAD
                        The smarter
                        <br />
                        student platform
=======
                        The Smarter
                        <br />
                        Student Platform
>>>>>>> develop
                    </h2>
                </div>

                <div className="reveal rd1">
                    <div className="rounded-[30px] border border-white/60 bg-white/80 backdrop-blur-xl px-8 py-7 shadow-[0_24px_70px_rgba(0,0,0,0.08)]">
                        <p className="font-epilogue text-[18px] leading-[1.8] text-slate-600">
                            UniVault brings lost-item recovery, safe student trading, live bidding, and reputation-based trust into one cleaner campus experience.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-6">
                            <span className="rounded-full bg-[#00D9FF]/10 text-[#007FFF] border border-[#00D9FF]/20 px-4 py-2 text-[12px] font-bold tracking-[0.08em] uppercase">Fast Recovery</span>
                            <span className="rounded-full bg-[#8B5CF6]/10 text-[#7C3AED] border border-[#8B5CF6]/20 px-4 py-2 text-[12px] font-bold tracking-[0.08em] uppercase">Verified Users</span>
                            <span className="rounded-full bg-[#10B981]/10 text-[#059669] border border-[#10B981]/20 px-4 py-2 text-[12px] font-bold tracking-[0.08em] uppercase">Community Trust</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7">
                {FEATURES.map((feature, index) => (
                    <article
                        key={feature.title}
                        className={`group reveal rd${index} rounded-[30px] border border-slate-200 bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-3 hover:bg-white hover:shadow-[0_28px_70px_rgba(0,0,0,0.1)] hover:border-[#00D9FF]/30 transform-gpu hover:rotate-1`}
                    >
                        <div className={`w-[72px] h-[72px] rounded-[24px] bg-gradient-to-br ${feature.accent} text-white text-[30px] font-bold flex items-center justify-center shadow-lg`}>
                            {feature.icon}
                        </div>
                        <h3 className="font-clash text-[22px] font-bold text-slate-900 mt-6 mb-3 group-hover:text-[#007FFF] transition-colors">{feature.title}</h3>
                        <p className="font-epilogue text-[15px] text-slate-500 leading-[1.7]">
                            {feature.desc}
                        </p>
                    </article>
                ))}
            </div>
        </div>
    </section>
);

export default Features;
