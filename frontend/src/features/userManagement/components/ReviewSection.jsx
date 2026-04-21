import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReceivedReviews from "./ReceivedReviews";
import GivenReviews from "./GivenReviews";
import RatingBreakdown from "./RatingBreakdown";
import { getReviewsForUser, getPendingReviews, submitReview } from "../../../api/reviewApi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const ReviewSection = ({ profileUserId, currentUser }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(location.hash.replace("#", "") || "received");
  const [pendingReviews, setPendingReviews] = useState([]);
  const [reviews, setReviews] = useState([]); // All received reviews for statistics
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ rating: 0, comment: "", category: "marketplace" });

  const isOwnProfile = currentUser && currentUser._id === profileUserId;
  const token = localStorage.getItem("token");

  // Sync tab with URL hash
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && ["received", "given", "breakdown"].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location.hash]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`${location.pathname}#${tab}`);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getReviewsForUser(profileUserId);
        setReviews(res.data.reviews || []);
      } catch (err) { console.error(err); }
    };
    fetchStats();
    
    if (isOwnProfile && token) {
      const fetchPending = async () => {
        try {
          const res = await getPendingReviews(token);
          setPendingReviews(res.data.pending || []);
        } catch (err) { console.error(err); }
      };
      fetchPending();
    }
  }, [profileUserId, isOwnProfile, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) return toast.error("Please select a rating");
    setSubmitting(true);
    try {
      await submitReview(token, {
        reviewedUserId: profileUserId,
        ...formData,
        interactionType: formData.category // mapped for legacy backend support
      });
      toast.success("Reputation shared successfully!");
      setIsModalOpen(false);
      window.location.reload(); // Refresh to see new scores
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-2">
      {/* Pending Feedback Banner */}
      {isOwnProfile && pendingReviews.length > 0 && (
        <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-pulse-subtle">
           <div className="flex items-center gap-4">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-sm font-black text-amber-900 uppercase tracking-widest leading-none mb-1">Feedback Needed</p>
                <p className="text-xs font-bold text-amber-700">You have {pendingReviews.length} pending interactions. Share your experience to help the community.</p>
              </div>
           </div>
           <button className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-amber-600 transition-all">
             Leave Reviews →
           </button>
        </div>
      )}

      {/* Modern Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
        <div className="max-w-xl">
           <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-sm border border-indigo-100/50">
                🌠
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight font-epilogue uppercase">Reputation Ledger</h2>
                <div className="flex items-center gap-2 mt-0.5">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Vault Identity</p>
                </div>
              </div>
           </div>
           <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
             Your social integrity score is built on verified student interactions. This ledger tracks testimonials from marketplace trades and lost/found resolutions.
           </p>
        </div>

        {!isOwnProfile && (
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(15,23,42,0.2)] hover:bg-indigo-600 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3 group"
           >
             <span className="text-base group-hover:rotate-12 transition-transform">✍️</span> Share Experience
           </button>
        )}
      </div>

      {/* Navigation Ecosystem - Pill Style */}
      <div className="flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-slate-100 pb-1">
        <div className="flex gap-2">
          {[
            { id: "received", label: `Received (${reviews.length})` },
            { id: "given", label: "Given", hide: !isOwnProfile },
            { id: "breakdown", label: "Analytics", hide: !isOwnProfile }
          ].filter(t => !t.hide).map((tab) => (
            <button 
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`relative px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                activeTab === tab.id 
                  ? "text-slate-900" 
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="feedback-tab-bg"
                  className="absolute inset-0 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-100 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === "received" && <ReceivedReviews userId={profileUserId} isOwnProfile={isOwnProfile} />}
        {activeTab === "given" && <GivenReviews />}
        {activeTab === "breakdown" && <RatingBreakdown reviews={reviews} />}
      </div>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
           <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl animate-scale-in">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-black text-slate-900 uppercase">Submit Feedback</h3>
                 <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">✕</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Overall Rating</label>
                    <div className="flex gap-2">
                       {[1, 2, 3, 4, 5].map(star => (
                         <button 
                           key={star} 
                           type="button" 
                           onClick={() => setFormData({...formData, rating: star})}
                           className={`text-3xl transition-transform hover:scale-125 ${star <= formData.rating ? 'text-[#F0A500]' : 'text-slate-200'}`}
                         >
                           ★
                         </button>
                       ))}
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Category</label>
                    <div className="grid grid-cols-2 gap-3">
                       {["marketplace", "lost_found"].map(cat => (
                         <button 
                           key={cat}
                           type="button"
                           onClick={() => setFormData({...formData, category: cat})}
                           className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.category === cat ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
                         >
                           {cat.replace("_", " & ")}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Your Testimonial</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all resize-none"
                      rows={4}
                      placeholder="Share your experience..."
                      maxLength={280}
                      value={formData.comment}
                      onChange={(e) => setFormData({...formData, comment: e.target.value})}
                    />
                    <p className="text-[10px] text-right font-bold text-slate-300 mt-2">{formData.comment.length}/280</p>
                 </div>

                 <button 
                   disabled={submitting}
                   className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                 >
                   {submitting ? "Transmitting..." : "Broadcast Review →"}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
