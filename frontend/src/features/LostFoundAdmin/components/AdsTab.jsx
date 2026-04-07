import React from "react";
const typeBadge = (type) =>
  type === "Lost"
    ? "badge-base border-red-500/20 bg-red-500/10 text-red-600"
    : "badge-base border-emerald-500/20 bg-emerald-500/10 text-emerald-600";

export default function AdsTab({
  allAds = [],
  loading,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  openArchiveModal,
  openNotifyModal,
  globalSearch,
}) {
  const filtered = allAds.filter((a) => {
    const term = (globalSearch || "").toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(term) ||
      a.student.toLowerCase().includes(term) ||
      a.category.toLowerCase().includes(term);

    const typeMatch = filterType === "all" || a.type === filterType;
    const mappedStatus = a.daysLeft <= 7 ? "Expiring" : a.status;
    const statusMatch = filterStatus === "all" || (filterStatus === "Expiring" ? mappedStatus === "Expiring" : a.status === filterStatus);

    return typeMatch && statusMatch && matchesSearch;
  });

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse font-medium text-lg">📁 Loading items from database...</div>;
  }

  return (
    <div className="glass-card p-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-[14.5px] font-bold text-indigo-950">📋 All Advertisements</div>
          <div className="mt-0.5 text-[11px] text-slate-500">Manage every post from the system - Live Data</div>
        </div>

        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-[9px] border border-indigo-300/30 bg-slate-50/90 px-3 py-2 text-[12.5px] text-indigo-950 outline-none"
          >
            <option value="all">All Types</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-[9px] border border-indigo-300/30 bg-slate-50/90 px-3 py-2 text-[12.5px] text-indigo-950 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Expiring">Expiring</option>
            <option value="Resolved">Resolved</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-indigo-300/20 text-left text-[10.5px] uppercase tracking-[0.1em] text-slate-400">
              <th className="px-3 py-3">Item</th>
              <th className="px-3 py-3">Student</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Expiry</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-indigo-300/10 text-[13px] hover:bg-indigo-500/[0.03] transition">
                <td className="px-3 py-4">
                  <div className="flex items-center gap-4">
                    <img src={a.img} alt={a.title} className="h-12 w-12 rounded-[12px] border border-indigo-300/20 object-cover shadow-sm" />
                    <div>
                      <div className="font-bold text-[14px] text-indigo-950">{a.title}</div>
                      <div className="mt-[2px] text-[11px] font-medium text-slate-500 flex items-center gap-1">
                        <span className="text-red-400">📍</span> {a.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <div className="font-bold text-[13.5px] text-indigo-950">{a.student}</div>
                  <div className="mt-[2px] text-[11px] text-slate-500">ID: {a.studentId}</div>
                </td>
                <td className="px-3 py-4">
                  <span className={typeBadge(a.type)}>{a.type.toUpperCase()}</span>
                </td>
                <td className="px-3 py-4">
                  <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider ${a.status === 'Active' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600' : 'border-indigo-500/20 bg-indigo-500/10 text-indigo-600'}`}>
                    {a.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <div className="flex flex-col gap-1.5 w-[90px]">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${a.daysLeft <= 3 ? 'bg-red-500 w-[90%]' :
                            a.daysLeft <= 7 ? 'bg-amber-500 w-[60%]' :
                              'bg-emerald-500 w-[30%]'
                          }`}
                      />
                    </div>
                    <span className={`inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${a.daysLeft <= 3 ? 'border-red-500/30 bg-red-500/10 text-red-600 shadow-[0_0_8px_rgba(239,68,68,0.1)]' :
                        a.daysLeft <= 7 ? 'border-amber-500/30 bg-amber-500/10 text-amber-600' :
                          'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                      }`}>
                      {a.daysLeft}D LEFT
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {a.status === "Active" && (
                      <button className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 text-[11.5px] font-bold text-emerald-600 transition hover:bg-emerald-500/20 flex items-center gap-1.5 focus:scale-95" onClick={() => openArchiveModal(a.title, a.student, "found", a)}>
                        <span>✓</span> Found
                      </button>
                    )}
                    <button className="rounded-md border border-amber-500/30 bg-amber-50/80 px-2.5 py-1.5 text-[11.5px] font-bold text-amber-600 shadow-sm transition hover:bg-amber-100 flex items-center gap-1.5 focus:scale-95" onClick={() => openNotifyModal(a.student, a)}>
                      <span>🔔</span> Notify
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}