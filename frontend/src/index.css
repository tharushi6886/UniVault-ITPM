@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Epilogue:wght@400;500;600&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');

:root {
  --color-border-tertiary: #e9e7ff;
  --color-text-tertiary: #6b7280;
  
  /* Alert Banner */
  --color-alert-bg: #FAEEDA;
  --color-alert-border: #FAC775;
  --color-alert-text: #633806;

  /* Anti-Gravity Tokens */
  --ag-bg-soft: #F0F9FF;
  --ag-bg-gradient: linear-gradient(180deg, #F0F9FF 0%, #E6F2FF 100%);
  --ag-card-primary: #FFFFFF;
  --ag-card-secondary: #F8FAFC;
  --ag-shadow-soft: 0 10px 30px rgba(30, 58, 138, 0.04);
  --ag-border: 1px solid rgba(0, 0, 0, 0.05);

  /* Chart Colors */
  --chart-lost: #534AB7;
  --chart-found: #1D9E75;
  --chart-market: #378ADD;
  --chart-bids: #BA7517;
  --chart-admins: #534AB7;
  --chart-students: #1D9E75;
  --chart-blocked: #E24B4A;
}

@layer utilities {
    .nav-link.active {
        @apply bg-purple-100 text-indigo-btn font-semibold;
    }
    .nav-link.active svg {
        @apply opacity-100;
    }
    .nav-link:hover {
        @apply bg-purple-50 text-indigo-btn;
    }

    /* Dashboard Utility Classes */
    .glass-card {
        @apply bg-white/80 backdrop-blur-xl border border-white/20 shadow-xl rounded-3xl transition-all duration-300;
    }

    .badge-base {
        @apply px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm;
    }

    .tab-btn {
        @apply px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 border-2 border-transparent;
    }

    .tab-btn-active {
        @apply bg-indigo-600 text-white shadow-lg shadow-indigo-200 border-indigo-600 scale-[1.02];
    }

    .btn-primary {
        @apply px-5 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-md shadow-indigo-100;
    }

    .btn-success {
        @apply px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-600 transition-all shadow-sm;
    }

    .btn-danger {
        @apply px-4 py-2 bg-rose-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-rose-600 transition-all shadow-sm;
    }

    .btn-warn {
        @apply px-4 py-2 bg-amber-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-amber-600 transition-all shadow-sm;
    }

    .pulse-soft {
        @apply relative after:content-[''] after:absolute after:-top-1 after:-right-1 after:w-3 after:h-3 after:bg-rose-500 after:rounded-full after:animate-badgePulse;
    }

    .pulse::after {
        content: '';
        @apply absolute -top-[3px] -right-[3px] w-[calc(100%+6px)] h-[calc(100%+6px)] rounded-full border-2 border-current opacity-50 animate-badgeRing;
    }

    /* Anti-Gravity Core Utilities */
    .ag-bg-soft {
        background-color: var(--ag-bg-soft);
    }
    .ag-bg-gradient {
        background: var(--ag-bg-gradient);
    }
    .ag-card {
        @apply bg-white border border-slate-100/50 shadow-[0_10px_30px_rgba(30,58,138,0.04)] rounded-[2rem] transition-all duration-300;
        border: var(--ag-border);
    }
    .ag-card-secondary {
        background-color: var(--ag-card-secondary);
        @apply border border-slate-100 shadow-sm rounded-2xl;
    }
    .ag-hover-lift {
        @apply transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/5;
    }
    .ag-fade-in {
        @apply animate-fade-in-up;
    }
    .ag-glow-indigo {
        filter: drop-shadow(0 0 8px rgba(79, 70, 229, 0.2));
    }
}

@keyframes badgeRing {
    0% { transform: scale(1); opacity: 0.5; }
    100% { transform: scale(1.1); opacity: 0; }
}

@keyframes badgePulse {
    0% { transform: scale(0.9); opacity: 1; }
    70% { transform: scale(1.5); opacity: 0; }
    100% { transform: scale(0.9); opacity: 0; }
}

@keyframes soft-pulse {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0.4); }
    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(79, 70, 229, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(79, 70, 229, 0); }
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}