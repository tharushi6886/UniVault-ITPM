import React, { useEffect, useState } from "react";
import Navbar from "../../homepage/components/Navbar";
import { getAllComplaints } from "../../../api/complaintApi";
import { toast } from "react-toastify";

const statusStyles = {
  open: "bg-amber-50 text-amber-700 border-amber-100",
  under_review: "bg-blue-50 text-blue-700 border-blue-100",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  dismissed: "bg-rose-50 text-rose-700 border-rose-100",
};

const formatLabel = (value = "") => value.replace(/_/g, " ");

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await getAllComplaints(token, {
          status: statusFilter,
          category: categoryFilter,
        });
        setComplaints(res.data.complaints || []);
      } catch (error) {
        console.error("Admin complaints fetch error:", error);
        toast.error("Failed to load complaint records");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  const counts = complaints.reduce(
    (acc, complaint) => {
      acc.total += 1;
      acc[complaint.status] = (acc[complaint.status] || 0) + 1;
      return acc;
    },
    { total: 0 }
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 pt-24 px-4 md:px-8 pb-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Moderation Console</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">Complaint Registry</h1>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                Review incoming complaints, inspect escalation status, and follow the threaded response history.
              </p>
            </div>

            <a
              href="/admin/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-colors w-fit"
            >
              Back to Dashboard
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <div className="rounded-3xl bg-white border border-slate-100 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loaded</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{counts.total}</p>
            </div>
            <div className="rounded-3xl bg-white border border-amber-100 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Open</p>
              <p className="mt-2 text-3xl font-black text-amber-700">{counts.open || 0}</p>
            </div>
            <div className="rounded-3xl bg-white border border-blue-100 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Under Review</p>
              <p className="mt-2 text-3xl font-black text-blue-700">{counts.under_review || 0}</p>
            </div>
            <div className="rounded-3xl bg-white border border-emerald-100 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Resolved</p>
              <p className="mt-2 text-3xl font-black text-emerald-700">{counts.resolved || 0}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="all">All statuses</option>
              <option value="open">Open</option>
              <option value="under_review">Under review</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="all">All categories</option>
              <option value="marketplace">Marketplace</option>
              <option value="lost_found">Lost and Found</option>
              <option value="bidding">Bidding</option>
              <option value="general">General</option>
            </select>
          </div>

          {loading ? (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-16 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin mx-auto" />
              <p className="mt-4 text-sm font-semibold text-slate-500">Fetching complaints...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-16 text-center shadow-sm">
              <h2 className="text-xl font-black text-slate-800">No complaints found</h2>
              <p className="mt-2 text-sm text-slate-500">
                There are no records for the current filters.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">People</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {complaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-slate-50/60 transition-colors align-top">
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-900">{complaint.subject}</p>
                        <p className="mt-1 text-sm text-slate-500 line-clamp-2">{complaint.description}</p>
                        {complaint.adminNote ? (
                          <p className="mt-2 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                            {complaint.adminNote}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <div className="font-semibold text-slate-900">{complaint.complainant?.name || "Unknown"}</div>
                        <div className="text-slate-500">{complaint.complainant?.studentId || "N/A"}</div>
                        <div className="mt-3 font-semibold text-slate-900">{complaint.accused?.name || "Unknown"}</div>
                        <div className="text-slate-500">{complaint.accused?.studentId || "N/A"}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-slate-50 text-slate-600 border-slate-100">
                          {formatLabel(complaint.category)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            statusStyles[complaint.status] || "bg-slate-50 text-slate-600 border-slate-100"
                          }`}
                        >
                          {formatLabel(complaint.status)}
                        </span>
                        <div className="mt-2 text-xs text-slate-500">
                          {complaint.resolvedBy?.name ? `By ${complaint.resolvedBy.name}` : "Awaiting action"}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {formatDate(complaint.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminComplaintsPage;
