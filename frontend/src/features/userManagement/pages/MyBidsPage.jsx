import React, { useEffect, useState } from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";

const MyBidsPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for UI consistency since there's no dedicated endpoint yet
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, []);

  return (
    <ProfileSectionLayout
      title="My Bids"
      description="Displays all bidding activity related to your account."
    >
      {loading ? (
        <div className="flex justify-center p-8"><span className="text-gray-500">Loading...</span></div>
      ) : (
        <div className="flex justify-center p-8 bg-gray-50 rounded-xl border border-gray-100 flex-col items-center">
          <span className="text-4xl mb-3">🎯</span>
          <p className="text-gray-500">No bidding activity found.</p>
        </div>
      )}
    </ProfileSectionLayout>
  );
};

export default MyBidsPage;