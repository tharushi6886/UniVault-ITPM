import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Massage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeContact, setActiveContact] = useState(5);
  const [chatInput, setChatInput] = useState('');
  const [expandedSections, setExpandedSections] = useState({ general: true, notes: true });
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Mary Franci', initials: 'MF', text: 'Can I try the software first?', type: 'received', time: '12:38' },
    { id: 2, text: 'Sure. Here is the demo unit. You can use it as long as you want.', type: 'sent-sms', time: '12:38' },
    { id: 3, sender: 'Mary Franci', initials: 'MF', text: 'Thank you. Now I want to buy the software. Which type of subscription do you have?', type: 'received', time: '12:38' },
    { id: 4, text: 'We have many type of subscription in this presentations. Please look at this showcase.', type: 'sent-sms', time: '12:39', file: { name: 'Presentation.pdf', size: '234 mb' } },
    { id: 5, sender: 'Mary Franci', initials: 'MF', text: 'Thanks. I will watch it later!', type: 'received', time: '12:38' },
  ]);

  const contacts = [
    { id: 1, name: 'Aspen Workman', phone: '+ (1) 234-543-4321', preview: 'Hello! I am looking for a new p...', time: '12:38', initials: 'AW', bgGradient: 'from-pink-300 to-purple-400', online: true, unread: 1 },
    { id: 2, name: 'Rhiel Madsen', phone: '+ (1) 234-543-4321', preview: 'Typing...', time: '12:38', initials: 'RM', bgGradient: 'from-emerald-300 to-blue-400', online: true, typing: true },
    { id: 3, name: 'Carla Dokidis', phone: '+ (1) 234-543-4321', preview: 'It works for me! Thanks', time: '12:38', initials: 'CD', bgGradient: 'from-yellow-300 to-orange-400', online: false },
    { id: 4, name: 'Maria Vetrovs', phone: '+ (1) 234-543-4321', preview: "Let's stay in touch!", time: '12:38', initials: 'MV', bgGradient: 'from-blue-300 to-indigo-400', online: true },
    { id: 5, name: 'Mary Franci', phone: '+ (1) 234-543-4321', preview: 'Thanks. I will watch it later...', time: '12:38', initials: 'MF', bgGradient: 'from-blue-300 to-indigo-400', online: true },
    { id: 6, name: 'Omar Vetrovs', phone: '+ (1) 234-543-4321', preview: 'Voice message', time: '12:38', initials: 'OV', bgGradient: 'from-cyan-300 to-cyan-400', online: false, voice: true },
    { id: 7, name: 'Marcus Bergson', phone: '+ (1) 234-543-4321', preview: 'Hello! I am looking for a new p...', time: '12:38', initials: 'MB', bgGradient: 'from-red-300 to-rose-400', online: false },
  ];

  const currentContact = contacts.find(c => c.id === activeContact);
  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      id: Date.now(),
      text: chatInput,
      type: 'sent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setChatInput('');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getGradient = (bgGradient) => {
    const gradients = {
      'from-pink-300 to-purple-400': 'from-pink-300 to-purple-400',
      'from-emerald-300 to-blue-400': 'from-emerald-300 to-blue-400',
      'from-yellow-300 to-orange-400': 'from-yellow-300 to-orange-400',
      'from-blue-300 to-indigo-400': 'from-blue-300 to-indigo-400',
      'from-cyan-300 to-cyan-400': 'from-cyan-300 to-cyan-400',
      'from-red-300 to-rose-400': 'from-red-300 to-rose-400',
    };
    return gradients[bgGradient] || bgGradient;
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      {/* TOP NAV */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between h-16 flex-shrink-0">
        <div className="flex gap-1 items-center">
          <button 
            onClick={() => navigate('/')} 
            className="text-2xl hover:opacity-60 transition mr-4" 
            title="Back to Dashboard"
          >
            ←
          </button>
          {['Chat'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-gray-900 text-white'
                  : 'bg-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">AB</div>
            Ashly Boldwin
          </div>
          <button className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">🔔</button>
          <button className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">⚙️</button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex-1 grid grid-cols-[260px_1fr_280px] gap-4 p-4 overflow-hidden">
        {/* LEFT: CONTACTS */}
        <div className="bg-white rounded-2xl shadow-md flex flex-col overflow-hidden">
          <div className="p-3 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
              <span className="text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1">
            {filteredContacts.map(c => (
              <div
                key={c.id}
                onClick={() => setActiveContact(c.id)}
                className={`flex items-center gap-2 p-2.5 border-b border-gray-100 cursor-pointer transition-colors ${
                  c.id === activeContact ? 'bg-gray-100' : 'hover:bg-gray-100'
                }`}
              >
                <div className={`relative w-11 h-11 rounded-full bg-gradient-to-br ${getGradient(c.bgGradient)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {c.initials}
                  {c.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white"></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <div className="text-sm font-bold text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-400">{c.time}</div>
                  </div>
                  <div className="text-xs text-gray-400">{c.phone}</div>
                  <div className={`text-xs truncate ${c.typing ? 'text-purple-600 italic' : c.voice ? 'text-gray-400' : 'text-gray-500'}`}>
                    {c.preview}
                  </div>
                </div>
                {c.unread && <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{c.unread}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE: CHAT */}
        <div className="bg-white rounded-2xl shadow-md flex flex-col overflow-hidden">
          {/* CHAT HEADER */}
          <div className="p-3 border-b border-gray-200 flex items-center gap-2 flex-shrink-0">
            {currentContact && (
              <>
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getGradient(currentContact.bgGradient)} flex items-center justify-center text-white text-sm font-bold`}>
                  {currentContact.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900">{currentContact.name}</div>
                  <div className="text-xs text-green-600">● Online</div>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">📞</button>
                  <button className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">⋯</button>
                </div>
              </>
            )}
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
            {messages.map((msg, idx) => (
              <React.Fragment key={msg.id}>
                {idx === 0 && <div className="text-center text-xs text-gray-400 py-2">12:38</div>}
                {msg.type === 'received' ? (
                  <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-300 to-indigo-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {msg.initials}
                    </div>
                    <div className="flex flex-col gap-0.5 max-w-xs">
                      <div className="text-xs font-semibold text-gray-500">{msg.sender}</div>
                      <div className="bg-white border border-gray-200 rounded-3xl rounded-bl-lg px-3 py-2 text-sm text-gray-900">
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ) : msg.type === 'sent-sms' ? (
                  <div className="flex justify-end">
                    <div className="flex flex-col gap-1 max-w-xs">
                      <div className="flex justify-end text-xs text-gray-400 gap-1">
                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">✉ via SMS</span>
                      </div>
                      <div className="bg-blue-100 text-blue-900 rounded-3xl rounded-br-lg px-3 py-2 text-sm">
                        {msg.text}
                      </div>
                      {msg.file && (
                        <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-2 mt-1">
                          <div className="w-7 h-7 rounded-lg bg-blue-200/50 flex items-center justify-center text-sm">📄</div>
                          <div className="text-xs">
                            <div className="font-semibold text-blue-900">{msg.file.name}</div>
                            <div className="text-blue-700">{msg.file.size}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="flex flex-col gap-1 max-w-xs">
                      <div className="bg-purple-600 text-white rounded-3xl rounded-br-lg px-3 py-2 text-sm">
                        {msg.text}
                      </div>
                      <div className="text-right text-xs text-gray-400">{msg.time} ✓✓</div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* CHAT INPUT */}
          <div className="p-3 border-t border-gray-200 flex items-center gap-2 flex-shrink-0 bg-white">
            <button className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition flex-shrink-0">📎</button>
            <button className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition flex-shrink-0">🎤</button>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="You are welcome!"
              className="flex-1 border border-gray-200 rounded-full px-4 py-2 bg-gray-100 text-sm text-gray-700 outline-none focus:border-purple-600 focus:bg-white transition"
            />
            <button
              onClick={sendMessage}
              className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center hover:opacity-90 transition flex-shrink-0"
            >
              ➤
            </button>
          </div>
        </div>

        {/* RIGHT: INFO PANEL */}
        <div className="bg-white rounded-2xl shadow-md overflow-y-auto flex flex-col">
          {/* General Info */}
          <div className="border-b border-gray-200 p-3.5">
            <button
              onClick={() => toggleSection('general')}
              className="flex justify-between items-center w-full"
            >
              <span className="text-sm font-bold text-gray-900">General info</span>
              <span className="text-gray-400 text-lg transition-transform" style={{ transform: expandedSections.general ? 'rotate(0deg)' : 'rotate(180deg)' }}>∧</span>
            </button>
            {expandedSections.general && (
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-300 to-indigo-400 flex items-center justify-center text-white font-bold">MF</div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">Mary Franci</div>
                    <div className="text-xs text-gray-400">+ (1) 234-543-4321</div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Email</div>
                  <div className="text-sm text-purple-600">mary_franci@gmail.com</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Date Created</div>
                  <div className="text-sm font-bold text-gray-900">Oct 12, 2022 · 11:43</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Status</div>
                  <div className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full mt-1">Active User</div>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="border-b border-gray-200 p-3.5">
            <button
              onClick={() => toggleSection('notes')}
              className="flex justify-between items-center w-full"
            >
              <span className="text-sm font-bold text-gray-900">Notes</span>
              <span className="text-gray-400 text-lg transition-transform" style={{ transform: expandedSections.notes ? 'rotate(0deg)' : 'rotate(180deg)' }}>∧</span>
            </button>
            {expandedSections.notes && (
              <div className="mt-3 space-y-2">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-gray-100 rounded-xl p-3">
                    <div className="text-xs text-gray-700 leading-relaxed">Eget pulvinar blandit tellus suspendisse augue sem lectus varius. Suspendisse sed imperdiet adipiscing.</div>
                    <div className="text-xs text-gray-400 mt-2">23 Oct, 2023</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="border-b border-gray-200 p-3.5">
            <button
              onClick={() => toggleSection('additional')}
              className="flex justify-between items-center w-full"
            >
              <span className="text-sm font-bold text-gray-900">Additional Info</span>
              <span className="text-gray-400 text-lg transition-transform" style={{ transform: !expandedSections.additional ? 'rotate(0deg)' : 'rotate(180deg)' }}>∨</span>
            </button>
            {expandedSections.additional && (
              <div className="mt-3 space-y-2">
                <div>
                  <div className="text-xs text-gray-400">Company</div>
                  <div className="text-sm text-gray-700 font-medium">Franci Corp</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Location</div>
                  <div className="text-sm text-gray-700 font-medium">New York, USA</div>
                </div>
              </div>
            )}
          </div>

          {/* Shared Files */}
          <div className="border-b border-gray-200 p-3.5">
            <button
              onClick={() => toggleSection('files')}
              className="flex justify-between items-center w-full"
            >
              <span className="text-sm font-bold text-gray-900">Shared Files</span>
              <span className="text-gray-400 text-lg transition-transform" style={{ transform: !expandedSections.files ? 'rotate(0deg)' : 'rotate(180deg)' }}>∨</span>
            </button>
            {expandedSections.files && (
              <div className="mt-3">
                <div className="bg-gray-100 rounded-xl p-3 flex items-center gap-2">
                  <span className="text-lg">📄</span>
                  <div className="text-xs">
                    <div className="font-semibold text-gray-900">Presentation.pdf</div>
                    <div className="text-gray-400">234 mb</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Shared Links */}
          <div className="border-b border-gray-200 p-3.5">
            <button
              onClick={() => toggleSection('links')}
              className="flex justify-between items-center w-full"
            >
              <span className="text-sm font-bold text-gray-900">Shared Links</span>
              <span className="text-gray-400 text-lg transition-transform" style={{ transform: !expandedSections.links ? 'rotate(0deg)' : 'rotate(180deg)' }}>∨</span>
            </button>
            {expandedSections.links && (
              <div className="mt-3">
                <div className="text-sm text-purple-600">https://presentation.example.com</div>
              </div>
            )}
          </div>

          {/* Documentations */}
          <div className="p-3.5">
            <button
              onClick={() => toggleSection('docs')}
              className="flex justify-between items-center w-full"
            >
              <span className="text-sm font-bold text-gray-900">Documentations</span>
              <span className="text-gray-400 text-lg transition-transform" style={{ transform: !expandedSections.docs ? 'rotate(0deg)' : 'rotate(180deg)' }}>∨</span>
            </button>
            {expandedSections.docs && (
              <div className="mt-3">
                <div className="text-sm text-gray-700">No documents yet.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Massage;
