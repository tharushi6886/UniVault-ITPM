
import React from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";

const BuySellHistoryPage = () => {
  const history = [
    { id: 1, item: "Database Notes", type: "Sold", date: "2026-03-10", price: "LKR 1,500", status: "Completed" },
    { id: 2, item: "Scientific Calculator", type: "Bought", date: "2026-03-08", price: "LKR 3,500", status: "Completed" },
    { id: 3, item: "Laptop Bag", type: "Sold", date: "2026-03-03", price: "LKR 2,000", status: "Completed" },
  ];

  return (
    <ProfileSectionLayout
      title="Buy & Sell History"
      description="Displays your marketplace purchase and sales history."
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#f8f8ff]">
            <tr>
              <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Item Name</th>
              <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Type</th>
              <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Date</th>
              <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Price</th>
              <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, index) => (
              <tr
                key={row.id}
                className={`border-t border-[#ecebff] ${
                  index % 2 === 0 ? "bg-white" : "bg-[#fcfcff]"
                }`}
              >
                <td className="px-6 py-4 text-gray-700">{row.item}</td>
                <td className="px-6 py-4 text-gray-700">{row.type}</td>
                <td className="px-6 py-4 text-gray-700">{row.date}</td>
                <td className="px-6 py-4 text-gray-700">{row.price}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProfileSectionLayout>
  );
};

export default BuySellHistoryPage;