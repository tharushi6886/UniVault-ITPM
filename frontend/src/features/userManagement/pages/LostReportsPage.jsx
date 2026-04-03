import React from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";

const LostReportsPage = () => {
  const reports = [
    { id: 1, title: "Lost Calculator", category: "Electronics", date: "2026-03-04", status: "Pending" },
    { id: 2, title: "Lost Notebook", category: "Study Item", date: "2026-02-25", status: "Matched" },
  ];

  return (
    <ProfileSectionLayout
      title="My Lost Reports"
      description="Shows all lost item reports you have submitted."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((report) => (
          <div key={report.id} className="rounded-2xl border border-[#ecebff] bg-[#f8f8ff] p-5">
            <h3 className="text-xl font-bold text-[#1f1b5b]">{report.title}</h3>
            <p className="text-gray-500 mt-2">Category: {report.category}</p>
            <p className="text-gray-500">Date: {report.date}</p>
            <p className="mt-3 inline-block px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-700">
              {report.status}
            </p>
          </div>
        ))}
      </div>
    </ProfileSectionLayout>
  );
};

export default LostReportsPage;