import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../homepage/components/Navbar";
import { getAdminDashboardStats, getUsers, blockUser, unblockUser, deleteUser, updateUserRole, getUserById } from "../../../api/userApi";
import { getAllItems, getAllLostItems, getAllFoundItems, updateMarketplaceItem } from "../../../api/itemApi";
import { getActivityLog, exportUsersData, getAdminOrders, deleteAdminOrder, deleteAdminItem } from "../../../api/adminApi";
import { toast } from "react-toastify";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const StatCard = ({ title, value, icon, color, bg, borderColor="border-slate-100", hoverBorder="hover:border-indigo-100", onClick, sublabel, sublabelColor="text-slate-400" }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative ag-card p-7 transition-all duration-300 text-left w-full ag-hover-lift ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 group-hover:text-indigo-400 transition-colors">{title}</p>
          <div className="flex items-baseline gap-2 mb-1">
             <h3 className="text-3xl font-black text-[#1f1b5b] tracking-tight">{value}</h3>
          </div>
          {sublabel && <p className={`text-[11px] font-bold ${sublabelColor} tracking-tight`}>{sublabel}</p>}
        </div>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${bg} ${color} border border-white/50 shadow-inner group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      {onClick && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-indigo-600 shadow-sm ring-4 ring-white">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
           </div>
        </div>
      )}
    </button>
  );
};

