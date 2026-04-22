import React, { useEffect, useState } from "react";
import Navbar from "../../homepage/components/Navbar";
import { getAllBidsAdmin } from "../../../api/bidApi";
import { toast } from "react-toastify";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-100",
  accepted: "bg-emerald-50 text-emerald-700 border-emerald-100",
  rejected: "bg-rose-50 text-rose-700 border-rose-100",
};

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

const getImageSrc = (image) => {
  if (!image) return null;
  return image.startsWith("http") ? image : `http://localhost:5000${image}`;
};

const AdminBidsPage = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await getAllBidsAdmin(token, { status: statusFilter });
        setBids(res.data.bids || []);
      } catch (error) {
        console.error("Admin bids fetch error:", error);
        toast.error("Failed to load bid records");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, [statusFilter]);

  const counts = bids.reduce(
    (acc, bid) => {
      acc.total += 1;
      acc[bid.status] = (acc[bid.status] || 0) + 1;
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
              <h1 className="mt-2 text-3xl font-black text-slate-900 tracking-tight">Bid Registry</h1>
              <p className="mt-2 text-sm text-slate-500 max-w-2xl">
                Review bid activity across all managed items and monitor the current lifecycle of each offer.
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
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Pending</p>
              <p className="mt-2 text-3xl font-black text-amber-700">{counts.pending || 0}</p>
            </div>
            <div className="rounded-3xl bg-white border border-emerald-100 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Accepted</p>
              <p className="mt-2 text-3xl font-black text-emerald-700">{counts.accepted || 0}</p>
            </div>
            <div className="rounded-3xl bg-white border border-rose-100 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-500">Rejected</p>
              <p className="mt-2 text-3xl font-black text-rose-700">{counts.rejected || 0}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {["all", "pending", "accepted", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-3 rounded-2xl border text-xs font-black uppercase tracking-widest transition-colors ${
                  statusFilter === status
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-lg"
                    : "bg-white border-slate-200 text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                }`}
                type="button"
              >
                {status === "all" ? "All statuses" : status}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-16 text-center">
              <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin mx-auto" />
              <p className="mt-4 text-sm font-semibold text-slate-500">Fetching bid records...</p>
            </div>
          ) : bids.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-dashed border-slate-200 p-16 text-center shadow-sm">
              <h2 className="text-xl font-black text-slate-800">No bids found</h2>
              <p className="mt-2 text-sm text-slate-500">
                There are no records for the current filter.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Item</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Bidder</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bids.map((bid) => (
                    <tr key={bid._id} className="hover:bg-slate-50/60 transition-colors align-top">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
                            {getImageSrc(bid.bidItem?.image) ? (
                              <img
                                src={getImageSrc(bid.bidItem.image)}
                                alt={bid.bidItem?.title || "Bid item"}
                                className="w-full h-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{bid.bidItem?.title || "Unknown Item"}</p>
                            <p className="text-xs text-slate-500">
                              Starting price: {Number(bid.bidItem?.startingPrice || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm">
                        <div className="font-semibold text-slate-900">{bid.bidder?.name || "Unknown"}</div>
                        <div className="text-slate-500">{bid.bidder?.studentId || "N/A"}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-black text-slate-900">
                          LKR {Number(bid.amount || 0).toLocaleString()}
                        </span>
                        {bid.message ? (
                          <p className="mt-2 text-xs text-slate-500 max-w-md">{bid.message}</p>
                        ) : null}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            statusStyles[bid.status] || "bg-slate-50 text-slate-600 border-slate-100"
                          }`}
                        >
                          {bid.status}
                        </span>
                        {bid.sellerNote ? (
                          <p className="mt-2 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
                            {bid.sellerNote}
                          </p>
                        ) : null}
                      </td>
                      <td className="px-6 py-5 text-sm text-slate-600">
                        {formatDate(bid.createdAt)}
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

export default AdminBidsPage;
