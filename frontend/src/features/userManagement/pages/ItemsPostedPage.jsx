import React, { useEffect, useState } from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";
import { getMyMarketplaceItems } from "../../../api/itemApi";

const ItemsPostedPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getMyMarketplaceItems(token);
        setItems(res.data.items || []);
      } catch (err) {
        console.error("Error fetching marketplace items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <ProfileSectionLayout
      title="Items Posted"
      description="Displays the items you currently have listed in the marketplace."
    >
      {loading ? (
        <div className="flex justify-center p-8"><span className="text-gray-500">Loading...</span></div>
      ) : items.length === 0 ? (
        <div className="flex justify-center p-8 bg-gray-50 rounded-xl border border-gray-100"><p className="text-gray-500">No marketplace items listed yet.</p></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#f8f8ff]">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Item Name</th>
                <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Type</th>
                <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Category</th>
                <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Price/Details</th>
                <th className="px-6 py-4 text-sm font-bold text-[#1f1b5b]">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row, index) => (
                <tr
                  key={row._id}
                  className={`border-t border-[#ecebff] ${
                    index % 2 === 0 ? "bg-white" : "bg-[#fcfcff]"
                  }`}
                >
                  <td className="px-6 py-4 text-gray-700">{row.item_name}</td>
                  <td className="px-6 py-4 text-gray-700 capitalize">{row.item_type}</td>
                  <td className="px-6 py-4 text-gray-700">{row.category || "N/A"}</td>
                  <td className="px-6 py-4 text-gray-700">{row.price ? `LKR ${row.price}` : "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 capitalize">
                      {row.availability_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ProfileSectionLayout>
  );
};

export default ItemsPostedPage;