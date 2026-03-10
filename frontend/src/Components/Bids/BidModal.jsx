import React, { useState } from "react";
import axiosInstance from "../../services/axiosInstance";

const BidModal = ({ item, onClose, onSuccess }) => {
  const [bidAmount, setBidAmount] = useState(item?.price || "");
  const [bidderNote, setBidderNote] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!bidAmount || Number(bidAmount) <= 0) {
      setError("Please enter a valid bid amount.");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/bids", {
        itemId: item._id,
        bidAmount: Number(bidAmount),
        bidderNote,
        fullName,
        email,
        phoneNumber,
      });
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place bid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-[0_16px_48px_rgba(79,70,229,0.18)] w-full max-w-md p-8 relative animate-[node-float_0.3s_cubic-bezier(0.22,1,0.36,1)_both]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-[#eef2ff] hover:text-i2 transition-colors"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-i2 to-cyan-500 flex items-center justify-center text-lg shadow-[0_4px_14px_rgba(79,70,229,0.3)]">
            🏷️
          </div>
          <div>
            <h2 className="text-xl font-bold text-text font-clash tracking-tight">
              Place a Bid
            </h2>
            <p className="text-sm text-muted font-epilogue">{item?.item_name}</p>
          </div>
        </div>

        {/* Item info strip */}
        {item?.price && (
          <div className="bg-[#eef2ff] border border-[#818cf8]/30 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
            <span className="text-sm text-muted font-epilogue">Starting price</span>
            <span className="text-i2 font-bold font-clash text-base">
              Rs. {item.price.toLocaleString()}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full border border-[#818cf8]/40 rounded-xl px-4 py-2.5 text-sm font-epilogue text-text bg-white focus:outline-none focus:ring-2 focus:ring-i3 focus:border-transparent placeholder-gray-400 transition-all"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-[#818cf8]/40 rounded-xl px-4 py-2.5 text-sm font-epilogue text-text bg-white focus:outline-none focus:ring-2 focus:ring-i3 focus:border-transparent placeholder-gray-400 transition-all"
              required
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full border border-[#818cf8]/40 rounded-xl px-4 py-2.5 text-sm font-epilogue text-text bg-white focus:outline-none focus:ring-2 focus:ring-i3 focus:border-transparent placeholder-gray-400 transition-all"
              required
            />
          </div>

          {/* Bid Amount */}
          <div>
            <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
              Your Bid Amount (Rs.)
            </label>
            <input
              type="number"
              min="0"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter your bid"
              className="w-full border border-[#818cf8]/40 rounded-xl px-4 py-2.5 text-sm font-epilogue text-text bg-white focus:outline-none focus:ring-2 focus:ring-i3 focus:border-transparent placeholder-gray-400 transition-all"
              required
            />
          </div>

          {/* Bidder Note */}
          <div>
            <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
              Note <span className="text-muted font-normal">(optional)</span>
            </label>
            <textarea
              value={bidderNote}
              onChange={(e) => setBidderNote(e.target.value)}
              placeholder="Any message to the seller..."
              rows={3}
              className="w-full border border-[#818cf8]/40 rounded-xl px-4 py-2.5 text-sm font-epilogue text-text bg-white focus:outline-none focus:ring-2 focus:ring-i3 focus:border-transparent placeholder-gray-400 transition-all resize-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-epilogue bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white border border-[#818cf8]/30 text-gray-700 text-sm font-epilogue font-medium px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 hover:border-i3 hover:text-i2 hover:bg-[#eef2ff]/90"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-br from-[#4f46e5] to-[#3730a3] border-none text-white text-sm font-epilogue font-semibold px-5 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.35)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_22px_rgba(79,70,229,0.48)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Placing…" : "Place Bid"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BidModal;
