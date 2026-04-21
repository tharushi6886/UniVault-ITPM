import React from "react";

/**
 * Native helper to format relative timestamps (e.g., "3 days ago")
 */
const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 }
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }
  return date.toLocaleDateString();
};

const ReviewCard = ({ review, onAction, actionLabel, showAction }) => {
  const { reviewer, rating, comment, category, createdAt, isVerified, interactionType } = review;
  
  const initials = reviewer?.name?.split(" ").map(n => n[0]).join("") || "?";
  
  // Category Styles
  const categoryConfig = {
    marketplace: { label: "Marketplace", icon: "🛍️", bg: "bg-[#EEEDFE]", text: "text-[#3C3489]", border: "border-[#D7D4FB]" },
    lost_found: { label: "Lost & Found", icon: "🔍", bg: "bg-[#E1F5EE]", text: "text-[#085041]", border: "border-[#C1EBDD]" },
    general: { label: "General", icon: "💬", bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-100" }
  };
  
  const config = categoryConfig[category] || categoryConfig.general;
  
  return (
    <div className="bg-white border border-slate-100 rounded-[1.5rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-6 relative group overflow-hidden">
      {/* SHIMMER EFFECT FOR VERIFIED */}
      {isVerified && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-50/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      )}

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black text-white shadow-lg ${isVerified ? 'bg-indigo-600' : 'bg-slate-300'}`}>
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-epilogue font-bold text-slate-900 text-[15px]">{reviewer?.name}</h4>
              {isVerified && (
                <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg flex items-center gap-1 border border-indigo-100 shadow-sm">
                  <span className="text-[12px] -mt-0.5">✓</span> Verified
                </span>
              )}
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              {getRelativeTime(createdAt)}
            </p>
          </div>
        </div>
        
        <span className={`${config.bg} ${config.text} ${config.border} border text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shadow-sm`}>
          <span>{config.icon}</span> {config.label}
        </span>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Star Display */}
        <div className="flex items-center gap-1 text-sm">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= rating ? "text-[#F0A500]" : "text-slate-200"}>★</span>
          ))}
          <span className="text-[11px] font-black text-slate-300 ml-2 uppercase tracking-tighter">{rating}/5</span>
        </div>

        {comment && (
          <p className="text-sm font-medium text-slate-500 leading-relaxed italic border-l-2 border-slate-100 pl-4 py-1">
            "{comment}"
          </p>
        )}
      </div>

      {showAction && onAction && (
        <div className="flex justify-end pt-2 relative z-10">
           <button 
             onClick={() => onAction(review._id)}
             className="text-[10px] font-black text-rose-400 hover:text-rose-600 uppercase tracking-widest transition-colors flex items-center gap-2"
           >
             <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
             {actionLabel}
           </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
