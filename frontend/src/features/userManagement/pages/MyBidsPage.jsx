import React, { useEffect, useState } from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";
import { getMyBids } from "../../../api/bidApi";
import { toast } from "react-toastify";

const MyBidsPage = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getMyBids(token);
        setBids(res.data.bids || []);
      } catch (err) {
        console.error("Bidding fetch error:", err);
        toast.error("Failed to sync your bidding records");
      } finally {
        setLoading(false);
      }
    };
    fetchBids();
  }, []);

  return (
    <ProfileSectionLayout
      title="My Bidding Ledger"
      description="Track your active participation and historical bids across the marketplace."
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Vault...</p>
        </div>
      ) : bids.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/30">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-xl mb-8 opacity-20 transform -rotate-12">🎯</div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2 font-epilogue">No Bid History Found</h3>
          <p className="text-slate-400 text-sm font-medium mb-8 text-center max-w-sm">Participate in auctions across the marketplace to see your active history here.</p>
          <a href="/marketplace" className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-indigo-600 hover:-translate-y-1 transition-all">
            Explore Marketplace
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-10 px-2">
             <div className="flex items-center gap-4">
                <div className="w-1.5 h-8 bg-rose-500 rounded-full"></div>
                <div>
                   <h3 className="text-lg font-black text-slate-800 tracking-tight font-epilogue leading-none mb-1">Active Participation</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Bids Transmitted: {bids.length}</p>
                </div>
             </div>
          </div>

          <div className="overflow-hidden bg-white/50 rounded-3xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item / Designation</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Your Bid</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {bids.map((bid) => (
                  <tr key={bid._id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform flex items-center justify-center p-1">
                          {bid.bidItem?.image ? (
                             <img 
                               src={bid.bidItem.image.startsWith('http') ? bid.bidItem.image : `http://localhost:5000${bid.bidItem.image}`} 
                               alt="" 
                               className="w-full h-full object-cover rounded-xl"
                             />
                          ) : (
                             <span className="text-xl">📦</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 font-epilogue leading-tight mb-0.5">{bid.bidItem?.title || "Unknown Item"}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bid.bidItem?.category || "General"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-black text-indigo-600 font-epilogue">LKR {bid.amount.toLocaleString()}</span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`inline-flex px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                        bid.status === 'won' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        bid.status === 'outbid' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-blue-50 text-blue-600 border-blue-100'
                      }`}>
                        {bid.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <p className="text-xs font-black text-slate-700">{new Date(bid.createdAt).toLocaleDateString()}</p>
                       <p className="text-[10px] font-bold text-slate-400">{new Date(bid.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-4">
             <div className="w-10 h-10 rounded-xl bg-white text-indigo-500 flex items-center justify-center shadow-sm border border-indigo-100 flex-shrink-0">💡</div>
             <p className="text-sm text-indigo-900 font-medium leading-relaxed">
              <strong>Bidding Protocol:</strong> Your bids are locked once transmitted. If you are outbid, you will receive an immediate notification to update your valuation.
             </p>
          </div>
        </div>
      )}
    </ProfileSectionLayout>
  );
};

export default MyBidsPage;