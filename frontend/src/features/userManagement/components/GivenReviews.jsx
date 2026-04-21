import React, { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import { getMyGivenReviews, deleteReview } from "../../../api/reviewApi";
import { toast } from "react-toastify";

const GivenReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await getMyGivenReviews(localStorage.getItem("token"));
      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    try {
      await deleteReview(localStorage.getItem("token"), id);
      toast.success("Review removed successfully");
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove review");
    }
  };

  if (loading) return <div className="animate-pulse space-y-4">{[1, 2].map(i => <div key={i} className="h-40 bg-slate-50 rounded-[2rem]" />)}</div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Subtle Info Banner */}
      <div className="bg-slate-50 border border-slate-100 px-8 py-4 rounded-2xl flex items-center justify-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Public Visibility: Reviews are public on recipient profiles and editable for <span className="text-slate-900 font-black underline decoration-slate-200 underline-offset-4">24 hours</span>
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center">
           <span className="text-4xl mb-4 block grayscale opacity-30">✍️</span>
           <p className="text-sm font-bold text-slate-400 italic">You haven't shared any feedback yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(review => (
            <ReviewCard 
              key={review._id} 
              review={review} 
              type="given"
              showAction={true} 
              actionLabel="Delete Review" 
              onAction={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GivenReviews;
