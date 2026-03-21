import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RF_CATS = [
  '💻 Laptops & Computers','📱 Phones & Tablets','🎧 Audio & Headphones',
  '⌚ Watches & Accessories','👜 Bags & Backpacks','🔑 Keys & Keychains',
  '👓 Eyewear','📚 Books & Stationery','🪪 ID Cards & Documents',
  '👗 Clothing & Apparel','🎮 Electronics & Gadgets','➕ Others',
];
const RF_ACCENT = {
  Lost:  { from:'#4338ca', to:'#6366f1', shadow:'rgba(67,56,202,0.42)' },
  Found: { from:'#7c3aed', to:'#a78bfa', shadow:'rgba(124,58,237,0.42)' }
};

export default function LostFoundForm({ setAds }) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialType = location.state?.type || 'Lost';

  const [rfMode, setRfMode] = useState(initialType.toLowerCase() === 'found' ? 'Found' : 'Lost');
  const [rfStep, setRfStep] = useState(0);
  const [rfCat, setRfCat] = useState('');
  const [rfStatus, setRfStatus] = useState('Active');
  const [rfError, setRfError] = useState('');
  const [drag, setDrag] = useState(false);
  const [rfSubmitting, setRfSubmitting] = useState(0);

  const [form, setForm] = useState({ 
    name:'', sid:'', date:new Date().toISOString().split('T')[0], 
    title:'', desc:'', loc:'', phone:'', wa:'', img:null 
  });

  const A = RF_ACCENT[rfMode];
  const setV = (k, v) => setForm(prev => ({...prev, [k]: v}));

  const validate = () => {
    if(rfStep===0){
      if(!form.name.trim()) return 'Full name is required';
      if(!form.sid.trim()) return 'Student ID is required';
      if(!form.date) return 'Date is required';
    }
    if(rfStep===1){
      if(!form.title.trim()) return 'Item title is required';
      if(!form.desc.trim()) return 'Description is required';
      if(!rfCat) return 'Please select a category';
      if(!form.loc) return 'Please select a location';
    }
    if(rfStep===2){
      if(!form.phone.trim()) return 'Contact number is required';
    }
    return null;
  };

  const goNext = () => {
    const err = validate();
    setRfError(err || '');
    if(!err) setRfStep(rfStep + 1);
  };
  const goBack = () => { setRfError(''); setRfStep(rfStep - 1); };

  const doSubmit = () => {
    const err = validate();
    setRfError(err || '');
    if(err) return;
    setRfSubmitting(1);
    
    setTimeout(() => {
      setRfSubmitting(2);
      setTimeout(() => {
        const newId = `ad_${Date.now()}`;
        setAds(prev => ({
          [newId]: {
            img: form.img || 'https://images.unsplash.com/photo-1544365558-35aa4af41144?w=800&h=500&fit=crop',
            status: rfStatus,
            statusClass: rfStatus === 'Active' ? 'bg-[rgba(16,185,129,0.88)] text-white' : 'bg-gray-500/88 text-white',
            type: rfMode.toUpperCase(),
            typeClass: rfMode === 'Lost' ? 'bg-[rgba(239,68,68,0.88)] text-white' : 'bg-[rgba(16,185,129,0.88)] text-white',
            title: form.title,
            desc: form.desc,
            tags: [rfCat, rfMode === 'Lost' ? 'Missing' : 'Recovered'],
            student: form.name,
            year: form.sid,
            phone: form.phone,
            location: form.loc,
            date: new Date(form.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            category: rfCat.replace(/[\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '').trim()
          },
          ...prev
        }));
        navigate('/lost-found');
      }, 1200);
    }, 1500);
  };

  const buildWa = (p) => {
    const phone = p.replace(/\D/g,'');
    const t = form.title || 'your item';
    if(phone) setV('wa', `https://wa.me/${phone}?text=${encodeURIComponent(`Hi! I saw your UniVault post about "${t}". I'd like to help.`)}`);
  };

  const fileInputRef = React.useRef(null);
  const handleFile = (f) => {
    if(f) {
      const rd = new FileReader();
      rd.onload = e => setV('img', e.target.result);
      rd.readAsDataURL(f);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-[20px] lg:p-[40px] overflow-x-hidden font-epilogue" style={{background:'linear-gradient(160deg, #f8f6ff 0%, #ede9fe 22%, #e8eeff 44%, #dbeafe 66%, #eff6ff 100%)'}}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute rounded-full blur-[80px] w-[50vw] h-[50vh] -top-[10%] -left-[10%] opacity-[0.14]" style={{background:`radial-gradient(circle, ${A.from}, transparent)`}}></div>
         <div className="absolute rounded-full blur-[80px] w-[40vw] h-[40vh] bottom-[5%] -right-[5%] opacity-[0.11]" style={{background:`radial-gradient(circle, ${A.to}, transparent)`}}></div>
      </div>
      
      <div className="relative w-full max-w-[660px] rounded-[28px] flex flex-col bg-white/[0.90] backdrop-blur-[24px] border-[1.5px] border-[#a5b4fc]/[0.32] shadow-[0_24px_80px_rgba(10,6,35,0.1),0_0_0_1px_rgba(255,255,255,0.85)] z-10 transition-all duration-300">
        {/* Header */}
        <div className="relative p-[32px] px-[36px] pb-[28px] shrink-0 overflow-hidden rounded-t-[26px] bg-gradient-to-br transition-all duration-350" style={{background:`linear-gradient(135deg, ${A.from}, ${A.to})`}}>
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/20 to-transparent via-transparent via-60%"></div>
          <button className="absolute top-[24px] right-[24px] w-[36px] h-[36px] rounded-full bg-white/[0.22] hover:bg-white/[0.38] text-white/90 text-[18px] flex items-center justify-center transition-all cursor-pointer border-none" onClick={() => navigate('/lost-found')}>✕</button>

          <div className="flex gap-[8px] mb-[18px]">
            <button onClick={() => setRfMode('Lost')} className={`px-[20px] py-[8px] rounded-full text-[13px] font-bold cursor-pointer transition-all border-[1.5px] border-white/[0.42] ${rfMode==='Lost'?'bg-white/[0.94] text-[${A.from}] shadow-md':'bg-white/20 text-white'}`} style={rfMode==='Lost'?{color:A.from}:{}}>🔴 Lost Item</button>
            <button onClick={() => setRfMode('Found')} className={`px-[20px] py-[8px] rounded-full text-[13px] font-bold cursor-pointer transition-all border-[1.5px] border-white/[0.42] ${rfMode==='Found'?'bg-white/[0.94] text-[${A.from}] shadow-md':'bg-white/20 text-white'}`} style={rfMode==='Found'?{color:A.from}:{}}>🟢 Found Item</button>
          </div>
          <div className="font-clash text-[32px] font-bold text-white mb-[6px] tracking-tight">{rfMode === 'Lost' ? 'Report a Lost Item' : 'Post a Found Item'}</div>
          <div className="text-[14.5px] text-white/[0.76] font-medium">{rfMode === 'Lost' ? 'Fill in the details to help the community find your item' : 'Help someone reunite with their belonging'}</div>

          <div className="flex flex-wrap items-center gap-[10px] mt-[26px]">
            {[0,1,2].map(i => (
               <React.Fragment key={i}>
                 <div className="flex items-center gap-[8px]">
                   <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[12px] font-bold transition-all shadow-sm" style={{background: i<=rfStep?'rgba(255,255,255,1)':'rgba(255,255,255,0.25)', color: i<=rfStep?A.from:'rgba(255,255,255,0.7)'}}>{i<rfStep ? '✓' : i+1}</div>
                   <span className="text-[13px] font-bold transition-colors" style={{color: i<=rfStep?'#fff':'rgba(255,255,255,0.6)'}}>{['Basic Info', 'Item Details', 'Contact / Image'][i]}</span>
                 </div>
                 {i<2 && <div className="w-[30px] h-[1.5px] rounded-[2px] transition-colors" style={{background: i<rfStep?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.25)'}}></div>}
               </React.Fragment>
            ))}
          </div>
        </div>

        <div className="p-[32px] px-[36px] bg-[#f8fafc] rounded-b-[26px]">
          {rfError && <div className="flex items-center gap-[10px] bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-[14px] p-[14px] px-[18px] rounded-[14px] mb-[24px] font-medium shadow-sm"><span>⚠️</span><span>{rfError}</span></div>}

          {rfStep === 0 && (
            <div className="space-y-[24px]">
              <div>
                <div className="flex items-center gap-[8px] mb-[10px]"><strong className="text-[14px] font-bold text-[#1e1b4b]">👤 Full Name</strong><span className="text-[#ef4444]">*</span></div>
                <input className="w-full p-[14px] px-[18px] rounded-[14px] text-[14.5px] border-[1.5px] border-[#a5b4fc]/35 bg-white text-[#1e1b4b] outline-none transition-all focus:bg-white shadow-sm" value={form.name} onChange={e => setV('name', e.target.value)} type="text" placeholder="e.g. Jane Doe" onFocus={e=>{e.target.style.borderColor=A.from;e.target.style.boxShadow=`0 0 0 3.5px ${A.from}22`;}} onBlur={e=>{e.target.style.borderColor='';e.target.style.boxShadow='';}} />
              </div>
              <div>
                <div className="flex items-center gap-[8px] mb-[10px]"><strong className="text-[14px] font-bold text-[#1e1b4b]">🪪 Student ID</strong><span className="text-[#ef4444]">*</span></div>
                <input className="w-full p-[14px] px-[18px] rounded-[14px] text-[14.5px] border-[1.5px] border-[#a5b4fc]/35 bg-white text-[#1e1b4b] outline-none transition-all focus:bg-white shadow-sm" value={form.sid} onChange={e => setV('sid', e.target.value)} type="text" placeholder="e.g. IT21234567" onFocus={e=>{e.target.style.borderColor=A.from;e.target.style.boxShadow=`0 0 0 3.5px ${A.from}22`;}} onBlur={e=>{e.target.style.borderColor='';e.target.style.boxShadow='';}} />
              </div>
              <div>
                <div className="flex items-center gap-[8px] mb-[10px]"><strong className="text-[14px] font-bold text-[#1e1b4b]">📅 Date of Incident</strong><span className="text-[#ef4444]">*</span><span className="text-[11.5px] text-[#9ca3af] font-medium">— When did it happen?</span></div>
                <input className="w-full p-[14px] px-[18px] rounded-[14px] text-[14.5px] border-[1.5px] border-[#a5b4fc]/35 bg-white text-[#1e1b4b] outline-none transition-all focus:bg-white shadow-sm" value={form.date} onChange={e => setV('date', e.target.value)} type="date" onFocus={e=>{e.target.style.borderColor=A.from;e.target.style.boxShadow=`0 0 0 3.5px ${A.from}22`;}} onBlur={e=>{e.target.style.borderColor='';e.target.style.boxShadow='';}} />
              </div>
              <div>
                <div className="flex items-center gap-[8px] mb-[10px]"><strong className="text-[14px] font-bold text-[#1e1b4b]">📊 Status</strong></div>
                <div className="flex gap-[12px]">
                  <button onClick={() => setRfStatus('Active')} className="flex-1 p-[14px] rounded-[14px] text-[14px] font-bold cursor-pointer border-[1.5px] transition-all flex items-center justify-center gap-[8px]" style={rfStatus==='Active'?{background:`linear-gradient(135deg,${A.from},${A.to})`,boxShadow:`0 6px 16px ${A.shadow}`,color:'#fff',borderColor:'transparent'}:{background:'rgba(241,245,249,0.9)',color:'#64748b',borderColor:'rgba(165,180,252,0.28)'}}><span className="w-[10px] h-[10px] rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,137,0.8)]"></span> Active</button>
                  <button onClick={() => setRfStatus('Resolved')} className="flex-1 p-[14px] rounded-[14px] text-[14px] font-bold cursor-pointer border-[1.5px] transition-all flex items-center justify-center gap-[8px]" style={rfStatus==='Resolved'?{background:`linear-gradient(135deg,${A.from},${A.to})`,boxShadow:`0 6px 16px ${A.shadow}`,color:'#fff',borderColor:'transparent'}:{background:'rgba(241,245,249,0.9)',color:'#64748b',borderColor:'rgba(165,180,252,0.28)'}}>✅ Resolved</button>
                </div>
              </div>
            </div>
          )}

          {rfStep === 1 && (
            <div className="space-y-[24px]">
              <div>
                <div className="flex items-center gap-[8px] mb-[10px]"><strong className="text-[14px] font-bold text-[#1e1b4b]">🏷️ Item Title</strong><span className="text-[#ef4444]">*</span><span className="text-[11.5px] text-[#9ca3af] font-medium">— Short specific name</span></div>
                <input className="w-full p-[14px] px-[18px] rounded-[14px] text-[14.5px] border-[1.5px] border-[#a5b4fc]/35 bg-white text-[#1e1b4b] outline-none transition-all focus:bg-white shadow-sm" value={form.title} onChange={e => {setV('title', e.target.value); buildWa(form.phone);}} type="text" placeholder="e.g. MacBook Air Silver M1" onFocus={e=>{e.target.style.borderColor=A.from;e.target.style.boxShadow=`0 0 0 3.5px ${A.from}22`;}} onBlur={e=>{e.target.style.borderColor='';e.target.style.boxShadow='';}} />
              </div>
              <div>
                <div className="flex items-center gap-[8px] mb-[10px]"><strong className="text-[14px] font-bold text-[#1e1b4b]">📝 Description</strong><span className="text-[#ef4444]">*</span><span className="text-[11.5px] text-[#9ca3af] font-medium">— Colour, brand, unique marks</span></div>
                <textarea className="w-full p-[14px] px-[18px] rounded-[14px] text-[14.5px] border-[1.5px] border-[#a5b4fc]/35 bg-white text-[#1e1b4b] outline-none transition-all focus:bg-white resize-none shadow-sm" rows="4" value={form.desc} onChange={e => setV('desc', e.target.value)} placeholder="Describe the item in detail..." onFocus={e=>{e.target.style.borderColor=A.from;e.target.style.boxShadow=`0 0 0 3.5px ${A.from}22`;}} onBlur={e=>{e.target.style.borderColor='';e.target.style.boxShadow='';}}></textarea>
              </div>
              <div>
                <div className="flex items-center gap-[8px] mb-[10px]"><strong className="text-[14px] font-bold text-[#1e1b4b]">🗂️ Category</strong><span className="text-[#ef4444]">*</span></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px]">
                  {RF_CATS.map(c => (
                    <button key={c} className="p-[12px] px-[14px] border-[1.5px] rounded-[12px] text-[13px] font-bold cursor-pointer text-left transition-all truncate" onClick={() => setRfCat(c)} style={rfCat===c ? {background:`linear-gradient(135deg,${A.from},${A.to})`,boxShadow:`0 4px 14px ${A.shadow}`,color:'#fff',borderColor:'transparent'} : {background:'rgba(248,250,252,0.9)',color:'#475569',borderColor:'rgba(165,180,252,0.28)'}}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-[8px] mb-[10px]"><strong className="text-[14px] font-bold text-[#1e1b4b]">📍 Location</strong><span className="text-[#ef4444]">*</span><span className="text-[11.5px] text-[#9ca3af] font-medium">— Where was it lost/found?</span></div>
                <div className="relative">
                  <select className="w-full p-[14px] px-[18px] rounded-[14px] text-[14.5px] border-[1.5px] border-[#a5b4fc]/35 bg-white text-[#1e1b4b] outline-none transition-all focus:bg-white appearance-none shadow-sm cursor-pointer" value={form.loc} onChange={e => setV('loc', e.target.value)} onFocus={e=>{e.target.style.borderColor=A.from;e.target.style.boxShadow=`0 0 0 3.5px ${A.from}22`;}} onBlur={e=>{e.target.style.borderColor='';e.target.style.boxShadow='';}}>
                    <option value="">Select campus location...</option>
                    <option>Engineering Hall</option><option>CS Lab – Block A</option><option>CS Lab – Block B</option><option>Science Block</option><option>Main Library</option><option>Student Café</option><option>Sports Complex</option><option>Gym Block B</option><option>Lecture Hall 3B</option><option>Administration Block</option><option>Medical Centre</option><option>Hostel Block</option><option>Campus Entrance</option><option>Parking Area</option>
                  </select>
                  <span className="absolute right-[18px] top-1/2 -translate-y-1/2 text-[#9ca3af] text-[14px] pointer-events-none">▼</span>
                </div>
              </div>
            </div>
          )}

          {rfStep === 2 && (
            <div className="space-y-[24px]">
              <div>
                <div className="flex items-center gap-[8px] mb-[10px]"><strong className="text-[14px] font-bold text-[#1e1b4b]">📞 Contact Number</strong><span className="text-[#ef4444]">*</span></div>
                <input className="w-full p-[14px] px-[18px] rounded-[14px] text-[14.5px] border-[1.5px] border-[#a5b4fc]/35 bg-white text-[#1e1b4b] outline-none transition-all focus:bg-white shadow-sm" value={form.phone} onChange={e => {setV('phone', e.target.value); buildWa(e.target.value);}} type="tel" placeholder="+94 77 123 4567" onFocus={e=>{e.target.style.borderColor=A.from;e.target.style.boxShadow=`0 0 0 3.5px ${A.from}22`;}} onBlur={e=>{e.target.style.borderColor='';e.target.style.boxShadow='';}} />
              </div>
              <div>
                <div className="flex items-center gap-[8px] mb-[10px]"><strong className="text-[14px] font-bold text-[#1e1b4b]">💬 WhatsApp Link</strong><span className="text-[11px] text-[#9ca3af] font-medium">— Auto-generated, editable</span></div>
                <div className="relative">
                  <input className="w-full p-[14px] px-[18px] rounded-[14px] text-[14.5px] border-[1.5px] border-[#a5b4fc]/35 bg-white text-[#1e1b4b] outline-none transition-all focus:bg-white shadow-sm pr-[90px]" value={form.wa} onChange={e => setV('wa', e.target.value)} type="text" placeholder="https://wa.me/94771234567" onFocus={e=>{e.target.style.borderColor=A.from;e.target.style.boxShadow=`0 0 0 3.5px ${A.from}22`;}} onBlur={e=>{e.target.style.borderColor='';e.target.style.boxShadow='';}} />
                  {form.wa && <a href={form.wa} target="_blank" rel="noreferrer" className="absolute right-[12px] top-1/2 -translate-y-1/2 text-[12px] font-bold py-[6px] px-[14px] rounded-[10px] bg-[#25d366] hover:bg-[#20bd5c] text-white no-underline shadow-sm transition-colors">Test ↗</a>}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-[8px] mb-[10px]"><strong className="text-[14px] font-bold text-[#1e1b4b]">🖼️ Item Image</strong><span className="text-[11px] text-[#9ca3af] font-medium">— Optional, helps identification</span></div>
                <div className="border-[2px] border-dashed rounded-[16px] min-h-[140px] flex flex-col items-center justify-center p-[28px] cursor-pointer text-center relative overflow-hidden transition-all duration-200" style={drag ? {borderColor:A.from, background:'rgba(99,102,241,0.06)'} : {borderColor:'rgba(165,180,252,0.45)', background:'rgba(255,255,255,0.8)'}} onClick={() => fileInputRef.current?.click()} onDragOver={e=>{e.preventDefault(); setDrag(true);}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]);}}>
                  {!form.img && (
                    <div>
                      <div className="w-[56px] h-[56px] rounded-[16px] mx-auto mb-[14px] flex items-center justify-center text-[26px]" style={{background:`linear-gradient(135deg,${A.from}15,${A.to}15)`}}>📷</div>
                      <div className="text-[14.5px] font-bold text-[#1e1b4b] mb-[4px]">Drag & drop or <span style={{textDecoration:'underline', cursor:'pointer', color:A.from}}>browse</span></div>
                      <div className="text-[12.5px] text-[#9ca3af]">PNG, JPG or WEBP — max 5MB</div>
                    </div>
                  )}
                  {form.img && (
                    <div className="relative w-full">
                      <img src={form.img} className="w-full max-h-[220px] object-cover rounded-[14px]" />
                      <button className="absolute top-[10px] right-[10px] w-[32px] h-[32px] rounded-full bg-black/60 text-white flex items-center justify-center text-[15px] border-none cursor-pointer hover:bg-black/80 transition-colors" onClick={(e) => { e.stopPropagation(); setV('img', null); }}>✕</button>
                    </div>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => handleFile(e.target.files[0])} />
              </div>
              
              <div className="rounded-[20px] p-[20px] mt-[10px]" style={{background:`linear-gradient(135deg,${A.from}08,${A.to}05)`, border:`1.5px solid ${A.from}22`}}>
                <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] mb-[16px] flex items-center gap-[8px]" style={{color:A.from}}><span>📋</span> Submission Summary</div>
                <div className="grid grid-cols-2 gap-y-[14px] gap-x-[20px]">
                  {[
                    ['Type', rfMode], ['Name', form.name], ['ID', form.sid], ['Title', form.title],
                    ['Category', rfCat ? rfCat.split(' ').slice(1).join(' ') : ''], ['Location', form.loc],
                    ['Date', form.date], ['Contact', form.phone]
                  ].filter(([_, v]) => v).map(([k, v]) => (
                    <div key={k} className="bg-white/40 p-[10px] px-[12px] rounded-[10px]">
                      <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-[0.05em] mb-[2px]">{k}</div>
                      <div className="text-[13px] font-bold text-[#1e1b4b] whitespace-nowrap overflow-hidden text-ellipsis">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-[12px] mt-[32px] pt-[24px] border-t-[1.5px] border-[#e2e8f0]">
            {rfStep > 0 && <button className="py-[14px] px-[24px] rounded-[14px] text-[14px] font-bold cursor-pointer text-[#475569] bg-white border-[1.5px] border-[#e2e8f0] hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all" onClick={goBack}>← Back</button>}
            <button className="py-[14px] px-[24px] rounded-[14px] text-[14px] font-bold cursor-pointer text-[#475569] bg-white border-[1.5px] border-[#e2e8f0] hover:bg-[#f8fafc] hover:border-[#cbd5e1] transition-all" onClick={() => navigate('/lost-found')}>Cancel</button>
            <div className="flex-1"></div>
            <div className="flex gap-[6px] items-center mr-[8px]">
              {[0,1,2].map(i => <div key={i} className="h-[6px] rounded-full transition-all duration-300" style={{width: i===rfStep?24:6, background: i<=rfStep?A.from:'rgba(165,180,252,0.30)'}}></div>)}
            </div>
            {rfStep < 2 && <button className="py-[14px] px-[32px] rounded-[14px] text-[14px] font-bold text-white cursor-pointer border-none transition-all shadow-md hover:-translate-y-[1px]" style={{background:`linear-gradient(135deg,${A.from},${A.to})`,boxShadow:`0 6px 20px ${A.shadow}`}} onClick={goNext}>Next →</button>}
            {rfStep === 2 && (
              <button className="py-[14px] px-[32px] rounded-[14px] text-[14px] font-bold text-white cursor-pointer border-none transition-all flex items-center justify-center hover:-translate-y-[1px]" disabled={rfSubmitting > 0} style={rfSubmitting===2 ? {background:'linear-gradient(135deg,#059669,#34d399)',boxShadow:'0 6px 20px rgba(5,150,105,0.4)',opacity:1} : {background:`linear-gradient(135deg,${A.from},${A.to})`,boxShadow:`0 6px 20px ${A.shadow}`, opacity: rfSubmitting===1 ? 0.7 : 1}} onClick={doSubmit}>
                {rfSubmitting === 0 && '✓ Submit Report'}
                {rfSubmitting === 1 && <><div className="inline-block w-[16px] h-[16px] border-[2.5px] border-white/[0.35] border-t-white rounded-full animate-spin mr-[8px]"></div> Submitting…</>}
                {rfSubmitting === 2 && '✅ Item Submitted!'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
