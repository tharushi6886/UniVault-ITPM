import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getMyBids, getReceivedBids, updateBidStatus } from "../../../api/bidApi";
import { getAllBidItems, getMyBidItems, createBidItem, updateBidItemStatus, deleteBidItem } from "../../../api/bidItemApi";
import { placeBid } from "../../../api/bidApi";
import { submitReview, getMyGivenReviews, getReviewsForUser, getMyReceivedReviews } from "../../../api/reviewApi";
import { submitComplaint, getMyComplaints, getComplaintsAgainstMe, replyToComplaint, buyerReplyToComplaint, sendComplaintMessage, editComplaintMessage, deleteComplaintMessage } from "../../../api/complaintApi";

const TABS = ["🛒 Browse Market", "📦 My Listed Items", "📥 Received Bids", "🎯 My Active Bids"];

const statusBadge = (status) => {
  const map = {
    pending: "bg-amber-50 text-amber-600 border-amber-200",
    accepted: "bg-emerald-50 text-emerald-600 border-emerald-200",
    rejected: "bg-rose-50 text-rose-600 border-rose-200",
    active: "bg-violet-50 text-violet-600 border-violet-200",
    closed: "bg-slate-50 text-slate-500 border-slate-200",
    sold: "bg-blue-50 text-blue-600 border-blue-200",
  };
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${map[status] || map.pending}`;
};

const emptyForm = { title: "", description: "", category: "Other", condition: "used", startingPrice: "", image: "" };

export default function Bid() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [activeTab, setActiveTab] = useState(0);
  const [allBidItems, setAllBidItems] = useState([]);
  const [myBidItems, setMyBidItems] = useState([]);
  const [receivedBids, setReceivedBids] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bidTarget, setBidTarget] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidMessage, setBidMessage] = useState("");
  const [bidLoading, setBidLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);

  const [filterTab, setFilterTab] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [noteMap, setNoteMap] = useState({});

  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewedBidIds, setReviewedBidIds] = useState(new Set());
  const [sellerRatings, setSellerRatings] = useState({});
  const [bidderRatings, setBidderRatings] = useState({});

  const [myBidReviews, setMyBidReviews] = useState({});
  const [myBidComplaints, setMyBidComplaints] = useState({});

  const [complaintTarget, setComplaintTarget] = useState(null);
  const [complaintType, setComplaintType] = useState("fraud");
  const [complaintSubject, setComplaintSubject] = useState("");
  const [complaintDesc, setComplaintDesc] = useState("");
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [filedComplaintBidIds, setFiledComplaintBidIds] = useState(new Set());

  const [reviewedReceivedBidIds, setReviewedReceivedBidIds] = useState(new Set());
  const [complaintReceivedBidIds, setComplaintReceivedBidIds] = useState(new Set());

  const [reviewTargetUser, setReviewTargetUser] = useState(null);
  const [complaintTargetUser, setComplaintTargetUser] = useState(null);

  const [receivedBidReviews, setReceivedBidReviews] = useState({});
  const [receivedBidComplaints, setReceivedBidComplaints] = useState({});

  const [replyTextMap, setReplyTextMap] = useState({});
  const [replyLoadingId, setReplyLoadingId] = useState(null);

  const [buyerReplyTextMap, setBuyerReplyTextMap] = useState({});
  const [buyerReplyLoadingId, setBuyerReplyLoadingId] = useState(null);

  const [chatMsgMap, setChatMsgMap] = useState({});
  const [chatLoadingId, setChatLoadingId] = useState(null);

  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editLoadingId, setEditLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    loadAll();
    loadGivenReviews();
    loadMyComplaints();
    loadSellerGivenReviews();
    loadSellerComplaints();
    loadBuyerFeedbackOnMe();
  }, []);

  const loadGivenReviews = async () => {
    try {
      const res = await getMyGivenReviews(token);
      const given = res.data.reviews || [];
      const ids = new Set(given.map((r) => r.linkedInteractionId).filter(Boolean));
      setReviewedBidIds(ids);
      const rvMap = {};
      given.forEach((r) => { if (r.linkedInteractionId) rvMap[r.linkedInteractionId] = r; });
      setMyBidReviews(rvMap);
    } catch { }
  };

  const loadMyComplaints = async () => {
    try {
      const res = await getMyComplaints(token);
      const complaints = res.data.complaints || [];
      const ids = new Set(complaints.map((c) => c.linkedItemId).filter(Boolean));
      setFiledComplaintBidIds(ids);
      const cpMap = {};
      complaints.forEach((c) => { if (c.linkedItemId) cpMap[c.linkedItemId] = c; });
      setMyBidComplaints(cpMap);
    } catch { }
  };

  const loadSellerGivenReviews = async () => {
    try {
      const res = await getMyGivenReviews(token);
      const given = res.data.reviews || [];
      const ids = new Set(given.filter(r => r.interactionType === "bidding").map(r => r.linkedInteractionId).filter(Boolean));
      setReviewedReceivedBidIds(ids);
    } catch { }
  };

  const loadSellerComplaints = async () => {
    try {
      const res = await getMyComplaints(token);
      const complaints = res.data.complaints || [];
      const ids = new Set(complaints.filter(c => c.category === "bidding").map(c => c.linkedItemId).filter(Boolean));
      setComplaintReceivedBidIds(ids);
    } catch { }
  };

  const loadBuyerFeedbackOnMe = async () => {
    try {
      const [rvRes, cpRes] = await Promise.all([
        getMyReceivedReviews(token),
        getComplaintsAgainstMe(token),
      ]);
      const rvMap = {};
      (rvRes.data.reviews || []).forEach((r) => { if (r.linkedInteractionId) rvMap[r.linkedInteractionId] = r; });
      setReceivedBidReviews(rvMap);
      const cpMap = {};
      (cpRes.data.complaints || []).forEach((c) => { if (c.linkedItemId) cpMap[c.linkedItemId] = c; });
      setReceivedBidComplaints(cpMap);
    } catch (err) { console.error(err); }
  };

  const handleReplyToComplaint = async (complaintId, bidId) => {
    const text = (replyTextMap[complaintId] || "").trim();
    if (!text) { toast.error("Reply cannot be empty."); return; }
    setReplyLoadingId(complaintId);
    try {
      await replyToComplaint(token, complaintId, text);
      toast.success("Reply submitted!");
      setReceivedBidComplaints((prev) => ({
        ...prev,
        [bidId]: { ...prev[bidId], accused_reply: text, repliedAt: new Date().toISOString() },
      }));
      setReplyTextMap((prev) => ({ ...prev, [complaintId]: "" }));
    } catch (err) { toast.error("Failed to submit reply."); } finally { setReplyLoadingId(null); }
  };

  const handleBuyerReplyToComplaint = async (complaintId, bidId) => {
    const text = (buyerReplyTextMap[complaintId] || "").trim();
    if (!text) { toast.error("Reply cannot be empty."); return; }
    setBuyerReplyLoadingId(complaintId);
    try {
      await buyerReplyToComplaint(token, complaintId, text);
      toast.success("Your reply submitted!");
      setMyBidComplaints((prev) => ({
        ...prev,
        [bidId]: { ...prev[bidId], complainant_reply: text, complainantRepliedAt: new Date().toISOString() },
      }));
      setBuyerReplyTextMap((prev) => ({ ...prev, [complaintId]: "" }));
    } catch (err) { toast.error("Failed to submit reply."); } finally { setBuyerReplyLoadingId(null); }
  };

  const handleSendComplaintMessage = async (complaintId, bidId, isSellerSending) => {
    const text = (chatMsgMap[complaintId] || "").trim();
    if (!text) { toast.error("Message cannot be empty."); return; }
    setChatLoadingId(complaintId);
    try {
      const res = await sendComplaintMessage(token, complaintId, text);
      const newMessages = res.data.messages || [];
      toast.success("Message sent.");
      setChatMsgMap((prev) => ({ ...prev, [complaintId]: "" }));
      if (isSellerSending) {
        setReceivedBidComplaints((prev) => ({ ...prev, [bidId]: { ...prev[bidId], messages: newMessages } }));
      } else {
        setMyBidComplaints((prev) => ({ ...prev, [bidId]: { ...prev[bidId], messages: newMessages } }));
      }
    } catch (err) { toast.error("Failed to send message."); } finally { setChatLoadingId(null); }
  };

  const applyMessagesToMaps = (bidId, complaintId, newMessages) => {
    setReceivedBidComplaints((prev) => prev[bidId] ? { ...prev, [bidId]: { ...prev[bidId], messages: newMessages } } : prev);
    setMyBidComplaints((prev) => prev[bidId] ? { ...prev, [bidId]: { ...prev[bidId], messages: newMessages } } : prev);
  };

  const handleEditComplaintMessage = async (complaintId, msgId, bidId) => {
    const text = editingText.trim();
    if (!text) { toast.error("Message cannot be empty."); return; }
    setEditLoadingId(msgId);
    try {
      const res = await editComplaintMessage(token, complaintId, msgId, text);
      applyMessagesToMaps(bidId, complaintId, res.data.messages || []);
      setEditingMsgId(null);
      setEditingText("");
      toast.success("Message updated!");
    } catch (err) { toast.error("Failed to edit message."); } finally { setEditLoadingId(null); }
  };

  const handleDeleteComplaintMessage = async (complaintId, msgId, bidId) => {
    if (!window.confirm("Delete this message?")) return;
    setDeleteLoadingId(msgId);
    try {
      const res = await deleteComplaintMessage(token, complaintId, msgId);
      applyMessagesToMaps(bidId, complaintId, res.data.messages || []);
      toast.success("Message deleted.");
    } catch (err) { toast.error("Failed to delete message."); } finally { setDeleteLoadingId(null); }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!complaintSubject.trim() || !complaintDesc.trim()) { toast.error("Subject and description are required."); return; }
    setComplaintLoading(true);
    try {
      const isSeller = complaintTarget.isSeller || false;
      const targetUserId = isSeller
        ? (complaintTarget.bid.bidder?._id || complaintTarget.bid.bidder)
        : (complaintTarget.bid.bidItem?.seller?._id || complaintTarget.bid.bidItem?.seller);
      await submitComplaint(token, {
        accusedUserId: targetUserId,
        category: "bidding",
        type: complaintType,
        subject: complaintSubject.trim(),
        description: complaintDesc.trim(),
        linkedItemId: complaintTarget.bid._id,
      });
      toast.success("Complaint submitted successfully.");
      if (isSeller) {
        setComplaintReceivedBidIds((prev) => new Set([...prev, complaintTarget.bid._id]));
      } else {
        setFiledComplaintBidIds((prev) => new Set([...prev, complaintTarget.bid._id]));
      }
      setComplaintTarget(null);
    } catch (err) { toast.error("Submission failed."); } finally { setComplaintLoading(false); }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) { toast.error("Select rating."); return; }
    setReviewLoading(true);
    try {
      const isSeller = reviewTarget.isSeller || false;
      const targetUserId = isSeller
        ? (reviewTarget.bid.bidder?._id || reviewTarget.bid.bidder)
        : (reviewTarget.bid.bidItem?.seller?._id || reviewTarget.bid.bidItem?.seller);
      await submitReview(token, {
        reviewedUserId: targetUserId,
        rating: reviewRating,
        comment: reviewComment.trim(),
        interactionType: "bidding",
        category: "marketplace",
        linkedInteractionId: reviewTarget.bid._id,
      });
      toast.success("Review submitted!");
      if (isSeller) {
        setReviewedReceivedBidIds((prev) => new Set([...prev, reviewTarget.bid._id]));
      } else {
        setReviewedBidIds((prev) => new Set([...prev, reviewTarget.bid._id]));
      }
      setReviewTarget(null);
    } catch (err) { toast.error("Review failed."); } finally { setReviewLoading(false); }
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [allRes, itemsRes, receivedRes, myBidsRes] = await Promise.all([
        getAllBidItems(),
        getMyBidItems(token),
        getReceivedBids(token),
        getMyBids(token),
      ]);
      const allItems = allRes.data.items || [];
      const currentId = currentUser?._id || currentUser?.id || "";
      const filtered = allItems.filter((i) => String(i.seller?._id) !== String(currentId));
      setAllBidItems(filtered);
      setMyBidItems(itemsRes.data.items || []);
      setReceivedBids(receivedRes.data.bids || []);
      setMyBids(myBidsRes.data.bids || []);

      const uniqueSellerIds = [...new Set(filtered.map((i) => i.seller?._id).filter(Boolean))];
      if (uniqueSellerIds.length > 0) {
        const ratingResults = await Promise.all(
          uniqueSellerIds.map((id) => getReviewsForUser(id).then((r) => ({ id, ...r.data })).catch(() => ({ id, avgRating: null, total: 0 })))
        );
        const map = {};
        ratingResults.forEach(({ id, avgRating, total }) => { map[id] = { avgRating, total: total || 0 }; });
        setSellerRatings(map);
      }

      const uniqueBidderIds = [...new Set((receivedRes.data.bids || []).map((b) => b.bidder?._id).filter(Boolean))];
      if (uniqueBidderIds.length > 0) {
        const bidderResults = await Promise.all(
          uniqueBidderIds.map((id) => getReviewsForUser(id).then((r) => ({ id, ...r.data })).catch(() => ({ id, avgRating: null, total: 0 })))
        );
        const bmap = {};
        bidderResults.forEach(({ id, avgRating, total }) => { bmap[id] = { avgRating, total: total || 0 }; });
        setBidderRatings(bmap);
      }
    } catch { toast.error("Data load failed."); } finally { setLoading(false); }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!bidAmount || Number(bidAmount) < 1) { toast.error("Invalid amount."); return; }
    setBidLoading(true);
    try {
      await placeBid(token, { bidItemId: bidTarget._id, amount: Number(bidAmount), message: bidMessage });
      toast.success("Bid placed!");
      setBidTarget(null); loadAll();
    } catch (err) { toast.error(err.response?.data?.message || "Failed."); } finally { setBidLoading(false); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFormData((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.startingPrice) { toast.error("Fields missing."); return; }
    setFormLoading(true);
    try {
      await createBidItem(token, { ...formData, startingPrice: Number(formData.startingPrice) });
      toast.success("Item listed!");
      setShowForm(false); setFormData(emptyForm); loadAll();
    } catch (err) { toast.error("Creation failed."); } finally { setFormLoading(false); }
  };

  const handleBidAction = async (bidId, status) => {
    setActionLoadingId(bidId);
    try {
      await updateBidStatus(token, bidId, { status, sellerNote: noteMap[bidId] || "" });
      toast.success(`Bid ${status}.`);
      loadAll();
    } catch { toast.error("Action failed."); } finally { setActionLoadingId(null); }
  };

  const handleCloseItem = async (id) => {
    try {
      await updateBidItemStatus(token, id, "closed");
      toast.success("Closed."); loadAll();
    } catch { toast.error("Failed."); }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete?")) return;
    try {
      await deleteBidItem(token, id);
      toast.success("Deleted."); loadAll();
    } catch { toast.error("Failed."); }
  };

  const filteredReceived = filterTab === "all" ? receivedBids : receivedBids.filter((b) => b.status === filterTab);

  const stats = {
    total: receivedBids.length,
    pending: receivedBids.filter((b) => b.status === "pending").length,
    accepted: receivedBids.filter((b) => b.status === "accepted").length,
    rejected: receivedBids.filter((b) => b.status === "rejected").length,
  };

  return (
    <div className="flex h-screen bg-slate-50 font-['Sora',sans-serif] text-slate-900 overflow-hidden relative">
      
      {/* Background Decor targeting the 'bg.png' from the public folder */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/bgg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Subtle overlay to ensure the foreground remains readable */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
      </div>

      {/* ===== SIDEBAR NAVIGATION (Desktop) ===== */}
      <aside className="w-72 bg-white/70 backdrop-blur-2xl border-r border-slate-200/50 hidden md:flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.04)]">
        {/* Sidebar Header */}
        <div className="p-8 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-violet-200">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Bid<span className="text-violet-600">Hub</span></h1>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">Campus Marketplace</p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {TABS.map((tabLabel, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={tabLabel}
                onClick={() => setActiveTab(idx)}
                className={`w-full flex items-center px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive 
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-200/50 scale-[1.02]" 
                    : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
                }`}
              >
                {tabLabel}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer (Action & Back) */}
        <div className="p-6 border-t border-slate-200/50 space-y-3 bg-white/30">
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-slate-800 shadow-xl hover:shadow-slate-300 transition-all active:scale-95"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4"><path d="M12 5v14M5 12h14" /></svg>
            List New Item
          </button>
          
          <button 
            onClick={() => navigate(-1)} 
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100/50 text-slate-500 font-bold hover:bg-slate-200 transition-all active:scale-95 text-xs"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M15 18l-6-6 6-6" /></svg>
            Back to Dashboard
          </button>
        </div>
      </aside>

      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="flex-1 relative flex flex-col h-screen overflow-hidden z-10">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden bg-white/80 backdrop-blur-xl border-b border-slate-200/60 px-5 py-4 flex items-center justify-between z-20 sticky top-0">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-600 active:scale-95">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <h1 className="text-lg font-black text-slate-900">BidHub</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-violet-600 text-white shadow-md active:scale-95">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        </header>

        {/* Mobile Top Navigation Tabs (Scrollable horizontally) */}
        <div className="md:hidden flex overflow-x-auto gap-2 px-4 py-3 bg-white/50 backdrop-blur-md border-b border-slate-200/60 z-10 snap-x hide-scrollbar">
          {TABS.map((tabLabel, idx) => (
            <button
              key={tabLabel}
              onClick={() => setActiveTab(idx)}
              className={`snap-center shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === idx ? "bg-violet-600 text-white shadow-md" : "bg-white/80 text-slate-500 border border-slate-200/50"
              }`}
            >
              {tabLabel}
            </button>
          ))}
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 pb-24 scroll-smooth">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-5">
              <div className="w-14 h-14 border-4 border-violet-600/20 border-t-violet-600 rounded-full animate-spin shadow-lg" />
              <p className="text-violet-700 font-black animate-pulse text-sm uppercase tracking-widest bg-white/50 px-4 py-2 rounded-full backdrop-blur-sm">Syncing Market...</p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto">
              
              {/* Contextual Header based on active tab */}
              <div className="hidden md:block mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 drop-shadow-sm">{TABS[activeTab].split(" ")[1]} {TABS[activeTab].split(" ")[2] || ""}</h2>
                <p className="text-sm font-semibold text-slate-700 mt-2 bg-white/40 inline-block px-3 py-1 rounded-full backdrop-blur-sm">Manage your interactions and discover campus deals.</p>
              </div>

              {/* TAB 0: Browse Items */}
              {activeTab === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {allBidItems.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-32 text-center bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white shadow-sm">
                      <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-5xl mb-6 shadow-sm rotate-[-10deg]">🔍</div>
                      <h3 className="text-2xl font-black text-slate-800">The market is asleep</h3>
                      <p className="text-slate-600 max-w-sm mt-3 font-medium">No active listings from other students yet. Be the first to spark some interest!</p>
                    </div>
                  ) : (
                    allBidItems.map((item) => (
                      <div key={item._id} className="group bg-white/80 backdrop-blur-lg rounded-[2.5rem] border border-white shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 hover:border-violet-100/50 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer">
                        <div className="relative h-60 m-3 rounded-[2rem] overflow-hidden bg-slate-100/50">
                          {item.image ? (
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">📦</div>
                          )}
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-violet-700 shadow-sm">{item.condition}</span>
                            <span className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase text-white shadow-sm">{item.category}</span>
                          </div>
                        </div>

                        <div className="px-6 pb-6 pt-3 flex-1 flex flex-col">
                          <h3 className="text-xl font-extrabold text-slate-900 leading-tight mb-3 line-clamp-1 group-hover:text-violet-600 transition-colors">{item.title}</h3>
                          
                          <div className="flex items-center gap-3 mb-5">
                             {(() => {
                              const sr = sellerRatings[item.seller?._id];
                              const avg = sr?.avgRating ? parseFloat(sr.avgRating) : null;
                              return (
                                <div className="flex items-center gap-1.5 bg-amber-50/80 backdrop-blur-sm px-2.5 py-1 rounded-xl border border-amber-100">
                                  <span className="text-amber-500 text-sm">★</span>
                                  <span className="text-xs font-bold text-amber-700">{avg ? avg.toFixed(1) : "New"}</span>
                                </div>
                              );
                             })()}
                             <span className="text-xs font-semibold text-slate-500">Sold by {item.seller?.name || "Student"}</span>
                          </div>

                          <div className="mt-auto flex items-center justify-between gap-4 bg-white/60 p-4 rounded-3xl border border-white group-hover:bg-violet-50/80 transition-colors">
                            <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Bid</p>
                              <p className="text-2xl font-black text-violet-700">LKR {Number(item.startingPrice).toLocaleString()}</p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); setBidTarget(item); setBidAmount(Math.round(item.startingPrice * 1.1)); }}
                              className="px-6 py-3 bg-white border-2 border-violet-100 text-violet-700 text-sm font-black rounded-2xl group-hover:bg-violet-600 group-hover:border-violet-600 group-hover:text-white transition-all shadow-sm active:scale-95"
                            >
                              Place a Bid
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 1: My Bid Items */}
              {activeTab === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {myBidItems.length === 0 ? (
                    <div className="col-span-full py-32 text-center bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white shadow-sm">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-sm">🏷️</div>
                      <h3 className="text-2xl font-black text-slate-800">Your inventory is empty</h3>
                      <p className="text-slate-600 font-medium mt-2">Time to declutter and list some items for bidding.</p>
                    </div>
                  ) : (
                    myBidItems.map((item) => (
                      <div key={item._id} className="bg-white/80 backdrop-blur-lg rounded-[2rem] p-5 border border-white shadow-sm hover:shadow-lg transition-all">
                         <div className="relative h-48 rounded-[1.5rem] overflow-hidden bg-slate-100/50 mb-5">
                          {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center opacity-20 text-5xl">📦</div>}
                          <div className="absolute top-3 right-3"><span className={statusBadge(item.status)}>{item.status}</span></div>
                         </div>
                         <h4 className="text-lg font-bold text-slate-900 px-1 line-clamp-1">{item.title}</h4>
                         <div className="flex justify-between items-center mt-4 bg-white/60 p-4 rounded-[1.5rem] border border-white">
                            <div>
                              <p className="text-[10px] font-bold text-slate-500 uppercase">Starting Price</p>
                              <span className="text-xl font-black text-violet-700">LKR {Number(item.startingPrice).toLocaleString()}</span>
                            </div>
                            <button onClick={() => handleDeleteItem(item._id)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
                            </button>
                         </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: Received Bids (Seller View) */}
              {activeTab === 2 && (
                <div className="max-w-5xl space-y-8">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Total Received", val: stats.total, color: "text-indigo-700", bg: "bg-indigo-50/80", border: "border-indigo-100" },
                      { label: "Awaiting Action", val: stats.pending, color: "text-amber-700", bg: "bg-amber-50/80", border: "border-amber-100" },
                      { label: "Accepted Bids", val: stats.accepted, color: "text-emerald-700", bg: "bg-emerald-50/80", border: "border-emerald-100" },
                      { label: "Rejected Bids", val: stats.rejected, color: "text-rose-700", bg: "bg-rose-50/80", border: "border-rose-100" },
                    ].map((s) => (
                      <div key={s.label} className={`${s.bg} backdrop-blur-md border ${s.border} rounded-[2rem] p-6 shadow-sm`}>
                        <p className={`text-4xl font-black ${s.color}`}>{s.val}</p>
                        <p className="text-xs text-slate-700 font-bold uppercase tracking-widest mt-2">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Filter buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {["all", "pending", "accepted", "rejected"].map((f) => (
                      <button key={f} onClick={() => setFilterTab(f)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filterTab === f ? "bg-violet-600 text-white shadow-sm" : "bg-white/80 text-slate-500 border border-slate-200 hover:border-violet-300"}`}>
                        {f === "all" ? "All" : `${f.charAt(0).toUpperCase() + f.slice(1)} (${receivedBids.filter(b => b.status === f).length})`}
                      </button>
                    ))}
                  </div>

                  {filteredReceived.length === 0 && (
                    <div className="py-20 text-center bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white">
                       <p className="text-slate-600 font-bold text-lg">No bids match your criteria.</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    {filteredReceived.map((bid) => (
                      <div key={bid._id} className="bg-white/80 backdrop-blur-lg rounded-[2rem] border border-white shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="flex gap-5 items-center">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-violet-100 to-indigo-50 flex items-center justify-center text-violet-700 font-black text-2xl shadow-inner border border-violet-200 shrink-0">
                              {bid.bidder?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-lg font-extrabold text-slate-900">{bid.bidder?.name || "Student Bidder"}</h4>
                              <p className="text-sm text-slate-600 font-medium mb-2">Rating: {bidderRatings[bid.bidder?._id]?.avgRating || "New"} ★</p>
                              <span className={statusBadge(bid.status)}>{bid.status}</span>
                            </div>
                          </div>

                          <div className="flex-1 lg:border-l border-slate-200 lg:pl-6">
                             <p className="text-sm font-bold text-slate-500">Interested in:</p>
                             <p className="text-lg font-extrabold text-slate-900">{bid.bidItem?.title}</p>
                          </div>

                          <div className="bg-white/60 p-5 rounded-3xl min-w-[180px] text-center border border-white">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Offer Amount</p>
                            <p className="text-2xl font-black text-violet-700 leading-none">LKR {Number(bid.amount).toLocaleString()}</p>
                            <p className="text-xs text-slate-500 mt-2 font-bold">{new Date(bid.createdAt).toLocaleDateString()}</p>
                          </div>

                          {bid.status === "pending" && (
                            <div className="flex lg:flex-col gap-3 shrink-0">
                              <button
                                disabled={actionLoadingId === bid._id}
                                onClick={() => handleBidAction(bid._id, "accepted")}
                                className="flex-1 px-6 py-3 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                              >
                                ✓ Accept
                              </button>
                              <button
                                disabled={actionLoadingId === bid._id}
                                onClick={() => handleBidAction(bid._id, "rejected")}
                                className="flex-1 px-6 py-3 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-2xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all active:scale-95 disabled:opacity-50 shadow-sm"
                              >
                                ✕ Reject
                              </button>
                            </div>
                          )}

                          {bid.status === "accepted" && (
                            <div className="flex gap-2 shrink-0">
                              {!reviewedReceivedBidIds.has(bid._id) ? (
                                <button onClick={() => setReviewTarget({ bid, isSeller: true })}
                                  className="px-4 py-2 bg-amber-50 text-amber-700 text-xs font-bold rounded-xl border border-amber-200 hover:bg-amber-500 hover:text-white transition-all active:scale-95">
                                  ⭐ Leave a Review
                                </button>
                              ) : (
                                <span className="px-3 py-1.5 bg-amber-50 text-amber-600 text-xs font-bold rounded-xl border border-amber-200">Reviewed</span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Buyer's Review section */}
                        {bid.status === "accepted" && receivedBidReviews[bid._id] && (
                          <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100 mt-2">
                            <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-1">Buyer's Review</p>
                            <p className="text-sm text-slate-700 font-medium">{"★".repeat(receivedBidReviews[bid._id].rating)} · {receivedBidReviews[bid._id].comment || "No comment."}</p>
                          </div>
                        )}

                        {/* Buyer Complaint section with chat */}
                        {bid.status === "accepted" && receivedBidComplaints[bid._id] && (
                          <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-100 mt-2">
                            <p className="text-xs font-black text-rose-600 uppercase tracking-widest mb-1">Buyer Complaint</p>
                            <p className="text-sm font-bold text-slate-800">{receivedBidComplaints[bid._id].subject}</p>
                            <p className="text-xs text-slate-500 mt-1">{receivedBidComplaints[bid._id].description}</p>
                            {/* Conversation */}
                            {receivedBidComplaints[bid._id].messages?.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <p className="text-xs font-bold text-slate-500">Conversation</p>
                                {receivedBidComplaints[bid._id].messages.map((msg, i) => {
                                  const senderId = msg.sender?._id || msg.sender;
                                  const isOwn = String(senderId) === String(currentUser?._id || currentUser?.id);
                                  const cId = receivedBidComplaints[bid._id]._id;
                                  return editingMsgId === msg._id ? (
                                    <div key={i} className="flex gap-2">
                                      <input
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        className="flex-1 bg-white border border-violet-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-violet-400"
                                      />
                                      <button onClick={() => handleEditComplaintMessage(cId, msg._id, bid._id)}
                                        disabled={editLoadingId === msg._id}
                                        className="px-3 py-1.5 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 disabled:opacity-50">
                                        Save
                                      </button>
                                      <button onClick={() => { setEditingMsgId(null); setEditingText(""); }}
                                        className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200">
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <div key={i} className="flex items-center gap-2 group">
                                      <div className={`flex-1 rounded-xl px-3 py-2 text-xs border ${isOwn ? "bg-violet-50 border-violet-100 text-violet-900" : "bg-white border-slate-100 text-slate-700"}`}>
                                        {msg.text}
                                      </div>
                                      {isOwn && (
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button onClick={() => { setEditingMsgId(msg._id); setEditingText(msg.text); }}
                                            className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-violet-100 hover:text-violet-600 text-[10px]">✏️</button>
                                          <button onClick={() => handleDeleteComplaintMessage(cId, msg._id, bid._id)}
                                            disabled={deleteLoadingId === msg._id}
                                            className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 text-[10px] disabled:opacity-50">🗑️</button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            <div className="flex gap-2 mt-3">
                              <input
                                type="text" placeholder="Type a message..."
                                value={chatMsgMap[receivedBidComplaints[bid._id]._id] || ""}
                                onChange={(e) => setChatMsgMap((p) => ({ ...p, [receivedBidComplaints[bid._id]._id]: e.target.value }))}
                                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-violet-400"
                              />
                              <button onClick={() => handleSendComplaintMessage(receivedBidComplaints[bid._id]._id, bid._id, true)}
                                className="w-8 h-8 flex items-center justify-center bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all text-xs font-bold">
                                ➤
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: My Bids (Buyer View) */}
              {activeTab === 3 && (
                 <div className="max-w-4xl space-y-5">
                  {myBids.length === 0 ? (
                    <div className="py-24 text-center bg-white/60 backdrop-blur-xl rounded-[3rem] border border-white shadow-sm">
                       <p className="text-slate-600 font-bold text-lg">You haven't placed any bids yet.</p>
                    </div>
                  ) : (
                    myBids.map((bid) => (
                      <React.Fragment key={bid._id}>
                      <div className="bg-white/80 backdrop-blur-lg rounded-[2rem] border border-white shadow-sm p-5 flex flex-col md:flex-row md:items-center gap-6 hover:shadow-md transition-shadow">
                        <div className="w-24 h-24 rounded-[1.5rem] bg-slate-100/50 overflow-hidden shrink-0 border border-white">
                          {bid.bidItem?.image ? <img src={bid.bidItem.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center opacity-20 text-4xl">📦</div>}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-extrabold text-slate-900 mb-1">{bid.bidItem?.title}</h4>
                          <p className="text-sm text-slate-600 font-medium mb-3">Placed on {new Date(bid.createdAt).toLocaleDateString()}</p>
                          <span className={statusBadge(bid.status)}>{bid.status}</span>
                        </div>
                        <div className="md:border-l border-slate-200 md:pl-8 text-left md:text-right">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Your Offer</p>
                          <p className="text-3xl font-black text-violet-700">LKR {Number(bid.amount).toLocaleString()}</p>
                        </div>
                        {bid.status === "accepted" && (
                          <div className="flex flex-wrap gap-2 md:pl-6 shrink-0">
                            {!reviewedBidIds.has(bid._id) ? (
                              <button onClick={() => setReviewTarget({ bid })}
                                className="px-5 py-2.5 bg-amber-100/80 text-amber-800 text-xs font-black rounded-2xl hover:bg-amber-500 hover:text-white border border-amber-200 transition-all active:scale-95">
                                ⭐ Leave a Review
                              </button>
                            ) : (
                              <span className="px-3 py-1.5 bg-amber-50 text-amber-600 text-xs font-bold rounded-xl border border-amber-200">Reviewed</span>
                            )}
                            {!filedComplaintBidIds.has(bid._id) ? (
                              <button onClick={() => setComplaintTarget({ bid })}
                                className="px-5 py-2.5 bg-rose-50 text-rose-600 text-xs font-black rounded-2xl hover:bg-rose-500 hover:text-white border border-rose-200 transition-all active:scale-95">
                                🚨 File a Complaint
                              </button>
                            ) : (
                              <span className="px-3 py-1.5 bg-rose-50 text-rose-500 text-xs font-bold rounded-xl border border-rose-200">Complaint Filed</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Complaint chat thread for buyer */}
                      {bid.status === "accepted" && myBidComplaints[bid._id] && (
                        <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-100 mt-2 mx-2">
                          <p className="text-xs font-black text-rose-600 uppercase tracking-widest mb-2">Your Complaint</p>
                          <p className="text-sm font-bold text-slate-800">{myBidComplaints[bid._id].subject}</p>
                          {myBidComplaints[bid._id].messages?.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs font-bold text-slate-500">Conversation</p>
                              {myBidComplaints[bid._id].messages.map((msg, i) => {
                                const senderId = msg.sender?._id || msg.sender;
                                const isOwn = String(senderId) === String(currentUser?._id || currentUser?.id);
                                const cId = myBidComplaints[bid._id]._id;
                                return editingMsgId === msg._id ? (
                                  <div key={i} className="flex gap-2">
                                    <input
                                      value={editingText}
                                      onChange={(e) => setEditingText(e.target.value)}
                                      className="flex-1 bg-white border border-violet-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-violet-400"
                                    />
                                    <button onClick={() => handleEditComplaintMessage(cId, msg._id, bid._id)}
                                      disabled={editLoadingId === msg._id}
                                      className="px-3 py-1.5 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 disabled:opacity-50">
                                      Save
                                    </button>
                                    <button onClick={() => { setEditingMsgId(null); setEditingText(""); }}
                                      className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200">
                                      Cancel
                                    </button>
                                  </div>
                                ) : (
                                  <div key={i} className="flex items-center gap-2 group">
                                    <div className={`flex-1 rounded-xl px-3 py-2 text-xs border ${isOwn ? "bg-violet-50 border-violet-100 text-violet-900" : "bg-white border-slate-100 text-slate-700"}`}>
                                      {msg.text}
                                    </div>
                                    {isOwn && (
                                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingMsgId(msg._id); setEditingText(msg.text); }}
                                          className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-violet-100 hover:text-violet-600 text-[10px]">✏️</button>
                                        <button onClick={() => handleDeleteComplaintMessage(cId, msg._id, bid._id)}
                                          disabled={deleteLoadingId === msg._id}
                                          className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-rose-100 hover:text-rose-600 text-[10px] disabled:opacity-50">🗑️</button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <div className="flex gap-2 mt-3">
                            <input
                              type="text" placeholder="Type a message..."
                              value={chatMsgMap[myBidComplaints[bid._id]._id] || ""}
                              onChange={(e) => setChatMsgMap((p) => ({ ...p, [myBidComplaints[bid._id]._id]: e.target.value }))}
                              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-violet-400"
                            />
                            <button onClick={() => handleSendComplaintMessage(myBidComplaints[bid._id]._id, bid._id, false)}
                              className="w-8 h-8 flex items-center justify-center bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-all text-xs font-bold">
                              ➤
                            </button>
                          </div>
                        </div>
                      )}
                      </React.Fragment>
                    ))
                  )}
                 </div>
              )}

            </div>
          )}
        </div>
      </main>

      {/* ===== Global Modal Overlay (Reusable) ===== */}
      {(showForm || bidTarget || reviewTarget || complaintTarget) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => { setShowForm(false); setBidTarget(null); setReviewTarget(null); setComplaintTarget(null); }} />
          
          <div className="relative bg-white/95 backdrop-blur-2xl w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 bg-white/50">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {showForm ? "Create Listing" : bidTarget ? "Submit Your Offer" : reviewTarget ? "Leave a Review" : "🚨 File a Complaint"}
              </h2>
              <button 
                onClick={() => { setShowForm(false); setBidTarget(null); setReviewTarget(null); setComplaintTarget(null); }}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-200 text-slate-400 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 max-h-[75vh] overflow-y-auto hide-scrollbar">
              
              {showForm && (
                <form onSubmit={handleSubmitForm} className="space-y-5">
                   <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 pl-1">Item Title</label>
                    <input
                      type="text" required value={formData.title}
                      onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                      placeholder="What are you selling?"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 pl-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 font-bold text-slate-900 appearance-none"
                      >
                        {["Electronics", "Books", "Clothing", "Furniture", "Other"].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2 pl-1">Min Price</label>
                      <input
                        type="number" required value={formData.startingPrice}
                        onChange={(e) => setFormData((f) => ({ ...f, startingPrice: e.target.value }))}
                        placeholder="LKR"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                  <div>
                     <label className="block text-xs font-bold text-slate-500 mb-2 pl-1">Description (Optional)</label>
                    <textarea
                      rows={3} value={formData.description}
                      onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Add more details about the item's condition..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 font-medium text-slate-900 resize-none placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 pl-1">Item Image (Optional)</label>
                    {formData.image ? (
                      <div className="relative">
                        <img src={formData.image} alt="preview" className="w-full h-40 object-cover rounded-2xl border border-slate-200" />
                        <button
                          type="button"
                          onClick={() => setFormData((f) => ({ ...f, image: "" }))}
                          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-slate-500 hover:text-red-500 transition"
                        >✕</button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer hover:border-violet-400 hover:bg-violet-50/30 transition-all">
                        <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-semibold text-slate-400">Click to upload image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onloadend = () => setFormData((f) => ({ ...f, image: reader.result }));
                          reader.readAsDataURL(file);
                        }} />
                      </label>
                    )}
                  </div>
                  <div className="pt-4">
                    <button 
                      type="submit" disabled={formLoading}
                      className="w-full py-4 bg-violet-600 text-white rounded-2xl font-black text-sm hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {formLoading ? "Creating Listing..." : "List Item to Market"}
                    </button>
                  </div>
                </form>
              )}

              {bidTarget && (
                <form onSubmit={handlePlaceBid} className="space-y-6">
                  <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-200 flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[1.2rem] bg-white flex items-center justify-center text-3xl shadow-sm overflow-hidden shrink-0">
                      {bidTarget.image ? <img src={bidTarget.image} className="w-full h-full object-cover" /> : "📦"}
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900 text-lg line-clamp-1">{bidTarget.title}</p>
                      <p className="text-xs font-bold text-slate-500 mt-1">Starting from <span className="text-violet-600 font-black">LKR {Number(bidTarget.startingPrice).toLocaleString()}</span></p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-2">Your Offer</label>
                    <input
                      type="number" required min={bidTarget.startingPrice} value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="w-full bg-white border-2 border-violet-200 rounded-2xl px-6 py-5 text-2xl font-black text-violet-700 focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                    />
                  </div>
                  <textarea
                    rows={3} value={bidMessage} onChange={(e) => setBidMessage(e.target.value)}
                    placeholder="Add a friendly note to the seller (optional)..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 resize-none text-slate-900 placeholder:text-slate-400"
                  />
                  <button 
                    type="submit" disabled={bidLoading}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95"
                  >
                    {bidLoading ? "Processing..." : "Place Bid"}
                  </button>
                </form>
              )}

              {reviewTarget && (
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div className="flex flex-col items-center gap-4 py-4">
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star} type="button"
                          onMouseEnter={() => setReviewHover(star)} onMouseLeave={() => setReviewHover(0)} onClick={() => setReviewRating(star)}
                          className="text-5xl transition-transform hover:scale-110 active:scale-90"
                        >
                          <span className={(reviewHover || reviewRating) >= star ? "text-amber-400 drop-shadow-md" : "text-slate-200"}>★</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-sm font-black text-slate-700 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full">
                      {["Poor Experience", "Fair Experience", "Good Interaction", "Great Seller", "Exceptional!"][reviewRating - 1]}
                    </p>
                  </div>
                  <textarea
                    rows={4} value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this seller..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-4 focus:ring-amber-500/20 focus:border-amber-400 text-slate-900 resize-none"
                  />
                  <button 
                    type="submit" disabled={reviewLoading}
                    className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black text-sm hover:bg-amber-600 shadow-lg shadow-amber-200 transition-all active:scale-95"
                  >
                    {reviewLoading ? "Sending..." : "Submit Review ⭐"}
                  </button>
                </form>
              )}

              {complaintTarget && (
                <form onSubmit={handleSubmitComplaint} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 pl-1">Complaint Type</label>
                    <select
                      value={complaintType}
                      onChange={(e) => setComplaintType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 font-bold text-slate-900 appearance-none"
                    >
                      {["item_not_delivered", "fraud", "damaged_item", "wrong_item", "other"].map(t => (
                        <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 pl-1">Subject</label>
                    <input
                      type="text" required value={complaintSubject}
                      onChange={(e) => setComplaintSubject(e.target.value)}
                      placeholder="Brief title of your complaint"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 font-medium text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 pl-1">Description</label>
                    <textarea
                      rows={4} required value={complaintDesc}
                      onChange={(e) => setComplaintDesc(e.target.value)}
                      placeholder="Describe the issue in detail..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 font-medium text-slate-900 resize-none placeholder:text-slate-400"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setComplaintTarget(null)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all">
                      Cancel
                    </button>
                    <button type="submit" disabled={complaintLoading}
                      className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-sm hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all active:scale-95 disabled:opacity-50">
                      {complaintLoading ? "Submitting..." : "🚨 Submit Complaint"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}