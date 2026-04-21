import React, { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import { getReviewsForUser, replyToReview } from "../../../api/reviewApi";
import { toast } from "react-toastify";

const ReceivedReviews = ({ userId, isOwnProfile }) => {
  const [data, setData] = useState({ reviews: [], avgRating: 0, total: 0, trustPtsEarned: 0 });
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await getReviewsForUser(userId);
      setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, [userId]);

  const handleReply = async (reviewId, replyText) => {
    try {
      const token = localStorage.getItem("token");
      await replyToReview(token, reviewId, replyText);
      toast.success("Response synchronized with ledger");
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to transmit reply");
    }
  };

  if (loading) return <div className="animate-pulse space-y-4">{[1, 2].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[2rem]" />)}</div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          { label: "Community Rating", value: data.avgRating || "0.0", sub: `${data.total} Total Reviews`, color: "text-[#F0A500]" },
          { label: "Trust Pts Earned", value: `+${data.trustPtsEarned || 0}`, sub: "From Verified Trades", color: "text-indigo-600" },
          { label: "Verified Ratio", value: data.total > 0 ? `${Math.round((data.reviews.filter(r => r.isVerified).length / data.total) * 100)}%` : "0%", sub: "Interaction Integrity", color: "text-emerald-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-[0_15px_50px_rgba(74,95,232,0.04)] flex flex-col items-center text-center hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{stat.label}</span>
            <span className={`text-4xl font-black ${stat.color} mb-3 font-epilogue tracking-tight`}>{stat.value}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.sub}</span>
          </div>
        ))}
      </div>

      {data.reviews.length === 0 ? (
        <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center">
           <span className="text-4xl mb-4 block grayscale opacity-30">⭐</span>
           <p className="text-sm font-bold text-slate-400 italic">No reviews received yet. Your interactions will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.reviews.map(review => (
            <ReviewCard 
              key={review._id} 
              review={review} 
              type="received"
              canReply={isOwnProfile}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedReviews;
