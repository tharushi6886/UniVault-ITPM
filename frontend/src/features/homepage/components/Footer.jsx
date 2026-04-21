import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden pt-24 pb-12 px-8 md:px-16 bg-[#0B0821] border-t border-white/5">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] -mr-64 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] -ml-40 -mb-40 pointer-events-none"></div>

      <div className="max-w-[1500px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4A8EF0] to-[#54DBC8] flex items-center justify-center text-sm font-black shadow-[0_8px_20px_rgba(79,134,239,0.2)] text-white">
                U
              </div>
              <span className="font-clash text-2xl font-bold text-white tracking-tight">UniVault</span>
            </div>
            <p className="font-epilogue text-sm text-slate-400 leading-relaxed max-w-xs">
              The premier campus intelligence platform for secure item recovery and peer-to-peer student trading. Built by students, for students.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'Instagram'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-[#00D9FF] hover:border-[#00D9FF]/30 transition-all duration-300"
                  title={platform}
                >
                  <span className="sr-only">{platform}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-8">System Modules</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/lost-items" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Lost & Found Directory</Link></li>
              <li><Link to="/marketplace" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Campus Marketplace</Link></li>
              <li><Link to="/bidding" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Live Bidding Beta</Link></li>
              <li><Link to="/report-item" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Report Lost Belonging</Link></li>
            </ul>
          </div>

          {/* User Intelligence */}
          <div>
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-8">User Intelligence</h4>
            <ul className="space-y-4">
              <li><Link to="/profile" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Personal Profile</Link></li>
              <li><Link to="/profile/my-bids" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Active Bid History</Link></li>
              <li><Link to="/profile/items-posted" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Marketplace Listings</Link></li>
              <li><Link to="/profile/feedback-trust" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Trust Integrity Stats</Link></li>
              <li><Link to="/admin/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Administrative Panel</Link></li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-8">Platform Support</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About the Project</Link></li>
              <li><Link to="/about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Privacy & Security</Link></li>
              <li><Link to="/about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Safety Guidelines</Link></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[12px] font-medium text-slate-500">
          <div className="flex items-center gap-4">
            <span>© {currentYear} UniVault Inc.</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>Educational Infrastructure Project</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500/40"></span>
              Secure Network Status: Nominal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
