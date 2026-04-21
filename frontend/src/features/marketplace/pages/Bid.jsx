import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getMyBids, getReceivedBids, updateBidStatus } from "../../../api/bidApi";
import { getAllBidItems, getMyBidItems, createBidItem, updateBidItemStatus, deleteBidItem } from "../../../api/bidItemApi";
import { placeBid } from "../../../api/bidApi";
import { submitReview, getMyGivenReviews, getReviewsForUser, getMyReceivedReviews } from "../../../api/reviewApi";
import { submitComplaint, getMyComplaints, getComplaintsAgainstMe, replyToComplaint, buyerReplyToComplaint, sendComplaintMessage, editComplaintMessage, deleteComplaintMessage } from "../../../api/complaintApi";

const TABS = ["🛒 Browse Items", "📦 My Bid Items", "📥 Received Bids", "🎯 My Bids"];

const statusBadge = (status) => {
  const map = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    accepted: "bg-green-100 text-green-800 border-green-300",
    rejected: "bg-red-100 text-red-800 border-red-300",
    active: "bg-purple-100 text-purple-800 border-purple-300",
    closed: "bg-gray-100 text-gray-600 border-gray-300",
    sold: "bg-blue-100 text-blue-800 border-blue-300",
  };
  return `inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${map[status] || map.pending}`;
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

  // Inline bid placement modal
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

  // Review modal state
  const [reviewTarget, setReviewTarget] = useState(null); // { bid, seller }
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewedBidIds, setReviewedBidIds] = useState(new Set());
  const [sellerRatings, setSellerRatings] = useState({}); // sellerId → { avgRating, total }
  const [bidderRatings, setBidderRatings] = useState({}); // bidderId → { avgRating, total }

  // Buyer's own review and complaint data for each bid (indexed by bid._id)
  const [myBidReviews, setMyBidReviews] = useState({});     // bid._id → review object
  const [myBidComplaints, setMyBidComplaints] = useState({}); // bid._id → complaint object

  // Complaint modal state
  const [complaintTarget, setComplaintTarget] = useState(null); // { bid }
  const [complaintType, setComplaintType] = useState("fraud");
  const [complaintSubject, setComplaintSubject] = useState("");
  const [complaintDesc, setComplaintDesc] = useState("");
  const [complaintLoading, setComplaintLoading] = useState(false);
  const [filedComplaintBidIds, setFiledComplaintBidIds] = useState(new Set());

  // Seller-side: track reviews/complaints filed ABOUT the bidder (Received Bids tab)
  const [reviewedReceivedBidIds, setReviewedReceivedBidIds] = useState(new Set());
  const [complaintReceivedBidIds, setComplaintReceivedBidIds] = useState(new Set());

  // Shared review/complaint modal target (reuse same modals; target determined by context)
  const [reviewTargetUser, setReviewTargetUser] = useState(null);
  const [complaintTargetUser, setComplaintTargetUser] = useState(null);

  // Maps: linkedInteractionId/linkedItemId → review/complaint from the BUYER (shown on seller's Received Bids card)
  const [receivedBidReviews, setReceivedBidReviews] = useState({});
  const [receivedBidComplaints, setReceivedBidComplaints] = useState({});

  // Complaint reply state (seller replying to buyer complaint)
  const [replyTextMap, setReplyTextMap] = useState({});      // complaintId → draft text
  const [replyLoadingId, setReplyLoadingId] = useState(null);

  // Buyer reply-back state (buyer replying to seller's response)
  const [buyerReplyTextMap, setBuyerReplyTextMap] = useState({});  // complaintId → draft
  const [buyerReplyLoadingId, setBuyerReplyLoadingId] = useState(null);

  // Unified chat state for complaint threads (both tabs)
  const [chatMsgMap, setChatMsgMap] = useState({});      // complaintId → draft text for new message
  const [chatLoadingId, setChatLoadingId] = useState(null);

  // Message edit/delete state
  const [editingMsgId, setEditingMsgId] = useState(null);   // _id of message being edited
  const [editingText, setEditingText]   = useState("");      // current edit draft
  const [editLoadingId, setEditLoadingId]   = useState(null);
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
      // Build map: linkedInteractionId → review (for My Bids detail display)
      const rvMap = {};
      given.forEach((r) => { if (r.linkedInteractionId) rvMap[r.linkedInteractionId] = r; });
      setMyBidReviews(rvMap);
    } catch { /* silently ignore */ }
  };

  const loadMyComplaints = async () => {
    try {
      const res = await getMyComplaints(token);
      const complaints = res.data.complaints || [];
      const ids = new Set(complaints.map((c) => c.linkedItemId).filter(Boolean));
      setFiledComplaintBidIds(ids);
      // Build map: linkedItemId → complaint (for My Bids detail + seller reply display)
      const cpMap = {};
      complaints.forEach((c) => { if (c.linkedItemId) cpMap[c.linkedItemId] = c; });
      setMyBidComplaints(cpMap);
    } catch { /* silently ignore */ }
  };

  // Load reviews/complaints the seller has given for received bids
  // We reuse getMyGivenReviews & getMyComplaints — same API — and separate by bid IDs
  const loadSellerGivenReviews = async () => {
    try {
      const res = await getMyGivenReviews(token);
      const given = res.data.reviews || [];
      // Filter for reviews marked as bidding (could overlap with buyer reviews; compare linkedInteractionId)
      const ids = new Set(given.filter(r => r.interactionType === "bidding").map(r => r.linkedInteractionId).filter(Boolean));
      setReviewedReceivedBidIds(ids);
    } catch { /* silently ignore */ }
  };

  const loadSellerComplaints = async () => {
    try {
      const res = await getMyComplaints(token);
      const complaints = res.data.complaints || [];
      const ids = new Set(complaints.filter(c => c.category === "bidding").map(c => c.linkedItemId).filter(Boolean));
      setComplaintReceivedBidIds(ids);
    } catch { /* silently ignore */ }
  };

  // Load reviews + complaints the BUYER submitted about THIS seller — displayed on each received bid card
  const loadBuyerFeedbackOnMe = async () => {
    try {
      const [rvRes, cpRes] = await Promise.all([
        getMyReceivedReviews(token),        // reviews WHERE reviewed = me (seller)
        getComplaintsAgainstMe(token),      // complaints WHERE accused = me (seller)
      ]);
      // Index reviews by linkedInteractionId (= bid._id)
      const rvMap = {};
      (rvRes.data.reviews || []).forEach((r) => {
        if (r.linkedInteractionId) rvMap[r.linkedInteractionId] = r;
      });
      setReceivedBidReviews(rvMap);

      // Index complaints by linkedItemId (= bid._id)
      const cpMap = {};
      (cpRes.data.complaints || []).forEach((c) => {
        if (c.linkedItemId) cpMap[c.linkedItemId] = c;
      });
      setReceivedBidComplaints(cpMap);
    } catch (err) {
      console.error("loadBuyerFeedbackOnMe error:", err);
    }
  };

  const handleReplyToComplaint = async (complaintId, bidId) => {
    const text = (replyTextMap[complaintId] || "").trim();
    if (!text) { toast.error("Reply cannot be empty."); return; }
    setReplyLoadingId(complaintId);
    try {
      const res = await replyToComplaint(token, complaintId, text);
      toast.success("Reply submitted!");
      setReceivedBidComplaints((prev) => ({
        ...prev,
        [bidId]: { ...prev[bidId], accused_reply: text, repliedAt: new Date().toISOString() },
      }));
      setReplyTextMap((prev) => ({ ...prev, [complaintId]: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit reply.");
    } finally {
      setReplyLoadingId(null);
    }
  };

  const handleBuyerReplyToComplaint = async (complaintId, bidId) => {
    const text = (buyerReplyTextMap[complaintId] || "").trim();
    if (!text) { toast.error("Reply cannot be empty."); return; }
    setBuyerReplyLoadingId(complaintId);
    try {
      await buyerReplyToComplaint(token, complaintId, text);
      toast.success("Your reply submitted!");
      // Update in-memory map
      setMyBidComplaints((prev) => ({
        ...prev,
        [bidId]: { ...prev[bidId], complainant_reply: text, complainantRepliedAt: new Date().toISOString() },
      }));
      setBuyerReplyTextMap((prev) => ({ ...prev, [complaintId]: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit reply.");
    } finally {
      setBuyerReplyLoadingId(null);
    }
  };

  // Unified chat message sender — works for both seller (Received Bids) and buyer (My Bids)
  const handleSendComplaintMessage = async (complaintId, bidId, isSellerSending) => {
    const text = (chatMsgMap[complaintId] || "").trim();
    if (!text) { toast.error("Message cannot be empty."); return; }
    setChatLoadingId(complaintId);
    try {
      const res = await sendComplaintMessage(token, complaintId, text);
      const newMessages = res.data.messages || [];
      toast.success("Message sent!");
      setChatMsgMap((prev) => ({ ...prev, [complaintId]: "" }));
      // Update the right map depending on who is sending
      if (isSellerSending) {
        setReceivedBidComplaints((prev) => ({
          ...prev,
          [bidId]: { ...prev[bidId], messages: newMessages },
        }));
      } else {
        setMyBidComplaints((prev) => ({
          ...prev,
          [bidId]: { ...prev[bidId], messages: newMessages },
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message.");
    } finally {
      setChatLoadingId(null);
    }
  };

  // Helper: update messages in BOTH maps (complaint appears on both Received Bids and My Bids)
  const applyMessagesToMaps = (bidId, complaintId, newMessages) => {
    setReceivedBidComplaints((prev) => prev[bidId] ? { ...prev, [bidId]: { ...prev[bidId], messages: newMessages } } : prev);
    setMyBidComplaints((prev)      => prev[bidId] ? { ...prev, [bidId]: { ...prev[bidId], messages: newMessages } } : prev);
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
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to edit message.");
    } finally {
      setEditLoadingId(null);
    }
  };

  const handleDeleteComplaintMessage = async (complaintId, msgId, bidId) => {
    if (!window.confirm("Delete this message?")) return;
    setDeleteLoadingId(msgId);
    try {
      const res = await deleteComplaintMessage(token, complaintId, msgId);
      applyMessagesToMaps(bidId, complaintId, res.data.messages || []);
      toast.success("Message deleted.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete message.");
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!complaintSubject.trim() || !complaintDesc.trim()) {
      toast.error("Subject and description are required.");
      return;
    }
    setComplaintLoading(true);
    try {
      // isSeller = true means seller filing complaint against the buyer (bidder)
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
      setComplaintSubject("");
      setComplaintDesc("");
      setComplaintType("fraud");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit complaint.");
    } finally {
      setComplaintLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewRating) { toast.error("Please select a rating."); return; }
    setReviewLoading(true);
    try {
      // isSeller = true means seller is reviewing the buyer (bidder)
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
      toast.success("Review submitted! ✨");
      if (isSeller) {
        setReviewedReceivedBidIds((prev) => new Set([...prev, reviewTarget.bid._id]));
      } else {
        setReviewedBidIds((prev) => new Set([...prev, reviewTarget.bid._id]));
      }
      setReviewTarget(null);
      setReviewRating(5);
      setReviewComment("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewLoading(false);
    }
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
      // Exclude current user's own items from browse
      const allItems = allRes.data.items || [];
      const currentId = currentUser?._id || currentUser?.id || "";
      const filtered = allItems.filter((i) => String(i.seller?._id) !== String(currentId));
      setAllBidItems(filtered);
      setMyBidItems(itemsRes.data.items || []);
      setReceivedBids(receivedRes.data.bids || []);
      setMyBids(myBidsRes.data.bids || []);

      // Fetch seller ratings for browse items
      const uniqueSellerIds = [...new Set(filtered.map((i) => i.seller?._id).filter(Boolean))];
      if (uniqueSellerIds.length > 0) {
        const ratingResults = await Promise.all(
          uniqueSellerIds.map((id) => getReviewsForUser(id).then((r) => ({ id, ...r.data })).catch(() => ({ id, avgRating: null, total: 0 })))
        );
        const map = {};
        ratingResults.forEach(({ id, avgRating, total }) => { map[id] = { avgRating, total: total || 0 }; });
        setSellerRatings(map);
      }

      // Fetch bidder ratings for received bids
      const receivedBidsList = receivedRes.data.bids || [];
      const uniqueBidderIds = [...new Set(receivedBidsList.map((b) => b.bidder?._id).filter(Boolean))];
      if (uniqueBidderIds.length > 0) {
        const bidderResults = await Promise.all(
          uniqueBidderIds.map((id) => getReviewsForUser(id).then((r) => ({ id, ...r.data })).catch(() => ({ id, avgRating: null, total: 0 })))
        );
        const bmap = {};
        bidderResults.forEach(({ id, avgRating, total }) => { bmap[id] = { avgRating, total: total || 0 }; });
        setBidderRatings(bmap);
      }
    } catch {
      toast.error("Failed to load bidding data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!bidAmount || Number(bidAmount) < 1) { toast.error("Enter a valid amount."); return; }
    setBidLoading(true);
    try {
      await placeBid(token, { bidItemId: bidTarget._id, amount: Number(bidAmount), message: bidMessage });
      toast.success("Bid placed successfully!");
      setBidTarget(null); setBidAmount(""); setBidMessage("");
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place bid.");
    } finally {
      setBidLoading(false);
    }
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
    if (!formData.title.trim() || !formData.startingPrice) {
      toast.error("Title and starting price are required.");
      return;
    }
    setFormLoading(true);
    try {
      await createBidItem(token, { ...formData, startingPrice: Number(formData.startingPrice) });
      toast.success("Bid item listed successfully!");
      setShowForm(false);
      setFormData(emptyForm);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create bid item.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleBidAction = async (bidId, status) => {
    setActionLoadingId(bidId);
    try {
      await updateBidStatus(token, bidId, { status, sellerNote: noteMap[bidId] || "" });
      toast.success(`Bid ${status}.`);
      loadAll();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCloseItem = async (id) => {
    try {
      await updateBidItemStatus(token, id, "closed");
      toast.success("Item closed.");
      loadAll();
    } catch {
      toast.error("Failed to close item.");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this bid item?")) return;
    try {
      await deleteBidItem(token, id);
      toast.success("Item deleted.");
      loadAll();
    } catch {
      toast.error("Failed to delete item.");
    }
  };

  const filteredReceived = filterTab === "all"
    ? receivedBids
    : receivedBids.filter((b) => b.status === filterTab);

  const stats = {
    total: receivedBids.length,
    pending: receivedBids.filter((b) => b.status === "pending").length,
    accepted: receivedBids.filter((b) => b.status === "accepted").length,
    rejected: receivedBids.filter((b) => b.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-[#f5f3ff] pt-20 pb-12 font-['Sora',sans-serif]">
      <div className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 800px 500px at 0% 0%, #7c3aed18 0%, transparent 60%), radial-gradient(ellipse 600px 400px at 100% 100%, #5b21b612 0%, transparent 60%)" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 transition shadow-sm">
              <svg viewBox="0 0 14 14" fill="none" className="w-4 h-4"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-purple-950">Bidding Hub</h1>
              <p className="text-[12px] text-purple-400">List items, receive and manage bids</p>
            </div>
          </div>
          <button
            onClick={() => { setShowForm(true); setActiveTab(0); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-700 text-white text-[13px] font-bold rounded-xl hover:bg-purple-800 transition shadow-md"
          >
            <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            Add Bidding Item
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-purple-100 rounded-2xl p-1 mb-6 shadow-sm w-fit">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-all ${activeTab === i ? "bg-purple-700 text-white shadow" : "text-purple-500 hover:text-purple-800 hover:bg-purple-50"}`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* TAB 0: Browse Items */}
            {activeTab === 0 && (
              <div>
                {allBidItems.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-5xl mb-4">🔍</div>
                    <p className="text-purple-400 font-medium">No active bid items from other users yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {allBidItems.map((item) => {
                      const sellerAvatar = item.seller?.profileImage
                        ? (item.seller.profileImage.startsWith("http") ? item.seller.profileImage : `http://localhost:5000${item.seller.profileImage}`)
                        : null;
                      return (
                        <div key={item._id} className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-md transition-all">
                          <div className="h-44 bg-gradient-to-br from-purple-50 to-purple-100 relative flex items-center justify-center overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-6xl opacity-20">📦</span>
                            )}
                            <span className="absolute top-2 left-2 bg-white/90 border border-purple-200 text-purple-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                              {item.condition}
                            </span>
                          </div>

                          <div className="p-4 flex-1">
                            <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">{item.category}</p>
                            <h3 className="font-bold text-purple-950 text-[15px] leading-snug mb-1">{item.title}</h3>
                            {item.description && (
                              <p className="text-[12px] text-gray-400 line-clamp-2 mb-2">{item.description}</p>
                            )}

                            {/* Seller rating */}
                            {(() => {
                              const sr = sellerRatings[item.seller?._id];
                              const avg = sr?.avgRating ? parseFloat(sr.avgRating) : null;
                              const total = sr?.total || 0;
                              return (
                                <div className="flex items-center gap-1.5 mb-2">
                                  {avg !== null ? (
                                    <>
                                      <div className="flex gap-0.5">
                                        {[1,2,3,4,5].map((s) => (
                                          <span key={s} className={`text-[13px] ${s <= Math.round(avg) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                                        ))}
                                      </div>
                                      <span className="text-[11px] font-bold text-amber-600">{avg.toFixed(1)}</span>
                                      <span className="text-[10px] text-gray-400">({total} review{total !== 1 ? 's' : ''})</span>
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex gap-0.5">
                                        {[1,2,3,4,5].map((s) => <span key={s} className="text-[13px] text-gray-200">★</span>)}
                                      </div>
                                      <span className="text-[10px] text-gray-400">No reviews yet</span>
                                    </>
                                  )}
                                </div>
                              );
                            })()}

                            <p className="text-xl font-black text-purple-700">LKR {Number(item.startingPrice).toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400 mb-3">Starting price</p>

                            {/* Seller info */}
                            <div className="flex items-center gap-2 p-2.5 bg-purple-50 rounded-xl border border-purple-100">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white text-[11px] font-bold shrink-0 overflow-hidden">
                                {sellerAvatar ? <img src={sellerAvatar} alt="" className="w-full h-full object-cover" /> : item.seller?.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold text-purple-900">{item.seller?.name || "Unknown"}</p>
                                <p className="text-[10px] text-purple-400">{item.seller?.studentId || ""}</p>
                              </div>
                            </div>
                          </div>

                          <div className="px-4 pb-4">
                            <button
                              onClick={() => { setBidTarget(item); setBidAmount(Math.round(item.startingPrice * 1.1)); setBidMessage(""); }}
                              className="w-full py-2.5 bg-purple-700 text-white text-[13px] font-bold rounded-xl hover:bg-purple-800 transition shadow-sm"
                            >
                              Place a Bid
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 1: My Bid Items */}
            {activeTab === 1 && (
              <div>
                {myBidItems.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="text-5xl mb-4">📋</div>
                    <p className="text-purple-400 font-medium mb-4">No bid items yet.</p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="px-6 py-3 bg-purple-700 text-white rounded-xl font-bold text-[13px] hover:bg-purple-800 transition shadow-md"
                    >
                      + Add an Item to Receive Bids
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-end mb-4">
                      <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-200 text-purple-700 text-[13px] font-semibold rounded-xl hover:bg-purple-50 transition shadow-sm"
                      >
                        + Add an Item to Receive Bids
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {myBidItems.map((item) => (
                        <div key={item._id} className="bg-white rounded-2xl border border-purple-100 shadow-sm overflow-hidden">
                          <div className="h-36 bg-gradient-to-br from-purple-50 to-purple-100 relative flex items-center justify-center">
                            {item.image ? (
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-5xl opacity-30">📦</span>
                            )}
                            <span className={`absolute top-2 right-2 ${statusBadge(item.status)}`}>{item.status}</span>
                          </div>
                          <div className="p-4">
                            <p className="font-bold text-purple-950 truncate">{item.title}</p>
                            <p className="text-[11px] text-purple-400 mt-0.5">{item.category} · {item.condition}</p>
                            <p className="text-lg font-black text-purple-700 mt-1">LKR {Number(item.startingPrice).toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">Starting price</p>
                          </div>
                          <div className="px-4 py-2.5 border-t border-purple-50 flex gap-2">
                            <button
                              onClick={() => setActiveTab(1)}
                              className="flex-1 py-1.5 text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-lg hover:bg-purple-100 transition"
                            >
                              View Bids
                            </button>
                            {item.status === "active" && (
                              <button
                                onClick={() => handleCloseItem(item._id)}
                                className="flex-1 py-1.5 text-[11px] font-bold bg-gray-50 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition"
                              >
                                Close
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteItem(item._id)}
                              className="py-1.5 px-2.5 text-[11px] font-bold bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition"
                            >
                              🗑
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Received Bids */}
            {activeTab === 2 && (
              <div>
                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Total Bids", val: stats.total, color: "text-purple-700" },
                    { label: "Pending Review", val: stats.pending, color: "text-yellow-600" },
                    { label: "Accepted", val: stats.accepted, color: "text-green-600" },
                    { label: "Rejected", val: stats.rejected, color: "text-red-500" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl border border-purple-100 p-4 shadow-sm">
                      <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-1 mb-4">
                  {["all", "pending", "accepted", "rejected"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilterTab(f)}
                      className={`px-3.5 py-1.5 rounded-lg text-[12px] font-semibold capitalize transition ${filterTab === f ? "bg-purple-700 text-white" : "bg-white text-purple-500 border border-purple-100 hover:bg-purple-50"}`}
                    >
                      {f === "all" ? "All" : f} {f !== "all" && `(${stats[f]})`}
                    </button>
                  ))}
                </div>

                {filteredReceived.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3 opacity-40">📭</div>
                    <p className="text-purple-400 font-medium mb-4">No bids received yet.</p>
                    <button
                      onClick={() => { setShowForm(true); setActiveTab(1); }}
                      className="px-5 py-2.5 bg-purple-700 text-white rounded-xl font-bold text-[13px] hover:bg-purple-800 transition"
                    >
                      + Add an Item to Receive Bids
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredReceived.map((bid) => (
                      <div key={bid._id} className="bg-white rounded-2xl border border-purple-100 shadow-sm p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3 items-start">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                              {bid.bidder?.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <div>
                              <p className="font-bold text-purple-950 text-sm">{bid.bidder?.name || "Unknown"}</p>
                              <p className="text-[11px] text-purple-400">{bid.bidder?.studentId || ""}</p>
                              {/* Buyer reputation row */}
                              {(() => {
                                const br = bidderRatings[bid.bidder?._id];
                                const avg = br?.avgRating ? parseFloat(br.avgRating) : null;
                                const total = br?.total || 0;
                                return (
                                  <div className="flex items-center gap-1 mt-1">
                                    {avg !== null ? (
                                      <>
                                        <div className="flex gap-0.5">
                                          {[1,2,3,4,5].map((s) => (
                                            <span key={s} className={`text-[11px] ${s <= Math.round(avg) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                                          ))}
                                        </div>
                                        <span className="text-[10px] font-bold text-amber-600">{avg.toFixed(1)}</span>
                                        <span className="text-[10px] text-gray-400">({total} review{total !== 1 ? 's' : ''})</span>
                                      </>
                                    ) : (
                                      <span className="text-[10px] text-gray-300 italic">No reviews yet</span>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                          <span className={statusBadge(bid.status)}>{bid.status}</span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div>
                            <p className="text-[11px] text-gray-400">Item: <span className="font-semibold text-purple-800">{bid.bidItem?.title || "—"}</span></p>
                            <p className="text-[11px] text-gray-400">Starting: LKR {Number(bid.bidItem?.startingPrice || 0).toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-black text-purple-700">LKR {Number(bid.amount).toLocaleString()}</p>
                            <p className="text-[10px] text-gray-400">{new Date(bid.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {bid.message && (
                          <p className="mt-2 text-[12px] text-gray-500 bg-purple-50 rounded-lg px-3 py-2 italic">"{bid.message}"</p>
                        )}

                        {/* ── Buyer's feedback about this seller ── */}
                        {bid.status === "accepted" && (() => {
                          const buyerReview    = receivedBidReviews[bid._id];
                          const buyerComplaint = receivedBidComplaints[bid._id];
                          if (!buyerReview && !buyerComplaint) return null;
                          return (
                            <div className="mt-3 space-y-2">
                              {/* Buyer's Review */}
                              {buyerReview && (
                                <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-wide">Buyer's Review</span>
                                    <div className="flex gap-0.5">
                                      {[1,2,3,4,5].map((s) => (
                                        <span key={s} className={`text-[12px] ${s <= buyerReview.rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
                                      ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-600">{buyerReview.rating}/5</span>
                                  </div>
                                  {buyerReview.comment && (
                                    <p className="text-[12px] text-amber-800 italic">"{buyerReview.comment}"</p>
                                  )}
                                </div>
                              )}
                              {/* Buyer's Complaint */}
                              {buyerComplaint && (
                                <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5">
                                  {/* Header row */}
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <span className="text-[10px] font-black text-red-600 uppercase tracking-wide">🚨 Buyer Complaint</span>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 capitalize">{buyerComplaint.type?.replace("_", " ")}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                      buyerComplaint.status === "resolved"    ? "bg-green-100 text-green-700" :
                                      buyerComplaint.status === "dismissed"   ? "bg-gray-100 text-gray-600"  :
                                      buyerComplaint.status === "under_review"? "bg-blue-100 text-blue-700"  :
                                      "bg-orange-100 text-orange-700"
                                    }`}>{buyerComplaint.status?.replace("_", " ")}</span>
                                  </div>
                                  <p className="text-[12px] text-red-700 font-semibold">{buyerComplaint.subject}</p>
                                  {buyerComplaint.description && (
                                    <p className="text-[11px] text-red-500 mt-0.5">{buyerComplaint.description}</p>
                                  )}

                                  {/* ── Chat thread ── */}
                                  <div className="mt-2.5 pt-2.5 border-t border-red-200 space-y-1.5">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide mb-2">Conversation</p>

                                    {/* Legacy single-round replies (backward compat) */}
                                    {(!buyerComplaint.messages || buyerComplaint.messages.length === 0) && buyerComplaint.accused_reply && (
                                      <div className="flex justify-end">
                                        <div className="max-w-[80%] bg-purple-600 text-white rounded-2xl rounded-tr-sm px-3 py-2">
                                          <p className="text-[11px]">{buyerComplaint.accused_reply}</p>
                                          <p className="text-[9px] opacity-60 mt-0.5 text-right">{buyerComplaint.repliedAt ? new Date(buyerComplaint.repliedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                                        </div>
                                      </div>
                                    )}

                                    {/* New messages[] array — chat bubbles */}
                                    {(buyerComplaint.messages || []).map((msg, i) => {
                                      const isMine = msg.senderRole === "accused"; // seller = accused (on Received Bids tab)
                                      const isEditing = editingMsgId === msg._id?.toString();
                                      return (
                                        <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"} group`}>
                                          <div className="max-w-[80%]">
                                            {isEditing ? (
                                              /* Inline edit input */
                                              <div className="flex gap-1.5 items-center">
                                                <input
                                                  autoFocus
                                                  value={editingText}
                                                  onChange={(e) => setEditingText(e.target.value)}
                                                  onKeyDown={(e) => { if (e.key === "Enter") handleEditComplaintMessage(buyerComplaint._id, msg._id, bid._id); if (e.key === "Escape") { setEditingMsgId(null); setEditingText(""); } }}
                                                  className="text-[12px] border border-purple-300 rounded-full px-3 py-1.5 outline-none focus:ring-2 focus:ring-purple-400 bg-white w-48"
                                                />
                                                <button disabled={editLoadingId === msg._id} onClick={() => handleEditComplaintMessage(buyerComplaint._id, msg._id, bid._id)} className="text-[10px] bg-purple-600 text-white px-2 py-1 rounded-full hover:bg-purple-700 disabled:opacity-50">
                                                  {editLoadingId === msg._id ? "…" : "Save"}
                                                </button>
                                                <button onClick={() => { setEditingMsgId(null); setEditingText(""); }} className="text-[10px] text-gray-400 hover:text-gray-600 px-1">✕</button>
                                              </div>
                                            ) : (
                                              <div className={`relative rounded-2xl px-3 py-2 ${isMine ? "bg-purple-600 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"}`}>
                                                <p className="text-[11px] pr-6">{msg.text}</p>
                                                <div className={`flex items-center gap-1 mt-0.5 ${isMine ? "justify-end" : ""}`}>
                                                  <p className={`text-[9px] ${isMine ? "opacity-60" : "text-gray-400"}`}>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                                                  {msg.editedAt && <p className={`text-[9px] ${isMine ? "opacity-50" : "text-gray-400"} italic`}>(edited)</p>}
                                                </div>
                                                {/* Edit/Delete controls — only on own messages */}
                                                {isMine && (
                                                  <div className="absolute -top-6 right-0 hidden group-hover:flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-1.5 py-0.5 shadow-md z-10">
                                                    <button title="Edit" onClick={() => { setEditingMsgId(msg._id?.toString()); setEditingText(msg.text); }} className="text-[10px] text-blue-500 hover:text-blue-700 px-1 py-0.5 rounded">✏️</button>
                                                    <button title="Delete" disabled={deleteLoadingId === msg._id} onClick={() => handleDeleteComplaintMessage(buyerComplaint._id, msg._id, bid._id)} className="text-[10px] text-red-500 hover:text-red-700 px-1 py-0.5 rounded disabled:opacity-50">🗑️</button>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}


                                    {(!buyerComplaint.messages || buyerComplaint.messages.length === 0) && !buyerComplaint.accused_reply && (
                                      <p className="text-[10px] text-gray-400 italic text-center py-1">No messages yet. Start the conversation.</p>
                                    )}

                                    {/* Send message input */}
                                    <div className="flex gap-2 pt-1">
                                      <input
                                        type="text"
                                        placeholder="Type a message..."
                                        value={chatMsgMap[buyerComplaint._id] || ""}
                                        onChange={(e) => setChatMsgMap((p) => ({ ...p, [buyerComplaint._id]: e.target.value }))}
                                        onKeyDown={(e) => e.key === "Enter" && handleSendComplaintMessage(buyerComplaint._id, bid._id, true)}
                                        className="flex-1 text-[12px] border border-red-200 rounded-full px-3 py-1.5 outline-none focus:ring-2 focus:ring-red-300 bg-white"
                                      />
                                      <button
                                        disabled={chatLoadingId === buyerComplaint._id}
                                        onClick={() => handleSendComplaintMessage(buyerComplaint._id, bid._id, true)}
                                        className="px-3 py-1.5 bg-purple-600 text-white text-[11px] font-bold rounded-full hover:bg-purple-700 transition disabled:opacity-50 shrink-0"
                                      >
                                        {chatLoadingId === buyerComplaint._id ? "…" : "➤"}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}


                            </div>
                          );
                        })()}

                        {bid.status === "pending" && (
                          <div className="mt-3 flex flex-col gap-2">
                            <input
                              type="text"
                              placeholder="Add a note to buyer (optional)"
                              value={noteMap[bid._id] || ""}
                              onChange={(e) => setNoteMap((p) => ({ ...p, [bid._id]: e.target.value }))}
                              className="w-full border border-purple-100 rounded-lg px-3 py-2 text-[12px] outline-none focus:ring-2 focus:ring-purple-300"
                            />
                            <div className="flex gap-2">
                              <button
                                disabled={actionLoadingId === bid._id}
                                onClick={() => handleBidAction(bid._id, "accepted")}
                                className="flex-1 py-2 bg-green-600 text-white rounded-lg text-[12px] font-bold hover:bg-green-700 transition disabled:opacity-50"
                              >
                                {actionLoadingId === bid._id ? "..." : "✓ Accept"}
                              </button>
                              <button
                                disabled={actionLoadingId === bid._id}
                                onClick={() => handleBidAction(bid._id, "rejected")}
                                className="flex-1 py-2 bg-red-500 text-white rounded-lg text-[12px] font-bold hover:bg-red-600 transition disabled:opacity-50"
                              >
                                {actionLoadingId === bid._id ? "..." : "✕ Reject"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: My Bids */}
            {activeTab === 3 && (
              <div>
                {myBids.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-4xl mb-3 opacity-40">🎯</div>
                    <p className="text-purple-400 font-medium">You haven't placed any bids yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myBids.map((bid) => (
                      <div key={bid._id} className="bg-white rounded-2xl border border-purple-100 shadow-sm p-4 flex gap-4 items-start">
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-purple-50 shrink-0 flex items-center justify-center">
                          {bid.bidItem?.image ? (
                            <img src={bid.bidItem.image} alt={bid.bidItem.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl opacity-30">📦</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-purple-950 truncate">{bid.bidItem?.title || "—"}</p>
                              <p className="text-[11px] text-purple-400">Starting: LKR {Number(bid.bidItem?.startingPrice || 0).toLocaleString()}</p>
                            </div>
                            <span className={statusBadge(bid.status)}>{bid.status}</span>
                          </div>
                          <p className="text-lg font-black text-purple-700 mt-1">LKR {Number(bid.amount).toLocaleString()}</p>
                          <p className="text-[10px] text-gray-400">Placed on {new Date(bid.createdAt).toLocaleDateString()}</p>
                          {bid.sellerNote && (
                            <p className="mt-1.5 text-[11px] text-gray-500 bg-purple-50 rounded-lg px-2.5 py-1.5 italic">Seller: "{bid.sellerNote}"</p>
                          )}
                          {/* Leave a Review button for accepted bids */}
                          {bid.status === "accepted" && (
                            <div className="mt-2.5 flex flex-wrap items-center gap-2">
                              {/* Review button */}
                              {reviewedBidIds.has(bid._id) ? (
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-green-600 bg-green-50 border border-green-200 rounded-lg px-3 py-1.5 w-fit">
                                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><path d="M1.5 6.5L4.5 9.5L10.5 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  Reviewed
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setReviewTarget({ bid });
                                    setReviewRating(5);
                                    setReviewComment("");
                                    setReviewHover(0);
                                  }}
                                  className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition w-fit"
                                >
                                  ⭐ Leave a Review
                                </button>
                              )}

                              {/* Complaint button */}
                              {filedComplaintBidIds.has(bid._id) ? (
                                <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 w-fit">
                                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><path d="M6 1v6M6 9v1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                                  Complaint Filed
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setComplaintTarget({ bid });
                                    setComplaintType("fraud");
                                    setComplaintSubject("");
                                    setComplaintDesc("");
                                  }}
                                  className="flex items-center gap-1.5 text-[11px] font-bold text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-100 transition w-fit"
                                >
                                  🚨 File a Complaint
                                </button>
                              )}
                            </div>
                          )}

                          {/* ── Show buyer's own review + complaint detail for accepted bids ── */}
                          {bid.status === "accepted" && (() => {
                            const myReview    = myBidReviews[bid._id];
                            const myComplaint = myBidComplaints[bid._id];
                            if (!myReview && !myComplaint) return null;
                            return (
                              <div className="mt-3 space-y-2">
                                {/* Own review detail */}
                                {myReview && (
                                  <div className="rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-[10px] font-black text-amber-700 uppercase tracking-wide">Your Review</span>
                                      <div className="flex gap-0.5">
                                        {[1,2,3,4,5].map((s) => (
                                          <span key={s} className={`text-[12px] ${s <= myReview.rating ? "text-amber-400" : "text-gray-200"}`}>★</span>
                                        ))}
                                      </div>
                                      <span className="text-[10px] font-bold text-amber-600">{myReview.rating}/5</span>
                                    </div>
                                    {myReview.comment && (
                                      <p className="text-[12px] text-amber-800 italic">"{myReview.comment}"</p>
                                    )}
                                  </div>
                                )}

                                {/* Own complaint detail + seller's reply */}
                                {myComplaint && (
                                  <div className="rounded-xl bg-red-50 border border-red-200 px-3 py-2.5">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <span className="text-[10px] font-black text-red-600 uppercase tracking-wide">🚨 Your Complaint</span>
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 capitalize">{myComplaint.type?.replace("_", " ")}</span>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                                        myComplaint.status === "resolved"    ? "bg-green-100 text-green-700" :
                                        myComplaint.status === "dismissed"   ? "bg-gray-100 text-gray-600"  :
                                        myComplaint.status === "under_review"? "bg-blue-100 text-blue-700"  :
                                        "bg-orange-100 text-orange-700"
                                      }`}>{myComplaint.status?.replace("_", " ")}</span>
                                    </div>
                                    <p className="text-[12px] text-red-700 font-semibold">{myComplaint.subject}</p>
                                    {myComplaint.description && (
                                      <p className="text-[11px] text-red-500 mt-0.5">{myComplaint.description}</p>
                                    )}

                                    {/* ── Chat thread ── */}
                                    <div className="mt-2.5 pt-2.5 border-t border-red-200 space-y-1.5">
                                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wide mb-2">Conversation</p>

                                      {/* Legacy single-round replies (backward compat) */}
                                      {(!myComplaint.messages || myComplaint.messages.length === 0) && myComplaint.accused_reply && (
                                        <>
                                          <div className="flex justify-start">
                                            <div className="max-w-[80%] bg-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-3 py-2">
                                              <p className="text-[11px]">{myComplaint.accused_reply}</p>
                                              <p className="text-[9px] text-gray-400 mt-0.5">{myComplaint.repliedAt ? new Date(myComplaint.repliedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                                            </div>
                                          </div>
                                          {myComplaint.complainant_reply && (
                                            <div className="flex justify-end">
                                              <div className="max-w-[80%] bg-purple-600 text-white rounded-2xl rounded-tr-sm px-3 py-2">
                                                <p className="text-[11px]">{myComplaint.complainant_reply}</p>
                                                <p className="text-[9px] opacity-60 mt-0.5 text-right">{myComplaint.complainantRepliedAt ? new Date(myComplaint.complainantRepliedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                                              </div>
                                            </div>
                                          )}
                                        </>
                                      )}

                                      {/* New messages[] — chat bubbles */}
                                      {(myComplaint.messages || []).map((msg, i) => {
                                        const isMine = msg.senderRole === "complainant"; // buyer = complainant (on My Bids tab)
                                        const isEditing = editingMsgId === msg._id?.toString();
                                        return (
                                          <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"} group`}>
                                            <div className="max-w-[80%]">
                                              {isEditing ? (
                                                <div className="flex gap-1.5 items-center">
                                                  <input
                                                    autoFocus
                                                    value={editingText}
                                                    onChange={(e) => setEditingText(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === "Enter") handleEditComplaintMessage(myComplaint._id, msg._id, bid._id); if (e.key === "Escape") { setEditingMsgId(null); setEditingText(""); } }}
                                                    className="text-[12px] border border-purple-300 rounded-full px-3 py-1.5 outline-none focus:ring-2 focus:ring-purple-400 bg-white w-48"
                                                  />
                                                  <button disabled={editLoadingId === msg._id} onClick={() => handleEditComplaintMessage(myComplaint._id, msg._id, bid._id)} className="text-[10px] bg-purple-600 text-white px-2 py-1 rounded-full hover:bg-purple-700 disabled:opacity-50">
                                                    {editLoadingId === msg._id ? "…" : "Save"}
                                                  </button>
                                                  <button onClick={() => { setEditingMsgId(null); setEditingText(""); }} className="text-[10px] text-gray-400 hover:text-gray-600 px-1">✕</button>
                                                </div>
                                              ) : (
                                                <div className={`relative rounded-2xl px-3 py-2 ${isMine ? "bg-purple-600 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"}`}>
                                                  <p className="text-[11px] pr-6">{msg.text}</p>
                                                  <div className={`flex items-center gap-1 mt-0.5 ${isMine ? "justify-end" : ""}`}>
                                                    <p className={`text-[9px] ${isMine ? "opacity-60" : "text-gray-400"}`}>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</p>
                                                    {msg.editedAt && <p className={`text-[9px] ${isMine ? "opacity-50" : "text-gray-400"} italic`}>(edited)</p>}
                                                  </div>
                                                  {isMine && (
                                                    <div className="absolute -top-6 right-0 hidden group-hover:flex items-center gap-1 bg-white border border-gray-200 rounded-lg px-1.5 py-0.5 shadow-md z-10">
                                                      <button title="Edit" onClick={() => { setEditingMsgId(msg._id?.toString()); setEditingText(msg.text); }} className="text-[10px] text-blue-500 hover:text-blue-700 px-1 py-0.5 rounded">✏️</button>
                                                      <button title="Delete" disabled={deleteLoadingId === msg._id} onClick={() => handleDeleteComplaintMessage(myComplaint._id, msg._id, bid._id)} className="text-[10px] text-red-500 hover:text-red-700 px-1 py-0.5 rounded disabled:opacity-50">🗑️</button>
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}


                                      {(!myComplaint.messages || myComplaint.messages.length === 0) && !myComplaint.accused_reply && (
                                        <p className="text-[10px] text-gray-400 italic text-center py-1">No messages yet. Awaiting seller's first response.</p>
                                      )}

                                      {/* Send message input */}
                                      <div className="flex gap-2 pt-1">
                                        <input
                                          type="text"
                                          placeholder="Type a message..."
                                          value={chatMsgMap[myComplaint._id] || ""}
                                          onChange={(e) => setChatMsgMap((p) => ({ ...p, [myComplaint._id]: e.target.value }))}
                                          onKeyDown={(e) => e.key === "Enter" && handleSendComplaintMessage(myComplaint._id, bid._id, false)}
                                          className="flex-1 text-[12px] border border-red-200 rounded-full px-3 py-1.5 outline-none focus:ring-2 focus:ring-purple-300 bg-white"
                                        />
                                        <button
                                          disabled={chatLoadingId === myComplaint._id}
                                          onClick={() => handleSendComplaintMessage(myComplaint._id, bid._id, false)}
                                          className="px-3 py-1.5 bg-purple-600 text-white text-[11px] font-bold rounded-full hover:bg-purple-700 transition disabled:opacity-50 shrink-0"
                                        >
                                          {chatLoadingId === myComplaint._id ? "…" : "➤"}
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== Complaint Modal ===== */}
      {complaintTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setComplaintTarget(null)}>
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
              <div>
                <h2 className="font-bold text-purple-950 text-lg">🚨 {complaintTarget.isSeller ? "Report Buyer" : "File a Complaint"}</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">{complaintTarget.isSeller ? "Report an issue with this buyer" : "Report an issue with this seller or transaction"}</p>
              </div>
              <button onClick={() => setComplaintTarget(null)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition">
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmitComplaint} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Item info */}
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-lg shrink-0 overflow-hidden">
                  {complaintTarget.bid.bidItem?.image
                    ? <img src={complaintTarget.bid.bidItem.image} alt="" className="w-full h-full object-cover" />
                    : "📦"}
                </div>
                <div>
                  <p className="font-semibold text-purple-900 text-sm">{complaintTarget.bid.bidItem?.title || "Item"}</p>
                  <p className="text-[10px] text-purple-400">
                    {complaintTarget.isSeller
                      ? `Buyer: ${complaintTarget.bid.bidder?.name || "Unknown"} · LKR ${Number(complaintTarget.bid.amount).toLocaleString()}`
                      : `Seller: ${complaintTarget.bid.bidItem?.seller?.name || "Unknown"} · LKR ${Number(complaintTarget.bid.amount).toLocaleString()}`
                    }
                  </p>
                </div>
              </div>

              {/* Complaint Type */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Complaint Type *</label>
                <select
                  value={complaintType}
                  onChange={(e) => setComplaintType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                >
                  <option value="fraud">🚫 Fraud / Scam</option>
                  <option value="item_not_delivered">📦 Item Not Delivered</option>
                  <option value="fake_listing">🛎 Fake Listing</option>
                  <option value="harassment">⚠️ Harassment</option>
                  <option value="false_report">📝 False Report</option>
                  <option value="other">• Other</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  maxLength={150}
                  value={complaintSubject}
                  onChange={(e) => setComplaintSubject(e.target.value)}
                  placeholder="Brief title of your complaint..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                />
                <p className="text-right text-[10px] text-gray-400">{complaintSubject.length}/150</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Description *</label>
                <textarea
                  rows={4}
                  required
                  maxLength={1000}
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  placeholder="Describe the issue in detail. Include dates, amounts, and any relevant context..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
                />
                <p className="text-right text-[10px] text-gray-400">{complaintDesc.length}/1000</p>
              </div>

              {/* Warning note */}
              <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                <span className="text-amber-500 text-sm shrink-0">⚠️</span>
                <p className="text-[11px] text-amber-700 leading-relaxed">False complaints may result in account suspension. Only submit if you have genuine concerns.</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button type="button" onClick={() => setComplaintTarget(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={complaintLoading} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition disabled:opacity-50">
                  {complaintLoading ? "Submitting..." : "🚨 Submit Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Review Modal ===== */}
      {reviewTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setReviewTarget(null)}>
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-yellow-50">
              <div>
                <h2 className="font-bold text-purple-950 text-lg">Leave a Review</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Rate your experience with this seller</p>
              </div>
              <button onClick={() => setReviewTarget(null)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition">
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6 space-y-5">
              {/* Item info */}
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-lg shrink-0 overflow-hidden">
                  {reviewTarget.bid.bidItem?.image
                    ? <img src={reviewTarget.bid.bidItem.image} alt="" className="w-full h-full object-cover" />
                    : "📦"}
                </div>
                <div>
                  <p className="font-semibold text-purple-900 text-sm">{reviewTarget.bid.bidItem?.title || "Item"}</p>
                  <p className="text-[10px] text-purple-400">Bid accepted · LKR {Number(reviewTarget.bid.amount).toLocaleString()}</p>
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-2">Your Rating *</label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHover(star)}
                      onMouseLeave={() => setReviewHover(0)}
                      className="text-3xl transition-transform hover:scale-110 focus:outline-none"
                    >
                      <span className={(reviewHover || reviewRating) >= star ? "text-amber-400" : "text-gray-200"}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="ml-2 text-[12px] font-semibold text-amber-600 self-center">
                    {["Poor", "Fair", "Good", "Great", "Excellent!"][reviewRating - 1]}
                  </span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Comment <span className="font-normal text-gray-400">(optional)</span>
                </label>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this seller..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-300"
                />
                <p className="text-right text-[10px] text-gray-400">{reviewComment.length}/500</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setReviewTarget(null)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewLoading}
                  className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition disabled:opacity-50"
                >
                  {reviewLoading ? "Submitting..." : "Submit Review ⭐"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Place a Bid Modal */}
      {bidTarget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setBidTarget(null)}>
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-purple-950 text-lg">Place a Bid</h2>
              <button onClick={() => setBidTarget(null)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition">
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>
            <form onSubmit={handlePlaceBid} className="p-6 space-y-4">
              <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
                <p className="font-semibold text-purple-900 text-sm">{bidTarget.title}</p>
                <p className="text-[11px] text-purple-400 mt-0.5">Starting price: LKR {Number(bidTarget.startingPrice).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Your Bid Amount (LKR) *</label>
                <input
                  type="number"
                  required
                  min={bidTarget.startingPrice}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min LKR ${Number(bidTarget.startingPrice).toLocaleString()}`}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Message to Seller <span className="font-normal text-gray-400">(optional)</span></label>
                <textarea
                  rows={3}
                  maxLength={500}
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  placeholder="Why are you interested? Any details..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <p className="text-right text-[10px] text-gray-400">{bidMessage.length}/500</p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setBidTarget(null)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={bidLoading} className="flex-1 py-3 rounded-xl bg-purple-700 text-white text-sm font-bold hover:bg-purple-800 transition disabled:opacity-50">
                  {bidLoading ? "Placing..." : "Place Bid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bid Item Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-purple-950 text-lg">New Bidding Item</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition">
                <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Item Title *</label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={formData.title}
                  onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Apple MacBook Air 2022"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                  >
                    {["Electronics", "Books", "Clothing", "Furniture", "Sports", "Other"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData((f) => ({ ...f, condition: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="damaged">Damaged</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Starting Price (LKR) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData((f) => ({ ...f, startingPrice: e.target.value }))}
                  placeholder="e.g. 5000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={formData.description}
                  onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Describe your item..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1">Item Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-[12px] text-gray-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-[12px] file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                />
                {formData.image && (
                  <img src={formData.image} alt="preview" className="mt-2 w-full h-32 object-cover rounded-xl border border-purple-100" />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={formLoading} className="flex-1 py-3 rounded-xl bg-purple-700 text-white text-sm font-bold hover:bg-purple-800 transition disabled:opacity-50">
                  {formLoading ? "Saving..." : "List Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
