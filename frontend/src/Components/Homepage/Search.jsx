import React from 'react';

const Search = () => (
    <section className="relative overflow-hidden py-[60px] px-16 bg-[radial-gradient(ellipse_65%_80%_at_8%_50%,rgba(129,140,248,0.18),transparent),radial-gradient(ellipse_55%_70%_at_92%_30%,rgba(96,165,250,0.15),transparent),radial-gradient(ellipse_45%_60%_at_50%_90%,rgba(196,181,253,0.14),transparent),linear-gradient(140deg,#f0eeff_0%,#e8e4ff_35%,#dbeafe_65%,#ede9fe_100%)] border-t border-[#a5b4fc]/20">
        <div className="max-w-[700px] mx-auto text-center relative z-10">
            <span className="block font-epilogue text-xs font-bold tracking-[0.15em] uppercase text-i2 mb-3">
                Quick Search
            </span>
            <h2 className="font-clash text-[28px] tracking-[-0.02em] font-bold text-text mb-2">
                Search Lost Items &amp; Marketplace
            </h2>
            <p className="font-epilogue text-[15px] text-muted mb-[26px]">
                Find your lost belongings or discover great deals from verified students
            </p>

            <div className="flex items-center bg-white/85 backdrop-blur-md border-[1.5px] border-[#818cf8]/25 rounded-2xl p-1.5 pl-5 shadow-[0_4px_28px_rgba(79,70,229,0.1),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-200 focus-within:border-i3 focus-within:shadow-[0_4px_36px_rgba(79,70,229,0.2)]">
                <span className="text-[#a5b4fc] text-[17px] mr-2 shrink-0">🔍</span>
                <input
                    type="text"
                    placeholder="Search lost items, marketplace products..."
                    className="flex-1 bg-transparent border-none outline-none text-text text-[15px] font-epilogue py-2.5 min-w-0 placeholder-[#a5b4fc]"
                />
                <button className="bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white border-none font-epilogue font-semibold text-sm py-[13px] px-7 rounded-xl cursor-pointer whitespace-nowrap shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition-all duration-200 hover:shadow-[0_6px_22px_rgba(79,70,229,0.5)] hover:-translate-y-[1px]">
                    Search
                </button>
            </div>

            <div className="flex gap-2 justify-center mt-[18px] flex-wrap items-center">
                <span className="text-[13px] color-muted font-epilogue">Quick Categories:</span>
                {['📱 Electronics', '🪪 ID Cards', '📚 Books', '👜 Bags', '⌚ Accessories', '➕ Others'].map(c => (
                    <button key={c} className="bg-white/75 backdrop-blur-sm border border-[#818cf8]/25 text-[#3730a3] text-[13px] py-1.5 px-4 rounded-full cursor-pointer transition-all duration-200 font-epilogue font-medium hover:bg-[#6366f1]/10 hover:border-i4 hover:-translate-y-[1px]">
                        {c}
                    </button>
                ))}
            </div>
        </div>
    </section>
);

export default Search;
