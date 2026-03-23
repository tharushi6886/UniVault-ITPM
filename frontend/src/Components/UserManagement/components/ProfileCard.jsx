import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] p-8 border border-[#e9e7ff]">
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4f46e5] to-cyan-500 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <h2 className="mt-4 text-2xl font-bold text-[#1f1b5b]">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>

          <div className="mt-4 flex gap-2 flex-wrap justify-center">
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

        <button
          onClick={handleLogout}
          className="mt-8 w-full bg-gradient-to-br from-red-500 to-red-600 text-white py-3 rounded-xl font-semibold shadow-[0_8px_20px_rgba(239,68,68,0.25)] hover:translate-y-[-1px] transition"
        >
          Logout
        </button>
      </div>

      <div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] p-8 border border-[#e9e7ff]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-[#1f1b5b]">Account Details</h3>

          <button
            onClick={() => navigate("/profile/edit")}
            className="px-5 py-2 rounded-xl bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white font-medium shadow-[0_6px_18px_rgba(79,70,229,0.24)]"
          >
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-[#f8f8ff] rounded-2xl p-4 border border-[#ecebff]">
            <p className="text-sm text-gray-500 mb-1">Full Name</p>
            <p className="text-lg font-semibold text-[#1f1b5b]">{user.name}</p>
          </div>

          <div className="bg-[#f8f8ff] rounded-2xl p-4 border border-[#ecebff]">
            <p className="text-sm text-gray-500 mb-1">Email Address</p>
            <p className="text-lg font-semibold text-[#1f1b5b]">{user.email}</p>
          </div>

          <div className="bg-[#f8f8ff] rounded-2xl p-4 border border-[#ecebff]">
            <p className="text-sm text-gray-500 mb-1">Student ID</p>
            <p className="text-lg font-semibold text-[#1f1b5b]">{user.studentId}</p>
          </div>

          <div className="bg-[#f8f8ff] rounded-2xl p-4 border border-[#ecebff]">
            <p className="text-sm text-gray-500 mb-1">Phone Number</p>
            <p className="text-lg font-semibold text-[#1f1b5b]">
              {user.phone || "N/A"}
            </p>
          </div>

          <div className="bg-[#f8f8ff] rounded-2xl p-4 border border-[#ecebff]">
            <p className="text-sm text-gray-500 mb-1">Faculty</p>
            <p className="text-lg font-semibold text-[#1f1b5b]">
              {user.faculty || "N/A"}
            </p>
          </div>

          <div className="bg-[#f8f8ff] rounded-2xl p-4 border border-[#ecebff]">
            <p className="text-sm text-gray-500 mb-1">Account Status</p>
            <p className="text-lg font-semibold text-[#1f1b5b]">{user.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;