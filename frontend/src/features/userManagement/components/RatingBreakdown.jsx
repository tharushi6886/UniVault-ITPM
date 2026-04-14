import React from "react";

const RatingBreakdown = ({ reviews }) => {
  const total = reviews.length;
  
  // Calculate star distribution
  const distribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    return {
      star,
      count,
      pct: total > 0 ? (count / total) * 100 : 0
    };
  });

  // Calculate category split
  const marketReviews = reviews.filter(r => r.category === "marketplace");
  const lfReviews = reviews.filter(r => r.category === "lost_found");
  
  const getAvg = (arr) => {
    if (arr.length === 0) return 0;
    return (arr.reduce((sum, r) => sum + r.rating, 0) / arr.length).toFixed(1);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Star Bar Chart */}
        <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">Rating Distribution</h4>
          <div className="space-y-4">
            {distribution.map((item) => (
              <div key={item.star} className="flex items-center gap-4">
                <span className="text-[11px] font-black text-slate-400 w-12">{item.star} Stars</span>
                <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div 
                    className="h-full bg-[#F0A500] rounded-full transition-all duration-1000"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-600 w-8">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <h4 className="text-[11px] font-black text-indigo-400 uppercase tracking-widest mb-8 relative z-10">Sector Performance</h4>
           
           <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🛍️</span>
                  <div>
                    <p className="text-xs font-black">Marketplace</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{marketReviews.length} Reviews</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-indigo-400">{getAvg(marketReviews)}</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AVG RATING</p>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔍</span>
                  <div>
                    <p className="text-xs font-black">Lost & Found</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{lfReviews.length} Reviews</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-emerald-400">{getAvg(lfReviews)}</p>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">AVG RATING</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Guidance Card */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-md border border-indigo-100 shrink-0">📈</div>
        <div className="flex-1 text-center md:text-left">
          <h5 className="text-[13px] font-black text-indigo-900 uppercase tracking-widest mb-2 font-epilogue">How to earn more Elite Status?</h5>
          <p className="text-sm font-medium text-indigo-700 leading-relaxed">
            Verified reviews carry 2.5x more weight in your trust score. Request feedback immediately after returning a lost item or completing a marketplace sale to maximize your reputation growth.
          </p>
        </div>
        <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg hover:bg-indigo-700 transition-all whitespace-nowrap">
          Learn More →
        </button>
      </div>
    </div>
  );
};

export default RatingBreakdown;
