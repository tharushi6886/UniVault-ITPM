import React, { useEffect, useState } from "react";
import Navbar from "../../homepage/components/Navbar";
import { getAdminDashboardStats, getUsers, blockUser, unblockUser, deleteUser, updateUserRole } from "../../../api/userApi";
import { getAllItems, getAllLostItems, getAllFoundItems } from "../../../api/itemApi";
import { toast } from "react-toastify";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from "recharts";

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
  
  // Search and Report state
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerSearchTerm, setDrawerSearchTerm] = useState("");
  const [drawerData, setDrawerData] = useState([]);
  const [drawerLoading, setDrawerLoading] = useState(false);

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

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === "Admin" ? "Student" : "Admin";
    const confirmMsg = newRole === "Admin" 
      ? "Are you sure you want to promote this user to Admin?" 
      : "Are you sure you want to revoke Admin privileges?";
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const token = localStorage.getItem("token");
      await updateUserRole(token, userId, newRole);
      toast.success(`User role updated to ${newRole}`);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update role");
    }
  };

  const exportUserCSV = () => {
    const activeUsersList = filteredUsers.length > 0 ? filteredUsers : users;
    if (activeUsersList.length === 0) return toast.error("No users to export");
    const header = ["ID,Name,Email,Student ID,Role,Status"];
    const rows = activeUsersList.map(u => `${u._id},"${u.name}","${u.email}",${u.studentId},${u.role},${u.status}`);
    const csvContent = header.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `univault_users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDrawerCSV = () => {
    if (drawerData.length === 0) return toast.error("No records to export");
    const activeList = filteredDrawerData.length > 0 ? filteredDrawerData : drawerData;
    
    // Attempting to dynamically infer keys based on common fields
    const keys = ["ID", "Title/Name", "Category", "Status", "Date"];
    const header = [keys.join(",")];
    const rows = activeList.map(item => {
      const id = item._id || "N/A";
      const name = item.item_name || item.title || item.itemName || "Unnamed";
      const cat = item.category || "N/A";
      const status = item.status || item.availability_status || "N/A";
      const date = item.date || item.createdAt || "N/A";
      return `${id},"${name}","${cat}","${status}","${date}"`;
    });
    
    const csvContent = header.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `univault_${drawerStat?.title.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateFullSystemReport = () => {
    if (!stats) return toast.error("Stats not loaded yet");
    const header = ["Category,Count"];
    const rows = [
      `Total Users,${stats.totalUsers}`,
      `Active Users,${stats.activeUsers}`,
      `Pending Users,${stats.pendingUsers}`,
      `Blocked Users,${stats.blockedUsers}`,
      `Lost Items Tracked,${stats.totalLostItems}`,
      `Found Items Tracked,${stats.totalFoundItems}`,
      `Marketplace Listings,${stats.totalMarketplaceItems}`
    ];
    const csvContent = header.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `univault_system_summary_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("System Summary Report Generated!");
  };

  const handleStatClick = async (title, count) => {
    setDrawerStat({ title, count });
    setDrawerLoading(true);
    setDrawerData([]);
    try {
      if (title === "Marketplace Listings") {
        const res = await getAllItems();
        setDrawerData(res.data.items || res.data || []);
      } else if (title === "Lost Items") {
        const res = await getAllLostItems();
        setDrawerData(Array.isArray(res.data) ? res.data : []);
      } else if (title === "Found Items") {
        const res = await getAllFoundItems();
        setDrawerData(Array.isArray(res.data) ? res.data : []);
      }
    } catch (err) {
      console.error(`Error loading records for ${title}:`, err);
    } finally {
      setDrawerLoading(false);
    }
  };

  const closeDrawer = () => {
    setDrawerStat(null);
    setDrawerData([]);
    setDrawerSearchTerm("");
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDrawerData = drawerData.filter(item => {
    const name = item.item_name || item.title || item.itemName || "";
    const category = item.category || "";
    const status = item.status || item.availability_status || "";
    return name.toLowerCase().includes(drawerSearchTerm.toLowerCase()) ||
           category.toLowerCase().includes(drawerSearchTerm.toLowerCase()) ||
           status.toLowerCase().includes(drawerSearchTerm.toLowerCase());
  });

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
                <div className="flex justify-end mb-4">
                   <button 
                    onClick={generateFullSystemReport}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#4f46e5] text-white rounded-xl hover:bg-[#3f37c9] transition shadow-md font-bold text-sm"
                   >
                     🚀 Generate System Report
                   </button>
                </div>
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

                {/* VISUAL ANALYTICS SECTION */}
                {!loadingStats && stats && stats.totalUsers > 0 && (
                  <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up">
                    <div className="bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(79,70,229,0.08)] border border-[#e9e7ff]">
                      <h3 className="text-xl font-bold text-[#1f1b5b] mb-6 flex items-center gap-2">
                        📊 Module Content Distribution
                      </h3>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { name: 'Lost', count: stats.totalLostItems || 0 },
                            { name: 'Found', count: stats.totalFoundItems || 0 },
                            { name: 'Market', count: stats.totalMarketplaceItems || 0 }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                            <Tooltip 
                              cursor={{fill: '#f8f9ff'}}
                              contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                            />
                            <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={50} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(79,70,229,0.08)] border border-[#e9e7ff]">
                      <h3 className="text-xl font-bold text-[#1f1b5b] mb-6 flex items-center gap-2">
                        ⚖️ User Base Partition
                      </h3>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Admins', value: stats.adminUsers },
                                { name: 'Students', value: stats.studentUsers }
                              ]}
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={8}
                              dataKey="value"
                            >
                              <Cell fill="#4f46e5" />
                              <Cell fill="#06b6d4" />
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                            <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* USER DIRECTORY TAB */}
            {activeTab === "User Directory" && (
              <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] border border-[#e9e7ff] overflow-hidden animate-fade-in-up">
                
                {/* Custom Search Bar & Utility Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f8f9ff]">
                  <div className="relative w-full md:max-w-sm">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                      🔍
                    </span>
                    <input
                      type="text"
                      className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/50 focus:border-[#4f46e5] text-sm bg-white shadow-sm"
                      placeholder="Search by name, email, or exact student ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button onClick={exportUserCSV} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition shadow-sm text-sm font-semibold text-[#1f1b5b]">
                    📄 Export CSV
                  </button>
                </div>

                {loadingUsers ? (
                  <div className="p-12 text-center text-gray-500 font-medium">Loading network directory...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 font-medium">
                    {searchTerm ? "No users matched your search." : "No users found in the system."}
                  </div>
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
                        {filteredUsers.map((user, index) => (
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
                                {user.role === "Admin" ? (
                                  <button onClick={() => handleRoleChange(user._id, user.role)} className="bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition shadow-sm">
                                    Revoke Admin
                                  </button>
                                ) : (
                                  <button onClick={() => handleRoleChange(user._id, user.role)} className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-100 transition shadow-sm">
                                    Promote to Admin
                                  </button>
                                )}
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
          className="fixed inset-0 bg-[#00000040] backdrop-blur-sm z-[100] transition-opacity" 
          onClick={closeDrawer}
        ></div>
      )}

      {/* --- Slide-In Right Drawer --- */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-[110] transform transition-transform duration-300 ease-in-out border-l border-[#e9e7ff] flex flex-col ${
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

        <div className="flex-1 overflow-y-auto bg-[#fbfbfe] flex flex-col">
          {drawerStat && !drawerLoading && drawerData.length > 0 && (
            <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between gap-4">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-xs">
                  🔍
                </span>
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#4f46e5] text-xs"
                  placeholder={`Search in ${drawerStat?.title}...`}
                  value={drawerSearchTerm}
                  onChange={(e) => setDrawerSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={exportDrawerCSV}
                className="bg-white border border-gray-200 p-1.5 rounded-lg hover:bg-gray-50 transition shadow-sm"
                title="Export list to CSV"
              >
                📥
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {drawerLoading ? (
              <div className="flex justify-center items-center h-full">
                <span className="text-gray-400 font-medium animate-pulse">Fetching real-time records...</span>
              </div>
            ) : drawerData.length > 0 ? (
              <div className="p-4 space-y-3">
                {(filteredDrawerData.length > 0 ? filteredDrawerData : drawerData).map((item, i) => (
                  <div key={item._id || i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-[#d0cfff] transition-colors">
                    <h4 className="font-bold text-[#1f1b5b] text-lg">{item.item_name || item.title || item.itemName || "Unnamed Item"}</h4>
                    <div className="text-sm text-gray-500 mt-2 flex justify-between">
                      <span>{item.category || item.item_type || "No Category"}</span>
                      <span className={`capitalize px-2 py-0.5 rounded-full text-xs font-semibold ${
                        (item.status || item.availability_status) === "active" || (item.status || item.availability_status) === "available" 
                        ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-600"
                      }`}>
                        {(item.status || item.availability_status || "Logged").replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredDrawerData.length === 0 && drawerSearchTerm && (
                  <div className="text-center p-8 text-gray-400">No matches found.</div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-80 p-6">
              <span className="text-7xl mb-6">📊</span>
              <p className="text-2xl font-semibold text-[#1f1b5b]">Module Data Secured</p>
              <p className="text-md text-gray-500 mt-2 max-w-[320px]">
                The system currently tracks <strong>{drawerStat?.count || 0}</strong> records for <strong>{drawerStat?.title}</strong>. Records will populate here when ready!
              </p>
              
              <button 
                onClick={closeDrawer}
                className="mt-8 px-8 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-[#4f46e5] font-semibold hover:bg-gray-50 transition hover:shadow-md"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminDashboardPage;