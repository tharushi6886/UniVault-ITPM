import React from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";

const FeedbackTrustPage = () => {
  return (
    <ProfileSectionLayout
      title="Feedback & Trust Details"
      description="Displays user rating, feedback, trust level, and community reputation."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl p-5 border border-[#ecebff] bg-[#f8f8ff]">
          <p className="text-sm text-gray-500">Overall Rating</p>
          <p className="text-3xl font-bold text-[#1f1b5b] mt-2">4.8 / 5.0</p>
        </div>

        <div className="rounded-2xl p-5 border border-[#ecebff] bg-[#f8f8ff]">
          <p className="text-sm text-gray-500">Trust Level</p>
          <p className="text-3xl font-bold text-green-600 mt-2">Trusted Member</p>
        </div>

        <div className="rounded-2xl p-5 border border-[#ecebff] bg-[#f8f8ff]">
          <p className="text-sm text-gray-500">Buyer Feedback</p>
          <p className="text-lg font-semibold text-[#1f1b5b] mt-2">
            Friendly communication and smooth transactions
          </p>
        </div>

        <div className="rounded-2xl p-5 border border-[#ecebff] bg-[#f8f8ff]">
          <p className="text-sm text-gray-500">Seller Feedback</p>
          <p className="text-lg font-semibold text-[#1f1b5b] mt-2">
            Reliable and quick response during sales
          </p>
        </div>

        <div className="rounded-2xl p-5 border border-[#ecebff] bg-[#f8f8ff]">
          <p className="text-sm text-gray-500">Recovery Trust</p>
          <p className="text-lg font-semibold text-green-600 mt-2">
            Verified and community trusted
          </p>
        </div>

        <div className="rounded-2xl p-5 border border-[#ecebff] bg-[#f8f8ff]">
          <p className="text-sm text-gray-500">Community Score</p>
          <p className="text-lg font-semibold text-[#1f1b5b] mt-2">
            Excellent reputation within UniVault
          </p>
        </div>
      </div>
    </ProfileSectionLayout>
  );
};

export default FeedbackTrustPage;