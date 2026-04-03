import React from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";

const MyBidsPage = () => {
  const bids = [
    { id: 1, item: "Laptop Stand", amount: "LKR 2,500", date: "2026-03-14", result: "Highest Bid" },
    { id: 2, item: "Reference Book Set", amount: "LKR 1,800", date: "2026-03-09", result: "Outbid" },
  ];

  return (
    <ProfileSectionLayout
      title="My Bids"
      description="Displays all bidding activity related to your account."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bids.map((bid) => (
          <div key={bid.id} className="rounded-2xl border border-[#ecebff] bg-[#f8f8ff] p-5">
            <h3 className="text-xl font-bold text-[#1f1b5b]">{bid.item}</h3>
            <p className="text-gray-500 mt-2">Bid Amount: {bid.amount}</p>
            <p className="text-gray-500">Bid Date: {bid.date}</p>
            <p className="mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium bg-[#eef2ff] text-[#4f46e5]">
              {bid.result}
            </p>
          </div>
        ))}
      </div>
    </ProfileSectionLayout>
  );
};

export default MyBidsPage;