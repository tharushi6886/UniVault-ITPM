import React from "react";

export default function ExpiringTab({ allAds = [], loading, openNotifyModal, globalSearch }) {
  const expiring = allAds.filter((a) => {
    const term = (globalSearch || "").toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(term) ||
      a.student.toLowerCase().includes(term);
    return a.status === "Active" && matchesSearch;
  }).sort((a, b) => a.daysLeft - b.daysLeft);

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse font-medium text-lg">⏰ Checking expiration dates...</div>;
  }

  return (
    <div className="glass-card border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-white/80 p-4">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-[14.5px] font-bold text-amber-800">⏰ Expiry Management</div>
          <div className="mt-0.5 text-[11px] text-slate-500">
            View all active ads and their remaining time before they go offline.
          </div>
        </div>

        <button className="btn-warn" onClick={() => openNotifyModal()}>
          📧 Notify All Students
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-indigo-300/20 text-left text-[10.5px] uppercase tracking-[0.1em] text-slate-400">
              <th className="px-3 py-3">Item</th>
              <th className="px-3 py-3">Student</th>
              <th className="px-3 py-3">Contact</th>
              <th className="px-3 py-3">Days Left</th>
              <th className="px-3 py-3">Urgency</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expiring.length > 0 ? expiring.map((a) => (
              <tr key={a.id} className="border-b border-indigo-300/10 text-[13px] hover:bg-slate-50/50 transition">
                <td className="px-3 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[12px] border border-indigo-300/20 shadow-sm relative">
                      <img src={a.img} alt={a.title} className="h-full w-full object-cover" />
                    </div>
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
                <td className="px-3 py-4 text-slate-600 font-medium">{a.phone}</td>
                <td className="px-3 py-4">
                  <div className="flex flex-col items-start w-fit">
                    <span className={`text-[18px] font-bold leading-none tracking-tight ${a.daysLeft <= 2 ? 'text-red-500' : 'text-amber-500'}`}>
                      {a.daysLeft}d
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      remaining
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <div className="flex flex-col gap-1.5 w-[80px]">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${a.daysLeft <= 2 ? 'bg-red-500 w-[90%]' :
                            a.daysLeft <= 5 ? 'bg-amber-500 w-[60%]' :
                              'bg-emerald-500 w-[30%]'
                          }`}
                      />
                    </div>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider ${a.daysLeft <= 2 ? 'text-red-600' :
                        a.daysLeft <= 5 ? 'text-amber-600' :
                          'text-emerald-500'
                      }`}>
                      {a.daysLeft <= 2 ? "🚨 Critical" : a.daysLeft <= 5 ? "⚠️ Warning" : "ℹ️ Notice"}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button className="rounded-md border border-amber-500/30 bg-amber-50/80 px-2.5 py-1.5 text-[11.5px] font-bold text-amber-600 shadow-sm transition hover:bg-amber-100 flex items-center gap-1.5 focus:scale-95" onClick={() => alert(`Notification sent to ${a.phone}`)}>
                      <span>🔔</span> Notify
                    </button>
                    <button className="rounded-md border border-indigo-400/30 bg-indigo-50 px-2.5 py-1.5 text-[11.5px] font-bold text-indigo-600 shadow-sm transition hover:bg-indigo-100 flex items-center gap-1.5 focus:scale-95" onClick={() => alert("Extension request simulated.")}>
                      <span>📅</span> Extend
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-400 font-medium italic text-sm">
                  No active ads found with expiration tracking.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}