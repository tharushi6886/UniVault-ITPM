import React, { useEffect, useState } from "react";
import Navbar from "../../homepage/components/Navbar";
import { getUsers, blockUser, unblockUser, deleteUser } from "../../../api/userApi";
import { toast } from "react-toastify";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getUsers(token);
        setUsers(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleBlock = async (userId) => {
    if (!window.confirm("Are you sure you want to block this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await blockUser(token, userId);
      toast.success("User blocked successfully");
      setUsers((prevUsers) => prevUsers.map((user) => user._id === userId ? { ...user, status: "blocked" } : user));
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
      setUsers((prevUsers) => prevUsers.map((user) => user._id === userId ? { ...user, status: "active" } : user));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unblock user");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const token = localStorage.getItem("token");
      await deleteUser(token, userId);
      toast.success("User deleted successfully");
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-32 pb-16 px-4 md:px-8 ag-bg-gradient font-inter">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="ag-fade-in">
              <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-indigo-100 shadow-sm">
                Administrative Control
              </span>
              <h1 className="text-4xl font-black text-[#1f1b5b] tracking-tight font-epilogue">User Directory</h1>
              <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-widest">
                Comprehensive Registry Access & Identity Control
              </p>
            </div>
            <div className="flex gap-3 justify-center">
               <div className="ag-card px-6 py-3 flex items-center gap-3 bg-white/50 backdrop-blur-sm border-white">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Population:</span>
                 <span className="text-lg font-black text-[#1f1b5b] leading-none">{users.length}</span>
               </div>
            </div>
          </div>

          <div className="ag-card overflow-hidden border-white ag-fade-in" style={{ animationDelay: '0.1s' }}>
            {loading ? (
              <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Synchronizing Encrypted Data...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-20 text-center opacity-40">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-sm font-black text-slate-500 uppercase tracking-widest">No verified user records found in current grid.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50/80 border-b border-slate-100 backdrop-blur-md">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Identity</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Node</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">University ID</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Authentication</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Integrity Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Control Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50">
                    {users.map((user, index) => (
                      <tr
                        key={user._id}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-sm font-black border border-indigo-100/50 shadow-inner group-hover:scale-110 transition-transform">
                              {user.name?.charAt(0) || "U"}
                            </div>
                            <span className="text-[13px] font-bold text-[#1f1b5b] tracking-tight">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-[12px] font-medium text-slate-500">{user.email}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-tighter bg-slate-100/50 px-2 py-0.5 rounded border border-slate-200">{user.studentId || "N/A"}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm ${user.role === 'Admin' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                              user.status === "active"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : user.status === "pending"
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : "bg-rose-50 text-rose-600 border-rose-100"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex gap-2 flex-wrap">
                            {user.status === "blocked" ? (
                              <button
                                onClick={() => handleUnblock(user._id)}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-[0_5px_15px_rgba(16,185,129,0.2)]"
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                onClick={() => handleBlock(user._id)}
                                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-[0_5px_15px_rgba(225,29,72,0.2)]"
                              >
                                Suspend
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(user._id)}
                              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-[0_5px_15px_rgba(15,23,42,0.15)]"
                            >
                              Destroy
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
        </div>
      </div>
    </>
  );
};

export default AdminUsersPage;