import React, { useEffect, useState } from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";
import { getMyLostItems } from "../../../api/itemApi";

const LostReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getMyLostItems(token);
        setReports(res.data);
      } catch (err) {
        console.error("Error fetching lost reports", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <ProfileSectionLayout
      title="My Lost Reports"
      description="Shows all lost item reports you have submitted."
    >
      {loading ? (
        <div className="flex justify-center p-8"><span className="text-gray-500">Loading...</span></div>
      ) : reports.length === 0 ? (
        <div className="flex justify-center p-8 bg-gray-50 rounded-xl border border-gray-100"><p className="text-gray-500">No lost items reported yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {reports.map((report) => (
            <div key={report._id} className="rounded-2xl border border-[#ecebff] bg-[#f8f8ff] p-5">
              <h3 className="text-xl font-bold text-[#1f1b5b]">{report.title}</h3>
              <p className="text-gray-500 mt-2">Category: {report.category}</p>
              <p className="text-gray-500">Date: {new Date(report.date).toLocaleDateString()}</p>
              <p className="mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
                {report.status}
              </p>
            </div>
          ))}
        </div>
      )}
    </ProfileSectionLayout>
  );
};

export default LostReportsPage;