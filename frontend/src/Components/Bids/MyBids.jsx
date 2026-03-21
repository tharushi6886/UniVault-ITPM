import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import BuyNowModal from "./BuyNowModal";

const STATUS_CONFIG = {
  pending: {
    label: "Pending Review",
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

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [purchasedBidIds, setPurchasedBidIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [buyNowBid, setBuyNowBid] = useState(null);
  const [purchasedBidId, setPurchasedBidId] = useState(null);

  useEffect(() => {
    fetchMyBids();
    fetchMyPurchases();
  }, []);

  const fetchMyBids = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.get("/bids/my-bids");
      setBids(data.bids || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your bids.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPurchases = async () => {
    try {
      const { data } = await axiosInstance.get("/purchases/my-purchases");
      const ids = new Set((data.purchases || []).map((p) => p.bidId?._id || p.bidId));
      setPurchasedBidIds(ids);
    } catch {
      // silently ignore
    }
  };

  const handleBuyNow = (bid) => {
    setBuyNowBid(bid);
  };

  const handleDelete = async (bidId) => {
    if (!window.confirm("Delete this bid? This cannot be undone.")) return;
    try {
      await axiosInstance.delete(`/bids/${bidId}`);
      setBids((prev) => prev.filter((b) => b._id !== bidId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete bid.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(196,181,253,0.3),transparent)] font-epilogue text-text">
      {buyNowBid && (
        <BuyNowModal
          bid={buyNowBid}
          onClose={() => setBuyNowBid(null)}
          onSuccess={(bid) => {
            setPurchasedBidId(bid._id);
            setPurchasedBidIds((prev) => new Set([...prev, bid._id]));
            setBuyNowBid(null);
            fetchMyBids();
          }}
        />
      )}

      {purchasedBidId && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(16,185,129,0.2)] w-full max-w-sm p-10 flex flex-col items-center text-center animate-[node-float_0.3s_cubic-bezier(0.22,1,0.36,1)_both]">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-4xl shadow-[0_8px_28px_rgba(16,185,129,0.4)] mb-5">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-text font-clash tracking-tight mb-2">
              Purchase Completed!
            </h2>
            <p className="text-muted text-sm font-epilogue mb-6">
              Your payment receipt has been submitted. We'll confirm your order shortly.
            </p>
            <button
              onClick={() => setPurchasedBidId(null)}
              className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-sm font-epilogue font-semibold px-8 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_22px_rgba(16,185,129,0.48)] hover:-translate-y-[1px] transition-all duration-200"
            >
              Done
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-[#f0eeff]/95 shadow-[0_4px_32px_rgba(79,70,229,0.1)] border-b border-[#818cf8]/20 px-8 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-i2 to-cyan-500 flex items-center justify-center text-base shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
            🏷️
          </div>
          <span className="text-xl font-bold text-text tracking-[-0.02em] font-clash">
            My Bids
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text font-clash tracking-tight mb-1">
            Your Bidding History
          </h2>
          <p className="text-muted text-sm">
            Track the status of all your submitted bids.
          </p>
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
        {!loading && !error && bids.length === 0 && (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏷️</div>
            <p className="text-text font-clash font-semibold text-lg mb-1">No bids yet</p>
            <p className="text-muted text-sm">
              Browse items and place a bid to get started.
            </p>
          </div>
        )}

        {/* Bids list */}
        {!loading && !error && bids.length > 0 && (
          <div className="space-y-4">
            {bids.map((bid) => {
              const statusCfg = STATUS_CONFIG[bid.status] || STATUS_CONFIG.pending;
              const isApproved = bid.status === "approved";
              const isPurchased = purchasedBidIds.has(bid._id);
              const item = bid.itemId;

              return (
                <div
                  key={bid._id}
                  className="bg-white/85 backdrop-blur-md border border-white/95 rounded-2xl shadow-[0_6px_28px_rgba(79,70,229,0.08)] hover:shadow-[0_10px_36px_rgba(79,70,229,0.14)] transition-all duration-300 p-6 flex flex-col sm:flex-row sm:items-center gap-5"
                >
                  {/* Item icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#eef2ff] to-[#f0f9ff] flex items-center justify-center text-3xl shrink-0 border border-[#818cf8]/20">
                    📦
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-text font-clash truncate">
                        {item?.item_name || "Item"}
                      </h3>
                      {item?.item_type && (
                        <span className="text-xs text-muted font-epilogue bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                          {item.item_type}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted font-epilogue">
                      <span>
                        Bid:{" "}
                        <span className="text-i2 font-semibold font-clash">
                          Rs. {bid.bidAmount.toLocaleString()}
                        </span>
                      </span>
                      {item?.price && (
                        <span>
                          Listed:{" "}
                          <span className="text-text font-medium">
                            Rs. {item.price.toLocaleString()}
                          </span>
                        </span>
                      )}
                      <span>
                        {new Date(bid.createdAt).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {bid.bidderNote && (
                      <p className="text-xs text-muted font-epilogue mt-1.5 italic line-clamp-1">
                        "{bid.bidderNote}"
                      </p>
                    )}
                  </div>

                  {/* Right side: status + buy now + delete */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span
                      className={`text-xs font-medium font-epilogue px-3 py-1 rounded-full border flex items-center gap-1.5 ${statusCfg.color}`}
                    >
                      {statusCfg.icon} {statusCfg.label}
                    </span>

                    {isApproved && (
                      isPurchased ? (
                        <span className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold font-epilogue px-4 py-2 rounded-xl">
                          🛍️ Purchased
                        </span>
                      ) : (
                        <button
                          onClick={() => handleBuyNow(bid)}
                          className="bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white text-xs font-semibold font-epilogue px-5 py-2 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.48)] hover:-translate-y-[1px] transition-all duration-200"
                        >
                          🛒 Buy Now
                        </button>
                      )
                    )}

                    {!isPurchased && (
                      <button
                        onClick={() => handleDelete(bid._id)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                        title="Delete bid"
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBids;
