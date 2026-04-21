import React, { useEffect, useState } from "react";

const getRelativeTime = (timestamp, fallbackMsg) => {
  const parseToMs = (val) => {
    if (!val) return NaN;
    if (typeof val === 'number') return val;
    const parsed = Date.parse(val);
    return isNaN(parsed) ? NaN : parsed;
  };

  let ts = parseToMs(timestamp);
  if (isNaN(ts)) ts = parseToMs(fallbackMsg);
  if (isNaN(ts)) return fallbackMsg || "Just now";

  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export default function NotificationsTab({
  openNotifyModal,
  quickStudent,
  setQuickStudent,
  quickType,
  setQuickType,
  quickMsg,
  setQuickMsg,
  sendQuickNotif,
  notifications = [],
}) {
  const [, setTick] = useState(0);

  useEffect(() => {
    // Re-render every minute to update relative times
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-[14px] xl:grid-cols-[1fr_320px]">
      <div className="glass-card p-4">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-[14.5px] font-bold text-indigo-950">🔔 Notifications Sent</div>
            <div className="mt-0.5 text-[11px] text-slate-500">System alerts delivered to students - Live Feed</div>
          </div>
          <button className="btn-primary" onClick={() => openNotifyModal()}>
            + Send Notification
          </button>
        </div>

        <div>
          {notifications.length > 0 ? notifications.map((n, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 border-b border-indigo-300/10 py-3 ${index === notifications.length - 1 ? "border-b-0" : ""}`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-[15px] ${n.iconBg}`}>
                {n.icon}
              </div>

              <div className="flex-1">
                <div className="text-[13px] font-semibold leading-[1.4] text-indigo-950">{n.title}</div>
                <div className="mt-0.5 text-[11.5px] text-slate-500">{n.sub}</div>
              </div>

              {n.unread && <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />}
              <div className="shrink-0 whitespace-nowrap text-[11px] text-slate-400">
                {getRelativeTime(n.timestamp, n.time)}
              </div>
            </div>
          )) : (
            <div className="py-12 text-center text-slate-400 font-medium italic text-sm">No notifications recorded in this session.</div>
          )}
        </div>
      </div>

      <div className="glass-card p-4">
        <div className="mb-4">
          <div className="text-[14.5px] font-bold text-indigo-950">✉️ Quick Notify</div>
          <div className="mt-0.5 text-[11px] text-slate-500">Send a message to a student</div>
        </div>

        <div className="flex flex-col gap-3">
          <select
            value={quickStudent}
            onChange={(e) => setQuickStudent(e.target.value)}
            className="rounded-[11px] border border-indigo-300/30 bg-slate-50/90 px-3 py-2.5 text-[13px] text-indigo-950 outline-none font-medium"
          >
            <option value="">Select student…</option>
            <option>Jane Doe — MacBook Air</option>
            <option>Ravi K. — Samsung Galaxy A54</option>
            <option>Tom M. — Apple Watch</option>
            <option>Kasun L. — Sony Headphones</option>
            <option>Nisha F. — Shoulder Bag</option>
          </select>

          <select
            value={quickType}
            onChange={(e) => setQuickType(e.target.value)}
            className="rounded-[11px] border border-indigo-300/30 bg-slate-50/90 px-3 py-2.5 text-[13px] text-indigo-950 outline-none font-medium"
          >
            <option>⏰ Expiry Warning (2 days left)</option>
            <option>🔔 Expiry Warning (7 days left)</option>
            <option>✅ Item Marked as Found</option>
            <option>🗃️ Post Archived</option>
            <option>📋 Custom Message</option>
          </select>

          <textarea
            rows={4}
            value={quickMsg}
            onChange={(e) => setQuickMsg(e.target.value)}
            placeholder="Type a custom message…"
            className="resize-none rounded-[11px] border border-indigo-300/30 bg-slate-50/90 px-3 py-2.5 text-[13px] text-indigo-950 outline-none"
          />

          <button className="btn-primary rounded-[11px] py-[11px] text-[13px]" onClick={sendQuickNotif}>
            📤 Send Notification
          </button>
        </div>
      </div>
    </div>
  );
}