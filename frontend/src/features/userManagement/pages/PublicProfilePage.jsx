import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicProfile } from "../../../api/userApi";
import Navbar from "../../homepage/components/Navbar";
import ReviewSection from "../components/ReviewSection";

const PublicProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fallback to fetch current user easily from localStorage
  const currUserStr = localStorage.getItem("user");
  const currentUser = currUserStr ? JSON.parse(currUserStr) : null;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getPublicProfile(id);
        setProfileData(res.data);
      } catch (err) {
        console.error("Failed to load public profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-28 bg-[#f5f7fc]">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  if (!profileData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-28 bg-[#f5f7fc]">
          <div className="text-center">
            <h2 className="text-2xl font-black text-slate-800">User Not Found</h2>
            <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 font-bold hover:underline">Go Back</button>
          </div>
        </div>
      </>
    );
  }

  const avatarSrc = profileData.profileImage
    ? profileData.profileImage.startsWith("http")
      ? profileData.profileImage
      : `http://localhost:5000${profileData.profileImage}`
    : null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f5f7fc] pt-28 pb-16 font-epilogue">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left: Identity Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm text-center">
              <div className="w-24 h-24 mx-auto rounded-3xl overflow-hidden bg-indigo-100 shadow-xl mb-4 relative">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={profileData.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black text-indigo-600 uppercase">
                    {profileData.name?.charAt(0)}
                  </div>
                )}
                {/* Verified badge */}
                <div className="absolute bottom-[-10px] right-[-10px] w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md text-sm border-[3px] border-white z-10">✓</div>
              </div>

              <h2 className="text-2xl font-black text-slate-800 tracking-tight">{profileData.name}</h2>
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                {profileData.role || "Student"}
              </div>

              <div className="mt-6 space-y-4 text-left border-t border-slate-100 pt-6">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Student ID</p>
                  <p className="text-sm font-black text-slate-700">{profileData.studentId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Faculty</p>
                  <p className="text-sm font-black text-slate-700">{profileData.faculty || "Not Specified"}</p>
                </div>
              </div>
            </div>

            {/* Trust Card */}
            {profileData.stats && (
              <div className="bg-gradient-to-br from-[#1e2a78] to-indigo-900 rounded-[2rem] p-8 text-white shadow-lg overflow-hidden relative">
                <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-white/10 blur-xl rounded-full" />
                <h3 className="text-xs font-black text-indigo-200 uppercase tracking-widest mb-4">Vault Trust Score</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-black leading-none">{profileData.stats.trustScore}</span>
                  <span className="text-indigo-300 font-bold mb-1">/100</span>
                </div>
                <div className="w-full h-2 bg-indigo-950 rounded-full mt-4 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400 rounded-full transition-all duration-1000"
                    style={{ width: `${profileData.stats.trustScore}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right: Feedback / Reviews */}
          <div className="lg:col-span-2">
             <div className="bg-white rounded-[2rem] p-8 shadow-sm">
                <ReviewSection profileUserId={profileData._id} currentUser={currentUser} />
             </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default PublicProfilePage;
