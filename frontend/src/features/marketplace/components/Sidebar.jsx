import React from 'react';
import Logo from '../../../Components/common/Logo';

const Sidebar = ({ isOpen, onClose, navLinks, activeNav, setActiveNav, navigate }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-[280px] bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-out border-r border-gray-100 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-indigo-50/50 to-white">
          <div className="flex items-center gap-2.5">
            <Logo textColor="text-slate-900" size={32} />
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
          <div className="px-3 mb-2">
            <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-gray-400">Navigation</span>
          </div>
          
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                if (link.name === 'My Items') navigate('/myitems');
                else if (link.name === 'Orders') navigate('/orders');
                else if (link.name === 'Biddings') navigate('/bidding');
                else if (link.name === 'Messages') navigate('/massage');
                else if (link.name === 'Home') navigate('/');
                else setActiveNav(link.name);
                onClose();
              }}
              className={`w-full group relative flex items-center gap-3.5 py-3 px-4 rounded-xl text-[14.5px] transition-all duration-300
                ${activeNav === link.name 
                  ? 'bg-purple-100 text-indigo-btn font-semibold shadow-sm' 
                  : 'text-gray-600 font-medium hover:bg-indigo-50 hover:text-indigo-700'}`}
            >
              <svg 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth="2" 
                className={`w-[18px] h-[18px] transition-transform duration-300 group-hover:scale-110 ${activeNav === link.name ? 'opacity-100' : 'opacity-60'}`}
              >
                {link.icon}
              </svg>
              {link.name}
              
              {link.badge && (
                <span className={`ml-auto flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full text-[10px] font-bold text-white ${link.badge.color}`}>
                  {link.badge.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-6 border-t border-gray-100 mt-auto bg-gray-50/50">
          <button className="w-full py-2.5 text-[13px] font-bold text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors">
            Account Settings
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
