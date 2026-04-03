import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderPage = () => {
  const navigate = useNavigate();
  const ORDERS = [
    { id: 'ORD-0841', buyer: 'Amaya Silva', fac: 'Science · Yr 2', av: 0, item: 'Casio FX-991EX Calculator', price: 2850, loc: 'Mahapola Hostel, Room 214', opt: 'Hostel Drop', time: '2–4 PM', date: '25 Mar', dateMs: 20260325, pay: 'pending', status: 'pending', ref: 'BOC·TXN892047' },
    { id: 'ORD-0842', buyer: 'Nuwan Perera', fac: 'Engineering · Yr 3', av: 1, item: 'Engineering Drawing Kit', price: 1450, loc: 'Uni Front Gate', opt: 'Front Gate', time: '12 PM', date: '25 Mar', dateMs: 20260325, pay: 'verified', status: 'accepted', ref: 'HSBC·TXN774821' },
    { id: 'ORD-0843', buyer: 'Dilani Fernando', fac: 'IT · Yr 1', av: 2, item: 'USB-C Hub 7-in-1', price: 3200, loc: 'IT Faculty Lobby', opt: 'Faculty Lobby', time: '10 AM', date: '24 Mar', dateMs: 20260324, pay: 'paid', status: 'completed', ref: 'Sampath·TXN663910' },
    { id: 'ORD-0844', buyer: 'Kasun Bandara', fac: 'Law · Yr 4', av: 3, item: 'Legal Drafting Guide 2024', price: 980, loc: 'Library Entrance', opt: 'Library', time: '3 PM', date: '24 Mar', dateMs: 20260324, pay: 'rejected', status: 'rejected', ref: 'NSB·TXN551209' },
    { id: 'ORD-0845', buyer: 'Thilini Jayasekara', fac: 'Arts · Yr 2', av: 4, item: 'Watercolour Set 24pc', price: 1750, loc: 'Arts Faculty Lobby', opt: 'Faculty Lobby', time: '1–2 PM', date: '23 Mar', dateMs: 20260323, pay: 'pending', status: 'pending', ref: 'BOC·TXN440773' },
    { id: 'ORD-0846', buyer: 'Roshan Gunawardena', fac: 'Medicine · Yr 3', av: 5, item: 'Anatomy Atlas 9th Ed.', price: 4500, loc: 'Medical Faculty Gate', opt: 'Faculty Gate', time: '9 AM', date: '23 Mar', dateMs: 20260323, pay: 'verified', status: 'accepted', ref: 'Sampath·TXN338890' },
    { id: 'ORD-0847', buyer: 'Malsha Wickramasinghe', fac: 'Business · Yr 1', av: 0, item: 'HP 15s Laptop Bag', price: 2100, loc: 'Hostel B, Room 108', opt: 'Hostel Drop', time: '5 PM', date: '22 Mar', dateMs: 20260322, pay: 'paid', status: 'completed', ref: 'Seylan·TXN229991' },
    { id: 'ORD-0848', buyer: 'Isuru Rajapaksha', fac: 'Science · Yr 3', av: 1, item: 'Lab Coat + Safety Glasses', price: 890, loc: 'Science Block, Rm 301', opt: 'Classroom', time: '11 AM', date: '22 Mar', dateMs: 20260322, pay: 'pending', status: 'pending', ref: 'BOC·TXN118820' },
  ];

  const [orders, setOrders] = useState(ORDERS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState('');

  const ini = (name) => name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const getFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = orders.filter(o => {
      const matchFilter = filter === 'all' || o.status === filter;
      const matchSearch = !q || o.buyer.toLowerCase().includes(q)
        || o.item.toLowerCase().includes(q)
        || o.loc.toLowerCase().includes(q)
        || o.id.toLowerCase().includes(q)
        || o.fac.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });

    if (sortBy === 'oldest') rows.sort((a, b) => a.dateMs - b.dateMs);
    else if (sortBy === 'newest') rows.sort((a, b) => b.dateMs - a.dateMs);
    else if (sortBy === 'price-hi') rows.sort((a, b) => b.price - a.price);
    else if (sortBy === 'price-lo') rows.sort((a, b) => a.price - b.price);
    else if (sortBy === 'buyer') rows.sort((a, b) => a.buyer.localeCompare(b.buyer));

    return rows;
  }, [orders, filter, search, sortBy]);

  const counts = useMemo(() => {
    const cnt = { all: orders.length, pending: 0, accepted: 0, completed: 0, rejected: 0 };
    orders.forEach(o => cnt[o.status]++);
    return cnt;
  }, [orders]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  };

  const doAct = (id, action) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const updated = { ...o };
      if (action === 'accept') updated.status = 'accepted';
      if (action === 'reject') updated.status = 'rejected';
      if (action === 'verify') updated.pay = 'verified';
      if (action === 'complete') {
        updated.status = 'completed';
        updated.pay = 'paid';
      }
      return updated;
    }));

    const msgs = {
      accept: '✅ Order accepted!',
      reject: '❌ Order rejected.',
      verify: '💳 Payment verified!',
      complete: '🏁 Order marked as completed!'
    };
    showToast(msgs[action] || '✓ Done');
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const avatarColors = [
    'bg-purple-100 text-purple-800',
    'bg-blue-100 text-blue-800',
    'bg-amber-100 text-amber-800',
    'bg-pink-100 text-pink-800',
    'bg-green-100 text-green-800',
    'bg-indigo-100 text-indigo-800',
  ];

  const PayBadge = ({ pay }) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-800 border-amber-300',
      verified: 'bg-green-50 text-green-800 border-green-300',
      paid: 'bg-teal-50 text-teal-800 border-teal-300',
      rejected: 'bg-red-50 text-red-800 border-red-300'
    };
    const labels = { pending: 'Pending', verified: 'Verified', paid: 'Paid', rejected: 'Rejected' };
    return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${styles[pay]}`}>
      <span className="w-1 h-1 rounded-full" style={{ background: { pending: '#f59e0b', verified: '#16a34a', paid: '#0f766e', rejected: '#b91c1c' }[pay] }}></span>
      {labels[pay]}
    </span>;
  };

  const StatusBadge = ({ status }) => {
    const styles = {
      pending: 'bg-amber-50 text-amber-800',
      accepted: 'bg-green-50 text-green-800',
      completed: 'bg-teal-50 text-teal-800',
      rejected: 'bg-red-50 text-red-800'
    };
    const labels = { pending: '⏳ Pending', accepted: '✅ Accepted', completed: '🏁 Completed', rejected: '❌ Rejected' };
    return <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold border-0 ${styles[status]}`}>{labels[status]}</span>;
  };

  const ActionButtons = ({ order }) => {
    if (order.status === 'completed') return <span className="text-xs font-bold text-gray-400">Completed ✓</span>;
    if (order.status === 'rejected') return <span className="text-xs font-bold text-gray-400">Rejected</span>;

    return (
      <div className="flex gap-1 flex-wrap">
        {order.status === 'pending' && (
          <>
            <button onClick={() => doAct(order.id, 'accept')} className="px-2 py-1 rounded text-xs font-bold bg-green-50 text-green-800 border border-green-300 hover:bg-green-100">✓ Accept</button>
            <button onClick={() => doAct(order.id, 'reject')} className="px-2 py-1 rounded text-xs font-bold bg-red-50 text-red-800 border border-red-300 hover:bg-red-100">✕ Reject</button>
          </>
        )}
        {(order.pay === 'pending' || order.pay === 'rejected') && (
          <button onClick={() => doAct(order.id, 'verify')} className="px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200">💳 Verify Pay</button>
        )}
        {order.status === 'accepted' && (
          <button onClick={() => doAct(order.id, 'complete')} className="px-2 py-1 rounded text-xs font-bold bg-teal-50 text-teal-800 border border-teal-300 hover:bg-teal-100">🏁 Complete</button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-purple-50">
      {/* TOPBAR WITH BACK BUTTON */}
      <div className="h-14 bg-white border-b border-purple-200 px-7 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-purple-100 transition text-xl"
            title="Back to Dashboard"
          >
            ←
          </button>
          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-base">📦</div>
          <div>
            <div className="text-base font-bold text-gray-900">Orders</div>
            <div className="text-xs text-gray-500">Manage and track all customer orders</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 border border-purple-200 px-3 py-1 rounded-full text-xs font-bold text-purple-800">📅 25 Mar 2026</div>
          <div className="w-8 h-8 rounded-lg bg-purple-100 border border-purple-200 flex items-center justify-center relative cursor-pointer">
            🔔
            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">

      {/* PAGE */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* STATS */}
          <div className="grid grid-cols-5 gap-3">
            <div className="bg-white border border-purple-200 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-lg">📦</div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{counts.all}</div>
                  <div className="text-xs text-gray-500 font-medium">Total Orders</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-purple-200 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-lg">⏳</div>
                <div>
                  <div className="text-2xl font-bold text-amber-600">{counts.pending}</div>
                  <div className="text-xs text-gray-500 font-medium">Pending</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-purple-200 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center text-lg">✅</div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{counts.accepted}</div>
                  <div className="text-xs text-gray-500 font-medium">Accepted</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-purple-200 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center text-lg">🏁</div>
                <div>
                  <div className="text-2xl font-bold text-teal-600">{counts.completed}</div>
                  <div className="text-xs text-gray-500 font-medium">Completed</div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-purple-200 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center text-lg">❌</div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{counts.rejected}</div>
                  <div className="text-xs text-gray-500 font-medium">Rejected</div>
                </div>
              </div>
            </div>
          </div>

          {/* CONTROLS */}
          <div className="bg-white border border-purple-200 rounded-2xl p-4 flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-fit flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
              <span className="text-sm opacity-50">🔍</span>
              <input
                type="text"
                placeholder="Search by buyer name, item, location, or order ID…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm flex-1 font-sans"
              />
            </div>
            <div className="w-px h-8 bg-purple-200"></div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'pending', 'accepted', 'completed', 'rejected'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition ${
                    filter === f
                      ? f === 'all' ? 'bg-purple-100 text-purple-700 border border-purple-300'
                        : f === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : f === 'accepted' ? 'bg-green-100 text-green-800 border border-green-300'
                        : f === 'completed' ? 'bg-teal-100 text-teal-800 border border-teal-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-white text-gray-600 border border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span className="text-xs font-bold bg-gray-200 rounded-lg px-1">{counts[f]}</span>
                </button>
              ))}
            </div>
            <div className="w-px h-8 bg-purple-200"></div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 rounded-lg border border-purple-200 bg-purple-50 text-xs font-medium outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="price-hi">Price high – low</option>
              <option value="price-lo">Price low – high</option>
              <option value="buyer">Buyer A–Z</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="bg-white border border-purple-200 rounded-2xl overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-purple-50 border-b border-purple-200 z-10">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Buyer</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Item</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Location</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Payment</th>
                    <th className="px-4 py-2.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wide">Slip</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFiltered.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="text-center py-12">
                        <div className="text-5xl opacity-30">📭</div>
                        <div className="text-gray-500 text-sm mt-2">No orders found</div>
                      </td>
                    </tr>
                  ) : (
                    getFiltered.map((o, i) => (
                      <tr key={o.id} className="border-b border-purple-200 hover:bg-purple-50 transition" style={{ animationDelay: `${i * 0.04}s` }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColors[o.av]}`}>{ini(o.buyer)}</div>
                            <div>
                              <div className="text-sm font-bold text-gray-900">{o.buyer}</div>
                              <div className="text-xs text-gray-500">{o.fac}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-sm text-gray-900">{o.item}</div>
                          <div className="text-xs text-purple-600 font-bold mt-0.5">LKR {o.price.toLocaleString()}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-gray-700 font-medium">{o.loc}</div>
                          <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded mt-1">{o.opt} · {o.time}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm font-bold text-gray-900">{o.date}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{o.id}</div>
                        </td>
                        <td className="px-4 py-3"><PayBadge pay={o.pay} /></td>
                        <td className="px-4 py-3 text-center">
                          <div
                            onClick={() => openModal(o)}
                            className="w-12 h-9 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-300 flex items-center justify-center text-lg cursor-pointer hover:scale-105 transition"
                          >
                            🧾
                          </div>
                          <button onClick={() => openModal(o)} className="text-xs text-purple-600 font-bold underline mt-1 hover:text-purple-800">View slip</button>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                        <td className="px-4 py-3"><ActionButtons order={o} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-purple-200 px-4 py-3 flex items-center justify-between text-xs text-gray-500 flex-shrink-0 bg-white">
              <span>Showing {getFiltered.length} of {orders.length} orders</span>
              <div className="flex gap-1">
                <button className="w-7 h-7 rounded border border-purple-200 bg-white text-gray-600 text-xs cursor-pointer hover:bg-purple-50">‹</button>
                <button className="w-7 h-7 rounded border border-purple-300 bg-purple-100 text-purple-700 text-xs font-bold">1</button>
                <button className="w-7 h-7 rounded border border-purple-200 bg-white text-gray-600 text-xs cursor-pointer hover:bg-purple-50">2</button>
                <button className="w-7 h-7 rounded border border-purple-200 bg-white text-gray-600 text-xs cursor-pointer hover:bg-purple-50">›</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center" onClick={closeModal}>
          <div className="bg-white rounded-3xl p-7 w-96 max-w-[calc(100vw-32px)] border border-purple-200 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-lg font-bold text-gray-900">Payment Slip – {selectedOrder.buyer}</div>
                <div className="text-xs text-gray-500 mt-0.5">{selectedOrder.id} · {selectedOrder.date}</div>
              </div>
              <button onClick={closeModal} className="w-7 h-7 rounded-lg bg-purple-100 border-0 cursor-pointer text-gray-500 text-sm flex items-center justify-center hover:bg-purple-200">✕</button>
            </div>
            <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 flex flex-col items-center justify-center gap-2 mb-4">
              <div className="text-5xl">🧾</div>
              <div className="text-sm text-purple-800 font-bold">{selectedOrder.ref}</div>
              <div className="text-xs text-gray-500">{selectedOrder.date} 2026</div>
            </div>
            <div className="bg-purple-50 rounded-2xl p-3 grid grid-cols-2 gap-2 mb-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Amount</div>
                <div className="text-sm font-bold text-gray-900">LKR {selectedOrder.price.toLocaleString()}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Buyer</div>
                <div className="text-sm font-bold text-gray-900">{selectedOrder.buyer}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Bank Ref</div>
                <div className="text-sm font-bold text-gray-900">{selectedOrder.ref.split('·')[1] || '—'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Pay Status</div>
                <div className="text-sm font-bold text-gray-900">{selectedOrder.pay.charAt(0).toUpperCase() + selectedOrder.pay.slice(1)}</div>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg border border-purple-200 bg-purple-50 text-xs font-bold text-gray-700 hover:bg-purple-100">Close</button>
              {selectedOrder.pay === 'pending' && (
                <>
                  <button onClick={() => { doAct(selectedOrder.id, 'reject'); closeModal(); }} className="px-4 py-2 rounded-lg bg-red-50 text-red-800 border border-red-300 text-xs font-bold hover:bg-red-100">✕ Reject</button>
                  <button onClick={() => { doAct(selectedOrder.id, 'verify'); closeModal(); }} className="px-4 py-2 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 text-white text-xs font-bold hover:shadow-lg">✓ Verify Payment</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-2.5 rounded-2xl text-sm font-bold shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          {toast}
        </div>
      )}
    </div>
  );
};

export default OrderPage;
