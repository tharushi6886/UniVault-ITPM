import React, { useEffect, useState } from "react";
import { getProfile } from "../api/userApi";
import ProfileCard from "../components/ProfileCard";
import Navbar from "../../Homepage/Navbar";

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
        <div className="min-h-screen bg-[#f7f7fb] flex justify-center items-center pt-28">
          <h2 className="text-xl font-semibold text-gray-600">Loading...</h2>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#f7f7fb] flex justify-center items-center pt-28">
          <h2 className="text-xl font-semibold text-red-500">
            Please login first
          </h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f3f0ff] via-[#f8f9ff] to-[#eef6ff] pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#1f1b5b]">My Profile</h1>
            <p className="text-gray-500 mt-2">
              Manage your account details and view your activity
            </p>
          </div>

          <ProfileCard user={user} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;