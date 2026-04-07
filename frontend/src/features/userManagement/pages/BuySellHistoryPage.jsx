import React, { useEffect, useState } from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";

const BuySellHistoryPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for UI consistency since there's no dedicated endpoint yet for this complex table
    setTimeout(() => {
      setLoading(false);
    }, 600);
  }, []);

  return (
    <ProfileSectionLayout
      title="Buy & Sell History"
      description="Displays your marketplace purchase and sales history."
    >
      {loading ? (
        <div className="flex justify-center p-8"><span className="text-gray-500">Loading...</span></div>
      ) : (
        <div className="flex justify-center p-8 bg-gray-50 rounded-xl border border-gray-100 flex-col items-center">
          <span className="text-4xl mb-3">🛒</span>
          <p className="text-gray-500">No transaction history found.</p>
        </div>
      )}
    </ProfileSectionLayout>
  );
};

export default BuySellHistoryPage;