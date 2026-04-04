import { useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import OverviewTab from "../components/OverviewTab";
import AdsTab from "../components/AdsTab";
import ExpiringTab from "../components/ExpiringTab";
import NotificationsTab from "../components/NotificationsTab";
import MessagesTab from "../components/MessagesTab";
import ArchivedTab from "../components/ArchivedTab";
import ConfirmModal from "../components/ConfirmModal";
import NotifyModal from "../components/NotifyModal";
import { CHAT_MSGS } from "../../../data/adminMockData";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [threadSearch, setThreadSearch] = useState("");
  const [activeThread, setActiveThread] = useState(1);
  const [chatMsgs, setChatMsgs] = useState(CHAT_MSGS);
  const [chatInput, setChatInput] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({ title: "", student: "", mode: "archive" });

  const [quickStudent, setQuickStudent] = useState("");
  const [quickType, setQuickType] = useState("⏰ Expiry Warning (2 days left)");
  const [quickMsg, setQuickMsg] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");

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

  const confirmAction = () => {
    setConfirmOpen(false);
    alert(modalInfo.mode === "found" ? "✅ Item marked as found!" : "🗃️ Post archived successfully!");
  };

  const openNotifyModal = () => {
    setNotifyOpen(true);
  };

  const confirmNotify = () => {
    setNotifyOpen(false);
    alert("📤 Notification sent successfully!");
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
        return <OverviewTab setActiveTab={setActiveTab} globalSearch={globalSearch} />;
      case "ads":
        return (
          <AdsTab
            filterType={filterType}
            setFilterType={setFilterType}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            openArchiveModal={openArchiveModal}
            globalSearch={globalSearch}
          />
        );
      case "expiring":
        return <ExpiringTab openNotifyModal={openNotifyModal} globalSearch={globalSearch} />;
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
          />
        );
      case "archived":
        return <ArchivedTab globalSearch={globalSearch} />;
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
