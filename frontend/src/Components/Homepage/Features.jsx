import React from 'react';

const FEATURES = [
    { icon: '🔍', title: 'Lost & Found', desc: 'AI-powered image matching and location tracking to reunite you with your items faster than ever.', bg: 'linear-gradient(135deg,#ede9fe,#c4b5fd)' },
    { icon: '🛒', title: 'Buy & Sell', desc: 'Secure peer-to-peer marketplace exclusively for verified university students. Zero scams.', bg: 'linear-gradient(135deg,#dbeafe,#93c5fd)' },
    { icon: '🔨', title: 'Bidding', desc: 'Auction high-demand items or textbooks to get the best value on campus in real-time.', bg: 'linear-gradient(135deg,#e0e7ff,#c7d2fe)' },
    { icon: '⭐', title: 'Feedback', desc: 'Trust system built on community reviews and successful item recoveries. Reputation matters.', bg: 'linear-gradient(135deg,#cffafe,#a5f3fc)' },
];

const Features = () => (
    <section className="relative overflow-hidden py-[70px] px-16 bg-[radial-gradient(ellipse_60%_70%_at_0%_35%,rgba(167,139,250,0.22),transparent),radial-gradient(ellipse_50%_60%_at_100%_65%,rgba(96,165,250,0.18),transparent),radial-gradient(ellipse_40%_50%_at_55%_5%,rgba(196,181,253,0.16),transparent),linear-gradient(155deg,#ede9fe_0%,#ddd6fe_20%,#e0e7ff_45%,#bfdbfe_70%,#dbeafe_100%)] border-t border-[#a78bfa]/20">
        <div className="max-w-[1280px] mx-auto relative z-[1]">
            <div className="grid grid-cols-2 gap-[60px] items-end mb-9">
                <div>
                    <span className="block font-epilogue text-xs font-bold tracking-[0.15em] uppercase text-i2 mb-3 reveal">
                        Powerful Features for Campus
                    </span>
                    <h2 className="font-clash text-[clamp(26px,3vw,40px)] tracking-[-0.03em] font-bold text-text mb-3 reveal">
                        Connecting Students Through Every Step
                    </h2>
                </div>
                <p className="font-epilogue text-[14px] text-muted leading-[1.7] reveal">
                    AI-powered recovery, verified marketplace, live bidding, and community trust — all in one campus platform.
                </p>
            </div>

            <div className="grid grid-cols-4 gap-5">
                {FEATURES.map((f, i) => (
                    <div className={`bg-white/70 backdrop-blur-xl border-[1.5px] border-white/90 rounded-3xl py-8 px-6 transition-all duration-300 shadow-[0_4px_24px_rgba(79,70,229,0.09),inset_0_1px_0_rgba(255,255,255,0.85)] hover:-translate-y-2 hover:shadow-[0_20px_56px_rgba(79,70,229,0.18)] hover:border-[#818cf8]/40 reveal rd${i}`} key={f.title}>
                        <div className="w-[54px] h-[54px] rounded-2xl mb-[22px] flex items-center justify-center text-2xl shadow-[0_4px_14px_rgba(0,0,0,0.07)]" style={{ background: f.bg }}>
                            {f.icon}
                        </div>
                        <h3 className="font-clash text-[17px] font-semibold mb-2.5 text-text">
                            {f.title}
                        </h3>
                        <p className="font-epilogue text-sm text-muted leading-[1.72]">
                            {f.desc}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default Features;
