import React, { useEffect, useState } from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";
import { getMyFoundItems, updateFoundItem } from "../../../api/itemApi";
import { getProfile } from "../../../api/userApi";
import { toast } from "react-toastify";

const FoundReturnedPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userTrust, setUserTrust] = useState("Standard");

  // Management State
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const [itemsRes, profileRes] = await Promise.all([
        getMyFoundItems(token),
        getProfile(token)
      ]);
      setItems(itemsRes.data);
      setUserTrust(profileRes.data?.trust?.level || "Standard");
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolve = async (item) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      await updateFoundItem(item._id, { status: "returned" }, token);
      toast.success("Found item officially returned in Vault ledger!");
      fetchData();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const { _id, title, category, description } = editingItem;
      await updateFoundItem(_id, { title, category, description }, token);
      toast.success("Vault record synchronized!");
      setIsEditModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Encryption update failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ProfileSectionLayout
      title="Found Items Returned"
      description="Displays all lost items you have found and reported/returned."
    >
      {loading ? (
        <div className="flex justify-center p-8"><span className="text-gray-500">Loading...</span></div>
      ) : items.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-16 border border-white text-center shadow-inner">
          <div className="text-6xl mb-6 opacity-20 italic font-black text-slate-400">#ZERO_RETURNS</div>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] max-w-xs mx-auto">No found item entries registered in your personal vault activity.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
          {items.map((item) => (
            <div key={item._id} className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>
               
               <div className="relative z-10">
                 <div className="flex items-start justify-between mb-6">
                   <div className="p-5 bg-sky-50 text-sky-600 rounded-2xl shadow-inner text-3xl group-hover:scale-110 transition-all duration-500">
                     🤝
                   </div>
                   <div className="flex flex-col items-end gap-1.5">
                      <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        item.status === "active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-sky-50 text-sky-600 border-sky-100"
                      }`}>
                        {item.status}
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-100">
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Vault Trust:</span>
                         <span className="text-[10px] font-black text-sky-500 uppercase">{userTrust}</span>
                      </div>
                   </div>
                 </div>

                 <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight mb-2 group-hover:text-sky-600 transition-colors">
                   {item.title}
                 </h3>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Sector: {item.category}</p>
                 
                 <div className="flex items-center justify-between pt-6 border-t border-slate-50 mb-8">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Observation Date</span>
                      <span className="text-sm font-black text-slate-700">{new Date(item.date).toLocaleDateString()}</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Origin</span>
                      <span className="text-[11px] font-black text-slate-500 truncate max-w-[100px]">{item.location || "Central Campus"}</span>
                   </div>
                 </div>

                 <div className="flex gap-3">
                   <button 
                     onClick={() => { setEditingItem(item); setIsEditModalOpen(true); }}
                     className="flex-1 py-3.5 rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 text-xs font-black uppercase tracking-widest transition-all border border-slate-100 flex items-center justify-center gap-2 shadow-sm"
                   >
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                     Modify
                   </button>
                   <button 
                     onClick={() => handleResolve(item)}
                     disabled={item.status === 'returned'}
                     className={`px-5 py-3.5 rounded-2xl bg-sky-500 text-white hover:bg-sky-600 shadow-xl shadow-sky-100 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none transition-all flex items-center justify-center`}
                   >
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                   </button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* SYNCED EDIT MODAL */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade-in">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsEditModalOpen(false)}></div>
           <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-white overflow-hidden animate-fade-in-up">
              <div className="bg-sky-500 p-10 text-white relative">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                 <h3 className="text-2xl font-black tracking-tight uppercase tracking-tighter">Edit Resolution</h3>
                 <p className="text-sky-100 text-sm font-bold uppercase tracking-widest mt-1">UUID: {editingItem._id?.slice(-8)}</p>
              </div>
              <form onSubmit={handleUpdate} className="p-10 space-y-6">
                <div className="space-y-4">
                  <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700" value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} placeholder="Title" />
                  <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700" value={editingItem.category} onChange={e => setEditingItem({...editingItem, category: e.target.value})} placeholder="Category" />
                  <textarea className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-700 resize-none h-32" value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} placeholder="Description"></textarea>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl text-xs font-black uppercase text-slate-500 tracking-widest">Abort</button>
                  <button type="submit" disabled={isSaving} className="flex-1 py-4 bg-sky-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-sky-100">{isSaving ? "Syncing..." : "Update Vault →"}</button>
                </div>
              </form>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}} />
    </ProfileSectionLayout>
  );
};

export default FoundReturnedPage;