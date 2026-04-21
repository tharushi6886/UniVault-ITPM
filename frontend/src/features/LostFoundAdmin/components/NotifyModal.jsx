export default function NotifyModal({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(15,10,40,0.5)] p-4 backdrop-blur-[6px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] overflow-hidden rounded-[22px] bg-white shadow-[0_32px_72px_rgba(15,10,40,0.22)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-6 pb-4 pt-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-amber-100 text-[20px]">
            🔔
          </div>
          <div className="text-[18px] font-bold text-indigo-950">Send Expiry Notification</div>
        </div>

        <div className="px-6 pb-5">
          <div className="text-[13px] leading-6 text-slate-500">
            A notification will be sent to the student informing them that their advertisement is expiring soon.
          </div>

          <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-[13px] text-amber-800">
            📱 WhatsApp + 📧 Email notification will be dispatched automatically.
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-indigo-300/15 bg-slate-50/70 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-[10px] border border-indigo-300/30 bg-slate-100 px-4 py-2 text-[13px] font-bold text-slate-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-[10px] bg-gradient-to-br from-amber-500 to-amber-600 px-5 py-2 text-[13px] font-bold text-white"
          >
            📤 Send Now
          </button>
        </div>
      </div>
    </div>
  );
}