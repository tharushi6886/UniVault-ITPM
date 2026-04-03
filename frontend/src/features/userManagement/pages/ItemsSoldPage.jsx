import React from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";

const ItemsSoldPage = () => {
  const soldItems = [
    { id: 1, item: "Laptop Bag", buyer: "Student User", soldDate: "2026-03-10", amount: "LKR 2,000" },
    { id: 2, item: "Engineering Drawing Tools", buyer: "Campus Buyer", soldDate: "2026-02-28", amount: "LKR 1,200" },
  ];

  return (
    <ProfileSectionLayout
      title="Items Sold"
      description="Displays all items successfully sold through the marketplace."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {soldItems.map((item) => (
          <div key={item.id} className="rounded-2xl border border-[#ecebff] bg-[#f8f8ff] p-5">
            <h3 className="text-xl font-bold text-[#1f1b5b]">{item.item}</h3>
            <p className="text-gray-500 mt-2">Buyer: {item.buyer}</p>
            <p className="text-gray-500">Sold Date: {item.soldDate}</p>
            <p className="text-gray-500">Amount: {item.amount}</p>
          </div>
        ))}
      </div>
    </ProfileSectionLayout>
  );
};

export default ItemsSoldPage;