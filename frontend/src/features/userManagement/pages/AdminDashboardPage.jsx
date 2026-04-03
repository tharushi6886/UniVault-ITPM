import React, { useEffect, useState } from "react";
import Navbar from "../../homepage/components/Navbar";
import { getAdminDashboardStats, getUsers, blockUser, unblockUser, deleteUser } from "../../../api/userApi";
import { toast } from "react-toastify";

const StatCard = ({ title, value, icon, color, bg, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] border border-[#e9e7ff] p-6 hover:-translate-y-1 hover:shadow-lg transition text-left group w-full ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2 group-hover:text-[#4f46e5] transition-colors">{title}</p>
          <h3 className={`text-4xl font-bold ${color}`}>{value}</h3>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${bg}`}>
          {icon}
        </div>
      </div>
      {onClick && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-400 opacity-60 group-hover:opacity-100 transition-opacity">
          <span>View records</span>
          <span className="group-hover:translate-x-1 group-hover:text-[#4f46e5] transition-transform">→</span>
        </div>
      )}
    </button>
  );
};

const QuickCard = ({ title, desc, onClick, active = true }) => (
  <button
    onClick={onClick}
    className={`bg-white rounded-3xl border border-[#e9e7ff] p-6 text-left shadow-[0_10px_30px_rgba(79,70,229,0.12)] w-full ${
      active ? "hover:-translate-y-1 hover:border-[#d0cfff] transition group" : "opacity-70 cursor-not-allowed"
    }`}
    type="button"
  >
    <div className="flex justify-between items-start">
      <h3 className="text-xl font-bold text-[#1f1b5b] group-hover:text-[#4f46e5] transition-colors">{title}</h3>
      {active && <span className="text-gray-300 group-hover:text-[#4f46e5] transition-colors">↗</span>}
    </div>
    <p className="text-gray-500 mt-2">{desc}</p>
    {!active && <span className="inline-block mt-3 text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-500 rounded">COMING SOON</span>}
  </button>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [drawerStat, setDrawerStat] = useState(null);

  const tabs = ["Overview", "User Directory", "System Modules", "Quick Actions"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const statsRes = await getAdminDashboardStats(token);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Dashboard stats fetch error:", error);
      } finally {
        setLoadingStats(false);
      }

      try {
        const usersRes = await getUsers(token);
        setUsers(usersRes.data || []);
      } catch (error) {
        console.error("Users fetch error:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleBlock = async (userId) => {
    if (!window.confirm("Are you sure you want to block this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await blockUser(token, userId);
      toast.success("User blocked successfully");
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, status: "blocked" } : u)));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to block user");
    }
  };

  const handleUnblock = async (userId) => {
    if (!window.confirm("Are you sure you want to unblock this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await unblockUser(token, userId);
      toast.success("User unblocked successfully");
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, status: "active" } : u)));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unblock user");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteUser(token, userId);
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const handleStatClick = (title, count) => {
    setDrawerStat({ title, count });
  };

  const closeDrawer = () => {
    setDrawerStat(null);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f3f0ff] via-[#f8f9ff] to-[#eef6ff] pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          
          {/* Horizontal Admin Header */}
          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] p-6 md:p-8 border border-[#e9e7ff] mb-6 flex flex-col md:flex-row items-center md:justify-between gap-6 animate-fade-in text-center md:text-left">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0efff] border border-[#e2defd] text-[#4f46e5] text-xs font-bold tracking-wide shadow-sm mb-3">
                ⚙️ ADMIN CONTROL CENTER
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#1f1b5b]">System Dashboard</h1>
              <p className="text-gray-500 mt-2 font-medium">
                Monitor users and connected platform modules effortlessly from one view.
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto gap-2 border-b-2 border-gray-100 mb-6 pb-2" style={{ scrollbarWidth: "none" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-6 py-3 rounded-t-xl text-lg font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-[#eef2ff] text-[#4f46e5] border-b-4 border-[#4f46e5]"
                    : "text-gray-500 hover:text-[#4f46e5] hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Pane (Max 500px tall) */}
          <div className="max-h-[500px] overflow-y-auto pr-2" style={{ scrollbarWidth: "thin", scrollbarColor: "#d1d5db transparent" }}>

            {/* OVERVIEW TAB */}
            {activeTab === "Overview" && (
              <div className="animate-fade-in-up">
                {loadingStats ? (
                  <div className="bg-white rounded-3xl shadow p-8 text-center text-gray-500">Loading metrics...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <StatCard title="Total Users" value={stats?.totalUsers || 0} icon="👥" color="text-[#4f46e5]" bg="bg-[#eef2ff]" onClick={() => handleStatClick("Total Users", stats?.totalUsers)} />
                    <StatCard title="Active Users" value={stats?.activeUsers || 0} icon="✅" color="text-green-600" bg="bg-green-100" onClick={() => handleStatClick("Active Users", stats?.activeUsers)} />
                    <StatCard title="Pending Users" value={stats?.pendingUsers || 0} icon="⏳" color="text-yellow-600" bg="bg-yellow-100" onClick={() => handleStatClick("Pending Users", stats?.pendingUsers)} />
                    <StatCard title="Blocked Users" value={stats?.blockedUsers || 0} icon="🚫" color="text-red-600" bg="bg-red-100" onClick={() => handleStatClick("Blocked Users", stats?.blockedUsers)} />
                    <StatCard title="Admin Users" value={stats?.adminUsers || 0} icon="🛡️" color="text-cyan-600" bg="bg-cyan-100" onClick={() => handleStatClick("Admin Users", stats?.adminUsers)} />
                    <StatCard title="Student Users" value={stats?.studentUsers || 0} icon="🎓" color="text-violet-600" bg="bg-violet-100" onClick={() => handleStatClick("Student Users", stats?.studentUsers)} />
                  </div>
                )}
              </div>
            )}

            {/* USER DIRECTORY TAB */}
            {activeTab === "User Directory" && (
              <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] border border-[#e9e7ff] overflow-hidden animate-fade-in-up">
                {loadingUsers ? (
                  <div className="p-12 text-center text-gray-500 font-medium">Loading network directory...</div>
                ) : users.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 font-medium">No users found in the system.</div>
                ) : (
                  <div className="overflow-x-auto relative max-h-[500px]">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#f8f8ff] sticky top-0 z-10 shadow-sm border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Name</th>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Email</th>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Student ID</th>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Role</th>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Status</th>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <tr key={user._id} className={`border-b border-gray-50 hover:bg-[#f8f9ff] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#fcfcff]"}`}>
                            <td className="px-6 py-5 text-gray-800 font-semibold">{user.name}</td>
                            <td className="px-6 py-5 text-gray-600 text-sm">{user.email}</td>
                            <td className="px-6 py-5 text-gray-500 text-sm font-mono">{user.studentId}</td>
                            <td className="px-6 py-5">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#eef2ff] text-[#4f46e5]">
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                user.status === "active" ? "bg-green-100 text-green-700" : 
                                user.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex gap-2 flex-wrap">
                                {user.status === "blocked" ? (
                                  <button onClick={() => handleUnblock(user._id)} className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition shadow-sm">
                                    Unblock
                                  </button>
                                ) : (
                                  <button onClick={() => handleBlock(user._id)} className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 transition shadow-sm">
                                    Block
                                  </button>
                                )}
                                <button onClick={() => handleDelete(user._id)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition shadow-sm">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* SYSTEM MODULES TAB */}
            {activeTab === "System Modules" && (
              <div className="animate-fade-in-up">
                {loadingStats ? (
                  <div className="bg-white rounded-3xl shadow p-8 text-center text-gray-500">Loading module status...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <StatCard title="Lost Items Tracked" value={stats?.totalLostItems || 0} icon="🧳" color="text-[#4f46e5]" bg="bg-[#eef2ff]" onClick={() => handleStatClick("Lost Items", stats?.totalLostItems)} />
                    <StatCard title="Found Items Tracked" value={stats?.totalFoundItems || 0} icon="🔎" color="text-cyan-600" bg="bg-cyan-100" onClick={() => handleStatClick("Found Items", stats?.totalFoundItems)} />
                    <StatCard title="Marketplace Listings" value={stats?.totalMarketplaceItems || 0} icon="🛒" color="text-green-600" bg="bg-green-100" onClick={() => handleStatClick("Marketplace Listings", stats?.totalMarketplaceItems)} />
                    <StatCard title="Active Bids" value={stats?.totalBids || 0} icon="💰" color="text-yellow-600" bg="bg-yellow-100" onClick={() => handleStatClick("Active Bids", stats?.totalBids)} />
                    <StatCard title="Pending Claims" value={stats?.pendingClaims || 0} icon="📌" color="text-red-600" bg="bg-red-100" onClick={() => handleStatClick("Pending Claims", stats?.pendingClaims)} />
                  </div>
                )}
              </div>
            )}

            {/* QUICK ACTIONS TAB */}
            {activeTab === "Quick Actions" && (
              <div className="animate-fade-in-up">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <QuickCard
                    title="User Directory"
                    desc="Manage and control user access across the network."
                    onClick={() => setActiveTab("User Directory")}
                  />
                  <QuickCard
                    title="System Backup"
                    desc="Run a full database snapshot for the current state."
                    active={false}
                  />
                  <QuickCard
                    title="Lost & Found Integrity"
                    desc="Run diagnostic checks on match algorithms."
                    active={false}
                  />
                  <QuickCard
                    title="Marketplace Rules"
                    desc="Configure auto-ban logic and threshold limits."
                    active={false}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- Overlay Backdrop --- */}
      {drawerStat && (
        <div 
          className="fixed inset-0 bg-[#00000040] backdrop-blur-sm z-40 transition-opacity" 
          onClick={closeDrawer}
        ></div>
      )}

      {/* --- Slide-In Right Drawer --- */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-[#e9e7ff] flex flex-col ${
          drawerStat ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#f8f9ff]">
          <div>
            <span className="text-xs font-bold text-[#4f46e5] uppercase tracking-wider">Metric Explorer</span>
            <div className="flex items-baseline gap-3 mt-1">
              <h2 className="text-2xl font-bold text-[#1f1b5b]">{drawerStat?.title}</h2>
              <span className="bg-[#4f46e5] text-white rounded-full px-3 py-0.5 text-sm font-bold shadow-sm">{drawerStat?.count || 0}</span>
            </div>
          </div>
          <button 
            onClick={closeDrawer}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors shadow-sm"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#fbfbfe]">
          <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
            <span className="text-7xl mb-6">📊</span>
            <p className="text-2xl font-semibold text-gray-500">Record view locked.</p>
            <p className="text-md text-gray-400 mt-2 max-w-[300px]">Detailed lists for the metric <strong>{drawerStat?.title}</strong> are securely stored and will populate here upon integration.</p>
            
            <button 
              onClick={closeDrawer}
              className="mt-8 px-8 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-[#4f46e5] font-semibold hover:bg-gray-50 transition hover:shadow-md"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;