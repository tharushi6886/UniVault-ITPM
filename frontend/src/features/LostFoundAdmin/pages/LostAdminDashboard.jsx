import React, { useMemo, useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import OverviewTab from "../components/OverviewTab";
import AdsTab from "../components/AdsTab";
import NotificationsTab from "../components/NotificationsTab";
import MessagesTab from "../components/MessagesTab";
import ConfirmModal from "../components/ConfirmModal";
import NotifyModal from "../components/NotifyModal";
import { getAllLostItems, getAllFoundItems, notifyStudent } from "../../../api/itemApi";
import axios from "axios";
import { toast } from "react-toastify";
// CHAT_MSGS removed - handling via state

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("overview");
    const [filterType, setFilterType] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");
    const [threadSearch, setThreadSearch] = useState("");
    const [activeThread, setActiveThread] = useState(null);
    const [chatMsgs, setChatMsgs] = useState({});
    const [threads, setThreads] = useState([]);
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem("adminNotifications");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("adminNotifications", JSON.stringify(notifications));
    }, [notifications]);
    const [chatInput, setChatInput] = useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [notifyOpen, setNotifyOpen] = useState(false);
    const [notifyInfo, setNotifyInfo] = useState({ name: "", item: null });
    const [modalInfo, setModalInfo] = useState({ title: "", student: "", mode: "archive" });

    const [allAds, setAllAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quickStudent, setQuickStudent] = useState("");
    const [quickType, setQuickType] = useState("⏰ Expiry Warning (2 days left)");
    const [quickMsg, setQuickMsg] = useState("");
    const [globalSearch, setGlobalSearch] = useState("");

    const fetchRealItems = async () => {
        setLoading(true);
        try {
            const [lostRes, foundRes] = await Promise.all([
                getAllLostItems(),
                getAllFoundItems()
            ]);

            const transform = (item, type) => {
                const reportDate = new Date(item.date);
                const today = new Date();
                const diffTime = Math.abs(today - reportDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                const daysLeft = Math.max(0, 30 - diffDays);

                return {
                    id: item._id,
                    title: item.title || item.itemName || "Unnamed Item",
                    student: item.studentId || "Unknown Student",
                    studentId: item.studentId, // Keep for actions
                    img: item.imageUrl || "https://images.unsplash.com/photo-1544365558-35aa4af41144?w=500&h=360&fit=crop",
                    type: type,
                    category: item.category || "General",
                    status: item.status || "Active",
                    location: item.location || "Campus",
                    daysLeft: daysLeft,
                    year: "Student", // Placeholder if not in item
                    phone: item.contactNumber || "N/A",
                    date: item.date,
                    raw: item // Keep original data
                };
            };

            const lostItems = (lostRes.data || []).map(item => transform(item, "Lost"));
            const foundItems = (foundRes.data || []).map(item => transform(item, "Found"));

            setAllAds([...lostItems, ...foundItems].sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (err) {
            console.error("Error fetching admin data:", err);
            toast.error("Failed to load real-time item data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRealItems();
    }, []);

    const sendChatMsg = () => {
        if (!chatInput.trim()) return;

        setChatMsgs((prev) => ({
            ...prev,
            [activeThread]: [
                ...(prev[activeThread] || []),
                { from: "admin", text: chatInput, time: "Now" },
            ],
        }));
        setChatInput("");
    };

    const openArchiveModal = (title, student, mode) => {
        setModalInfo({ title, student, mode });
        setConfirmOpen(true);
    };

    const confirmAction = async () => {
        setConfirmOpen(false);
        const { id, mode } = modalInfo;
        
        try {
            const endpoint = modalInfo.raw?.type === "Lost" ? "/api/lost-items" : "/api/found-items";
            const url = `http://localhost:5000${endpoint}/${id}`;
            
            if (mode === "found" || mode === "archive") {
                // Update status to Resolved/Archived in backend
                await axios.put(url, { ...modalInfo.raw?.raw, status: mode === "found" ? "Resolved" : "Archived" });
                toast.success(mode === "found" ? "✅ Item marked as found!" : "🗃️ Post archived successfully!");
                fetchRealItems(); // Refresh data
            }
        } catch (err) {
            console.error("Action error:", err);
            toast.error("Failed to update item status.");
        }
    };

    const openNotifyModal = (studentName, item) => {
        setNotifyInfo({ name: studentName || "", item: item || null });
        setNotifyOpen(true);
    };

    const confirmNotify = async (customMessage) => {
        try {
            // Prevent passing React SyntheticEvents as the message payload to Axios
            const msgPayload = typeof customMessage === 'string' ? customMessage : "";

            if (!notifyInfo.item) {
                toast.error("No item selected for notification.");
                return;
            }

            const res = await notifyStudent(notifyInfo.item.id, notifyInfo.item.type, msgPayload);
            
            // Add to the Notifications Tab history
            const newNotif = {
                id: Date.now(),
                student: notifyInfo.name,
                item: notifyInfo.item.title,
                type: notifyInfo.item.type,
                time: "Just now",
                icon: "🔔",
                iconBg: "bg-amber-100/80 text-amber-600",
                title: `Notification sent to ${notifyInfo.name}`,
                sub: `Regarding "${notifyInfo.item.title}" - "${msgPayload}"`,
                unread: true
            };
            setNotifications(prev => [newNotif, ...prev]);

            toast.success(res.data.message || "Notification sent successfully!");
            setNotifyOpen(false);
        } catch (err) {
            console.error("Notification error:", err);
            toast.error(err.response?.data?.message || "Failed to send notification.");
        }
    };

    const sendQuickNotif = () => {
        if (!quickStudent) {
            alert("Please select a student.");
            return;
        }
        alert(`📤 Notification sent to ${quickStudent.split(" — ")[0]}!`);
        setQuickStudent("");
        setQuickMsg("");
    };

    const content = useMemo(() => {
        switch (activeTab) {
            case "overview":
                return <OverviewTab setActiveTab={setActiveTab} globalSearch={globalSearch} allAds={allAds} loading={loading} />;
            case "ads":
                return (
                    <AdsTab
                        allAds={allAds}
                        loading={loading}
                        filterType={filterType}
                        setFilterType={setFilterType}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        openArchiveModal={(title, student, mode, item) => {
                            setModalInfo({ title, student, mode, raw: item });
                            setConfirmOpen(true);
                        }}
                        openNotifyModal={openNotifyModal}
                        globalSearch={globalSearch}
                    />
                );

            case "notifications":
                return (
                    <NotificationsTab
                        openNotifyModal={openNotifyModal}
                        quickStudent={quickStudent}
                        setQuickStudent={setQuickStudent}
                        quickType={quickType}
                        setQuickType={setQuickType}
                        quickMsg={quickMsg}
                        setQuickMsg={setQuickMsg}
                        sendQuickNotif={sendQuickNotif}
                        notifications={notifications}
                    />
                );
            case "messages":
                return (
                    <MessagesTab
                        activeThread={activeThread}
                        setActiveThread={setActiveThread}
                        threadSearch={threadSearch}
                        setThreadSearch={setThreadSearch}
                        chatMsgs={chatMsgs}
                        chatInput={chatInput}
                        setChatInput={setChatInput}
                        sendChatMsg={sendChatMsg}
                        openArchiveModal={openArchiveModal}
                        threads={threads}
                    />
                );

            default:
                return <OverviewTab setActiveTab={setActiveTab} globalSearch={globalSearch} />;
        }
    }, [
        activeTab,
        filterType,
        filterStatus,
        activeThread,
        threadSearch,
        chatMsgs,
        chatInput,
        quickStudent,
        quickType,
        quickMsg,
        globalSearch,
        allAds,
        loading,
        threads,
        notifications,
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ]);

    return (
        <>
            <AdminLayout
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                globalSearch={globalSearch}
                setGlobalSearch={setGlobalSearch}
            >
                {content}
            </AdminLayout>

            <ConfirmModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmAction}
                mode={modalInfo.mode}
                title={modalInfo.title}
                student={modalInfo.student}
            />

            <NotifyModal
                open={notifyOpen}
                onClose={() => setNotifyOpen(false)}
                onConfirm={confirmNotify}
            />
        </>
    );
}