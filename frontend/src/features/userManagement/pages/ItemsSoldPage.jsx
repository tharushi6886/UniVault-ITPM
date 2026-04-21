import React, { useEffect, useState } from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";
import { getMyMarketplaceItems } from "../../../api/itemApi";

const ItemsSoldPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getMyMarketplaceItems(token);
        const sold = (res.data.items || []).filter(item => item.availability_status === "not_available");
        setItems(sold);
      } catch (err) {
        console.error("Error fetching sold items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <ProfileSectionLayout
      title="Items Sold"
      description="Displays all items successfully sold through the marketplace."
    >
      {loading ? (
        <div className="flex justify-center p-8"><span className="text-gray-500">Loading...</span></div>
      ) : items.length === 0 ? (
        <div className="flex justify-center p-8 bg-gray-50 rounded-xl border border-gray-100"><p className="text-gray-500">No items sold yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => (
            <div key={item._id} className="rounded-2xl border border-[#ecebff] bg-[#f8f8ff] p-5">
              <h3 className="text-xl font-bold text-[#1f1b5b]">{item.item_name}</h3>
              <p className="text-gray-500 mt-2">Category: {item.category}</p>
              <p className="text-gray-500">Listed Price: {item.price ? `LKR ${item.price}` : "N/A"}</p>
              <p className="text-gray-500">Status: <span className="font-semibold text-red-500 capitalize">{item.availability_status.replace('_', ' ')}</span></p>
            </div>
          ))}
        </div>
      )}
    </ProfileSectionLayout>
  );
};

export default ItemsSoldPage;