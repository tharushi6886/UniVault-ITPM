import React from 'react';
import { useNavigate } from 'react-router-dom';

const overviewItems = [
  {
    key: "overview",
    label: "Dashboard",
    badge: null,
    badgeColor: "",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    )
  },
  {
    key: "ads",
    label: "All Advertisements",
    badge: "24",
    badgeColor: "blue",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    )
  },
  {
    key: "notifications",
    label: "Notifications Sent",
    badge: "3",
    badgeColor: "red",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    )
  }
];

const managementItems = [
  {
    key: "messages",
    label: "Student Messages",
    badge: "5",
    badgeColor: "red",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    key: "students",
    label: "Students",
    badge: null,
    badgeColor: "",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )
  },
  {
    key: "reports",
    label: "Reports & Analytics",
    badge: null,
    badgeColor: "",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  },
  {
    key: "settings",
    label: "Settings",
    badge: null,
    badgeColor: "",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  }
];

export default function Sidebar({ activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session if applicable
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    // Redirect to homepage
    navigate("/");
  };

  const getBadgeColor = (color) => {
    if (color === "red") return "bg-gradient-to-br from-red-500 to-red-600";
    if (color === "blue") return "bg-gradient-to-br from-indigo-600 to-indigo-500";
    if (color === "amber") return "bg-gradient-to-br from-amber-500 to-amber-600";
    return "";
  };

  const NavItem = ({ item }) => {
    const isActive = activeTab === item.key;
    return (
      <button
        onClick={() => setActiveTab(item.key)}
        className={`group relative mb-[2px] flex w-full items-center gap-[10px] rounded-[11px] px-[11px] py-[9px] text-left text-[13px] font-medium transition-all duration-200 decoration-none ${isActive
            ? "border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 to-indigo-500/5 font-semibold text-indigo-600"
            : "text-slate-500 hover:bg-indigo-500/10 hover:text-indigo-600"
          }`}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 h-[22px] w-[3px] -translate-y-1/2 rounded-r-[3px] bg-gradient-to-b from-indigo-600 to-indigo-500" />
        )}

        <span
          className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[8px] transition-all duration-200 ${isActive
              ? "bg-indigo-100 text-indigo-700"
              : "bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-700"
            }`}
        >
          {item.icon}
        </span>

        <span>{item.label}</span>

        {item.badge && (
          <span className={`ml-auto rounded-full px-[7px] py-[2px] text-[10px] font-bold text-white ${getBadgeColor(item.badgeColor)}`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-[300] hidden w-[260px] flex-col border-r-[1.5px] border-indigo-300/20 bg-white/90 shadow-[4px_0_36px_rgba(79,70,229,0.07)] backdrop-blur-[28px] lg:flex">
      <div className="flex items-center gap-[10px] border-b border-indigo-300/20 px-[18px] pb-[16px] pt-[20px]">
        <div className="flex h-[36px] w-[36px] items-center justify-center rounded-[10px] bg-gradient-to-br from-indigo-600 to-cyan-500 text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <span className="text-[18px] font-bold text-indigo-950">UniVault</span>
        <span className="ml-auto rounded-[6px] bg-gradient-to-br from-red-600 to-red-500 px-2 py-[3px] text-[9px] font-extrabold uppercase tracking-[0.06em] text-white">
          Admin
        </span>
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto px-[10px] py-[14px]">
        <div className="mt-1 px-[10px] pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-400">
          Overview
        </div>
        {overviewItems.map((item) => (
          <NavItem key={item.key} item={item} />
        ))}

        <div className="mt-4 px-[10px] pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-indigo-400">
          Management
        </div>
        {managementItems.map((item) => (
          <NavItem key={item.key} item={item} />
        ))}
      </div>

      <div className="flex items-center gap-[10px] border-t border-indigo-300/20 px-[14px] py-[13px]">
        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-400 text-[12px] font-bold text-white shadow-[0_3px_10px_rgba(220,38,38,0.3)]">
          AD
        </div>
        <div>
          <div className="text-[12.5px] font-semibold text-indigo-950">Admin User</div>
          <div className="text-[10.5px] text-slate-500">System Administrator</div>
        </div>
        <button 
          onClick={handleLogout}
          className="ml-auto flex items-center justify-center rounded-[8px] p-[6px] text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer group"
          title="Logout"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-[2px]" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}