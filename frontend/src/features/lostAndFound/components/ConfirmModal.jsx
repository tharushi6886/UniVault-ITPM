export default function ConfirmModal({ open, onClose, onConfirm, mode, title, student }) {
  if (!open) return null;

  const isFound = mode === "found";

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
          <div className={`flex h-11 w-11 items-center justify-center rounded-[14px] text-[20px] ${isFound ? "bg-emerald-100" : "bg-slate-100"}`}>
            {isFound ? "✅" : "🗃️"}
          </div>
          <div className="text-[18px] font-bold text-indigo-950">
            {isFound ? "Mark as Found / Returned" : "Archive Post"}
          </div>
        </div>

        <div className="px-6 pb-5 text-[13px] leading-6 text-slate-500">
          {isFound
            ? `This will update "${title}" (posted by ${student}) as found and automatically archive it. The student will be notified.`
            : `Archive "${title}" by ${student}? This will remove it from the community board. The student will receive a notification.`}
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
            className={`rounded-[10px] px-5 py-2 text-[13px] font-bold text-white ${
              isFound
                ? "bg-gradient-to-br from-emerald-600 to-emerald-400"
                : "bg-gradient-to-br from-slate-500 to-slate-700"
            }`}
          >
            {isFound ? "✅ Confirm Found" : "🗃️ Archive"}
          </button>
        </div>
      </div>
    </div>
  );
}
