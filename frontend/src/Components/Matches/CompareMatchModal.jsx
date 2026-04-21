import React from 'react';

const CompareMatchModal = ({ match, onClose, onVerify }) => {
  if (!match) return null;
  const { lostItemId: lostItem, foundItemId: foundItem, score, reasons } = match;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-[20px] bg-black/60 backdrop-blur-[10px]" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-[26px] w-[95vw] lg:w-[840px] max-h-[92vh] overflow-y-auto shadow-[0_40px_100px_rgba(15,10,40,0.4)] relative flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
          <div>
            <h2 className="text-[20px] font-bold text-[#1e1b4b] flex items-center gap-3">
              AI Match Comparison
              <span className="text-[12px] bg-indigo-600 text-white px-3 py-1 rounded-full">{score}% Match Score</span>
            </h2>
            <p className="text-[12px] text-gray-500 mt-1">Review similarities and differences to confirm match</p>
          </div>
          <button className="w-[36px] h-[36px] rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors border-none cursor-pointer" onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
            {/* Divider */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gray-100 -translate-x-1/2 z-0"></div>

            {/* Lost Item (Left) */}
            <div className="relative z-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center text-[18px]">🚩</span>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest">Lost Item Report</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-gray-100 aspect-video mb-4 shadow-sm">
                <img src={lostItem.imageUrl || "/placeholder-lost.png"} className="w-full h-full object-cover" alt="Lost" />
              </div>
              <ItemDetail label="Item Name" value={lostItem.title} />
              <ItemDetail label="Category" value={lostItem.category} />
              <ItemDetail label="Location" value={lostItem.location} />
              <ItemDetail label="Date" value={new Date(lostItem.date).toLocaleDateString()} />
              <ItemDetail label="Description" value={lostItem.description} isMultiLine />
            </div>

            {/* Found Item (Right) */}
            <div className="relative z-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-[18px]">✅</span>
                <span className="text-[11px] font-bold text-green-600 uppercase tracking-widest">Found Item Post</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-gray-100 aspect-video mb-4 shadow-sm">
                <img src={foundItem.imageUrl || "/placeholder-found.png"} className="w-full h-full object-cover" alt="Found" />
              </div>
              <ItemDetail label="Item Name" value={foundItem.title} />
              <ItemDetail label="Category" value={foundItem.category} />
              <ItemDetail label="Location" value={foundItem.location} />
              <ItemDetail label="Date" value={new Date(foundItem.date).toLocaleDateString()} />
              <ItemDetail label="Description" value={foundItem.description} isMultiLine />
            </div>
          </div>

          {/* AI Reasons */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-[13px] font-bold text-[#1e1b4b] mb-4 flex items-center gap-2">
              <span className="text-indigo-600">🤖</span> Why this is a match?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {reasons.map((reason, i) => (
                <div key={i} className="bg-indigo-50/50 border border-indigo-100/50 p-3 rounded-xl flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0 italic">AI</div>
                  <span className="text-[11.5px] text-indigo-900 font-medium">{reason}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-epilogue text-[13px] cursor-pointer">
            Close & Keep Browsing
          </button>
          <button 
            onClick={() => { onVerify(match._id); onClose(); }}
            className="flex-[2] py-3 font-bold text-white bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all font-epilogue text-[13px] cursor-pointer border-none"
          >
            Verify Match & Start Recovery →
          </button>
        </div>
      </div>
    </div>
  );
};

const ItemDetail = ({ label, value, isMultiLine }) => (
  <div className="mb-4">
    <div className="text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">{label}</div>
    <div className={`text-[13px] text-[#1e1b4b] p-3 rounded-xl bg-gray-50 border border-gray-100 ${isMultiLine ? 'min-h-[60px]' : ''}`}>
      {value || "Not specify"}
    </div>
  </div>
);

export default CompareMatchModal;
