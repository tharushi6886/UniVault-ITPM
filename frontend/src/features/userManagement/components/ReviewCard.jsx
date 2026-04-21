import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Native helper to format relative timestamps (e.g., "3 days ago")
 */
const getRelativeTime = (dateString) => {
  if (!dateString) return "";
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

const ReviewCard = ({ review, onAction, actionLabel, showAction, type = "received", canReply, onReply }) => {
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const { _id, reviewer, reviewed, rating, comment, category, createdAt, isVerified, reply, repliedAt } = review;
  
  // Decide which identity to show in the header
  const targetUser = type === "received" ? reviewer : reviewed;
  const initials = targetUser?.name?.split(" ").map(n => n[0]).join("") || "?";
  
  const categoryConfig = {
    marketplace: { label: "Marketplace", icon: "🛍️", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
    lost_found: { label: "Lost & Found", icon: "🔍", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    general: { label: "General", icon: "💬", bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-100" }
  };
  
  const config = categoryConfig[category] || categoryConfig.general;

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !onReply) return;
    setSubmittingReply(true);
    try {
      await onReply(_id, replyText);
      setReplyText("");
      setShowReplyInput(false);
    } finally {
      setSubmittingReply(false);
    }
  };
  
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all duration-500 flex flex-col gap-6 relative group overflow-hidden">
      
      {/* SHIMMER EFFECT FOR VERIFIED */}
      {isVerified && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-50/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      )}

      {/* HEADER: Identity & Source Tag */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-[13px] font-black text-white shadow-md ${isVerified ? 'bg-slate-900' : 'bg-slate-300'}`}>
            {initials}
          </div>
          <div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                {type === "received" ? "From Reviewer" : "To Recipient"}
              </span>
              <div className="flex items-center gap-2">
                <h4 className="font-epilogue font-bold text-slate-900 text-[15px]">{targetUser?.name || "Anonymous User"}</h4>
                {isVerified && (
                  <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-[8px] text-white">✓</div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <span className={`${config.bg} ${config.text} ${config.border} border text-[8px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest flex items-center gap-2 shadow-sm shrink-0`}>
          <span>{config.icon}</span> {config.label}
        </span>
      </div>

      {/* CONTENT: Stars & Message */}
      <div className="space-y-4 relative z-10">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-sm ${star <= rating ? "text-[#F0A500]" : "text-slate-100"}`}>★</span>
            ))}
          </div>
          <span className="text-[11px] font-black text-slate-900/40 ml-1.5 uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
            {rating}.0
          </span>
          <div className="h-1 w-1 rounded-full bg-slate-200 mx-1"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {getRelativeTime(createdAt)}
          </p>
        </div>

        {comment && (
          <p className="text-[14px] font-medium text-slate-600 leading-relaxed italic border-l-2 border-slate-100 pl-5 py-0.5">
            "{comment}"
          </p>
        )}
      </div>

      {/* FOOTER: Threaded Reply or Actions */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {reply ? (
            /* THREADED REPLY UI */
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mt-2 ml-4 pl-6 border-l-2 border-indigo-500/20 relative"
            >
              <div className="absolute top-0 left-0 w-3 h-[2px] bg-indigo-500/20 -ml-0.5 mt-2.5"></div>
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.15em]">Your Reply</span>
                 <div className="h-1 w-1 rounded-full bg-indigo-200"></div>
                 <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{getRelativeTime(repliedAt)}</span>
              </div>
              <p className="text-[13px] font-semibold text-slate-700 leading-relaxed">{reply}</p>
            </motion.div>
          ) : (
            <>
              {/* REPLY INPUT (Received Tab Only) */}
              {canReply && (
                <div className="mt-2">
                   {!showReplyInput ? (
                      <button 
                        onClick={() => setShowReplyInput(true)}
                        className="text-[10px] font-black text-indigo-500 hover:text-indigo-700 uppercase tracking-widest transition-colors flex items-center gap-2 group"
                      >
                         <span className="w-5 h-5 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">💬</span>
                         Awaiting your reply...
                      </button>
                   ) : (
                      <form onSubmit={handleReplySubmit} className="flex gap-2">
                        <input 
                          autoFocus
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your response..."
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-inner"
                        />
                        <button 
                          disabled={submittingReply || !replyText.trim()}
                          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-600 transition-all disabled:opacity-30"
                        >
                          Send
                        </button>
                        <button 
                          type="button"
                          onClick={() => setShowReplyInput(false)}
                          className="px-3 text-slate-400 hover:text-slate-600"
                        >✕</button>
                      </form>
                   )}
                </div>
              )}
            </>
          )}
        </AnimatePresence>

        {/* DELETE ACTION (Given Tab Only) */}
        {showAction && onAction && (
          <div className="flex justify-end pt-2">
             <button 
               onClick={() => onAction(_id)}
               className="px-4 py-2 rounded-xl text-[10px] font-black text-rose-500 hover:bg-rose-50 uppercase tracking-widest transition-all flex items-center gap-2 group"
             >
               <svg className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
               {actionLabel}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
