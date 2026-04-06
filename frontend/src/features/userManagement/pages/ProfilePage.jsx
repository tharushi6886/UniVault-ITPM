import React, { useEffect, useState } from "react";
import { getProfile } from "../../../api/userApi";
import ProfileCard from "../components/ProfileCard";
import Navbar from "../../homepage/components/Navbar";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const res = await getProfile(token);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#f3f0ff] via-[#f8f9ff] to-[#eef6ff] pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto flex flex-col gap-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="bg-white rounded-3xl p-6 border border-[#e9e7ff] h-32 w-full"></div>
            <div className="flex gap-4">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-[#e9e7ff] h-64 w-full"></div>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#f3f0ff] via-[#f8f9ff] to-[#eef6ff] flex justify-center items-center pt-28">
          <div className="bg-white p-10 rounded-3xl shadow-xl border border-red-100 text-center max-w-sm">
            <span className="text-5xl mb-4 block">🔒</span>
            <h2 className="text-2xl font-bold text-[#1f1b5b] mb-2">Access Denied</h2>
            <p className="text-gray-500 mb-6">Please log in to view your profile dashboard.</p>
            <a href="/login" className="px-6 py-3 bg-[#4f46e5] text-white rounded-xl font-medium shadow hover:bg-[#3730a3] transition">
              Sign In Now
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f3f0ff] via-[#f8f9ff] to-[#eef6ff] pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#e2defd] text-[#4f46e5] text-sm font-semibold shadow-sm">
              👤 USER DASHBOARD / PROFILE MANAGEMENT
            </span>
            <h1 className="text-4xl font-bold text-[#1f1b5b] mt-4">
              My Profile Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              View your personal details, trust score, activity, feedback, and
              marketplace history
            </p>
          </div>

          <ProfileCard user={user} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;