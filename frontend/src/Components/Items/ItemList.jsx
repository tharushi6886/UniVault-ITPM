import React, { useEffect, useState } from "react";
import axiosInstance from "../../services/axiosInstance";
import BidModal from "../Bids/BidModal";

const CATEGORY_ICONS = {
  Electronics: "💻",
  Books: "📚",
  Clothing: "👕",
  Accessories: "🎒",
  Sports: "⚽",
  Stationery: "✏️",
};

const TYPE_BADGE = {
  sell: { label: "For Sale", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  lost: { label: "Lost", color: "bg-red-100 text-red-600 border-red-200" },
  found: { label: "Found", color: "bg-blue-100 text-blue-700 border-blue-200" },
};

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axiosInstance.get("/items");
      setItems(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load items.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = (item) => {
    setSelectedItem(item);
    setShowBidModal(true);
  };

  const handleBidSuccess = () => {
    setSuccessMsg("Bid placed successfully! We'll notify you once it's reviewed.");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const filteredItems = filterType === "all"
    ? items
    : items.filter((i) => i.item_type === filterType);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(196,181,253,0.3),transparent)] font-epilogue text-text">
      {/* Header */}
      <div className="bg-[#f0eeff]/95 shadow-[0_4px_32px_rgba(79,70,229,0.1)] border-b border-[#818cf8]/20 px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-i2 to-cyan-500 flex items-center justify-center text-base shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
              🔍
            </div>
            <span className="text-xl font-bold text-text tracking-[-0.02em] font-clash">
              UniVault
            </span>
          </div>
          <h1 className="text-lg font-semibold text-text font-clash hidden sm:block">
            Browse Items
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-8 reveal rd0">
          <h2 className="text-3xl font-bold text-text font-clash tracking-tight mb-1">
            Available Items
          </h2>
          <p className="text-muted text-sm">
            Browse lost, found, and marketplace items from the SLIIT community.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 reveal rd1">
          {["all", "sell", "lost", "found"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-5 py-2 rounded-full text-sm font-medium font-epilogue transition-all duration-200 border ${
                filterType === type
                  ? "bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white border-transparent shadow-[0_4px_14px_rgba(79,70,229,0.3)]"
                  : "bg-white/70 border-[#818cf8]/30 text-gray-600 hover:border-i3 hover:text-i2"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Success banner */}
        {successMsg && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-epilogue rounded-xl px-5 py-3 flex items-center gap-2">
            <span>✅</span> {successMsg}
          </div>
        )}

        {/* Loading / Error / Empty */}
        {loading && (
          <div className="flex items-center justify-center py-20">
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
        {!loading && !error && filteredItems.length === 0 && (
          <div className="text-center py-20 text-muted font-epilogue text-sm">
            No items found.
          </div>
        )}

        {/* Items grid */}
        {!loading && !error && filteredItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, idx) => {
              const badge = TYPE_BADGE[item.item_type] || {};
              const icon = CATEGORY_ICONS[item.category] || "📦";
              return (
                <div
                  key={item._id}
                  className={`reveal rd${idx % 4} bg-white/85 backdrop-blur-md border border-white/95 rounded-3xl shadow-[0_6px_28px_rgba(79,70,229,0.1)] hover:shadow-[0_12px_36px_rgba(79,70,229,0.18)] hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col`}
                >
                  {/* Card image area */}
                  <div className="bg-gradient-to-br from-[#eef2ff] to-[#f0f9ff] h-36 flex items-center justify-center text-5xl select-none">
                    {icon}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    {/* Type badge */}
                    <span
                      className={`self-start text-xs font-medium font-epilogue px-2.5 py-0.5 rounded-full border mb-2 ${badge.color}`}
                    >
                      {badge.label}
                    </span>

                    <h3 className="text-base font-bold text-text font-clash mb-1 leading-tight line-clamp-2">
                      {item.item_name}
                    </h3>

                    {item.description && (
                      <p className="text-xs text-muted font-epilogue mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="mt-auto">
                      {item.price && (
                        <p className="text-i2 font-bold font-clash text-lg mb-3">
                          Rs. {item.price.toLocaleString()}
                        </p>
                      )}

                        <div className="flex gap-2">
                          {item.item_type === "sell" && (
                            <button className="flex-1 bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white text-xs font-semibold font-epilogue px-3 py-2 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] hover:-translate-y-[1px] transition-all duration-200">
                              Buy Now
                            </button>
                          )}
                          {item.item_type !== "lost" && (
                            <button
                              onClick={() => handlePlaceBid(item)}
                              className="flex-1 bg-white border border-[#818cf8]/40 text-i2 text-xs font-semibold font-epilogue px-3 py-2 rounded-xl hover:bg-[#eef2ff] hover:border-i3 transition-all duration-200"
                            >
                              🏷️ Place Bid
                            </button>
                          )}
                        </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bid Modal */}
      {showBidModal && selectedItem && (
        <BidModal
          item={selectedItem}
          onClose={() => {
            setShowBidModal(false);
            setSelectedItem(null);
          }}
          onSuccess={handleBidSuccess}
        />
      )}
    </div>
  );
};

export default ItemList;
