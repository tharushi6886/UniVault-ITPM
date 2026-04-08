import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip);

export default function OverviewTab({ setActiveTab, globalSearch, allAds = [], loading }) {
  const ads = allAds;
  
  const filteredAds = ads.filter((a) => {
    if (!globalSearch) return true;
    const term = globalSearch.toLowerCase();
    return (
      a.title.toLowerCase().includes(term) ||
      a.student.toLowerCase().includes(term) ||
      a.category.toLowerCase().includes(term)
    );
  });

  const recentAds = filteredAds.slice(0, 5);

  const stats = {
    total: ads.filter(a => a.status === "Active").length,
    lost: ads.filter(a => a.type === "Lost" && a.status === "Active").length,
    found: ads.filter(a => a.type === "Found" && a.status === "Active").length,
    resolved: ads.filter(a => a.status === "Resolved").length,
  };

  const expiringSoon = ads
    .filter(a => a.status === "Active" && a.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);

  const typeBadge = (type) =>
    type === "Lost"
      ? "badge-base border-red-500/20 bg-red-500/10 text-red-600"
      : "badge-base border-emerald-500/20 bg-emerald-500/10 text-emerald-600";

  if (loading) {
    return <div className="p-8 text-center text-slate-500 animate-pulse font-medium text-lg">📊 Synchronizing real-time data...</div>;
  }

  return (
    <div>
      {/* Stat cards */}
      <div className="mb-[14px] grid grid-cols-1 gap-[14px] md:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card px-5 py-[18px]">
          <div className="mb-3 flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-gradient-to-br from-indigo-600/15 to-indigo-500/10 text-[18px]">
            📋
          </div>
          <div className="text-[30px] font-bold leading-none text-indigo-950 font-clash">{stats.total}</div>
          <div className="mt-1 text-[12px] font-medium text-slate-500">Total Active Ads</div>
          <span className="mt-2 inline-block rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-600">
            Real-time Status
          </span>
        </div>

        <div className="glass-card px-5 py-[18px]">
          <div className="mb-3 flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-gradient-to-br from-red-500/15 to-red-400/10 text-[18px]">
            🔴
          </div>
          <div className="text-[30px] font-bold leading-none text-indigo-950 font-clash">{stats.lost}</div>
          <div className="mt-1 text-[12px] font-medium text-slate-500">Lost Item Reports</div>
          <span className="mt-2 inline-block rounded-full bg-red-500/10 px-2 py-1 text-[11px] font-bold text-red-600">
            Waiting for Recovery
          </span>
        </div>

        <div className="glass-card px-5 py-[18px]">
          <div className="mb-3 flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-gradient-to-br from-emerald-500/15 to-emerald-400/10 text-[18px]">
            🟢
          </div>
          <div className="text-[30px] font-bold leading-none text-indigo-950 font-clash">{stats.found}</div>
          <div className="mt-1 text-[12px] font-medium text-slate-500">Found Item Posts</div>
          <span className="mt-2 inline-block rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-bold text-emerald-600">
            Awaiting Claims
          </span>
        </div>

        <div className="glass-card px-5 py-[18px]">
          <div className="mb-3 flex h-[42px] w-[42px] items-center justify-center rounded-[13px] bg-gradient-to-br from-amber-500/15 to-amber-400/10 text-[18px]">
            ✅
          </div>
          <div className="text-[30px] font-bold leading-none text-indigo-950 font-clash">{stats.resolved}</div>
          <div className="mt-1 text-[12px] font-medium text-slate-500">Resolved / Archived</div>
          <span className="mt-2 inline-block rounded-full bg-slate-500/10 px-2 py-1 text-[11px] font-bold text-slate-600">
            Successfully Closed
          </span>
        </div>
      </div>

      {/* Two-column: chart + recent activity */}
      <div className="mb-[14px] grid grid-cols-1 gap-[14px] lg:grid-cols-[1fr_340px]">
        {/* Weekly chart */}
        <div className="glass-card p-[20px]">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <div className="text-[14.5px] font-bold text-indigo-950">📈 Weekly Progression</div>
              <div className="mt-0.5 text-[11px] text-slate-500">Activity trend over time (Mock Trend)</div>
            </div>
          </div>
          <div className="relative mt-[10px] h-[200px]">
            <Line
              data={{
                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                datasets: [
                  {
                    label: 'Activity',
                    data: [3, 5, 2, 7, 4, 6, 8],
                    borderColor: "#4f46e5",
                    backgroundColor: "#fff",
                    borderWidth: 2,
                    pointBorderWidth: 2,
                    pointBackgroundColor: "#fff",
                    pointRadius: 4,
                    tension: 0.4,
                  }
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, border: { display: false }, ticks: { color: "#94a3b8", font: { size: 10 } } },
                  y: { grid: { color: "#f1f5f9" }, border: { display: false }, ticks: { color: "#94a3b8", font: { size: 10 }, stepSize: 2 } },
                },
              }}
            />
          </div>
        </div>

        {/* Mini stats + expiry alert */}
        <div className="flex flex-col gap-[14px]">
          {/* Donut */}
          <div className="glass-card p-[20px]">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="text-[14.5px] font-bold text-indigo-950">🍩 Status Breakdown</div>
              </div>
            </div>
            <div className="relative mt-[10px] h-[150px]">
              <Doughnut
                data={{
                  labels: ["Lost", "Found", "Resolved"],
                  datasets: [
                    {
                      data: [stats.lost, stats.found, stats.resolved],
                      backgroundColor: ["#4f46e5", "#10b981", "#cbd5e1"],
                      borderWidth: 0,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  cutout: "75%",
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true },
                  },
                }}
              />
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-[20px] font-bold leading-none text-indigo-950 font-clash">{ads.length}</div>
                <div className="text-[10px] font-medium text-slate-400">Total Items</div>
              </div>
            </div>
          </div>

          {/* Expiry alert card */}
          <div className="glass-card border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-amber-400/5 p-[20px]">
            <div className="mb-2 flex items-start justify-between">
              <div>
                <div className="text-[14.5px] font-bold text-amber-800">⏰ Expiring Soon</div>
              </div>
              <button className="rounded-[11px] border border-amber-500/30 bg-amber-100/50 px-3 py-1 text-[11.5px] font-semibold text-amber-700 transition hover:bg-amber-100/80" onClick={() => setActiveTab("ads")}>
                View All
              </button>
            </div>
            <div className="flex flex-col gap-[7px]">
              {expiringSoon.length > 0 ? expiringSoon.map(a => (
                <div key={a.id} className="flex items-center justify-between text-[12.5px]">
                  <span className="font-semibold text-indigo-950 truncate max-w-[140px]">{a.title}</span>
                  <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2 py-[2px] text-[10.5px] font-bold text-amber-600">{a.daysLeft} days</span>
                </div>
              )) : (
                <div className="text-[12px] text-amber-600 font-medium">No items expiring soon.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent ads table preview */}
      <div className="glass-card p-[20px]">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-[14.5px] font-bold text-indigo-950">📋 Recent Advertisements</div>
            <div className="mt-0.5 text-[11px] text-slate-500">Latest active posts from the system</div>
          </div>
          <button className="rounded-[11px] border border-indigo-300/30 bg-indigo-50/50 px-3 py-1.5 text-[12.5px] font-semibold text-indigo-600 transition hover:bg-indigo-100/50" onClick={() => setActiveTab("ads")}>
            View All &rarr;
          </button>
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
              </tr>
            </thead>
            <tbody>
              {recentAds.map((a) => (
                <tr key={a.id} className="border-b border-indigo-300/10 text-[13px] hover:bg-indigo-500/[0.03] transition">
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-4">
                      <img src={a.img} alt={a.title} className="h-12 w-12 rounded-[12px] border border-indigo-300/20 object-cover shadow-sm" />
                      <div>
                        <div className="text-[14px] font-bold text-indigo-950">{a.title}</div>
                        <div className="mt-[2px] flex items-center gap-1 text-[11px] font-medium text-slate-500">
                          <span className="text-red-400">📍</span> {a.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <div className="text-[13.5px] font-bold text-indigo-950">{a.student}</div>
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
                    <div className="flex w-[80px] flex-col gap-1.5">
                      <span className={`inline-flex w-fit items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${a.daysLeft <= 2 ? 'border-red-500/20 bg-red-500/10 text-red-600' :
                          a.daysLeft <= 7 ? 'border-amber-500/20 bg-amber-500/10 text-amber-600' :
                            'border-emerald-500/20 bg-emerald-500/10 text-emerald-600'
                        }`}>
                        {a.daysLeft}D LEFT
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}