const QuickCard = ({ title, desc, onClick, active = true, iconBg="bg-slate-50", iconColor="text-slate-500", iconIcon }) => (
  <button
    onClick={onClick}
    className={`ag-card p-6 border-slate-100/50 transition-all duration-300 text-left w-full group overflow-hidden ${
      active ? "ag-hover-lift hover:border-indigo-100" : "opacity-70 cursor-not-allowed grayscale"
    }`}
    type="button"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-4">
        {iconIcon && (
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-white-50 shadow-inner group-hover:scale-110 transition-transform ${iconBg} ${iconColor}`}>
             {iconIcon}
           </div>
        )}
        <div>
           <h3 className="text-xs font-black text-[#1f1b5b] group-hover:text-indigo-600 transition-colors uppercase tracking-[0.2em]">{title}</h3>
           {!active && <span className="inline-block mt-1 text-[8px] font-black px-1.5 py-0.5 bg-slate-100 text-slate-500 uppercase tracking-widest rounded transition-colors group-hover:bg-amber-100 group-hover:text-amber-700">STAGED</span>}
        </div>
      </div>
      {active && (
        <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
        </div>
      )}
    </div>
    <div className="pl-[4rem]">
       <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{desc}</p>
    </div>
  </button>
);

const ExportModal = ({ isOpen, onClose, onExport, filters, setFilters }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className="ag-card w-full max-w-md shadow-2xl relative z-10 overflow-hidden border-white ag-fade-in">
        <div className="bg-slate-50/80 px-8 py-7 border-b border-slate-100 flex justify-between items-center backdrop-blur-sm">
           <div>
             <h3 className="text-xl font-black text-[#1f1b5b] tracking-tight font-epilogue leading-none">Intelligence Export</h3>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Data Extraction Protocol</p>
           </div>
           <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all hover:rotate-90 shadow-md">✕</button>
        </div>
        
        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Entity Classification</label>
            <div className="grid grid-cols-3 gap-2">
              {['all', 'Admin', 'Student'].map(r => (
                <button key={r} onClick={() => setFilters({...filters, role: r})} className={`py-3 rounded-[1.2rem] border text-[11px] font-black uppercase tracking-widest transition-all ${filters.role === r ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100 hover:bg-slate-50'}`}>{r === 'all' ? 'Unfiltered' : r}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Account Integrity</label>
            <div className="grid grid-cols-2 gap-2">
              {['all', 'active', 'pending', 'blocked'].map(s => (
                <button key={s} onClick={() => setFilters({...filters, status: s})} className={`py-3 rounded-[1.2rem] border text-[11px] font-black uppercase tracking-widest transition-all ${filters.status === s ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100 hover:bg-slate-50'}`}>{s.toUpperCase()}</button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Archive Horizon</label>
            <div className="flex gap-2">
              {[
                {id: 'all_time', label: 'ALL TIME'},
                {id: 'this_month', label: 'M-30 RECORDS'}
              ].map(d => (
                <button key={d.id} onClick={() => setFilters({...filters, dateRange: d.id})} className={`flex-1 py-3 rounded-[1.2rem] border text-[11px] font-black tracking-widest transition-all ${filters.dateRange === d.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100 hover:bg-slate-50'}`}>{d.label}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-8 pb-8">
          <button 
            onClick={onExport}
            className="w-full py-4.5 bg-gradient-to-r from-indigo-800 to-indigo-600 text-white rounded-[1.4rem] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-indigo-200 hover:opacity-90 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <span>Execute Export</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const UserInsightDrawer = ({ isOpen, onClose, user, loading }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] animate-fade-in" onClick={onClose} />
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-[0_0_100px_rgba(30,58,138,0.2)] z-[160] transform transition-transform duration-500 ease-out border-l border-white/10 flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="bg-slate-50/80 px-8 py-10 border-b border-slate-100 relative group overflow-hidden backdrop-blur-xl">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-100/50 transition-colors"></div>
          <div className="relative z-10 flex justify-between items-start">
             <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-indigo-100 border-4 border-white ag-hover-lift">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-[#1f1b5b] tracking-tight font-epilogue leading-none">{user?.name || "Loading..."}</h2>
                  <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-2 bg-white inline-block px-2.5 py-1 rounded-lg border border-indigo-100 shadow-sm">{user?.role || "STUDENT"}</p>
                </div>
             </div>
             <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all hover:rotate-90 shadow-md">✕</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 ag-bg-gradient">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 space-y-4">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-indigo-200"></div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Retrieving Secure Data...</p>
            </div>
          ) : (
            <>
              {/* Profile Details */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Account Credentials</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="ag-card-secondary p-4 hover:bg-white hover:border-indigo-100 transition-all group">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">Student Identity & Email</p>
                    <p className="text-sm font-bold text-[#1f1b5b]">{user?.studentId || "N/A"}</p>
                    <p className="text-xs font-bold text-slate-500 opacity-70 mt-0.5">{user?.email}</p>
                  </div>
                  <div className="ag-card-secondary p-4 hover:bg-white hover:border-indigo-100 transition-all group">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">Security & Status</p>
                    <div className="flex items-center gap-3">
                       <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${user?.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                         {user?.status}
                       </span>
                       <span className="text-[10px] font-bold text-slate-400 tracking-tight">Verified System Record</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Trust Insights */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Trust Integrity Matrix</h4>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#1f1b5b]">{user?.stats?.trustScore || 0}</span>
                    <span className="text-xs font-black text-slate-400 opacity-50">%</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   {user?.stats?.trustBreakdown?.map((item, idx) => (
                      <div key={idx} className="ag-card-secondary bg-white p-4 hover:translate-y-[-2px] transition-all">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{item.name}</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-[#1f1b5b]">{item.score}</span>
                          <span className="text-[9px] font-bold text-slate-400 opacity-40">/ {item.weight}</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden shadow-inner">
                           <div 
                             className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full transition-all duration-1000" 
                             style={{ width: `${(item.score / item.weight) * 100}%` }}
                           ></div>
                        </div>
                      </div>
                   ))}
                </div>
              </section>

              {/* System Milestones */}
              <section className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Platform Contributions</h4>
                <div className="flex gap-2 flex-wrap">
                  <div className="ag-card-secondary bg-indigo-50/50 px-4 py-2 flex items-center gap-2.5 border-indigo-100/30">
                    <span className="text-base drop-shadow-sm">📦</span>
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-wider">{user?.stats?.itemsSold || 0} Listed</span>
                  </div>
                  <div className="ag-card-secondary bg-sky-50/50 px-4 py-2 flex items-center gap-2.5 border-sky-100/30">
                    <span className="text-base drop-shadow-sm">🔍</span>
                    <span className="text-[10px] font-black text-sky-700 uppercase tracking-wider">{user?.stats?.lostReports || 0} Lost</span>
                  </div>
                  <div className="ag-card-secondary bg-teal-50/50 px-4 py-2 flex items-center gap-2.5 border-teal-100/30">
                    <span className="text-base drop-shadow-sm">🤝</span>
                    <span className="text-[10px] font-black text-teal-700 uppercase tracking-wider">{user?.stats?.foundReturned || 0} Returned</span>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        <div className="p-8 border-t border-slate-100 bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] text-center mb-5">Security Administration</p>
           <div className="grid grid-cols-2 gap-3">
              <button disabled={loading} className="py-3.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg hover:shadow-indigo-900/10">Audit Log</button>
              <button disabled={loading} className="py-3.5 bg-white border border-slate-200 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-100 transition-all shadow-sm">Flag Account</button>
           </div>
        </div>
      </div>
    </>
  );
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
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
  
  // Status tab filter
  const [userTab, setUserTab] = useState("All");

  // Activity Log
  const [activityLog, setActivityLog] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Export State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFilters, setExportFilters] = useState({
    role: 'all',
    status: 'all',
    dateRange: 'all_time'
  });

  // User Drawer & Selection
  const [isUserDrawerOpen, setIsUserDrawerOpen] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [marketplaceOrders, setMarketplaceOrders] = useState([]);
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [marketplaceSubTab, setMarketplaceSubTab] = useState("Items");
  const [loadingMarketplace, setLoadingMarketplace] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const tabs = ["Overview", "User Directory", "Marketplace", "System Modules"];

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

      try {
        const logRes = await getActivityLog(token);
        setActivityLog(logRes.data || []);
      } catch (error) {
        console.error("Log fetch error:", error);
      } finally {
        setLoadingActivity(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (activeTab === "Marketplace") {
      fetchMarketplaceData();
    }
  }, [activeTab]);

  const fetchMarketplaceData = async () => {
    setLoadingMarketplace(true);
    const token = localStorage.getItem("token");
    try {
      const [itemsRes, ordersRes] = await Promise.all([
        getAllItems(),
        getAdminOrders(token)
      ]);
      setMarketplaceItems(itemsRes.data.items || itemsRes.data || []);
      setMarketplaceOrders(ordersRes.data || []);
    } catch (error) {
      console.error("Marketplace fetch error:", error);
      toast.error("Failed to fetch marketplace data");
    } finally {
      setLoadingMarketplace(false);
    }
  };

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

  const handleGenerateExport = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await exportUsersData(token, exportFilters);
      const data = res.data;

      if (!data || data.length === 0) {
        return toast.info("No records found matching these filters.");
      }

      // Format CSV
      const headers = ["Full Name", "Email", "Student ID", "Role", "Status", "Trust Score", "Registration Date"];
      const rows = data.map(u => [
        `"${u.name}"`,
        `"${u.email}"`,
        u.studentId || "N/A",
        u.role,
        u.status,
        u.trustScore || 0,
        new Date(u.createdAt).toLocaleDateString()
      ]);

      const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      
      // Dynamic Filename
      const filename = `${exportFilters.status}_${exportFilters.role.toLowerCase()}_${exportFilters.dateRange}.csv`.replace(/all_/g, '');
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExportModalOpen(false);
      toast.success("Professional User Report Generated!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to generate export");
    }
  };

  const handleViewDetails = async (userId) => {
    setIsUserDrawerOpen(true);
    setLoadingDetail(true);
    try {
      const token = localStorage.getItem("token");
      const res = await getUserById(token, userId);
      setSelectedUserDetail(res.data);
    } catch (error) {
      toast.error("Failed to load user intelligence");
      setIsUserDrawerOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUserIds.length === currentFilteredUsers.length) {
      setSelectedUserIds([]);
    } else {
      setSelectedUserIds(currentFilteredUsers.map(u => u._id));
    }
  };

  const handleBatchBlock = async () => {
    if (!window.confirm(`Are you sure you want to block ${selectedUserIds.length} users?`)) return;
    try {
      const token = localStorage.getItem("token");
      await Promise.all(selectedUserIds.map(id => blockUser(token, id)));
      toast.success(`${selectedUserIds.length} users blocked`);
      setUsers(prev => prev.map(u => selectedUserIds.includes(u._id) ? { ...u, status: 'blocked' } : u));
      setSelectedUserIds([]);
    } catch (error) {
      toast.error("Bulk block operation failed partially");
    }
  };

  const handleBatchDelete = async () => {
    if (!window.confirm(`⚠️ CAUTION: You are about to PERMANENTLY delete ${selectedUserIds.length} users. This action cannot be undone.`)) return;
    try {
      const token = localStorage.getItem("token");
      await Promise.all(selectedUserIds.map(id => deleteUser(token, id)));
      toast.success(`${selectedUserIds.length} records removed`);
      setUsers(prev => prev.filter(u => !selectedUserIds.includes(u._id)));
      setSelectedUserIds([]);
    } catch (error) {
      toast.error("Bulk deletion failed partially");
    }
  };

  const handleDeleteAdminOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteAdminOrder(token, orderId);
      toast.success("Order deleted successfully");
      setMarketplaceOrders(prev => prev.filter(o => o._id !== orderId));
    } catch (error) {
      toast.error("Failed to delete order");
    }
  };

  const handleDeleteAdminItem = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteAdminItem(token, itemId);
      toast.success("Item deleted successfully");
      setMarketplaceItems(prev => prev.filter(i => i._id !== itemId));
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const handleEditAdminItem = (item) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleUpdateAdminItem = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      // Create a clean object for update
      const updateData = { ...editingItem };
      // Payment details might need to be structured if we kept it, but user asked to remove from form.
      // We keep the existing ones in the object if not touched.
      
      await updateMarketplaceItem(editingItem._id, updateData, token);
      toast.success("Item updated in database successfully");
      setMarketplaceItems(prev => prev.map(i => i._id === editingItem._id ? editingItem : i));
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Failed to update database record");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("Image too large (max 2MB)");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem({ ...editingItem, item_image: reader.result });
      };
      reader.readAsDataURL(file);
    }
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

    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    const brandColor = [79, 70, 229]; // UniVault Indigo

    // --- 1. Header Section ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.text("UniVault System Report", 20, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Comprehensive Platform Audit • Operational Oversight", 20, 32);

    // Decorative Line
    doc.setDrawColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.setLineWidth(0.5);
    doc.line(20, 38, 190, 38);

    // Metadata
    doc.setFontSize(9);
    doc.text(`Generated on: ${timestamp}`, 20, 46);
    doc.text(`Report ID: UV-SYS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 20, 51);
    doc.text(`Issuer: System Administrator`, 190, 46, { align: "right" });

    // --- 2. Executive Summary ---
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("Executive Summary", 20, 65);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text("The following data represents the current state of the UniVault platform ecosystem. All metrics are derived from live database records at the time of generation.", 20, 72, { maxWidth: 170 });

    // --- 3. Structured Data Table ---
    const tableData = [
      ["Metric Category", "Value", "System Status"],
      ["Total Registered Users", stats.totalUsers.toString(), "Stable"],
      ["Active Network Users", stats.activeUsers.toString(), "Healthy"],
      ["Pending Verifications", stats.pendingUsers.toString(), stats.pendingUsers > 0 ? "Action Required" : "All Clear"],
      ["Blocked Violations", stats.blockedUsers.toString(), stats.blockedUsers > 0 ? "Under Review" : "Nominal"],
      ["Lost Items Logged", stats.totalLostItems.toString(), "Live Tracking"],
      ["Found Items Logged", stats.totalFoundItems.toString(), "Live Tracking"],
      ["Marketplace Inventory", stats.totalMarketplaceItems.toString(), "Active"],
      ["System Latency", "0.0ms", "Excellent"]
    ];

    autoTable(doc, {
      startY: 85,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: {
        fillColor: brandColor,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [40, 40, 40],
        cellPadding: 4
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        1: { halign: 'center', fontStyle: 'bold' },
        2: { halign: 'center' }
      }
    });

    // --- 4. Footer & Page Numbers ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text("Generated by UniVault Admin Panel Secure System", 20, 285);
      doc.text(`Page ${i} of ${pageCount}`, 190, 285, { align: "right" });
    }

    doc.save(`univault_report_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("Professional System Report Generated!");
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

  const currentFilteredUsers = filteredUsers.filter(u => 
    userTab === "All" ? true : u.status.toLowerCase() === userTab.toLowerCase()
  );

  const filteredDrawerData = drawerData.filter(item => {
    const name = item.item_name || item.title || item.itemName || "";
    const category = item.category || "";
    const status = item.status || item.availability_status || "";
    return name.toLowerCase().includes(drawerSearchTerm.toLowerCase()) ||
           category.toLowerCase().includes(drawerSearchTerm.toLowerCase()) ||
           status.toLowerCase().includes(drawerSearchTerm.toLowerCase());
  });

  const getActivePct = () => stats?.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0;

  const getTimeAgo = (date) => {
    if (!date) return "Unknown";
    const diffHours = Math.round((new Date() - new Date(date)) / 36e5);
    if (diffHours < 24) return "Today";
    const diffDays = Math.round(diffHours / 24);
    if (diffDays > 30) return "Inactive 30d+";
    return `${diffDays} days ago`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-inter flex flex-col ag-bg-gradient">
        
        {/* Anti-Gravity Admin Header */}
        <div className="bg-[#0F0A2E] pt-28 pb-20 px-4 md:px-8 relative overflow-hidden border-b border-white/5 shadow-2xl">
           <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[150px] -mr-64 -mt-32 pointer-events-none"></div>
           
           <div className="max-w-[1500px] mx-auto relative z-10 w-full">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-sm text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6 ag-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse"></span>
                Secure Operational Grid
              </span>
              <div className="ag-fade-in" style={{ animationDelay: '0.1s' }}>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-epilogue drop-shadow-sm">
                  Executive Dashboard
                </h1>
                <p className="text-white/60 mt-3 font-medium text-sm md:text-base max-w-xl leading-relaxed">
                  Real-time intelligence and administrative control over the UniVault ecosystem and user integrity matrix.
                </p>
              </div>
            </div>
           </div>
        </div>

        {/* --- Anti-Gravity Main Tabs --- */}
        <div className="flex-1 pb-20 px-4 md:px-8 relative z-20">
          <div className="max-w-[1500px] mx-auto">
            
            <div className="flex ag-card p-1.5 gap-1 -mt-10 mb-10 overflow-x-auto scrollbar-hide sticky top-24 z-30 font-epilogue bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-900/10">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap flex-1 px-10 py-3.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all duration-500 ${
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-2xl scale-100"
                      : "text-slate-400 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

          {/* Tab Content Pane (Max 500px tall) */}
          <div className="min-h-[60rem] pb-12">

            {/* OVERVIEW TAB */}
            {activeTab === "Overview" && (
              <div className="animate-fade-in-up space-y-8">
                {loadingStats ? (
                  <div className="ag-card p-16 text-center animate-pulse border-indigo-100/30">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
                       <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Calibrating System Metrics...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>} color="text-indigo-600" bg="bg-indigo-50" borderColor="border-indigo-100" hoverBorder="hover:border-indigo-300" sublabel="Total Registered" onClick={() => { setActiveTab("User Directory"); setUserTab("All"); }} />
                    <StatCard title="Active Users" value={stats?.activeUsers || 0} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>} color="text-sky-600" bg="bg-sky-50" borderColor="border-sky-100" hoverBorder="hover:border-sky-300" sublabel={`${getActivePct()}% of total base`} onClick={() => { setActiveTab("User Directory"); setUserTab("Active"); }} />
                    <StatCard title="Blocked Users" value={stats?.blockedUsers || 0} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>} color="text-rose-600" bg="bg-rose-50" borderColor="border-rose-100" hoverBorder="hover:border-rose-300" sublabel={stats?.blockedUsers > 0 ? "Review required" : "No violations"} sublabelColor={stats?.blockedUsers > 0 ? "text-rose-500" : "text-slate-400"} onClick={() => { setActiveTab("User Directory"); setUserTab("Blocked"); }} />
                  </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* SIDEBAR COLUMN: Command Center & Reports (Now on Left) */}
                  <div className="w-full lg:w-[380px] order-1">
                    <div className="lg:sticky lg:top-40 space-y-6">
                      
                      {/* Command Center Card */}
                      <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_32px_80px_rgba(30,58,138,0.06)] border border-indigo-100 ring-4 ring-white">
                        <div className="flex items-center gap-4 mb-8">
                           <span className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg text-lg">⚡</span>
                           <div>
                             <h3 className="text-xl font-black text-slate-800 tracking-tight font-epilogue leading-none">Command Center</h3>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Module Operations</p>
                           </div>
                        </div>
                        
                        <div className="space-y-4">
                          <QuickCard
                            title="L&F Integrity"
                            desc="Run match diagnostics."
                            active={true}
                            iconBg="bg-emerald-50"
                            iconIcon={<div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                            onClick={() => navigate("/admin/lost-found")}
                          />
                          <QuickCard
                            title="Marketplace Admin"
                            desc="Manage shop inventory."
                            active={true}
                            iconBg="bg-slate-50"
                            iconColor="text-indigo-600"
                            iconIcon="🛒"
                            onClick={() => setActiveTab("Marketplace")}
                          />
                          <QuickCard
                            title="Bidding Control"
                            desc="Oversee auction cycles."
                            active={false}
                            iconBg="bg-slate-50"
                            iconColor="text-slate-500"
                            iconIcon="⚖️"
                          />
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col gap-4">
                           <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                              <span>Admin Roles</span>
                              <span className="text-indigo-600 font-black">{stats?.adminUsers || 0} Listed</span>
                           </div>
                           <div className="flex -space-x-3 overflow-hidden px-2">
                             {[...Array(Math.min(stats?.adminUsers || 1, 5))].map((_, i) => (
                               <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-400">
                                 A
                               </div>
                             ))}
                             {(stats?.adminUsers > 5) && (
                               <div className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white bg-slate-50 text-[10px] font-black text-slate-400">
                                 +{stats.adminUsers - 5}
                               </div>
                             )}
                           </div>
                        </div>
                      </div>

                      {/* Operational Reports Card */}
                      <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_32px_80px_rgba(30,58,138,0.06)] border border-slate-100 ring-4 ring-white">
                        <div className="flex items-center gap-4 mb-8">
                           <span className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-lg text-lg">📊</span>
                           <div>
                             <h3 className="text-xl font-black text-slate-800 tracking-tight font-epilogue leading-none">Intelligence</h3>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Reports & Exports</p>
                           </div>
                        </div>
                        
                        <div className="space-y-4">
                          <QuickCard
                            title="System Report"
                            desc="Full platform audit."
                            active={true}
                            iconBg="bg-purple-50"
                            iconColor="text-purple-500"
                            iconIcon="📄"
                            onClick={generateFullSystemReport}
                          />
                          <QuickCard
                            title="CSV Extraction"
                            desc="Download user directory."
                            active={true}
                            iconBg="bg-blue-50"
                            iconIcon={<div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                            onClick={() => setIsExportModalOpen(true)}
                          />
                        </div>
                      </div>

                      {/* Info Card */}
                      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
                         <h4 className="text-sm font-black uppercase tracking-widest mb-1 opacity-80">Security Protocol</h4>
                         <p className="text-lg font-black leading-tight mb-4">Universal Access Control is active.</p>
                         <div className="flex items-center gap-2 text-[10px] font-bold bg-white/10 w-fit px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            NO LATENCY DETECTED
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* MAIN COLUMN: Analytics & Activity (Now on Right) */}
                  <div className="flex-1 space-y-8 order-2">
                    
                    {/* VISUAL ANALYTICS SECTION */}
                    {!loadingStats && stats && stats.totalUsers > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(79,70,229,0.08)] border border-[#e9e7ff]">
                          <h3 className="text-xl font-bold text-[#1f1b5b] mb-6 flex items-center gap-2">
                            📊 Module Content
                          </h3>
                          <div className="h-[250px] w-full">
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
                                <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                                  {
                                    [
                                      { name: 'Lost', count: stats.totalLostItems || 0 },
                                      { name: 'Found', count: stats.totalFoundItems || 0 },
                                      { name: 'Market', count: stats.totalMarketplaceItems || 0 }
                                    ].map((entry, index) => {
                                      const colors = ['#ef4444', '#10b981', '#3b82f6'];
                                      return <Cell key={`cell-${index}`} fill={colors[index]} />;
                                    })
                                  }
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-[0_10px_30px_rgba(79,70,229,0.08)] border border-[#e9e7ff]">
                          <h3 className="text-xl font-bold text-[#1f1b5b] mb-6 flex items-center gap-2">
                            ⚖️ User Partition
                          </h3>
                          <div className="h-[250px] w-full relative">
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-[36px]">
                              <span className="text-2xl font-black text-[#1f1b5b]">{stats.adminUsers + stats.studentUsers}</span>
                              <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Total</span>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: 'Admins', value: stats.adminUsers },
                                    { name: 'Students', value: stats.studentUsers }
                                  ]}
                                  innerRadius={50}
                                  outerRadius={80}
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

                    {/* Recent Activity Feed */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_32px_80px_rgba(30,58,138,0.06)] border border-white flex flex-col min-h-[400px]">
                      <div className="flex items-center gap-4 mb-8">
                         <span className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center border border-indigo-100 text-lg">⏱️</span>
                         <h3 className="text-xl font-black text-slate-800 tracking-tight font-epilogue">Real-Time Activity Sync</h3>
                      </div>
                      <div className="flex-1 space-y-6 relative before:absolute before:inset-0 before:left-3 before:h-full before:w-px before:bg-slate-100 before:z-0 pr-2">
                        {loadingActivity ? (
                          <p className="text-slate-400 text-sm font-medium">Loading network sync...</p>
                        ) : activityLog.length === 0 ? (
                          <p className="text-slate-400 text-sm font-medium">No recent activity tracked on network</p>
                        ) : (
                          activityLog.map((log, index) => {
                            const borderMap = { green: 'border-emerald-500', blue: 'border-blue-500', amber: 'border-amber-500', teal: 'border-teal-500', purple: 'border-purple-500', red: 'border-rose-500' };
                            const dotMap = { green: 'bg-emerald-500', blue: 'bg-blue-500', amber: 'bg-amber-500', teal: 'bg-teal-500', purple: 'bg-purple-500', red: 'bg-rose-500' };
                            return (
                              <div key={index} className="relative z-10 pl-10 group/item">
                                <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center group-hover/item:${borderMap[log.color] || 'border-indigo-500'} transition-colors`}>
                                  <div className={`w-2 h-2 rounded-full ${dotMap[log.color] || 'bg-indigo-500'}`} />
                                </div>
                                <div>
                                  <p className="text-[12px] font-medium text-slate-700 leading-snug">
                                     <span className="font-black text-slate-900 tracking-tight">{log.username}</span> {log.description.replace(log.username, "").trim()}
                                  </p>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                                     {getTimeAgo(log.timestamp)}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <UserInsightDrawer 
              isOpen={isUserDrawerOpen} 
              onClose={() => { setIsUserDrawerOpen(false); setSelectedUserDetail(null); }}
              user={selectedUserDetail}
              loading={loadingDetail}
            />

            <ExportModal 
              isOpen={isExportModalOpen} 
              onClose={() => setIsExportModalOpen(false)} 
              onExport={handleGenerateExport} 
              filters={exportFilters} 
              setFilters={setExportFilters} 
            />

            {/* Batch Action Toolbar */}
            {selectedUserIds.length > 0 && (
               <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[200] animate-fade-in-up">
                 <div className="bg-[#1f1b5b] text-white px-8 py-4 rounded-[2rem] shadow-[0_20px_50px_rgba(31,27,91,0.3)] flex items-center gap-10 border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                       <span className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-black text-xs">{selectedUserIds.length}</span>
                       <span className="text-xs font-black uppercase tracking-widest text-indigo-100">Users Selected</span>
                    </div>
                    <div className="h-8 w-[1px] bg-white/10"></div>
                    <div className="flex gap-4">
                       <button onClick={handleBatchBlock} className="px-5 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Batch Block</button>
                       <button onClick={handleBatchDelete} className="px-5 py-2 bg-rose-500 hover:bg-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Batch Delete</button>
                       <button onClick={() => setSelectedUserIds([])} className="px-4 py-2 text-white/50 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Cancel</button>
                    </div>
                 </div>
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
                  <button onClick={() => setIsExportModalOpen(true)} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition shadow-sm text-sm font-semibold text-[#1f1b5b]">
                    📄 Export CSV
                  </button>
                </div>
                
                {/* Status Pills */}
                <div className="flex gap-2 px-6 py-3 bg-white border-b border-gray-100 uppercase text-[11px] font-bold">
                  {["All", "Active", "Pending", "Blocked"].map(tab => (
                    <button 
                       key={tab}
                       onClick={() => setUserTab(tab)}
                       className={`px-4 py-1.5 rounded-full transition-colors ${userTab === tab ? "bg-[#eef2ff] text-[#4f46e5]" : "text-gray-500 hover:bg-gray-50"}`}
                    >
                       {tab}
                    </button>
                  ))}
                </div>

                {loadingUsers ? (
                  <div className="p-20 text-center animate-pulse">
                    <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6 shadow-indigo-100"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Establishing Secure Directory Connection...</p>
                  </div>
                ) : currentFilteredUsers.length === 0 ? (
                  <div className="p-12 text-center text-gray-500 font-medium">
                    {searchTerm ? "No users matched your search." : "No users found in this status."}
                  </div>
                ) : (
                  <div className="overflow-x-auto relative max-h-[500px]">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#f8f8ff] sticky top-0 z-10 shadow-sm border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-5 w-12 bg-[#f8f8ff]">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded text-[#4f46e5] focus:ring-[#4f46e5] cursor-pointer" 
                              checked={selectedUserIds.length === currentFilteredUsers.length && currentFilteredUsers.length > 0}
                              onChange={handleSelectAll}
                            />
                          </th>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Name</th>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Email</th>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Student ID</th>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Role</th>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Trust Score</th>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Status</th>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Last Active</th>
                          <th className="px-6 py-5 text-xs uppercase tracking-wider font-bold text-[#1f1b5b]">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentFilteredUsers.map((user, index) => (
                          <tr key={user._id} className={`border-b border-gray-50 hover:bg-[#f8f9ff] transition-colors ${index % 2 === 0 ? "bg-white" : "bg-[#fcfcff]"} ${selectedUserIds.includes(user._id) ? "bg-indigo-50/30" : ""}`}>
                            <td className="px-6 py-5">
                              <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded text-[#4f46e5] focus:ring-[#4f46e5] cursor-pointer" 
                                checked={selectedUserIds.includes(user._id)}
                                onChange={() => handleSelectUser(user._id)}
                              />
                            </td>
                            <td className="px-6 py-5">
                               <button 
                                 onClick={() => handleViewDetails(user._id)}
                                 className="text-gray-800 font-bold hover:text-indigo-600 transition-colors text-left"
                               >
                                 {user.name}
                               </button>
                            </td>
                            <td className="px-6 py-5 text-gray-600 text-sm">{user.email}</td>
                            <td className="px-6 py-5 text-gray-500 text-sm font-mono">{user.studentId}</td>
                            <td className="px-6 py-5">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#eef2ff] text-[#4f46e5]">
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-5 gap-2">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-[#1f1b5b]">{user.trustScore || 0}</span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                                  (user.trustScore || 0) < 40 ? "bg-red-50 text-red-600" :
                                  (user.trustScore || 0) < 65 ? "bg-amber-50 text-amber-600" :
                                  (user.trustScore || 0) < 80 ? "bg-blue-50 text-blue-600" : "bg-yellow-50 text-yellow-600"
                                }`}>{user.trustLevel || "Improving"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <span className={`px-3 py-1 rounded-full text-[11px] uppercase font-bold ${
                                user.status === "active" ? "bg-green-100 text-green-700" : 
                                user.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className={`px-6 py-5 text-sm ${getTimeAgo(user.updatedAt) === "Inactive 30d+" ? "text-amber-600 font-medium border-l-2 border-amber-400" : "text-gray-500"}`}>
                              {getTimeAgo(user.updatedAt)}
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex gap-2 flex-wrap">
                                {user.status === "blocked" ? (
                                  <button onClick={() => handleUnblock(user._id)} className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-100 transition shadow-sm" title="Unblock User">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
                                  </button>
                                ) : (
                                  <button onClick={() => handleBlock(user._id)} className="bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 transition shadow-sm" title="Block User">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                  </button>
                                )}
                                <button onClick={() => handleDelete(user._id)} className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition shadow-sm" title="Delete Permanent">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                                <button onClick={() => handleRoleChange(user._id, user.role)} className="bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-100 transition shadow-sm" title="Shift Role">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
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

            {/* MARKETPLACE TAB */}
            {activeTab === "Marketplace" && (
              <div className="animate-fade-in-up space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-white/40 shadow-sm">
                    {["Items", "Orders"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setMarketplaceSubTab(t)}
                        className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          marketplaceSubTab === t
                            ? "bg-indigo-600 text-white shadow-lg"
                            : "text-slate-400 hover:text-slate-600 hover:bg-white"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                       <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                       </span>
                       <input 
                         type="text" 
                         placeholder={`Search ${marketplaceSubTab}...`}
                         className="bg-white/70 backdrop-blur-md border border-white px-10 py-2.5 rounded-2xl text-[11px] font-bold text-slate-700 w-[280px] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all shadow-sm"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                    </div>
                  </div>
                </div>

                <div className="ag-card overflow-hidden border-white">
                  {loadingMarketplace ? (
                    <div className="p-20 text-center animate-pulse">
                      <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Market Grid...</p>
                    </div>
                  ) : marketplaceSubTab === "Items" ? (
                    <div className="overflow-x-auto max-h-[600px]">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Listing</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Seller</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marketplaceItems.filter(i => {
                            const search = searchTerm.toLowerCase();
                            return (
                              (i.item_name || "").toLowerCase().includes(search) ||
                              (i.userId?.name || "").toLowerCase().includes(search) ||
                              (i.description || "").toLowerCase().includes(search) ||
                              (i.category || "").toLowerCase().includes(search) ||
                              (i.availability_status || "").toLowerCase().includes(search) ||
                              (i.price?.toString() || "").includes(search)
                            );
                          }).map((item, idx) => (
                            <tr key={item._id} className={`border-b border-slate-50 hover:bg-indigo-50/30 transition-colors ${idx % 2 === 0 ? "bg-white/40" : "bg-white/20"}`}>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-lg bg-indigo-100 overflow-hidden border border-white flex-shrink-0">
                                    {item.item_image ? (
                                      <img src={item.item_image} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-indigo-400 text-xs">📦</div>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-slate-800">{item.item_name}</p>
                                    <p className="text-[9px] text-slate-400 font-mono">ID: {item._id.slice(-6).toUpperCase()}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-[11px] font-bold text-slate-600">{item.userId?.name || 'Unknown'}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-[10px] text-slate-500 max-w-[150px] truncate" title={item.description}>{item.description || 'No description'}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md">{item.category}</span>
                              </td>
                              <td className="px-6 py-4 text-[10px] font-bold text-slate-600">
                                {item.quantity || 1}
                              </td>
                              <td className="px-6 py-4 font-black text-slate-800 text-xs whitespace-nowrap">LKR {item.price?.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <p className="text-[10px] font-bold text-slate-500 uppercase">{item.payment_details?.payment_method || 'N/A'}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                  item.availability_status === 'available' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                                }`}>{item.availability_status}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex gap-2 justify-end">
                                  <button onClick={() => handleEditAdminItem(item)} className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center border border-indigo-100 shadow-sm">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                  </button>
                                  <button onClick={() => handleDeleteAdminItem(item._id)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center border border-rose-100 shadow-sm">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-[600px]">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/80 sticky top-0 z-10 border-b border-slate-100">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Buyer</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Seller</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {marketplaceOrders.filter(o => {
                            const search = searchTerm.toLowerCase();
                            return (
                              (o._id || "").toLowerCase().includes(search) || 
                              (o.buyerId?.name || "").toLowerCase().includes(search) ||
                              (o.sellerId?.name || "").toLowerCase().includes(search) ||
                              (o.status || "").toLowerCase().includes(search) ||
                              (o.totalPrice?.toString() || "").includes(search)
                            );
                          }).map((order, idx) => (
                            <tr key={order._id} className={`border-b border-slate-50 hover:bg-indigo-50/30 transition-colors ${idx % 2 === 0 ? "bg-white/40" : "bg-white/20"}`}>
                              <td className="px-6 py-4">
                                <p className="text-[10px] font-black text-indigo-600 font-mono">ORD-{order._id.slice(-4).toUpperCase()}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-[11px] font-bold text-slate-700">{order.buyerId?.name || 'Unknown'}</p>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-[11px] font-bold text-slate-600">{order.sellerId?.name || 'Unknown'}</p>
                              </td>
                              <td className="px-6 py-4 font-black text-slate-800 text-xs">LKR {order.totalPrice?.toLocaleString()}</td>
                              <td className="px-6 py-4">
                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                                  order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                  order.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                }`}>{order.status}</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button onClick={() => handleDeleteAdminOrder(order._id)} className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center border border-rose-100 shadow-sm ml-auto">
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SYSTEM MODULES TAB */}
            {activeTab === "System Modules" && (
              <div className="animate-fade-in-up">
                {loadingStats ? (
                  <div className="bg-white rounded-3xl shadow p-8 text-center text-gray-500">Loading module status...</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <StatCard title="Lost Items Tracked" value={stats?.totalLostItems || 0} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>} color="text-indigo-600" bg="bg-indigo-50" borderColor="border-indigo-100" hoverBorder="hover:border-indigo-300" onClick={() => handleStatClick("Lost Items", stats?.totalLostItems)} />
                    <StatCard title="Found Items Tracked" value={stats?.totalFoundItems || 0} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>} color="text-sky-600" bg="bg-sky-50" borderColor="border-sky-100" hoverBorder="hover:border-sky-300" onClick={() => handleStatClick("Found Items", stats?.totalFoundItems)} />
                    <StatCard title="Marketplace Listings" value={stats?.totalMarketplaceItems || 0} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>} color="text-violet-600" bg="bg-violet-50" borderColor="border-violet-100" hoverBorder="hover:border-violet-300" onClick={() => handleStatClick("Marketplace Listings", stats?.totalMarketplaceItems)} />
                    <StatCard title="Active Bids" value={stats?.totalBids || 0} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"></path><line x1="12" y1="18" x2="12" y2="22"></line><line x1="12" y1="2" x2="12" y2="6"></line></svg>} color="text-amber-500" bg="bg-amber-50" borderColor="border-amber-100" hoverBorder="hover:border-amber-300" onClick={() => handleStatClick("Active Bids", stats?.totalBids)} />
                    <StatCard title="Pending Claims" value={stats?.pendingClaims || 0} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>} color="text-rose-600" bg="bg-rose-50" borderColor="border-rose-100" hoverBorder="hover:border-rose-300" onClick={() => handleStatClick("Pending Claims", stats?.pendingClaims)} />
                  </div>
                )}
              </div>
            )}


          </div>

        </div>
      </div>

      {/* --- Edit Marketplace Item Modal --- */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/20 animate-scale-in">
            <div className="bg-indigo-600 px-8 py-6 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight font-epilogue">Edit Marketplace Listing</h3>
                <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mt-1">Ref ID: {editingItem._id}</p>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} className="text-white/60 hover:text-white transition-colors text-2xl">✕</button>
            </div>
            
            <form onSubmit={handleUpdateAdminItem} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Item Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all"
                    value={editingItem.item_name}
                    onChange={(e) => setEditingItem({...editingItem, item_name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Price (LKR)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({...editingItem, price: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all appearance-none"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Textbooks">Textbooks</option>
                    <option value="Lab Equipment">Lab Equipment</option>
                    <option value="Hostel Gear">Hostel Gear</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quantity</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({...editingItem, quantity: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Description</label>
                <textarea 
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all resize-none"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Availability</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all appearance-none"
                    value={editingItem.availability_status}
                    onChange={(e) => setEditingItem({...editingItem, availability_status: e.target.value})}
                  >
                    <option value="available">Available</option>
                    <option value="sold">Sold</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Item Image</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                      {editingItem.item_image ? (
                        <img src={editingItem.item_image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">📷</div>
                      )}
                    </div>
                    <label className="flex-1 cursor-pointer">
                      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-[10px] font-black text-indigo-600 text-center hover:bg-slate-50 transition-all border-dashed">
                        CHOOSE NEW IMAGE
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 hover:bg-slate-200 transition-all"
                >
                  Discard Changes
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Save Intelligence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
    </>
  );
};

export default AdminDashboardPage;