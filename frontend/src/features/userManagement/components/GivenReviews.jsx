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
      <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] flex items-center gap-4">
        <span className="text-xl">ℹ️</span>
        <p className="text-xs font-bold text-slate-500">
          Reviews you've given are visible on the recipient's public profile. You can delete your reviews within <span className="text-rose-500">24 hours</span> of submission.
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
