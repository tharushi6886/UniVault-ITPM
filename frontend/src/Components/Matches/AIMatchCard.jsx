import React from 'react';

const AIMatchCard = ({ match, onCompare, onVerify, onReject }) => {
  const { score, reasons, foundItemId: foundItem, _id: matchId } = match;

  return (
    <div className="bg-gradient-to-br from-[#4f46e5]/[0.06] to-[#8b5cf6]/[0.05] border-[1.5px] border-[#6366f1]/20 rounded-[16px] p-[15px] mb-[12px] last:mb-0 cursor-pointer transition-all hover:border-[#6366f1]/40 hover:-translate-y-[2px] hover:shadow-[0_8px_24px_rgba(79,70,229,0.12)] group">
      <div className="flex justify-between items-start mb-[11px]">
        <div>
          <div className="text-[10px] font-bold text-[#6b7280] uppercase tracking-[0.06em]">Found Match</div>
          <div className="text-[13.5px] font-bold text-[#1e1b4b] mt-[2px]">{foundItem.title}</div>
          <div className="text-[11px] text-[#6b7280] mt-[2px]">📍 {foundItem.location}</div>
        </div>
        <div className="font-clash text-[26px] font-bold text-[#4f46e5] leading-none text-right">
          {score}%
          <small className="text-[11px] text-[#6b7280] font-epilogue font-medium block uppercase tracking-tighter">Match</small>
        </div>
      </div>

      <div className="flex items-center gap-[8px] mb-[11px]">
        <div className="relative flex-1 h-[64px] rounded-[10px] overflow-hidden border-[2px] border-[#a5b4fc]/30">
          <img 
            className="w-full h-full object-cover" 
            src={match.lostItemId.imageUrl || "/placeholder-lost.png"} 
            alt="Lost Item"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="text-[8px] font-bold text-white uppercase bg-red-500/80 px-1 rounded">Lost</span>
          </div>
        </div>
        <div className="text-[#818cf8] text-[18px] shrink-0 font-bold">⟷</div>
        <div className="relative flex-1 h-[64px] rounded-[10px] overflow-hidden border-[2px] border-[#a5b4fc]/30">
          <img 
            className="w-full h-full object-cover" 
            src={foundItem.imageUrl || "/placeholder-found.png"} 
            alt="Found Item"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <span className="text-[8px] font-bold text-white uppercase bg-green-500/80 px-1 rounded">Found</span>
          </div>
        </div>
      </div>

      <div className="mb-[12px]">
        <div className="text-[10px] font-bold text-[#94a3b8] uppercase mb-1">Reasons:</div>
        <div className="flex flex-wrap gap-1">
          {reasons.slice(0, 2).map((reason, idx) => (
            <span key={idx} className="text-[9px] bg-white/50 border border-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded">
              {reason}
            </span>
          ))}
          {reasons.length > 2 && <span className="text-[9px] text-gray-400">+{reasons.length - 2} more</span>}
        </div>
      </div>

      <div className="flex gap-[7px]">
        <button 
          onClick={(e) => { e.stopPropagation(); onCompare(match); }}
          className="flex-1 text-[11.5px] font-semibold py-[7px] px-[10px] rounded-[8px] cursor-pointer font-epilogue bg-[#6366f1]/[0.09] text-[#4f46e5] border border-[#6366f1]/20 hover:bg-[#6366f1]/[0.18] transition-colors"
        >
          Compare
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onVerify(matchId); }}
          className="flex-1 text-[11.5px] font-semibold py-[7px] px-[10px] rounded-[8px] cursor-pointer font-epilogue bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white shadow-[0_2px_8px_rgba(79,70,229,0.28)] hover:shadow-[0_4px_14px_rgba(79,70,229,0.44)] transition-all"
        >
          Verify Match →
        </button>
      </div>
    </div>
  );
};

export default AIMatchCard;
