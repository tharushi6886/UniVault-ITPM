import { ARCHIVED } from "../../../data/adminMockData";

export default function ArchivedTab({ globalSearch }) {
  const filtered = ARCHIVED.filter((a) => {
    const term = (globalSearch || "").toLowerCase();
    return (
      a.title.toLowerCase().includes(term) ||
      a.student.toLowerCase().includes(term) ||
      a.reason.toLowerCase().includes(term)
    );
  });

  return (
    <div className="glass-card p-4">
      <div className="mb-4">
        <div className="text-[14.5px] font-bold text-indigo-950">🗃️ Archived Posts</div>
        <div className="mt-0.5 text-[11px] text-slate-500">
          Items marked as found, returned, or expired
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-indigo-300/20 text-left text-[10.5px] uppercase tracking-[0.1em] text-slate-400">
              <th className="px-3 py-3">Item</th>
              <th className="px-3 py-3">Student</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Reason</th>
              <th className="px-3 py-3">Archived On</th>
              <th className="px-3 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a, idx) => (
              <tr key={idx} className="border-b border-indigo-300/10 text-[13px] hover:bg-indigo-500/[0.03] transition">
                <td className="px-3 py-4">
                  <div className="flex items-center gap-4">
                    <img src={a.img} alt={a.title} className="h-12 w-12 rounded-[12px] border border-indigo-300/20 object-cover shadow-sm" />
                    <div className="font-bold text-[14px] text-indigo-950">{a.title}</div>
                  </div>
                </td>
                <td className="px-3 py-4">
                  <div className="font-bold text-[13.5px] text-indigo-950">{a.student}</div>
                </td>
                <td className="px-3 py-4">
                  <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                    a.type === 'Found' ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600' : 'border-red-500/20 bg-red-500/10 text-red-600'
                  }`}>
                    {a.type.toUpperCase()}
                  </span>
                </td>
                <td className="px-3 py-4 text-slate-600 font-medium">{a.reason}</td>
                <td className="px-3 py-4 text-slate-500 font-medium">{a.date}</td>
                <td className="px-3 py-4">
                  <button className="rounded-md border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[11.5px] font-bold text-indigo-600 transition hover:bg-indigo-500/20 flex items-center gap-1.5 focus:scale-95">
                    <span className="text-[14px]">↩</span> Restore
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
