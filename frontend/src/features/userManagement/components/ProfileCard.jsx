import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InfoCard = ({ title, value, editable, onClick }) => {
  const CardWrapper = editable ? "button" : "div";
  return (
    <CardWrapper
      type={editable ? "button" : undefined}
      onClick={editable ? onClick : undefined}
      className={`bg-[#f8f8ff] rounded-2xl p-4 border border-[#ecebff] text-left w-full transition-all ${
        editable ? "cursor-pointer hover:bg-[#f0f0ff] hover:border-[#d0cfff] group" : ""
      }`}
    >
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold text-[#1f1b5b]">{value}</p>
        {editable && (
          <span className="text-gray-400 group-hover:text-[#4f46e5] opacity-50 group-hover:opacity-100 transition-opacity">
            ✎
          </span>
        )}
      </div>
    </CardWrapper>
  );
};

const ActivityCard = ({ icon, title, count, note, color, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex flex-col justify-between rounded-2xl p-5 border ${color} text-left w-full h-full shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300`}
  >
    <div>
      <div className="flex items-start justify-between mb-3">
        <div className="text-3xl">{icon}</div>
        <span className="text-3xl font-extrabold text-[#1f1b5b]">{count}</span>
      </div>
      <p className="text-lg font-semibold text-[#1f1b5b]">{title}</p>
    </div>
    <div className="flex justify-between items-center mt-3">
      <p className="text-sm text-gray-500">{note}</p>
      <span className="text-gray-400 group-hover:text-[#4f46e5] group-hover:translate-x-1 transition-all">
        →
      </span>
    </div>
  </button>
);

const MiniTrustCard = ({ title, value, valueClass = "text-[#1f1b5b]" }) => (
  <div className="bg-[#f8f8ff] rounded-2xl p-4 border border-[#ecebff]">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <p className={`text-lg font-semibold ${valueClass}`}>{value}</p>
  </div>
);

const ProfileCard = ({ user }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");
  const [drawerActivity, setDrawerActivity] = useState(null);

  const tabs = ["Overview", "Activity", "Trust & Reputation", "Feedback"];

  const handleActivityClick = (activity) => {
    setDrawerActivity(activity);
  };

  const closeDrawer = () => {
    setDrawerActivity(null);
  };

  return (
    <div className="animate-fade-in relative">
      {/* Horizontal Profile Header */}
      <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] p-6 border border-[#e9e7ff] mb-6 flex flex-col md:flex-row items-center md:justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <label className="relative group cursor-pointer w-24 h-24 rounded-full bg-gradient-to-br from-[#4f46e5] to-cyan-500 text-white flex items-center justify-center text-4xl font-bold shadow-lg overflow-hidden shrink-0">
            {user.name?.charAt(0).toUpperCase()}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-2xl">📷</span>
            </div>
            <input type="file" accept="image/*" className="hidden" />
          </label>
          <div>
            <h2 className="text-3xl font-bold text-[#1f1b5b]">{user.name}</h2>
            <p className="text-gray-500 text-lg">{user.email}</p>
            <div className="mt-2 flex gap-2 flex-wrap justify-center md:justify-start">
              <span className="px-4 py-1 rounded-full text-sm font-medium bg-[#eef2ff] text-[#4f46e5]">
                {user.role}
              </span>
              <span
                className={`px-4 py-1 rounded-full text-sm font-medium ${
                  user.status === "active"
                    ? "bg-green-100 text-green-700"
                    : user.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {user.status}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/profile/edit")}
          className="bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white px-8 py-3 rounded-xl font-semibold shadow-[0_8px_20px_rgba(79,70,229,0.25)] hover:-translate-y-1 transition shrink-0 w-full md:w-auto"
        >
          Edit Profile
        </button>
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
          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] p-8 border border-[#e9e7ff]">
            <h3 className="text-2xl font-bold text-[#1f1b5b] mb-6">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <InfoCard title="Full Name" value={user.name} editable={true} onClick={() => navigate("/profile/edit")} />
              <InfoCard title="Email Address" value={user.email} />
              <InfoCard title="Student ID" value={user.studentId} />
              <InfoCard title="Phone Number" value={user.phone || "N/A"} editable={true} onClick={() => navigate("/profile/edit")} />
              <InfoCard title="Faculty" value={user.faculty || "N/A"} />
              <InfoCard title="Account Status" value={user.status} />
            </div>
          </div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "Activity" && (
          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] p-8 border border-[#e9e7ff]">
            <h3 className="text-2xl font-bold text-[#1f1b5b] mb-6">My Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <ActivityCard
                icon="🛒"
                title="Buy & Sell History"
                count="12"
                note="View total marketplace transactions"
                color="border-[#dde3ff] bg-gradient-to-br from-[#eef2ff] to-white"
                onClick={() => handleActivityClick({ title: "Buy & Sell History", type: "buysell" })}
              />
              <ActivityCard
                icon="📦"
                title="Items Posted"
                count="8"
                note="View products and listings posted"
                color="border-[#cffafe] bg-gradient-to-br from-[#ecfeff] to-white"
                onClick={() => handleActivityClick({ title: "Items Posted", type: "posted" })}
              />
              <ActivityCard
                icon="💰"
                title="Items Sold"
                count="5"
                note="View successful marketplace sales"
                color="border-[#dcfce7] bg-gradient-to-br from-[#f0fdf4] to-white"
                onClick={() => handleActivityClick({ title: "Items Sold", type: "sold" })}
              />
              <ActivityCard
                icon="🔁"
                title="Found Items Returned"
                count="3"
                note="View recovered items returned"
                color="border-[#ede9fe] bg-gradient-to-br from-[#f5f3ff] to-white"
                onClick={() => handleActivityClick({ title: "Found Items Returned", type: "returned" })}
              />
              <ActivityCard
                icon="🔍"
                title="My Lost Reports"
                count="4"
                note="View your lost item reports"
                color="border-[#fde68a] bg-gradient-to-br from-[#fff7ed] to-white"
                onClick={() => handleActivityClick({ title: "My Lost Reports", type: "lost" })}
              />
              <ActivityCard
                icon="🎯"
                title="My Bids"
                count="6"
                note="View your bidding activity"
                color="border-[#fecdd3] bg-gradient-to-br from-[#fff1f2] to-white"
                onClick={() => handleActivityClick({ title: "My Bids", type: "bids" })}
              />
            </div>
          </div>
        )}

        {/* TRUST & REPUTATION TAB */}
        {activeTab === "Trust & Reputation" && (
          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] p-8 border border-[#e9e7ff] max-w-3xl">
            <h3 className="text-2xl font-bold text-[#1f1b5b] mb-6">Trust Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MiniTrustCard title="Trust Level" value="Trusted Member" valueClass="text-green-600" />
              <MiniTrustCard title="Rating Score" value="4.8 / 5.0" valueClass="text-[#4f46e5]" />
              <div className="md:col-span-2">
                <MiniTrustCard title="Feedback Summary" value="Positive and reliable campus user" valueClass="text-gray-700" />
              </div>
            </div>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === "Feedback" && (
          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] p-8 border border-[#e9e7ff]">
            <h3 className="text-2xl font-bold text-[#1f1b5b] mb-6">Community Feedback</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-2xl p-6 border border-[#ecebff] bg-[#f8f8ff]">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-bold mb-2">Buyer Feedback</p>
                <p className="text-xl font-medium text-[#1f1b5b]">"Friendly communication and smooth transactions"</p>
              </div>
              <div className="rounded-2xl p-6 border border-[#ecebff] bg-[#f8f8ff]">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-bold mb-2">Seller Feedback</p>
                <p className="text-xl font-medium text-[#1f1b5b]">"Reliable and quick response during sales"</p>
              </div>
              <div className="rounded-2xl p-6 border border-[#ecebff] bg-[#f8f8ff]">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-bold mb-2">Recovery Trust</p>
                <p className="text-xl font-medium text-green-600">"Verified and community trusted"</p>
              </div>
              <div className="rounded-2xl p-6 border border-[#ecebff] bg-[#f8f8ff]">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-bold mb-2">Overall Community Score</p>
                <p className="text-xl font-medium text-[#1f1b5b]">"Excellent standing within UniVault"</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- Overlay Backdrop --- */}
      {drawerActivity && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity" 
          onClick={closeDrawer}
        ></div>
      )}

      {/* --- Slide-In Right Drawer --- */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-gray-100 flex flex-col ${
          drawerActivity ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#f8f9ff]">
          <div>
            <span className="text-xs font-bold text-[#4f46e5] uppercase tracking-wider">Activity Details</span>
            <h2 className="text-2xl font-bold text-[#1f1b5b] mt-1">{drawerActivity?.title}</h2>
          </div>
          <button 
            onClick={closeDrawer}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-red-500 transition-colors shadow-sm"
          >
            ✕
          </button>
        </div>

        {/* Drawer Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#fbfbfe]">
          <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
            <span className="text-7xl mb-6">📂</span>
            <p className="text-2xl font-semibold text-gray-500">No records found.</p>
            <p className="text-md text-gray-400 mt-2 max-w-[300px]">Your detail list for <strong>{drawerActivity?.title}</strong> will appear here once you start interacting with UniVault.</p>
            
            <button 
              onClick={() => { closeDrawer(); navigate("/"); }}
              className="mt-8 px-8 py-3 bg-white border border-gray-200 rounded-xl shadow-sm text-[#4f46e5] font-semibold hover:bg-gray-50 transition hover:shadow-md"
            >
              Explore UniVault
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;