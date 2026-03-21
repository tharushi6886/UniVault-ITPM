import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: "⏳",
  },
  approved: {
    label: "Approved",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: "✅",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-600 border-red-200",
    icon: "❌",
  },
};

const AdminBidList = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.get("/bids");
      setBids(data.bids || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load bids.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (bidId, action) => {
    setActionLoading((prev) => ({ ...prev, [bidId]: action }));
    try {
      await axiosInstance.patch(`/bids/${bidId}/${action}`);
      setBids((prev) =>
        prev.map((b) =>
          b._id === bidId
            ? { ...b, status: action === "approve" ? "approved" : "rejected" }
            : b
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} bid.`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [bidId]: null }));
    }
  };

  const handleDelete = async (bidId) => {
    if (!window.confirm("Delete this bid? This cannot be undone.")) return;
    setActionLoading((prev) => ({ ...prev, [bidId]: "delete" }));
    try {
      await axiosInstance.delete(`/bids/${bidId}`);
      setBids((prev) => prev.filter((b) => b._id !== bidId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete bid.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [bidId]: null }));
    }
  };

  const filteredBids =
    filterStatus === "all"
      ? bids
      : bids.filter((b) => b.status === filterStatus);

  const counts = {
    all: bids.length,
    pending: bids.filter((b) => b.status === "pending").length,
    approved: bids.filter((b) => b.status === "approved").length,
    rejected: bids.filter((b) => b.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(196,181,253,0.3),transparent)] font-epilogue text-text">
      {/* Header */}
      <div className="bg-[#f0eeff]/95 shadow-[0_4px_32px_rgba(79,70,229,0.1)] border-b border-[#818cf8]/20 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-i2 to-cyan-500 flex items-center justify-center text-base shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
            🔍
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
        {/* Page title + stats */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-text font-clash tracking-tight mb-1">
              Bid Management
            </h2>
            <p className="text-muted text-sm">
              Review, approve, or reject bids from students.
            </p>
          </div>

          {/* Stat pills */}
          <div className="flex gap-3 flex-wrap">
            {[
              { key: "pending", icon: "⏳", color: "text-amber-600 bg-amber-50 border-amber-200" },
              { key: "approved", icon: "✅", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
              { key: "rejected", icon: "❌", color: "text-red-500 bg-red-50 border-red-200" },
            ].map(({ key, icon, color }) => (
              <div
                key={key}
                className={`text-xs font-medium font-epilogue px-3 py-1.5 rounded-full border flex items-center gap-1.5 ${color}`}
              >
                {icon} {counts[key]} {key}
              </div>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-5 py-2 rounded-full text-sm font-medium font-epilogue transition-all duration-200 border ${
                filterStatus === status
                  ? "bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white border-transparent shadow-[0_4px_14px_rgba(79,70,229,0.3)]"
                  : "bg-white/70 border-[#818cf8]/30 text-gray-600 hover:border-i3 hover:text-i2"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1.5 text-xs opacity-70">({counts[status] ?? bids.length})</span>
            </button>
          ))}
        </div>

        {/* Loading / Error / Empty */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-i3 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!loading && error && (
          <div className="text-center py-16">
            <p className="text-red-500 font-epilogue text-sm bg-red-50 border border-red-200 rounded-xl px-6 py-4 inline-block">
              {error}
            </p>
          </div>
        )}
        {!loading && !error && filteredBids.length === 0 && (
          <div className="text-center py-24 text-muted font-epilogue text-sm">
            No bids found.
          </div>
        )}

        {/* Table-style bid list */}
        {!loading && !error && filteredBids.length > 0 && (
          <div className="bg-white/85 backdrop-blur-md border border-white/95 rounded-3xl shadow-[0_6px_28px_rgba(79,70,229,0.1)] overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-[#eef2ff]/80 border-b border-[#818cf8]/20 text-xs font-semibold text-muted uppercase tracking-wide font-epilogue">
              <span>Item</span>
              <span>Bidder</span>
              <span>Bid Amount</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-[#818cf8]/10">
              {filteredBids.map((bid) => {
                const statusCfg = STATUS_CONFIG[bid.status] || STATUS_CONFIG.pending;
                const isPending = bid.status === "pending";
                const isActing = actionLoading[bid._id];

                return (
                  <div
                    key={bid._id}
                    className="grid grid-cols-1 sm:grid-cols-[2fr_2fr_1fr_1fr_auto] gap-3 sm:gap-4 px-6 py-5 items-center hover:bg-[#eef2ff]/30 transition-colors"
                  >
                    {/* Item */}
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text font-clash truncate">
                        {bid.itemId?.item_name || "—"}
                      </p>
                      <p className="text-xs text-muted capitalize">
                        {bid.itemId?.item_type || ""}
                        {bid.itemId?.category ? ` · ${bid.itemId.category}` : ""}
                      </p>
                      {bid.bidderNote && (
                        <p className="text-xs text-muted italic mt-0.5 line-clamp-1">
                          "{bid.bidderNote}"
                        </p>
                      )}
                    </div>

                    {/* Bidder */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text font-epilogue truncate">
                        {bid.bidderId?.name || "—"}
                      </p>
                      <p className="text-xs text-muted truncate">
                        {bid.bidderId?.email || ""}
                      </p>
                      {bid.bidderId?.studentId && (
                        <p className="text-xs text-muted">
                          {bid.bidderId.studentId}
                        </p>
                      )}
                    </div>

                    {/* Bid amount */}
                    <div>
                      <p className="text-sm font-bold text-i2 font-clash">
                        Rs. {bid.bidAmount.toLocaleString()}
                      </p>
                      {bid.itemId?.price && (
                        <p className="text-xs text-muted">
                          Listed: Rs. {bid.itemId.price.toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Status badge */}
                    <div>
                      <span
                        className={`text-xs font-medium font-epilogue px-2.5 py-1 rounded-full border flex items-center gap-1 w-fit ${statusCfg.color}`}
                      >
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end items-center">
                      {isPending ? (
                        <>
                          <button
                            onClick={() => handleAction(bid._id, "approve")}
                            disabled={!!isActing}
                            className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-xs font-semibold font-epilogue px-4 py-1.5 rounded-lg shadow-[0_2px_8px_rgba(16,185,129,0.3)] hover:shadow-[0_4px_14px_rgba(16,185,129,0.45)] hover:-translate-y-[1px] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {isActing === "approve" ? "…" : "Approve"}
                          </button>
                          <button
                            onClick={() => handleAction(bid._id, "reject")}
                            disabled={!!isActing}
                            className="bg-white border border-red-300 text-red-500 text-xs font-semibold font-epilogue px-4 py-1.5 rounded-lg hover:bg-red-50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {isActing === "reject" ? "…" : "Reject"}
                          </button>
                        </>
                      ) : null}
                      <button
                        onClick={() => handleDelete(bid._id)}
                        disabled={!!isActing}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 hover:border-red-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete bid"
                      >
                        {isActing === "delete" ? "…" : "🗑"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBidList;
