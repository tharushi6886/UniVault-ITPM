import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BidForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bidAmount: 175.00,
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Add fonts if not already loaded globally
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,400&family=Outfit:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.bidAmount || formData.bidAmount < 150) {
      newErrors.bidAmount = "Bid must be at least $150.00";
    }
    if (!formData.fullName.trim()) newErrors.fullName = "Required";
    if (!formData.studentId.trim()) newErrors.studentId = "Required (e.g. 2024-XXXXX)";
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Valid email required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleConfirmBid = () => {
    if (validate()) {
      setErrors({});
      navigate('/bid-done');
    }
  };

  return (
    <div className="min-h-screen py-10 flex items-center justify-center font-['Outfit',_sans-serif] bg-[#F5F0FF] text-[#1E1040]">

      <div className="bg-white border-[1.5px] border-[#C9B3F5] rounded-[26px] w-[90%] max-w-[500px] p-9 relative shadow-[0_30px_80px_rgba(76,0,176,0.18),_0_4px_20px_rgba(0,0,0,0.08)]">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-[22px]">
          <div className="w-[50px] h-[50px] rounded-[16px] bg-[#4c00b0] flex items-center justify-center text-[22px] shadow-[0_6px_18px_rgba(76,0,176,0.3)] text-white">
            🎧
          </div>
          <button className="w-[34px] h-[34px] rounded-[10px] bg-[#FAF7FF] border-[1.5px] border-[#E5D9FF] text-[#7C6FA0] hover:bg-[#4c00b0]/5 hover:border-[#C9B3F5] hover:text-[#3a0085] flex items-center justify-center transition-all">
            ✕
          </button>
        </div>

        <div className="font-['Playfair_Display'] text-[26px] font-semibold text-[#1E1040] mb-1">Place Your Bid</div>
        <div className="font-['Space_Mono'] text-[10px] text-[#B0A0CC] tracking-[0.5px] mb-[22px] uppercase">
          PREMIUM NOISE-CANCELLING HEADPHONES · AUCTION #7824
        </div>

        {/* Bid Input Area */}
        <div className="bg-[#4c00b0]/5 border-[1.5px] border-[#A78BFA]/40 rounded-[16px] px-5 py-4 mb-[18px]">
          <div className="font-['Space_Mono'] text-[9px] font-bold uppercase tracking-[1px] text-[#B0A0CC] mb-2">Your Bid Amount</div>
          <div className="flex items-center gap-2">
            <span className="font-['Playfair_Display'] text-[20px] text-[#7c3aed]">$</span>
            <input
              type="number"
              name="bidAmount"
              value={formData.bidAmount}
              onChange={handleChange}
              className="font-['Playfair_Display'] text-[26px] text-[#1E1040] bg-transparent border-none outline-none w-full tracking-[-0.5px]"
              min="150" step="0.01"
            />
          </div>
          {errors.bidAmount && <div className="text-red-500 text-xs mt-1">{errors.bidAmount}</div>}
          <div className="font-['Space_Mono'] text-[10px] text-[#059669] mt-1.5 font-bold tracking-[0.3px] uppercase">
            ✓ MIN. $150.00 · +$30 ABOVE CURRENT
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="grid grid-cols-2 gap-3 mb-2.5">
          <div className="flex flex-col gap-1.5">
            <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#B0A0CC]">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`px-3.5 py-[11px] bg-[#FAF7FF] border-[1.5px] ${errors.fullName ? 'border-red-400' : 'border-[#E5D9FF] hover:border-[#C9B3F5] focus:border-[#7c3aed]'} rounded-[11px] text-[13.5px] outline-none transition-all placeholder-[#B0A0CC]`}
              placeholder="Alex Rivera"
            />
            {errors.fullName && <div className="text-red-500 text-[10px]">{errors.fullName}</div>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#B0A0CC]">Student ID</label>
            <input
              type="text"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              className={`px-3.5 py-[11px] bg-[#FAF7FF] border-[1.5px] ${errors.studentId ? 'border-red-400' : 'border-[#E5D9FF] hover:border-[#C9B3F5] focus:border-[#7c3aed]'} rounded-[11px] text-[13.5px] outline-none transition-all placeholder-[#B0A0CC]`}
              placeholder="2024-XXXXX"
            />
            {errors.studentId && <div className="text-red-500 text-[10px]">{errors.studentId}</div>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#B0A0CC]">University Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`px-3.5 py-[11px] bg-[#FAF7FF] border-[1.5px] ${errors.email ? 'border-red-400' : 'border-[#E5D9FF] hover:border-[#C9B3F5] focus:border-[#7c3aed]'} rounded-[11px] text-[13.5px] outline-none transition-all placeholder-[#B0A0CC]`}
              placeholder="alex@university.edu"
            />
            {errors.email && <div className="text-red-500 text-[10px]">{errors.email}</div>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#B0A0CC]">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`px-3.5 py-[11px] bg-[#FAF7FF] border-[1.5px] ${errors.phone ? 'border-red-400' : 'border-[#E5D9FF] hover:border-[#C9B3F5] focus:border-[#7c3aed]'} rounded-[11px] text-[13.5px] outline-none transition-all placeholder-[#B0A0CC]`}
              placeholder="(555) 000-0000"
            />
            {errors.phone && <div className="text-red-500 text-[10px]">{errors.phone}</div>}
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="font-['Space_Mono'] text-[9.5px] font-bold uppercase tracking-[0.8px] text-[#B0A0CC]">Message to Seller (Optional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="px-3.5 py-[11px] bg-[#FAF7FF] border-[1.5px] border-[#E5D9FF] hover:border-[#C9B3F5] focus:border-[#7c3aed] rounded-[11px] text-[13.5px] outline-none transition-all placeholder-[#B0A0CC] resize-none h-[78px]"
              placeholder="I can pick it up near the Student Union..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-5">
          <button className="flex-1 p-[13px] bg-transparent text-[#7C6FA0] border-[1.5px] border-[#E5D9FF] hover:border-[#C9B3F5] hover:text-[#1E1040] hover:bg-[#FAF7FF] rounded-[13px] font-semibold text-[14px] transition-all">
            Cancel
          </button>
          <button onClick={handleConfirmBid} className="flex-[2] p-[13px] bg-[#4c00b0] hover:bg-[#3a0085] text-white rounded-[13px] font-bold text-[14.5px] shadow-[0_4px_18px_rgba(76,0,176,0.32)] hover:shadow-[0_7px_24px_rgba(124,58,237,0.45)] hover:-translate-y-px transition-all">
            Confirm Bid →
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-[#B0A0CC] text-center mt-3.5 leading-[1.6]">
          By confirming, you agree to the <a href="#" className="text-[#4c00b0]">UniMarket Safety Guidelines</a> and commit to purchasing the item if your bid is accepted.
        </p>

      </div>
    </div>
  );
};

export default BidForm;
