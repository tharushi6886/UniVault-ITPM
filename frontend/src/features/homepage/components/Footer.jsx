import React from 'react';

const FOOTER_LINKS = {
    'Quick Links': ['Home', 'Lost & Found', 'Marketplace', 'Bidding', 'Terms of Service'],
    Support: ['Help Center', 'Safety Tips', 'Campus Guidelines', 'Contact Us', 'Privacy Policy'],
    Platform: ['Verified Partners', 'Community Protection', 'Student ID Secured', 'API Access'],
};

const Footer = () => (
    <footer className="relative overflow-hidden pt-20 pb-10 px-16 bg-[radial-gradient(ellipse_55%_65%_at_5%_20%,rgba(147,197,253,0.14),transparent),radial-gradient(ellipse_45%_55%_at_95%_80%,rgba(165,243,252,0.12),transparent),linear-gradient(155deg,#27415b_0%,#2f5575_35%,#3e688a_70%,#23425d_100%)]" id="about">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_40%_50%_at_50%_50%,rgba(255,255,255,0.08),transparent)]" />
        <div className="max-w-[1280px] mx-auto">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-[60px] mb-[52px] relative z-[1]">
                <div>
                    <div className="flex items-center gap-2.5 mb-3.5">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#4A8EF0] to-[#54DBC8] flex items-center justify-center text-sm font-black shadow-[0_4px_14px_rgba(79,134,239,0.24)] shrink-0 text-white">
                            U
                        </div>
                        <span className="font-clash text-xl font-bold text-white tracking-[-0.02em]">UniVault</span>
                    </div>
                    <p className="font-epilogue text-sm text-white/70 leading-[1.78] max-w-[270px]">
                        Making university life easier by providing a safe platform for students to recover lost belongings and trade items within the community.
                    </p>
                    <div className="flex gap-2.5 mt-[22px]">
                        {['X', 'in', 'ig', 'yt'].map((symbol) => (
                            <a
                                href="#!"
                                key={symbol}
                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/18 text-white/70 text-[13px] font-bold transition-all duration-200 hover:bg-white/18 hover:border-white/30 hover:text-white hover:-translate-y-0.5 no-underline"
                            >
                                {symbol}
                            </a>
                        ))}
                    </div>
                </div>
                {Object.entries(FOOTER_LINKS).map(([heading, items]) => (
                    <div className="relative z-[1]" key={heading}>
                        <h4 className="font-epilogue text-[11px] font-bold mb-5 text-cyan-100 tracking-[0.12em] uppercase">
                            {heading}
                        </h4>
                        {items.map((item) => (
                            <a href="#!" key={item} className="block font-epilogue text-[14px] text-white/68 mb-[11px] transition-colors duration-200 hover:text-white no-underline">
                                {item}
                            </a>
                        ))}
                    </div>
                ))}
            </div>
            <div className="flex justify-between items-center pt-[30px] border-t border-white/10 text-[13px] text-white/55 flex-wrap gap-3 relative z-[1] font-epilogue">
                <span>© 2026 UniVault Inc. Designed for Universities Worldwide.</span>
                <div className="flex gap-6">
                    {['Verified Partners', 'Community Protection', 'Student ID Secured'].map((link) => (
                        <a href="#!" key={link} className="text-white/55 transition-colors duration-200 hover:text-white no-underline">
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
