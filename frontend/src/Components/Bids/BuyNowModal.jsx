import React, { useState } from "react";
import axiosInstance from "../../services/axiosInstance";

const BuyNowModal = ({ bid, onClose, onSuccess }) => {
  const [receipt, setReceipt] = useState(null);
  const [preview, setPreview] = useState(null);
  const [address, setAddress] = useState("");
  const [building, setBuilding] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [preferredDeliveryDate, setPreferredDeliveryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const item = bid?.itemId;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReceipt(file);
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!receipt) {
      setError("Please upload your payment receipt.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("receipt", receipt);
      formData.append("bidId", bid._id);
      formData.append("itemId", item._id);
      formData.append("amount", bid.bidAmount);
      formData.append("address", address);
      formData.append("building", building);
      formData.append("roomNumber", roomNumber);
      formData.append("preferredDeliveryDate", preferredDeliveryDate);

      await axiosInstance.post("/purchases", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess && onSuccess(bid);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit purchase.");
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-lg shadow-[0_4px_14px_rgba(16,185,129,0.3)]">
            🧾
          </div>
          <div>
            <h2 className="text-xl font-bold text-text font-clash tracking-tight">
              Complete Purchase
            </h2>
            <p className="text-sm text-muted font-epilogue">{item?.item_name}</p>
          </div>
        </div>

        {/* Amount strip */}
        <div className="bg-[#eef2ff] border border-[#818cf8]/30 rounded-xl px-4 py-3 mb-6 flex items-center justify-between">
          <span className="text-sm text-muted font-epilogue">Amount to pay</span>
          <span className="text-i2 font-bold font-clash text-base">
            Rs. {bid?.bidAmount?.toLocaleString()}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address"
              className="w-full border border-[#818cf8]/40 rounded-xl px-4 py-2.5 text-sm font-epilogue text-text bg-white focus:outline-none focus:ring-2 focus:ring-i3 focus:border-transparent placeholder-gray-400 transition-all"
              required
            />
          </div>

          {/* Building & Room in a row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
                Building
              </label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                placeholder="Building name / no."
                className="w-full border border-[#818cf8]/40 rounded-xl px-4 py-2.5 text-sm font-epilogue text-text bg-white focus:outline-none focus:ring-2 focus:ring-i3 focus:border-transparent placeholder-gray-400 transition-all"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
                Room Number
              </label>
              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="Room / Unit no."
                className="w-full border border-[#818cf8]/40 rounded-xl px-4 py-2.5 text-sm font-epilogue text-text bg-white focus:outline-none focus:ring-2 focus:ring-i3 focus:border-transparent placeholder-gray-400 transition-all"
                required
              />
            </div>
          </div>

          {/* Preferred Delivery Date */}
          <div>
            <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
              Preferred Delivery Date
            </label>
            <input
              type="date"
              value={preferredDeliveryDate}
              onChange={(e) => setPreferredDeliveryDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full border border-[#818cf8]/40 rounded-xl px-4 py-2.5 text-sm font-epilogue text-text bg-white focus:outline-none focus:ring-2 focus:ring-i3 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Receipt upload */}
          <div>
            <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
              Upload Payment Receipt
            </label>
            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-[#818cf8]/50 rounded-xl px-4 py-6 cursor-pointer hover:bg-[#eef2ff]/60 transition-colors">
              {preview ? (
                <img
                  src={preview}
                  alt="Receipt preview"
                  className="max-h-40 rounded-lg object-contain mb-2"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted">
                  <span className="text-3xl">📎</span>
                  <span className="text-sm font-epilogue">
                    {receipt ? receipt.name : "Click to upload receipt"}
                  </span>
                  <span className="text-xs">JPEG, PNG, WebP or PDF · max 5 MB</span>
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {receipt && !preview && (
              <p className="text-xs text-muted font-epilogue mt-1.5 flex items-center gap-1">
                📄 {receipt.name}
              </p>
            )}
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
              className="flex-1 bg-gradient-to-br from-emerald-500 to-teal-600 border-none text-white text-sm font-epilogue font-semibold px-5 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(16,185,129,0.35)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_6px_22px_rgba(16,185,129,0.48)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Submitting…" : "Submit Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BuyNowModal;
