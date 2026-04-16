import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const Bid = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('all');
  const [viewingId, setViewingId] = useState(null);
  const [toast, setToast] = useState('');
  const [bids, setBids] = useState([
    { id: 1, name: 'Ashan Perera', initials: 'AP', sid: 'STU-2021-0041', session: 'Web Design Lot A', amount: 4500, time: '10 mins ago', msg: 'I am highly interested in this session as it aligns with my final year project. Please consider my bid.', status: 'pending' },
    { id: 2, name: 'Nimesha Silva', initials: 'NS', sid: 'STU-2022-0088', session: 'Data Science Bundle', amount: 7200, time: '25 mins ago', msg: 'This course will help me complete my research paper on machine learning. I have prior experience in Python.', status: 'pending' },
    { id: 3, name: 'Dilshan Fernando', initials: 'DF', sid: 'STU-2020-0017', session: 'UI/UX Masterclass', amount: 3800, time: '1 hr ago', msg: 'I want to build a career in product design. This session is exactly what I need.', status: 'pending' },
    { id: 4, name: 'Kavya Jayawardena', initials: 'KJ', sid: 'STU-2023-0102', session: 'Mobile Dev Bootcamp', amount: 6100, time: '2 hrs ago', msg: 'I have been learning Flutter for 6 months. This session will help me get certified.', status: 'accepted' },
    { id: 5, name: 'Ruwan Bandara', initials: 'RB', sid: 'STU-2021-0065', session: 'Cloud Computing Lot B', amount: 5500, time: '3 hrs ago', msg: 'My internship company uses AWS. This session will directly help my work.', status: 'rejected' },
    { id: 6, name: 'Tharushi Wijesinghe', initials: 'TW', sid: 'STU-2022-0054', session: 'Web Design Lot A', amount: 4200, time: '3 hrs ago', msg: 'I need this for my final semester project submission. Looking forward to this opportunity.', status: 'pending' },
    { id: 7, name: 'Chamara Dissanayake', initials: 'CD', sid: 'STU-2020-0033', session: 'Data Science Bundle', amount: 8000, time: '4 hrs ago', msg: 'Strong background in statistics. This bundle perfectly matches my academic path.', status: 'pending' },
    { id: 8, name: 'Sachini Peiris', initials: 'SP', sid: 'STU-2023-0078', session: 'UI/UX Masterclass', amount: 3600, time: '5 hrs ago', msg: 'I am a graphic design student looking to transition into UX. This is ideal for me.', status: 'accepted' },
  ]);

  const stats = useMemo(() => ({
    total: bids.length,
    pending: bids.filter(b => b.status === 'pending').length,
    accepted: bids.filter(b => b.status === 'accepted').length,
    rejected: bids.filter(b => b.status === 'rejected').length,
  }), [bids]);

  const filteredBids = useMemo(() => bids.filter(b => currentTab === 'all' || b.status === currentTab), [bids, currentTab]);

  const acceptBid = (id) => {
    const bid = bids.find(b => b.id === id);
    setBids(bids.map(b => b.id === id ? { ...b, status: 'accepted' } : b));
    showToast(`✓ Bid accepted for ${bid.name}`, 'success');
    setViewingId(null);
  };

  const rejectBid = (id) => {
    const bid = bids.find(b => b.id === id);
    setBids(bids.map(b => b.id === id ? { ...b, status: 'rejected' } : b));
    showToast(`✕ Bid rejected for ${bid.name}`, 'error');
    setViewingId(null);
  };

  const viewBid = (id) => {
    setViewingId(id);
  };

  const showToast = (msg, type = '') => {
    setToast({ msg, type, show: true });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  const currentBid = bids.find(b => b.id === viewingId);

  return (
    <div className="bg-purple-50 min-h-screen">
      {/* HEADER WITH BACK BUTTON */}
      <header className="sticky top-0 z-50 bg-white border-b border-purple-200 h-14 px-7 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')} 
            className="text-2xl hover:opacity-60 transition title='Back to Dashboard'" 
          >
            ←
          </button>
          <div>
            <div className="font-serif font-bold text-lg text-purple-700">Bid Requests</div>
            <div className="text-xs text-gray-400">Student Bidding System</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-purple-100 border border-purple-200 rounded-full py-1.5 px-3.5">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">AD</div>
          <span className="text-sm font-medium text-purple-700">Admin Panel</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-purple-900 mb-2">
            Student Bid <span className="text-purple-500 italic">Requests</span>
          </h1>
          <p className="text-sm text-gray-400">Review, accept or reject incoming student bids</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <div className="bg-white border border-purple-200 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-300 to-purple-500"></div>
            <div className="text-3xl font-bold text-purple-700">{stats.total}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Total Bids</div>
          </div>
          <div className="bg-white border border-purple-200 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-300 to-amber-600"></div>
            <div className="text-3xl font-bold text-amber-700">{stats.pending}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Pending Review</div>
          </div>
          <div className="bg-white border border-purple-200 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-300 to-green-600"></div>
            <div className="text-3xl font-bold text-green-700">{stats.accepted}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Accepted</div>
          </div>
          <div className="bg-white border border-purple-200 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-300 to-red-600"></div>
            <div className="text-3xl font-bold text-red-700">{stats.rejected}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Rejected</div>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-purple-100 rounded-3xl p-1 w-fit mb-6 flex gap-1">
          {['all', 'pending', 'accepted', 'rejected'].map(tab => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`px-5 py-2 rounded-2xl text-sm font-medium transition-all ${
                currentTab === tab
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-purple-500 hover:text-purple-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} {tab === 'all' ? '' : `(${stats[tab] || 0})`}
            </button>
          ))}
        </div>

        {/* BIDS */}
        <div className="space-y-3">
          {filteredBids.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 opacity-50">📋</div>
              <div className="text-gray-400 text-base">No bids in this category yet.</div>
            </div>
          ) : (
            filteredBids.map((bid, idx) => (
              <div
                key={bid.id}
                className="bg-white border border-purple-200 rounded-3xl p-5 grid grid-cols-[auto_1fr_auto] gap-4 items-start hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                style={{ animation: `slideIn 0.3s ease both ${idx * 0.05}s` }}
              >
                {/* Avatar */}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-200 to-purple-400 flex items-center justify-center font-serif text-lg text-purple-700 flex-shrink-0">
                  {bid.initials}
                </div>

                {/* Info */}
                <div className="min-w-0">
                  <div className="text-base font-semibold text-gray-900 mb-1">{bid.name}</div>
                  <div className="text-xs text-gray-400 mb-3">{bid.sid} · Bid placed <span className="text-purple-500 font-medium">{bid.time}</span></div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-purple-100 text-purple-700 border border-purple-200 rounded-full px-2.5 py-1 font-medium">⊞ {bid.session}</span>
                    <span className="text-xs bg-green-50 text-green-700 border border-green-300 rounded-full px-2.5 py-1 font-medium">LKR {bid.amount.toLocaleString()}</span>
                    <span className="text-xs bg-amber-50 text-amber-700 border border-amber-300 rounded-full px-2.5 py-1 font-medium">⏱ {bid.time}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 items-end">
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold tracking-wider ${
                    bid.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-300' :
                    bid.status === 'accepted' ? 'bg-green-50 text-green-700 border border-green-300' :
                    'bg-red-50 text-red-700 border border-red-300'
                  }`}>
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </span>

                  {bid.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => acceptBid(bid.id)}
                        className="text-xs bg-gradient-to-br from-green-400 to-green-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:opacity-90 transition"
                      >
                        ✓ Accept
                      </button>
                      <button
                        onClick={() => rejectBid(bid.id)}
                        className="text-xs bg-red-50 text-red-700 border border-red-300 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-100 transition"
                      >
                        ✕ Reject
                      </button>
                      <button
                        onClick={() => viewBid(bid.id)}
                        className="text-xs bg-purple-50 text-purple-600 border border-purple-200 px-3 py-1.5 rounded-lg font-semibold hover:bg-purple-100 transition"
                      >
                        ⊙ View
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 ${
                        bid.status === 'accepted'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-700'
                      }`}>
                        {bid.status === 'accepted' ? '✓' : '✕'} {bid.status === 'accepted' ? 'Accepted' : 'Rejected'}
                      </span>
                      <button
                        onClick={() => viewBid(bid.id)}
                        className="text-xs bg-purple-50 text-purple-600 border border-purple-200 px-3 py-1.5 rounded-lg font-semibold hover:bg-purple-100 transition"
                      >
                        ⊙ View
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      {viewingId && currentBid && (
        <div
          className="fixed inset-0 bg-purple-700/15 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setViewingId(null)}
        >
          <div
            className="bg-white rounded-3xl p-7 max-w-sm w-full border border-purple-200 shadow-2xl"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'modalIn 0.25s ease' }}
          >
            <h2 className="font-serif text-2xl font-bold text-purple-900 mb-1">{currentBid.name}'s Bid</h2>
            <p className="text-sm text-gray-400 mb-5">Session: {currentBid.session}</p>

            <div className="space-y-4 mb-5">
              <div>
                <div className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-1">Student</div>
                <div className="text-sm font-medium text-gray-900">{currentBid.name}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-1">Student ID</div>
                <div className="text-sm font-medium text-gray-900">{currentBid.sid}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-1">Session</div>
                <div className="text-sm font-medium text-gray-900">{currentBid.session}</div>
              </div>
            </div>

            <hr className="border-purple-100 my-4" />

            <div className="mb-5">
              <div className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-2">Bid Amount</div>
              <div className="font-serif text-3xl font-bold text-purple-700">LKR {currentBid.amount.toLocaleString()}</div>
            </div>

            <div className="mb-5">
              <div className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-2">Submitted</div>
              <div className="text-sm font-medium text-gray-900">{currentBid.time}</div>
            </div>

            <div className="mb-5">
              <div className="text-xs uppercase tracking-widest text-purple-400 font-bold mb-2">Message from student</div>
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 text-sm text-gray-700 leading-relaxed">
                {currentBid.msg}
              </div>
            </div>

            <div className="flex gap-2 flex-col pt-4">
              {currentBid.status === 'pending' ? (
                <>
                  <button
                    onClick={() => acceptBid(currentBid.id)}
                    className="w-full bg-gradient-to-br from-green-400 to-green-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
                  >
                    ✓ Accept Bid
                  </button>
                  <button
                    onClick={() => rejectBid(currentBid.id)}
                    className="w-full bg-red-50 text-red-700 border border-red-300 py-3 rounded-xl font-semibold hover:bg-red-100 transition"
                  >
                    ✕ Reject Bid
                  </button>
                </>
              ) : null}
              <button
                onClick={() => setViewingId(null)}
                className="w-full bg-purple-50 text-purple-600 border border-purple-200 py-3 rounded-xl font-semibold hover:bg-purple-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast.show && (
        <div
          className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl font-medium text-white text-sm flex items-center gap-2 shadow-2xl transition-all ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Bid;
