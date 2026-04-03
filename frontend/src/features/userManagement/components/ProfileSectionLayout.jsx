import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../homepage/components/Navbar";

const ProfileSectionLayout = ({ title, description, children }) => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f3f0ff] via-[#f8f9ff] to-[#eef6ff] pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#1f1b5b]">{title}</h1>
              <p className="text-gray-500 mt-2">{description}</p>
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="px-5 py-3 rounded-xl bg-white border border-[#e9e7ff] text-[#1f1b5b] font-medium shadow-sm hover:bg-[#f8f8ff]"
            >
              ← Back to Profile
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-[0_10px_30px_rgba(79,70,229,0.12)] p-8 border border-[#e9e7ff]">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSectionLayout;