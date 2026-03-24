import React, { useEffect, useState } from "react";
import Navbar from "../../Homepage/Navbar";
import { useNavigate } from "react-router-dom";
import { getAdminDashboardStats } from "../api/userApi";

const StatCard = ({ title, value, icon, color, bg }) => {
  return (
    <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] border border-[#e9e7ff] p-6 hover:-translate-y-1 transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-2">{title}</p>
          <h3 className={`text-4xl font-bold ${color}`}>{value}</h3>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${bg}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getAdminDashboardStats(token);
        setStats(res.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#f3f0ff] via-[#f8f9ff] to-[#eef6ff] flex justify-center items-center pt-28">
          <h2 className="text-xl font-semibold text-gray-600">Loading dashboard...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f3f0ff] via-[#f8f9ff] to-[#eef6ff] pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e2defd] text-[#4f46e5] text-sm font-semibold shadow-sm">
              ⚙️ ADMIN CONTROL CENTER
            </span>
            <h1 className="text-4xl font-bold text-[#1f1b5b] mt-4">Admin Dashboard</h1>
            <p className="text-gray-500 mt-2">
              Monitor users and connected platform modules from one place
            </p>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#1f1b5b] mb-5">User Management</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard title="Total Users" value={stats?.totalUsers || 0} icon="👥" color="text-[#4f46e5]" bg="bg-[#eef2ff]" />
              <StatCard title="Active Users" value={stats?.activeUsers || 0} icon="✅" color="text-green-600" bg="bg-green-100" />
              <StatCard title="Pending Users" value={stats?.pendingUsers || 0} icon="⏳" color="text-yellow-600" bg="bg-yellow-100" />
              <StatCard title="Blocked Users" value={stats?.blockedUsers || 0} icon="🚫" color="text-red-600" bg="bg-red-100" />
              <StatCard title="Admin Users" value={stats?.adminUsers || 0} icon="🛡️" color="text-cyan-600" bg="bg-cyan-100" />
              <StatCard title="Student Users" value={stats?.studentUsers || 0} icon="🎓" color="text-violet-600" bg="bg-violet-100" />
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-[#1f1b5b] mb-5">Other Modules</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard title="Lost Items" value={stats?.totalLostItems || 0} icon="🧳" color="text-[#4f46e5]" bg="bg-[#eef2ff]" />
              <StatCard title="Found Items" value={stats?.totalFoundItems || 0} icon="🔎" color="text-cyan-600" bg="bg-cyan-100" />
              <StatCard title="Marketplace Listings" value={stats?.totalMarketplaceItems || 0} icon="🛒" color="text-green-600" bg="bg-green-100" />
              <StatCard title="Active Bids" value={stats?.totalBids || 0} icon="💰" color="text-yellow-600" bg="bg-yellow-100" />
              <StatCard title="Pending Claims" value={stats?.pendingClaims || 0} icon="📌" color="text-red-600" bg="bg-red-100" />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1f1b5b] mb-5">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => navigate("/admin/users")}
                className="bg-white rounded-3xl border border-[#e9e7ff] p-6 text-left shadow-[0_10px_30px_rgba(79,70,229,0.12)] hover:-translate-y-1 transition"
              >
                <h3 className="text-xl font-bold text-[#1f1b5b]">Manage Users</h3>
                <p className="text-gray-500 mt-2">
                  View all users, check status, and block suspicious accounts.
                </p>
              </button>

              <button className="bg-white rounded-3xl border border-[#e9e7ff] p-6 text-left shadow-[0_10px_30px_rgba(79,70,229,0.12)] cursor-default">
                <h3 className="text-xl font-bold text-[#1f1b5b]">Lost & Found Module</h3>
                <p className="text-gray-500 mt-2">
                  Ready for integration with lost and found management.
                </p>
              </button>

              <button className="bg-white rounded-3xl border border-[#e9e7ff] p-6 text-left shadow-[0_10px_30px_rgba(79,70,229,0.12)] cursor-default">
                <h3 className="text-xl font-bold text-[#1f1b5b]">Marketplace Module</h3>
                <p className="text-gray-500 mt-2">
                  Ready for integration with marketplace and bidding.
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;