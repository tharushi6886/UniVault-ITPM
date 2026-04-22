import React, { useEffect, useState } from "react";
import ProfileSectionLayout from "../components/ProfileSectionLayout";
import { getMyComplaints } from "../../../api/complaintApi";
import { toast } from "react-toastify";

const statusStyles = {
  open: "bg-amber-50 text-amber-700 border-amber-100",
  under_review: "bg-blue-50 text-blue-700 border-blue-100",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-100",
  dismissed: "bg-rose-50 text-rose-700 border-rose-100",
};

const formatLabel = (value = "") => value.replace(/_/g, " ");

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getMyComplaints(token);
        setComplaints(res.data.complaints || []);
      } catch (error) {
        console.error("Complaint fetch error:", error);
        toast.error("Failed to load your complaints");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const openCount = complaints.filter((item) => item.status === "open").length;
  const reviewCount = complaints.filter((item) => item.status === "under_review").length;

  return (
    <ProfileSectionLayout
      title="My Complaints"
      description="Review the complaints you have submitted and track each case through the resolution flow."
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 animate-pulse">
          <div className="w-14 h-14 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-5" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Loading complaint archive...
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Cases</p>
              <p className="mt-2 text-3xl font-black text-slate-900">{complaints.length}</p>
            </div>
            <div className="rounded-3xl border border-amber-100 bg-amber-50/70 p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Open</p>
              <p className="mt-2 text-3xl font-black text-amber-700">{openCount}</p>
            </div>
            <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Under Review</p>
              <p className="mt-2 text-3xl font-black text-blue-700">{reviewCount}</p>
            </div>
          </div>

          {complaints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/40">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">No complaints submitted</h3>
              <p className="text-slate-500 text-sm mt-2 text-center max-w-md">
                When you submit a complaint, it will appear here with its current status and any replies.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <article
                  key={complaint._id}
                  className="rounded-[2rem] border border-slate-100 bg-white shadow-sm p-6 md:p-7 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            statusStyles[complaint.status] || "bg-slate-50 text-slate-600 border-slate-100"
                          }`}
                        >
                          {formatLabel(complaint.status)}
                        </span>
                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-slate-50 text-slate-600 border-slate-100">
                          {formatLabel(complaint.category)}
                        </span>
                        <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-slate-50 text-slate-600 border-slate-100">
                          {formatLabel(complaint.type)}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">{complaint.subject}</h3>
                        <p className="text-sm text-slate-500 mt-1 leading-relaxed max-w-3xl">
                          {complaint.description}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-[220px] rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accused User</p>
                      <p className="mt-2 font-bold text-slate-900">
                        {complaint.accused?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-slate-500">{complaint.accused?.studentId || "N/A"}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-4">Submitted</p>
                      <p className="text-sm font-semibold text-slate-700 mt-1">{formatDate(complaint.createdAt)}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-2xl bg-slate-50/70 border border-slate-100 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accused Reply</p>
                      <p className="text-sm text-slate-700 mt-2">
                        {complaint.accused_reply || "Waiting for a response."}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/70 border border-slate-100 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Reply</p>
                      <p className="text-sm text-slate-700 mt-2">
                        {complaint.complainant_reply || "No follow-up sent yet."}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50/70 border border-slate-100 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Conversation</p>
                      <p className="text-sm text-slate-700 mt-2">
                        {complaint.messages?.length || 0} threaded message{(complaint.messages?.length || 0) === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  {complaint.adminNote ? (
                    <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Admin Note</p>
                      <p className="text-sm text-indigo-950 mt-2">{complaint.adminNote}</p>
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </ProfileSectionLayout>
  );
};

export default MyComplaintsPage;
