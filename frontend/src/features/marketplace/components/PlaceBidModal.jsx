import React, { useState } from "react";
import { toast } from "react-toastify";
import { placeBid } from "../../../api/bidApi";

const PlaceBidModal = ({ item, onClose }) => {
  const [amount, setAmount] = useState(item.price ? Math.round(item.price * 0.9) : "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) {
      toast.error("Enter a valid bid amount.");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to place a bid.");
        return;
      }
      await placeBid(token, { itemId: item._id, amount: Number(amount), message });
      toast.success("Bid placed successfully! The seller will review it.");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place bid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 border border-purple-200 relative"
        style={{ animation: "modalIn 0.25s ease" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-serif text-2xl font-bold text-purple-900 mb-1">Place a Bid</h2>
        <p className="text-sm text-gray-400 mb-6">
          Item: <span className="font-semibold text-gray-700">{item.item_name}</span>
          {item.price && (
            <span className="ml-2 text-xs text-purple-500">Listed at LKR {item.price.toLocaleString()}</span>
          )}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              Your Bid Amount (LKR)
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 4500"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 font-bold text-purple-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              Message to Seller <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              rows={3}
              maxLength={500}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Why are you interested? Any relevant details..."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <p className="text-right text-xs text-gray-400 mt-0.5">{message.length}/500</p>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Placing..." : "Place Bid"}
            </button>
          </div>
        </form>

        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default PlaceBidModal;
