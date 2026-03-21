import React, { useState } from "react";

const CATEGORIES = ["General", "Item Issue", "Delivery", "Billing", "User Conduct", "Other"];

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className={`text-2xl transition-transform duration-150 hover:scale-110 ${
          star <= value ? "text-amber-400" : "text-gray-200"
        }`}
      >
        ★
      </button>
    ))}
  </div>
);

const FeedbackForm = () => {
  const [type, setType] = useState("feedback");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("General");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (type === "feedback" && rating === 0) {
      setError("Please select a star rating.");
      return;
    }

    const entry = {
      id: `fb_${Date.now()}`,
      type,
      name,
      email,
      category,
      subject,
      message,
      rating: type === "feedback" ? rating : null,
      status: "unread",
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("univault_feedback") || "[]");
    localStorage.setItem("univault_feedback", JSON.stringify([entry, ...existing]));

    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setName(""); setEmail(""); setSubject(""); setMessage("");
    setRating(0); setCategory("General");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(196,181,253,0.3),transparent)] font-epilogue flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-[0_16px_48px_rgba(79,70,229,0.15)] w-full max-w-md p-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-4xl shadow-[0_8px_28px_rgba(16,185,129,0.35)] mb-5">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-text font-clash tracking-tight mb-2">
            {type === "feedback" ? "Thanks for your feedback!" : "Complaint submitted!"}
          </h2>
          <p className="text-muted text-sm font-epilogue mb-7 leading-relaxed">
            {type === "feedback"
              ? "We appreciate you taking the time to share your thoughts with us."
              : "We've received your complaint and will look into it shortly."}
          </p>
          <button
            onClick={resetForm}
            className="bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white text-sm font-semibold font-epilogue px-8 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(79,70,229,0.3)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.45)] hover:-translate-y-[1px] transition-all duration-200"
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_80%_60%_at_0%_0%,rgba(196,181,253,0.3),transparent)] font-epilogue text-text">
      {/* Header */}
      <div className="bg-[#f0eeff]/95 shadow-[0_4px_32px_rgba(79,70,229,0.1)] border-b border-[#818cf8]/20 px-8 py-5">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-i2 to-cyan-500 flex items-center justify-center text-base shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
            💬
          </div>
          <span className="text-xl font-bold text-text tracking-[-0.02em] font-clash">
            UniVault
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text font-clash tracking-tight mb-1">
            Feedback &amp; Complaints
          </h2>
          <p className="text-muted text-sm">
            Share your experience or report an issue — we're listening.
          </p>
        </div>

        {/* Type toggle */}
        <div className="flex gap-2 mb-8 p-1.5 bg-[#eef2ff] rounded-2xl border border-[#818cf8]/20 w-fit">
          {[
            { key: "feedback", icon: "⭐", label: "Give Feedback" },
            { key: "complaint", icon: "🚨", label: "File a Complaint" },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold font-epilogue transition-all duration-200 ${
                type === key
                  ? "bg-white shadow-[0_4px_14px_rgba(79,70,229,0.12)] text-i2"
                  : "text-muted hover:text-text"
              }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white/85 backdrop-blur-md border border-white/95 rounded-3xl shadow-[0_6px_28px_rgba(79,70,229,0.1)] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name + Email */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full border border-[#818cf8]/40 rounded-xl px-4 py-2.5 text-sm font-epilogue text-text bg-white focus:outline-none focus:ring-2 focus:ring-i3 focus:border-transparent placeholder-gray-400 transition-all"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-[#818cf8]/40 rounded-xl px-4 py-2.5 text-sm font-epilogue text-text bg-white focus:outline-none focus:ring-2 focus:ring-i3 focus:border-transparent placeholder-gray-400 transition-all"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-text font-epilogue mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium font-epilogue border transition-all duration-200 ${
                      category === cat
                        ? "bg-gradient-to-br from-[#4f46e5] to-[#3730a3] text-white border-transparent shadow-[0_2px_10px_rgba(79,70,229,0.3)]"
                        : "bg-white border-[#818cf8]/30 text-gray-600 hover:border-i3 hover:text-i2"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={
                  type === "feedback"
                    ? "What went well?"
                    : "Brief summary of your issue"
                }
                className="w-full border border-[#818cf8]/40 rounded-xl px-4 py-2.5 text-sm font-epilogue text-text bg-white focus:outline-none focus:ring-2 focus:ring-i3 focus:border-transparent placeholder-gray-400 transition-all"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-text font-epilogue mb-1.5">
                {type === "feedback" ? "Your Feedback" : "Describe the Issue"}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  type === "feedback"
                    ? "Tell us about your experience..."
                    : "Please describe what happened in detail..."
                }
                rows={5}
                className="w-full border border-[#818cf8]/40 rounded-xl px-4 py-2.5 text-sm font-epilogue text-text bg-white focus:outline-none focus:ring-2 focus:ring-i3 focus:border-transparent placeholder-gray-400 transition-all resize-none"
                required
              />
            </div>

            {/* Star rating — feedback only */}
            {type === "feedback" && (
              <div>
                <label className="block text-sm font-medium text-text font-epilogue mb-2">
                  Overall Rating
                </label>
                <StarRating value={rating} onChange={setRating} />
                {rating > 0 && (
                  <p className="text-xs text-muted font-epilogue mt-1.5">
                    {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                  </p>
                )}
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm font-epilogue bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              className={`w-full text-white text-sm font-semibold font-epilogue py-3 rounded-xl transition-all duration-200 hover:-translate-y-[1px] ${
                type === "feedback"
                  ? "bg-gradient-to-br from-[#4f46e5] to-[#3730a3] shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:shadow-[0_6px_22px_rgba(79,70,229,0.48)]"
                  : "bg-gradient-to-br from-rose-500 to-red-600 shadow-[0_4px_14px_rgba(244,63,94,0.35)] hover:shadow-[0_6px_22px_rgba(244,63,94,0.48)]"
              }`}
            >
              {type === "feedback" ? "⭐ Submit Feedback" : "🚨 Submit Complaint"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
