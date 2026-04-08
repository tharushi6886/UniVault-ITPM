import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { submitReview, getReviewsForUser, deleteReview } from "../../../api/reviewApi";

// ─── Star Rating Input ──────────────────────────────────────────────────────
const StarInput = ({ value, onChange }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className={`text-2xl transition-transform hover:scale-125 ${
          star <= value ? "text-amber-400" : "text-slate-200"
        }`}
      >
        ★
      </button>
    ))}
  </div>
);

// ─── Star Display (read-only) ───────────────────────────────────────────────
const StarDisplay = ({ rating, size = "text-sm" }) => (
  <span className={size}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={s <= rating ? "text-amber-400" : "text-slate-200"}>★</span>
    ))}
  </span>
);

// ─── Interaction type labels ────────────────────────────────────────────────
const typeLabel = {
  marketplace: { label: "Marketplace Trade", icon: "🏪", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  lost_found:  { label: "Lost & Found",       icon: "🔍", color: "bg-amber-50 text-amber-600 border-amber-100"   },
  bidding:     { label: "Bidding",            icon: "🔨", color: "bg-sky-50 text-sky-600 border-sky-100"         },
  general:     { label: "General",            icon: "💬", color: "bg-slate-50 text-slate-500 border-slate-100"   },
};

// ─── Single Review Card ─────────────────────────────────────────────────────
const ReviewCard = ({ review, currentUserId, onDelete }) => {
  const [deleting, setDeleting] = useState(false);
  const isOwn = review.reviewer?._id === currentUserId;
  const meta = typeLabel[review.interactionType] || typeLabel.general;
  const avatarSrc = review.reviewer?.profileImage
    ? review.reviewer.profileImage.startsWith("http")
      ? review.reviewer.profileImage
      : `http://localhost:5000${review.reviewer.profileImage}`
    : null;

  const handleDelete = async () => {
    if (!window.confirm("Remove your review?")) return;
    setDeleting(true);
    await onDelete(review._id);
    setDeleting(false);
  };

  return (
    <div className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-indigo-100 shrink-0">
            {avatarSrc
              ? <img src={avatarSrc} alt={review.reviewer?.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-indigo-600 font-black text-lg">
                  {review.reviewer?.name?.charAt(0).toUpperCase() || "?"}
                </div>
            }
          </div>
          <div>
            <p className="text-sm font-black text-slate-800 leading-none">{review.reviewer?.name || "Anonymous"}</p>
            <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest">
              {review.reviewer?.studentId || "—"}
            </p>
          </div>
        </div>

        {/* Interaction badge */}
        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border whitespace-nowrap ${meta.color}`}>
          {meta.icon} {meta.label}
        </span>
      </div>

      {/* Stars */}
      <div className="flex items-center gap-2 mb-3">
        <StarDisplay rating={review.rating} />
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
          {review.rating}/5
        </span>
      </div>

      {/* Comment */}
      {review.comment && (
        <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-2 border-indigo-100 pl-3 mb-4">
          "{review.comment}"
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
        </span>
        {isOwn && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-[10px] font-black text-rose-400 hover:text-rose-600 uppercase tracking-widest transition-colors disabled:opacity-50"
          >
            {deleting ? "Removing..." : "Delete"}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Submit Form ────────────────────────────────────────────────────────────
const SubmitReviewForm = ({ targetUserId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [interactionType, setInteractionType] = useState("general");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1) { toast.error("Please select a star rating."); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await submitReview(token, {
        reviewedUserId: targetUserId,
        rating,
        comment,
        interactionType,
      });
      toast.success("Review submitted!");
      setRating(0); setComment(""); setInteractionType("general");
      onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to submit review.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/60 to-indigo-50/20 border border-indigo-100 rounded-[2rem] p-7 mb-8">
      <h4 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-6 flex items-center gap-2">
        <span className="w-6 h-6 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xs">✏️</span>
        Leave a Review
      </h4>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Star picker */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Your Rating *
          </label>
          <StarInput value={rating} onChange={setRating} />
        </div>

        {/* Interaction type */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Interaction Type *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(typeLabel).map(([key, meta]) => (
              <button
                key={key}
                type="button"
                onClick={() => setInteractionType(key)}
                className={`py-2.5 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  interactionType === key
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                    : "bg-white text-slate-500 border-slate-100 hover:border-indigo-200"
                }`}
              >
                {meta.icon} {meta.label}
              </button>
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            Comment (optional · max 500 chars)
          </label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            placeholder="Share your experience with this member..."
            className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-200 transition-all resize-none"
          />
          <p className="text-[10px] text-slate-300 font-bold text-right mt-1">{comment.length}/500</p>
        </div>

        <button
          type="submit"
          disabled={submitting || rating < 1}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0"
        >
          {submitting ? "Submitting..." : "Submit Review →"}
        </button>
      </form>
    </div>
  );
};

// ─── Main ReviewSection Component ───────────────────────────────────────────
const ReviewSection = ({ profileUserId, currentUser }) => {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?._id === profileUserId;
  const isLoggedIn = Boolean(currentUser);

  const fetchReviews = useCallback(async () => {
    if (!profileUserId) return;
    setLoading(true);
    try {
      const res = await getReviewsForUser(profileUserId);
      setReviews(res.data.reviews || []);
      setAvgRating(res.data.avgRating);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  }, [profileUserId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleDelete = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      await deleteReview(token, reviewId);
      toast.success("Review removed.");
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete review.");
    }
  };

  return (
    <div className="pt-2 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Community Testimonials</h2>
          <p className="text-sm text-slate-400 font-medium mt-0.5">Feedback from real interactions</p>
        </div>
        {total > 0 && (
          <div className="flex flex-col items-end">
            <span className="text-4xl font-black text-indigo-600 leading-none">{avgRating}</span>
            <StarDisplay rating={Math.round(avgRating)} size="text-base" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-0.5">{total} review{total !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Submit form — only shown to logged-in users viewing someone else's profile */}
      {isLoggedIn && !isOwnProfile && (
        <SubmitReviewForm targetUserId={profileUserId} onSuccess={fetchReviews} />
      )}

      {/* Own profile notice */}
      {isOwnProfile && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4 mb-8 flex items-center gap-3">
          <span className="text-indigo-400 text-xl">ℹ️</span>
          <p className="text-sm font-bold text-indigo-600">This is your profile. Others can leave reviews after interacting with you.</p>
        </div>
      )}

      {/* Not logged in notice */}
      {!isLoggedIn && (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 mb-8">
          <p className="text-sm font-bold text-slate-500">Log in to leave a review for this member.</p>
        </div>
      )}

      {/* Review list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
          {[1, 2].map(i => <div key={i} className="h-36 bg-slate-100 rounded-[2rem]" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
          <div className="text-4xl mb-3 opacity-20 font-black text-slate-400">★★★★★</div>
          <p className="text-sm text-slate-400 font-medium italic">No reviews yet. Be the first to share your experience.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUserId={currentUser?._id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
