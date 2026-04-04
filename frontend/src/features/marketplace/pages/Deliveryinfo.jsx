import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Room Map constant
const ROOM_MAP = {
  main: ['A3011', 'B3010'],
  new: ['A3011', 'B3010'],
  burdnest: ['A3011', 'B3010'],
};

export default function Deliveryinfo() {
  const navigate = useNavigate();
  const [method, setMethod] = useState('pickup'); // 'pickup' | 'courier'
  const [bid, setBid] = useState('');
  const [building, setBuilding] = useState('');
  const [room, setRoom] = useState('');
  const [date, setDate] = useState('');
  const [timeWindow, setTimeWindow] = useState('');
  const [file, setFile] = useState(null);
  
  const [errors, setErrors] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const availableRooms = building && ROOM_MAP[building] ? ROOM_MAP[building] : [];

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const validateForm = () => {
    const errs = {};
    if (method === 'courier' && (!bid || parseFloat(bid) < 3)) {
      errs.bid = "Minimum bid is $3.00";
    }
    if (!building) errs.building = "Building selection is required";
    if (!room) errs.room = "Room selection is required";
    if (!date) errs.date = "Preferred date is required";
    if (!timeWindow) errs.timeWindow = "Time window is required";
    if (!file) errs.file = "Receipt upload is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      navigate('/purchasedone');
    }
  };

  return (
    <div className="font-['Plus_Jakarta_Sans',sans-serif] bg-[#F2F4F7] min-h-screen flex items-center justify-center p-6 text-[#111827]">
      <div className="flex flex-col md:flex-row gap-5 items-start w-full max-w-[940px] animate-[fadeUp_0.4s_cubic-bezier(0.34,1.1,0.64,1)_both]">
        
        {/* FORM CARD */}
        <div className="bg-white rounded-[20px] border-[1.5px] border-[#E4E8EF] shadow-[0_8px_40px_rgba(0,0,0,0.08)] flex-1 overflow-hidden">
          
          <div className="px-7 py-6 pb-5 border-b-[1.5px] border-[#E4E8EF]">
            <div className="flex items-center justify-between mb-0.5">
              <div className="font-['Lora',serif] text-xl font-semibold text-[#111827]">Delivery Information</div>
              <button className="w-7 h-7 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[14px] text-[#6B7280] hover:bg-[#E4E8EF] transition-colors">✕</button>
            </div>
            <div className="text-[12.5px] text-[#6B7280] mt-1">Choose how you want to receive your item from the seller.</div>
          </div>

          <div className="px-7 py-5 flex flex-col gap-5">
            
            {/* Delivery Options */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#6B7280] mb-2.5">Delivery Method</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div onClick={() => setMethod('pickup')} className={`border-[1.5px] rounded-xl p-3.5 cursor-pointer relative transition-all ${method === 'pickup' ? 'border-[#1E3A5F] bg-[#EEF3FA]' : 'border-[#E4E8EF] bg-[#F8FAFC] hover:border-[#94A3B8]'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mb-2 transition-colors ${method === 'pickup' ? 'border-[#1E3A5F] bg-[#1E3A5F]' : 'border-[#E4E8EF]'}`}>
                    {method === 'pickup' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                  <div className="text-[13px] font-bold mb-[3px]">📍 Direct Pickup</div>
                  <div className="text-[11.5px] text-[#6B7280] leading-[1.4]">Meet the seller at a mutually agreed campus location. No extra fees.</div>
                  <div className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-[0.3px] bg-[#D1FAE5] text-[#065F46]">RECOMMENDED</div>
                </div>

                <div onClick={() => setMethod('courier')} className={`border-[1.5px] rounded-xl p-3.5 cursor-pointer relative transition-all ${method === 'courier' ? 'border-[#1E3A5F] bg-[#EEF3FA]' : 'border-[#E4E8EF] bg-[#F8FAFC] hover:border-[#94A3B8]'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mb-2 transition-colors ${method === 'courier' ? 'border-[#1E3A5F] bg-[#1E3A5F]' : 'border-[#E4E8EF]'}`}>
                    {method === 'courier' && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                  <div className="text-[13px] font-bold mb-[3px]">🚚 Courier Bid</div>
                  <div className="text-[11.5px] text-[#6B7280] leading-[1.4]">Request a campus courier to deliver the item to your room.</div>
                  <div className="inline-block mt-2 text-[11px] font-semibold text-[#6B7280]">Bids start at $3.00</div>
                </div>
              </div>

              {/* Courier Bid Box */}
              {method === 'courier' && (
                <div className="mt-3 animate-[fadeUp_0.25s_ease_both]">
                  <div className="bg-[#F8FAFC] border-[1.5px] border-[#E4E8EF] rounded-xl p-4 transition-all">
                    <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#6B7280] mb-2.5">Your Courier Bid Price *</div>
                    <div className="flex items-center gap-2">
                      <span className="font-['Lora',serif] text-[22px] font-semibold text-[#6B7280]">$</span>
                      <input 
                        type="number" min="3" step="0.50" placeholder="0.00" value={bid} onChange={e => setBid(e.target.value)}
                        className="font-['Lora',serif] text-[26px] font-semibold text-[#111827] bg-transparent outline-none w-full tracking-[-0.5px]" 
                      />
                    </div>
                    {errors.bid ? (
                       <div className="mt-2 text-[12px] font-semibold text-red-500">⚠️ {errors.bid}</div>
                    ) : (
                       <div className="mt-2 text-[12px] font-semibold text-emerald-500">{!bid || parseFloat(bid) < 3 ? 'Minimum bid is $3.00' : `✅ Your bid: $${parseFloat(bid).toFixed(2)}`}</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-[1px] bg-[#E4E8EF]"></div>

            {/* Logistics Details */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#6B7280] mb-2.5">Logistics Details</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[11.5px] font-semibold text-[#6B7280] tracking-[0.2px]">Campus Building *</label>
                  <select value={building} onChange={e => { setBuilding(e.target.value); setRoom(''); }} className="p-2.5 border-[1.5px] border-[#E4E8EF] rounded-lg bg-[#F8FAFC] text-[13px] text-[#111827] outline-none transition-all focus:border-[#1E3A5F] focus:bg-white cursor-pointer appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%236B7280' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                    <option value="">Select a building</option>
                    <option value="main">Main Building</option>
                    <option value="new">New Building</option>
                    <option value="burdnest">Burdnest</option>
                  </select>
                  {errors.building && <span className="text-[10px] text-red-500 font-bold">{errors.building}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11.5px] font-semibold text-[#6B7280] tracking-[0.2px]">Room / Suite Number *</label>
                  <select value={room} onChange={e => setRoom(e.target.value)} disabled={!building} className="p-2.5 border-[1.5px] border-[#E4E8EF] rounded-lg bg-[#F8FAFC] text-[13px] text-[#111827] outline-none transition-all focus:border-[#1E3A5F] focus:bg-white cursor-pointer appearance-none disabled:opacity-60" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%236B7280' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                    <option value="">{building ? 'Select a room' : 'Select building first'}</option>
                    {availableRooms.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.room && <span className="text-[10px] text-red-500 font-bold">{errors.room}</span>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11.5px] font-semibold text-[#6B7280] tracking-[0.2px]">Preferred Date *</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2.5 border-[1.5px] border-[#E4E8EF] rounded-lg bg-[#F8FAFC] text-[13px] text-[#111827] outline-none transition-all focus:border-[#1E3A5F] focus:bg-white" />
                  {errors.date && <span className="text-[10px] text-red-500 font-bold">{errors.date}</span>}
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-[11.5px] font-semibold text-[#6B7280] tracking-[0.2px]">Arrival Window *</label>
                  <select value={timeWindow} onChange={e => setTimeWindow(e.target.value)} className="p-2.5 border-[1.5px] border-[#E4E8EF] rounded-lg bg-[#F8FAFC] text-[13px] text-[#111827] outline-none transition-all focus:border-[#1E3A5F] focus:bg-white cursor-pointer appearance-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%236B7280' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                    <option value="">Select a time window</option>
                    <option>Morning (08:00 – 12:00)</option>
                    <option>Afternoon (12:00 – 17:00)</option>
                    <option>Evening (17:00 – 20:00)</option>
                  </select>
                  {errors.timeWindow && <span className="text-[10px] text-red-500 font-bold">{errors.timeWindow}</span>}
                </div>
              </div>
            </div>

            <div className="h-[1px] bg-[#E4E8EF]"></div>

            {/* Payment Verification */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#6B7280] mb-2.5">Payment Verification *</div>
              <div 
                className={`border-2 dashed rounded-[10px] p-5 text-center cursor-pointer transition-all ${isDragOver ? 'border-[#1E3A5F] bg-[#EEF3FA]' : 'border-[#E4E8EF] border-dashed bg-[#F8FAFC] hover:border-[#1E3A5F] hover:bg-[#EEF3FA]'}`} 
                onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-[26px] mb-2">📄</div>
                <div className="text-[13px] font-semibold mb-[3px]">{file ? `✅ ${file.name}` : 'Drop your receipt here'}</div>
                {!file && <div className="text-[11.5px] text-[#6B7280] mb-3">JPG, PNG, or PDF up to 5MB</div>}
                
                <button onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }} className="px-4 py-1.5 bg-white border-[1.5px] border-[#E4E8EF] rounded-lg text-[12.5px] font-semibold text-[#111827] hover:border-[#1E3A5F] transition-all">Select File</button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={e => { if(e.target.files && e.target.files[0]) setFile(e.target.files[0]) }} />
                {errors.file && <div className="mt-2 text-[10px] text-red-500 font-bold">{errors.file}</div>}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-7 py-4 pb-5 border-t-[1.5px] border-[#E4E8EF] flex gap-2.5 items-center">
            <button className="flex-1 p-3 bg-white text-[#111827] border-[1.5px] border-[#E4E8EF] rounded-xl font-semibold text-[13.5px] hover:border-[#94A3B8] transition-all">Cancel</button>
            <button onClick={handleSubmit} className="flex-[2] p-3 bg-[#1E3A5F] text-white rounded-xl font-bold text-[13.5px] hover:bg-[#162D4A] hover:-translate-y-[1px] transition-all">Confirm Delivery Info</button>
          </div>
          
        </div>

        {/* ORDER SUMMARY */}
        <div className="w-full md:w-[290px] bg-white rounded-[20px] border-[1.5px] border-[#E4E8EF] shadow-[0_8px_40px_rgba(0,0,0,0.08)] p-5 md:sticky md:top-6 shrink-0 mt-5 md:mt-0">
          <div className="text-[11px] font-bold uppercase tracking-[1px] text-[#6B7280] mb-4">Order Summary</div>

          <div className="flex items-center gap-3 pb-4 border-b-[1.5px] border-[#E4E8EF] mb-3.5">
            <div className="w-[50px] h-[50px] rounded-[10px] bg-[#DBEAFE] flex items-center justify-center text-[24px] shrink-0">🎧</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold leading-[1.3] mb-0.5 max-w-full">Advanced Calculator 12th Edition</div>
              <div className="text-[11.5px] text-[#6B7280]">Golden Sato · · ·</div>
            </div>
            <div className="text-[14px] font-bold shrink-0 ml-1.5">$43.01</div>
          </div>

          <div className="flex justify-between items-center text-[13px] py-1">
            <span className="text-[#6B7280]">Subtotal</span>
            <span className="font-semibold text-[#111827]">$43.80</span>
          </div>
          <div className="flex justify-between items-center text-[13px] py-1">
            <span className="text-[#6B7280]">Marketplace Fee (3%)</span>
            <span className="font-semibold text-[#111827]">$1.55</span>
          </div>
          <div className="flex justify-between items-center text-[13px] py-1">
            <span className="text-[#6B7280]">Delivery Fee</span>
            <span className="font-bold text-[#10B981]">{method === 'courier' && bid ? `$${parseFloat(bid).toFixed(2)}` : 'FREE'}</span>
          </div>

          <div className="h-[1px] bg-[#E4E8EF] my-2.5"></div>

          <div className="flex justify-between items-center py-1.5">
            <span className="text-[15px] font-bold">Total</span>
            <span className="font-['Lora',serif] text-[22px] font-semibold tracking-[-0.5px]">
              ${(43.80 + 1.55 + (method === 'courier' && bid ? parseFloat(bid) : 0)).toFixed(2)}
            </span>
          </div>

          <div className="mt-3.5 bg-[#EFF6FF] border-[1.5px] border-[#BFDBFE] rounded-xl p-3 flex gap-2.5 items-start">
            <div className="text-[18px] shrink-0">🛡️</div>
            <div className="text-[11.5px] text-[#1E40AF] leading-[1.5]">
              <strong className="font-bold block mb-[2px]">Buyer Protection</strong>
              Funds are held in escrow until you confirm delivery of the item. 
              <span className="font-bold cursor-pointer underline ml-1">Need help with your checkout?</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
