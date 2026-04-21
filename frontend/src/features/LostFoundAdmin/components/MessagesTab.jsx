import React from "react";

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
  threads = [],
}) {
  const filteredThreads = threads.filter((t) =>
    t.name.toLowerCase().includes(threadSearch.toLowerCase()) ||
    t.subject.toLowerCase().includes(threadSearch.toLowerCase())
  );

  const currentThread = threads.find((t) => t.id === activeThread);
  const currentMsgs = chatMsgs[activeThread] || [];

  return (
    <div className="glass-card overflow-hidden p-0">
      <div className="grid h-auto grid-cols-1 overflow-hidden rounded-[18px] border border-indigo-300/20 md:h-[520px] md:grid-cols-[280px_1fr]">
        <div className="flex flex-col border-r border-indigo-300/15 bg-white/70 backdrop-blur-[16px]">
          <div className="flex items-center justify-between border-b border-indigo-300/15 px-4 py-4 text-[13.5px] font-bold text-indigo-950">
            💬 Student Messages
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
            {filteredThreads.length > 0 ? filteredThreads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveThread(t.id)}
                className={`relative flex w-full gap-3 border-b border-indigo-300/10 px-4 py-3 text-left transition ${activeThread === t.id ? "bg-indigo-500/10" : "hover:bg-indigo-500/5"
                  }`}
              >
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[13px] font-bold text-white ${t.color}`}>
                  {t.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-bold text-indigo-950">{t.name}</div>
                  <div className="mt-0.5 truncate text-[11.5px] text-slate-500">{t.preview}</div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="text-[10.5px] text-slate-400">{t.time}</div>
                </div>
              </button>
            )) : (
              <div className="py-8 text-center text-slate-400 font-medium italic text-xs">No active conversations.</div>
            )}
          </div>
        </div>

        <div className="flex flex-col bg-white/55 backdrop-blur-[14px]">
          {activeThread ? (
          <>
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
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-400 text-[10px] font-bold text-white">
                        AD
                      </div>
                    )}

                    <div>
                      <div
                        className={`rounded-[16px] px-[14px] py-[10px] text-[13px] leading-[1.5] ${m.from === "admin"
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
          </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
               <span className="text-4xl mb-4 opacity-50">📤</span>
               <div className="font-bold text-indigo-900/60">No Conversation Selected</div>
               <div className="text-[12px] max-w-[200px]">Select a student from the sidebar to view their messages or start a new thread.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}