import React, { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import { getReviewsForUser } from "../../../api/reviewApi";

const ReceivedReviews = ({ userId }) => {
  const [data, setData] = useState({ reviews: [], avgRating: 0, total: 0, trustPtsEarned: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetch();
  }, [userId]);

  if (loading) return <div className="animate-pulse space-y-4">{[1, 2].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[2rem]" />)}</div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Community Rating", value: data.avgRating || "0.0", sub: `${data.total} Total Reviews`, color: "text-[#F0A500]" },
          { label: "Trust Pts Earned", value: `+${data.trustPtsEarned || 0}`, sub: "From Verified Trades", color: "text-indigo-600" },
          { label: "Verified Ratio", value: data.total > 0 ? `${Math.round((data.reviews.filter(r => r.isVerified).length / data.total) * 100)}%` : "0%", sub: "Interaction Integrity", color: "text-emerald-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex flex-col items-center text-center">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{stat.label}</span>
            <span className={`text-3xl font-black ${stat.color} mb-1`}>{stat.value}</span>
            <span className="text-[10px] font-bold text-slate-400">{stat.sub}</span>
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
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedReviews;
