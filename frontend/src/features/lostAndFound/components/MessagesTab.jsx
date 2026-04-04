import { THREADS } from "../../../data/adminMockData";

export default function MessagesTab({
  activeThread,
  setActiveThread,
  threadSearch,
  setThreadSearch,
  chatMsgs,
  chatInput,
  setChatInput,
  sendChatMsg,
  openArchiveModal,
}) {
  const filteredThreads = THREADS.filter((t) =>
    t.name.toLowerCase().includes(threadSearch.toLowerCase()) ||
    t.subject.toLowerCase().includes(threadSearch.toLowerCase())
  );

  const currentThread = THREADS.find((t) => t.id === activeThread);
  const currentMsgs = chatMsgs[activeThread] || [];

  return (
    <div className="glass-card overflow-hidden p-0">
      <div className="grid h-auto grid-cols-1 overflow-hidden rounded-[18px] border border-indigo-300/20 md:h-[520px] md:grid-cols-[280px_1fr]">
        <div className="flex flex-col border-r border-indigo-300/15 bg-white/70 backdrop-blur-[16px]">
          <div className="flex items-center justify-between border-b border-indigo-300/15 px-4 py-4 text-[13.5px] font-bold text-indigo-950">
            💬 Student Messages
            <span className="rounded-full bg-gradient-to-br from-red-600 to-red-500 px-2 py-1 text-[11px] font-bold text-white">
              5 new
            </span>
          </div>

          <div className="border-b border-indigo-300/10 p-3">
            <input
              value={threadSearch}
              onChange={(e) => setThreadSearch(e.target.value)}
              placeholder="Search conversations…"
              className="w-full rounded-[9px] border border-indigo-300/25 bg-slate-100/80 px-3 py-2 text-[12.5px] text-indigo-950 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredThreads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThread(t.id)}
                className={`relative flex w-full gap-3 border-b border-indigo-300/10 px-4 py-3 text-left transition ${
                  activeThread === t.id ? "bg-indigo-500/10" : "hover:bg-indigo-500/5"
                }`}
              >
                {t.unread > 0 && (
                  <span className="absolute left-1.5 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-indigo-600" />
                )}

                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[13px] font-bold text-white ${t.color}`}>
                  {t.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-indigo-950">{t.name}</div>
                  <div className="mt-0.5 truncate text-[11.5px] text-slate-500">{t.preview}</div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="text-[10.5px] text-slate-400">{t.time}</div>
                  {t.unread > 0 && (
                    <div className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {t.unread}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col bg-white/55 backdrop-blur-[14px]">
          <div className="flex items-center gap-3 border-b border-indigo-300/15 bg-white/60 px-4 py-4">
            <div className={`flex h-[38px] w-[38px] items-center justify-center rounded-full bg-gradient-to-br text-[14px] font-bold text-white ${currentThread?.color}`}>
              {currentThread?.initials}
            </div>

            <div className="flex-1">
              <div className="text-[14px] font-bold text-indigo-950">{currentThread?.name}</div>
              <div className="mt-0.5 text-[11.5px] text-slate-500">
                Engineering · Year 3 · {currentThread?.subject}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn-success" onClick={() => openArchiveModal("MacBook Air", currentThread?.name, "found")}>
                ✅ Mark Found
              </button>
              <button className="btn-danger" onClick={() => openArchiveModal("MacBook Air", currentThread?.name, "archive")}>
                🗃️ Archive
              </button>
            </div>
          </div>

          <div className="mx-4 mt-3 flex items-center gap-2 rounded-[11px] border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-yellow-400/5 px-4 py-2 text-[12px] text-amber-800">
            <span>⏰</span>
            <span>
              This student's <strong>MacBook Air</strong> post expires in <strong>2 days</strong>.
              <button className="font-medium text-amber-700 hover:text-amber-900 hover:underline decoration-amber-400/50 underline-offset-2 transition ml-1">
                Send reminder &rarr;
              </button>
            </span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="flex flex-col gap-3">
              {currentMsgs.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex max-w-[75%] gap-2 ${m.from === "admin" ? "ml-auto flex-row-reverse" : ""}`}
                >
                  {m.from !== "admin" ? (
                    <div className={`mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white ${currentThread?.color}`}>
                      {currentThread?.initials}
                    </div>
                  ) : (
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-400 text-[10px] font-bold text-white">
                      AD
                    </div>
                  )}

                  <div>
                    <div
                      className={`rounded-[16px] px-[14px] py-[10px] text-[13px] leading-[1.5] ${
                        m.from === "admin"
                          ? "rounded-tr-[4px] bg-gradient-to-br from-indigo-600 to-indigo-500 text-white"
                          : "rounded-tl-[4px] border border-indigo-300/20 bg-white/85 text-indigo-950"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className={`mt-1 text-[10px] text-slate-400 ${m.from === "admin" ? "text-left" : "text-right"}`}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-indigo-300/15 bg-white/70 p-4">
            <div className="flex gap-2 rounded-[14px] border border-indigo-300/30 bg-slate-100/80 px-[14px] py-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMsg()}
                placeholder="Type a reply to the student…"
                className="flex-1 bg-transparent text-[13.5px] text-indigo-950 outline-none placeholder:text-slate-400"
              />
              <button
                onClick={sendChatMsg}
                className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gradient-to-br from-indigo-600 to-indigo-500 text-white shadow-[0_3px_10px_rgba(79,70,229,0.3)] transition hover:-translate-y-[1px]"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
