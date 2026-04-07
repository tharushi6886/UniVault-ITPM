import React, { useEffect, useState } from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";
import { getMyFoundItems } from "../../../api/itemApi";

const FoundReturnedPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getMyFoundItems(token);
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching found items", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <ProfileSectionLayout
      title="Found Items Returned"
      description="Displays all lost items you have found and reported/returned."
    >
      {loading ? (
        <div className="flex justify-center p-8"><span className="text-gray-500">Loading...</span></div>
      ) : items.length === 0 ? (
        <div className="flex justify-center p-8 bg-gray-50 rounded-xl border border-gray-100"><p className="text-gray-500">No found items reported yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item) => (
            <div key={item._id} className="rounded-2xl border border-[#ecebff] bg-[#f8f8ff] p-5">
              <h3 className="text-xl font-bold text-[#1f1b5b]">{item.title}</h3>
              <p className="text-gray-500 mt-2">Category: {item.category}</p>
              <p className="text-gray-500">Found Date: {new Date(item.date).toLocaleDateString()}</p>
              <p className="mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                {item.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </ProfileSectionLayout>
  );
};

export default FoundReturnedPage;