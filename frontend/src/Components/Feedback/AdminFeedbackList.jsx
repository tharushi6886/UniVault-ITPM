import React, { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "univault_feedback";

const StarDisplay = ({ value }) => (
  <span className="text-sm">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= value ? "text-amber-400" : "text-gray-200"}>
        ★
      </span>
    ))}
  </span>
);

const AdminFeedbackList = () => {
  const [entries, setEntries] = useState([]);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setEntries(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markStatus = (id, status) => {
    const updated = entries.map((e) => (e.id === id ? { ...e, status } : e));
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteEntry = (id) => {
    if (!window.confirm("Delete this entry?")) return;
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (expandedId === id) setExpandedId(null);
  };

  const filtered = entries.filter((e) => {
    const matchType = filter === "all" || e.type === filter;
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    return matchType && matchStatus;
  });

  const counts = {
    all: entries.length,
    feedback: entries.filter((e) => e.type === "feedback").length,
    complaint: entries.filter((e) => e.type === "complaint").length,
    unread: entries.filter((e) => e.status === "unread").length,
    resolved: entries.filter((e) => e.status === "resolved").length,
  };

  const avgRating =
    entries.filter((e) => e.type === "feedback" && e.rating).length > 0
      ? (
          entries
            .filter((e) => e.type === "feedback" && e.rating)
            .reduce((acc, e) => acc + e.rating, 0) /
          entries.filter((e) => e.type === "feedback" && e.rating).length
        ).toFixed(1)
      : "—";

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(196,181,253,0.3),transparent)] font-epilogue text-text">
      {/* Header */}
      <div className="bg-[#f0eeff]/95 shadow-[0_4px_32px_rgba(79,70,229,0.1)] border-b border-[#818cf8]/20 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-i2 to-cyan-500 flex items-center justify-center text-base shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
            💬
          </div>
          <span className="text-xl font-bold text-text tracking-[-0.02em] font-clash">
            UniVault
          </span>
          <span className="text-muted text-sm font-epilogue ml-2 hidden sm:block">
            / Admin Panel
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Title + stats */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-text font-clash tracking-tight mb-1">
              Feedback &amp; Complaints
            </h2>
            <p className="text-muted text-sm">
              Review and manage user submissions.
            </p>
          </div>

          {/* Stat cards */}
          <div className="flex flex-wrap gap-3">
            {[
              { label: "Total", value: counts.all, color: "bg-[#eef2ff] text-i2 border-[#818cf8]/30" },
              { label: "Feedback", value: counts.feedback, color: "bg-amber-50 text-amber-600 border-amber-200", icon: "⭐" },
              { label: "Complaints", value: counts.complaint, color: "bg-red-50 text-red-500 border-red-200", icon: "🚨" },
              { label: "Unread", value: counts.unread, color: "bg-purple-50 text-purple-600 border-purple-200", icon: "🔔" },
              { label: "Avg Rating", value: avgRating, color: "bg-emerald-50 text-emerald-600 border-emerald-200", icon: "★" },
            ].map(({ label, value, color, icon }) => (
              <div
                key={label}
                className={`text-xs font-semibold font-epilogue px-3 py-2 rounded-xl border flex items-center gap-1.5 ${color}`}
              >
                {icon && <span>{icon}</span>}
                <span className="text-base font-bold font-clash">{value}</span>
                <span className="text-xs font-normal opacity-70">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Type filter */}
          <div className="flex gap-1.5 bg-white/70 border border-[#818cf8]/20 rounded-xl p-1">
            {["all", "feedback", "complaint"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium font-epilogue transition-all duration-200 ${
                  filter === t
                    ? "bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white shadow-[0_2px_8px_rgba(79,70,229,0.3)]"
                    : "text-gray-500 hover:text-text"
                }`}
              >
                {t === "all" ? "All Types" : t === "feedback" ? "⭐ Feedback" : "🚨 Complaints"}
                <span className="ml-1 opacity-60">({t === "all" ? counts.all : counts[t]})</span>
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex gap-1.5 bg-white/70 border border-[#818cf8]/20 rounded-xl p-1">
            {["all", "unread", "read", "resolved"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium font-epilogue transition-all duration-200 capitalize ${
                  statusFilter === s
                    ? "bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white shadow-[0_2px_8px_rgba(79,70,229,0.3)]"
                    : "text-gray-500 hover:text-text"
                }`}
              >
                {s === "all" ? "All Status" : s}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-text font-clash font-semibold text-lg mb-1">No submissions yet</p>
            <p className="text-muted text-sm">Entries will appear here once users submit feedback or complaints.</p>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {filtered.map((entry) => {
            const isExpanded = expandedId === entry.id;
            const isComplaint = entry.type === "complaint";
            const statusColor = {
              unread: "bg-purple-100 text-purple-700 border-purple-200",
              read: "bg-gray-100 text-gray-600 border-gray-200",
              resolved: "bg-emerald-100 text-emerald-700 border-emerald-200",
            }[entry.status] || "bg-gray-100 text-gray-600 border-gray-200";

            return (
              <div
                key={entry.id}
                className={`bg-white/85 backdrop-blur-md border rounded-2xl shadow-[0_4px_20px_rgba(79,70,229,0.06)] transition-all duration-300 overflow-hidden ${
                  entry.status === "unread"
                    ? "border-[#818cf8]/40"
                    : "border-white/95"
                }`}
              >
                {/* Row */}
                <div
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#eef2ff]/20 transition-colors"
                  onClick={() => {
                    setExpandedId(isExpanded ? null : entry.id);
                    if (entry.status === "unread") markStatus(entry.id, "read");
                  }}
                >
                  {/* Type icon */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                      isComplaint
                        ? "bg-red-50 border border-red-200"
                        : "bg-amber-50 border border-amber-200"
                    }`}
                  >
                    {isComplaint ? "🚨" : "⭐"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-text font-clash truncate">
                        {entry.subject}
                      </p>
                      {entry.status === "unread" && (
                        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted font-epilogue">{entry.name}</span>
                      <span className="text-xs text-muted font-epilogue">{entry.category}</span>
                      {entry.rating && <StarDisplay value={entry.rating} />}
                      <span className="text-xs text-muted font-epilogue">
                        {new Date(entry.createdAt).toLocaleDateString("en-US", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Status badge + actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-medium font-epilogue px-2.5 py-1 rounded-full border capitalize ${statusColor}`}>
                      {entry.status}
                    </span>
                    <span className={`text-muted text-sm transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-6 pb-5 border-t border-[#818cf8]/10">
                    <div className="pt-4 space-y-4">
                      {/* Email */}
                      <div className="flex items-center gap-2 text-sm font-epilogue text-muted">
                        <span>✉️</span>
                        <a href={`mailto:${entry.email}`} className="text-i2 hover:underline">
                          {entry.email}
                        </a>
                      </div>

                      {/* Message */}
                      <div className="bg-[#f8f9ff] border border-[#818cf8]/20 rounded-xl px-4 py-3">
                        <p className="text-sm font-epilogue text-text leading-relaxed whitespace-pre-wrap">
                          {entry.message}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {entry.status !== "resolved" && (
                          <button
                            onClick={() => markStatus(entry.id, "resolved")}
                            className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-semibold font-epilogue px-4 py-2 rounded-xl shadow-[0_2px_10px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_14px_rgba(16,185,129,0.45)] hover:-translate-y-[1px] transition-all duration-200"
                          >
                            ✓ Mark Resolved
                          </button>
                        )}
                        {entry.status === "resolved" && (
                          <button
                            onClick={() => markStatus(entry.id, "read")}
                            className="bg-white border border-[#818cf8]/30 text-gray-600 text-xs font-semibold font-epilogue px-4 py-2 rounded-xl hover:border-i3 hover:text-i2 transition-all duration-200"
                          >
                            ↩ Reopen
                          </button>
                        )}
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="bg-red-50 border border-red-200 text-red-500 text-xs font-semibold font-epilogue px-4 py-2 rounded-xl hover:bg-red-100 transition-all duration-200"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedbackList;
