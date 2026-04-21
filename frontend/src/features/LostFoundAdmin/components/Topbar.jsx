const TAB_TITLES = {
  overview: "Dashboard Overview",
  ads: "All Advertisements",
  expiring: "Expiring Soon",
  notifications: "Notifications",
  archived: "Archived Posts",
};

export default function Topbar({ activeTab, setActiveTab, globalSearch, setGlobalSearch }) {
  return (
    <div className="fixed left-0 right-0 top-0 z-[200] flex h-[70px] items-center justify-between border-b border-indigo-300/20 bg-white/80 px-4 shadow-[0_2px_20px_rgba(79,70,229,0.06)] backdrop-blur-[24px] lg:left-[260px] lg:px-6">
      <div>
        <div className="text-[20px] font-bold text-indigo-950">
          {TAB_TITLES[activeTab] || "Admin Panel"}
        </div>
        <div className="mt-0.5 text-[12px] text-slate-500 line-clamp-1">
          Monday, 23 March 2026 · UniVault Admin Panel
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Updated Search Bar */}
        <div className="hidden items-center gap-2 rounded-full border border-indigo-300/40 bg-slate-50/80 px-4 py-2.5 transition-all focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-[0_4px_12px_rgba(79,70,229,0.08)] md:flex w-[260px] md:w-[320px] lg:w-[420px]">
          <span className="text-slate-400 text-[14px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
            </svg>
          </span>
          <input
            value={globalSearch || ""}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search ads, students..."
            className="w-full bg-transparent text-[13.5px] text-indigo-950 outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          onClick={() => setActiveTab("notifications")}
          className="relative flex h-9 w-9 items-center justify-center rounded-[10px] border border-indigo-300/25 bg-slate-100/90 text-[15px] transition hover:border-indigo-400 hover:bg-indigo-100"
        >
          🔔
          <span className="pulse-soft absolute right-1.5 top-1.5 h-[7px] w-[7px] rounded-full border border-white bg-red-500" />
        </button>

        

        <div className="hidden items-center gap-2 rounded-[11px] border border-indigo-500/20 bg-gradient-to-br from-indigo-600/10 to-indigo-500/5 px-3 py-2 text-[12px] font-bold text-indigo-600 md:flex">
          <span className="h-[7px] w-[7px] rounded-full bg-emerald-500 shadow-[0_0_6px_#22c55e]" />
          Admin Online
        </div>
      </div>
    </div>
  );
}