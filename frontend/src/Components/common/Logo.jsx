import React from 'react';

const Logo = ({ showText = true, className = "", textColor = "text-white dark:text-slate-900", size = 42 }) => {
  return (
    <div className={`flex items-center gap-3.5 group cursor-pointer ${className}`}>
      {/* Premium SVG Icon Container */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-[5deg] drop-shadow-[0_10px_20px_rgba(74,95,232,0.35)]"
        >
          {/* Main Shield / Vault Outer Body */}
          <path 
            d="M50 6L15 22V48C15 68 30 86 50 94C70 86 85 68 85 48V22L50 6Z" 
            fill="url(#logo_grad_main)" 
          />
          
          {/* Graduation Cap Plate */}
          <path 
            d="M50 24L20 38L50 52L80 38L50 24Z" 
            fill="white" 
            fillOpacity="0.95"
            className="drop-shadow-sm"
          />
          
          {/* Graduation Cap Base */}
          <path 
            d="M30 43V58C30 58 40 64 50 64C60 64 70 58 70 58V43L50 52L30 43Z" 
            fill="white" 
            fillOpacity="0.85"
          />
          
          {/* Tassel Detail */}
          <path 
            d="M80 38V54" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round"
            strokeOpacity="0.8"
          />
          
          {/* Vault Keyhole / Central Focus */}
          <circle 
            cx="50" 
            cy="42" 
            r="4" 
            fill="url(#logo_grad_accent)" 
            className="animate-pulse"
            style={{ animationDuration: '3s' }}
          />

          <defs>
            <linearGradient id="logo_grad_main" x1="15" y1="6" x2="85" y2="94" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A5FE8" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="logo_grad_accent" x1="46" y1="38" x2="54" y2="46" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00D9FF" />
              <stop offset="1" stopColor="#4A5FE8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`text-[22px] font-black tracking-tight font-epilogue ${textColor} transition-colors group-hover:text-indigo-500`}>
            Uni<span className="text-indigo-500 group-hover:text-cyan-400 transition-colors">Vault</span>
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400/80">Secure Campus</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
