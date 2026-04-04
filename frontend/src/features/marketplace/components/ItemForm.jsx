import React, { useState, useRef } from 'react';

const ItemForm = ({ onClose, onAddItem }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    itemName: '', description: '', category: '', brand: '', colorPicker: '#b5d4f4', colorText: '', condition: '', price: '', quantity: '', listing: '', availability: '', bankName: '', accountName: '', branch: '', accountNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageName, setImageName] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef(null);

  const colorMap = {
    '#ff0000':'Red','#ffffff':'Clear','#000000':'Black','#ffff00':'Yellow',
    '#00ff00':'Green','#0000ff':'Blue','#ff6600':'Amber','#800080':'Purple',
    '#ffc0cb':'Pink','#a52a2a':'Brown','#808080':'Gray','#b5d4f4':'Clear Blue'
  };

  const validateField = (name, value) => {
    let isValid = true;
    const v = (value || '').toString().trim();
    if (name === 'itemName') isValid = v.length >= 2 && v.length <= 80;
    else if (['category', 'brand', 'condition', 'listing', 'availability', 'bankName', 'accountName', 'branch', 'accountNumber'].includes(name)) isValid = v.length > 0;
    else if (name === 'price') isValid = v !== '' && !isNaN(parseFloat(v)) && parseFloat(v) >= 0;
    else if (name === 'quantity') isValid = v !== '' && !isNaN(parseInt(v, 10)) && parseInt(v, 10) >= 0;
    
    setErrors(prev => ({ ...prev, [name]: !isValid }));
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'colorPicker') {
      const autoText = colorMap[value.toLowerCase()] || '';
      setFormData(prev => ({ ...prev, [name]: value, colorText: prev.colorText === '' ? autoText : prev.colorText }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (touched[name]) validateField(name, value);
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
    validateField(e.target.name, e.target.value);
  };

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => { setImagePreview(e.target.result); setImageName(file.name); };
    reader.readAsDataURL(file);
  };

  const nextStep = (from) => {
    const stepFields = { 1: ['itemName'], 2: ['category', 'brand', 'condition'], 3: ['price', 'quantity', 'listing', 'availability'], 4: ['bankName', 'accountName', 'branch', 'accountNumber'] };
    let allValid = true;
    const newTouched = {};
    const newErrors = {};
    (stepFields[from] || []).forEach(name => {
      newTouched[name] = true;
      const valid = validateField(name, formData[name]);
      if (!valid) allValid = false;
      newErrors[name] = !valid;
    });
    setTouched(prev => ({ ...prev, ...newTouched }));
    setErrors(prev => ({ ...prev, ...newErrors }));
    if (allValid) setCurrentStep(from + 1);
  };

  const submitForm = () => {
    const stepFields = ['bankName', 'accountName', 'branch', 'accountNumber'];
    let allValid = true;
    const newTouched = {};
    const newErrors = {};
    stepFields.forEach(name => {
      newTouched[name] = true;
      const valid = validateField(name, formData[name]);
      if (!valid) allValid = false;
      newErrors[name] = !valid;
    });
    setTouched(prev => ({ ...prev, ...newTouched }));
    setErrors(prev => ({ ...prev, ...newErrors }));
    
    if (allValid) {
      const categoryColorMap = {
        'Laboratory': 'bg-teal-50',
        'Decorative': 'bg-pink-50',
        'Kitchenware': 'bg-orange-50',
        'Industrial': 'bg-gray-100',
        'Optical': 'bg-blue-50',
        'Architectural': 'bg-emerald-50',
        'Other': 'bg-purple-50'
      };

      const newItem = {
        title: formData.itemName,
        price: `$${parseFloat(formData.price).toFixed(2)}`,
        old: '',
        desc: formData.description || 'No description provided.',
        cat: formData.category || 'Other',
        catColor: categoryColorMap[formData.category] || 'bg-purple-50',
        badge: formData.condition === 'new' ? 'NEW' : '',
        badgeColor: formData.condition === 'new' ? 'bg-emerald-100 text-emerald-600' : '',
        stars: 5,
        image: imagePreview,
        emoji: !imagePreview ? '📦' : null
      };

      setSuccess(true);
      
      setTimeout(() => {
        if (onAddItem) onAddItem(newItem);
        setSuccess(false);
        setFormData({ itemName: '', description: '', category: '', brand: '', colorPicker: '#b5d4f4', colorText: '', condition: '', price: '', quantity: '', listing: '', availability: '', bankName: '', accountName: '', branch: '', accountNumber: '' });
        setTouched({});
        setImagePreview(null);
        setCurrentStep(1);
      }, onAddItem ? 1200 : 3500);
    }
  };

  const getInputClass = (name) => {
    const base = "font-sans text-[13px] text-[#1a0040] bg-[#faf8ff] border-[1.5px] rounded-[8px] px-3.5 py-[9px] outline-none w-full transition-all placeholder-[#b8a0d4] appearance-none ";
    if (touched[name] && errors[name]) return base + "border-[#f87171] bg-[#fef2f2] focus:shadow-[0_0_0_3px_rgba(248,113,113,0.1)]";
    if (touched[name] && !errors[name]) return base + "border-[#4ade80] bg-[#dcfce7] focus:border-[#6d28d9] focus:bg-[#fff] focus:shadow-[0_0_0_3px_rgba(109,40,217,0.12)]";
    return base + "border-[#cfbfed] hover:border-[#8b5cf6] focus:border-[#6d28d9] focus:bg-[#fff] focus:shadow-[0_0_0_3px_rgba(109,40,217,0.12)]";
  };

  const steps = [
    { title: 'Step 1', name: 'Basic info' },
    { title: 'Step 2', name: 'Item details' },
    { title: 'Step 3', name: 'Pricing & listing' },
    { title: 'Step 4', name: 'Payment details' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ zIndex: 100 }}>
      {/* Blurred Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Modal Shell */}
      <div className="relative z-10 w-full max-w-[780px] bg-white rounded-3xl overflow-hidden shadow-[0_32px_80px_rgba(46,0,96,0.28),0_8px_24px_rgba(46,0,96,0.14)] animate-[popIn_0.6s_cubic-bezier(0.22,0.68,0,1.2)_both] flex flex-col md:grid md:grid-cols-[250px_1fr] max-h-[90vh]">
        
        {/* Left Panel */}
        <div className="hidden md:flex flex-col relative overflow-hidden bg-gradient-to-br from-[#2e0060] via-[#4c0099] to-[#6d28d9] px-[22px] py-10">
          <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <div className="absolute -bottom-16 -right-16 w-[200px] h-[200px] rounded-full bg-white/5 pointer-events-none"></div>

          <div className="flex items-center gap-2.5 mb-8 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5">
                <path d="M6.5 3h7l2 5H4.5l2-5Z" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round"/>
                <path d="M4.5 8v7a2 2 0 002 2h7a2 2 0 002-2V8" stroke="#fff" strokeWidth="1.3"/>
                <path d="M8 13h4M10 11v4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="font-serif text-[16.5px] font-medium text-white leading-[1.2]">ItemRegistry</div>
              <div className="text-[9px] text-white/50 mt-[1px]">Item management</div>
            </div>
          </div>

          <div className="font-serif text-[20px] italic text-white leading-[1.3] mb-2 relative z-10">Add a new<br/>university item</div>
          <div className="text-[11px] text-white/55 leading-[1.65] mb-7 relative z-10">Complete all four steps to register your university item in the inventory.</div>

          <div className="flex flex-col flex-1 relative z-10">
            {steps.map((s, i) => {
              const num = i + 1;
              const isActive = num === currentStep;
              const isDone = num < currentStep;
              return (
                <div key={num} className="flex flex-col relative" onClick={() => {
                   if (isDone) setCurrentStep(num);
                }}>
                  <div className={`flex items-start gap-3 py-2.5 relative cursor-pointer group`}>
                    <div className={`w-[28px] h-[28px] flex-shrink-0 rounded-full border-[1.5px] flex items-center justify-center text-[10px] font-semibold transition-all relative z-10
                      ${isActive ? 'bg-white border-white text-[#6d28d9]' : isDone ? 'bg-[#a78bfa]/30 border-[#a78bfa] text-white' : 'bg-white/10 border-white/25 text-white/60 group-hover:bg-white/20'}`}
                    >
                      {num}
                    </div>
                    <div className="pt-[2px]">
                      <div className={`text-[10.5px] font-semibold uppercase tracking-[0.06em] transition-colors ${isActive ? 'text-white/90' : isDone ? 'text-white/60' : 'text-white/40'}`}>{s.title}</div>
                      <div className={`text-[12.5px] mt-[1px] transition-colors ${isActive ? 'text-white font-medium' : isDone ? 'text-white/50' : 'text-white/30'}`}>{s.name}</div>
                    </div>
                  </div>
                  {num < 4 && <div className="absolute left-[13px] top-[34px] w-[1px] h-[calc(100%-10px)] bg-white/15"></div>}
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-6 text-[10.5px] text-white/30 leading-[1.6] relative z-10">
            Fields marked <span className="text-[#a78bfa]">*</span> are required.<br/>
            You can go back at any time to edit.
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col bg-white overflow-y-auto overflow-x-hidden relative h-full custom-scrollbar">
          
          {/* Close button top right */}
          <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="flex flex-col flex-1 animate-[slideIn_0.3s_ease_both]">
              <div className="px-5 sm:px-8 py-[1.8rem] border-b border-[#e4d9f7]">
                <h2 className="text-[17px] font-semibold text-[#1a0040]">Basic information</h2>
                <p className="text-[12px] text-[#7c5aa6] mt-[3px]">Start with the item name and a description</p>
                <div className="h-[3px] bg-[#e4d9f7] mt-4 rounded-sm overflow-hidden"><div className="h-full bg-gradient-to-r from-[#6d28d9] to-[#8b5cf6] rounded-sm transition-all duration-400" style={{ width: '25%' }}></div></div>
              </div>
              <div className="p-5 sm:p-8 flex flex-col gap-4 flex-1">
                
                {success && (
                  <div className="flex items-center gap-2 bg-[#dcfce7] border border-[#4ade80] rounded-lg py-2.5 px-3.5 mb-1 text-[12.5px] text-[#166534]">
                    <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0"><circle cx="8" cy="8" r="8" fill="#166534"/><path d="M4.5 8.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                    Glass item added successfully!
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Item name <span className="text-[#6d28d9] ml-0.5">*</span></label>
                  <input type="text" name="itemName" value={formData.itemName} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Borosilicate Beaker 500ml" maxLength="80" className={getInputClass('itemName')} />
                  <div className="flex justify-between mt-[-2px]">
                    {touched.itemName && errors.itemName ? <span className="text-[11px] text-[#991b1b]">Required (2–80 characters).</span> : <span></span>}
                    <span className="text-[11px] text-[#b8a0d4] text-right ml-auto">{formData.itemName.length} / 80</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} onBlur={handleBlur} placeholder="Describe the glass item — material type, usage, specifications…" maxLength="400" className={`${getInputClass('description')} min-h-[80px] resize-y`} />
                  <span className="text-[11px] text-[#b8a0d4] text-right">{formData.description.length} / 400</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Item image</label>
                  <div 
                    className={`border-2 border-dashed rounded-[10px] cursor-pointer min-h-[88px] flex flex-col items-center justify-center transition-all overflow-hidden bg-[#f5f3ff] ${isDragOver ? 'border-[#6d28d9] bg-[#ede9fe]' : 'border-[#c4b5fd] hover:border-[#6d28d9] hover:bg-[#ede9fe]'}`}
                    onClick={() => fileInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }} onDragLeave={() => setIsDragOver(false)} onDrop={(e) => { e.preventDefault(); setIsDragOver(false); handleFile(e.dataTransfer.files[0]); }}
                  >
                    <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
                    
                    {!imagePreview ? (
                      <div className="flex flex-col items-center gap-1.5 p-3.5 pointer-events-none">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <rect x="2" y="2" width="24" height="24" rx="4" stroke="#a78bfa" strokeWidth="1.5"/>
                          <path d="M8 20l4-5 3 3.5 2.5-3 4 4.5" stroke="#c4b5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="10" cy="10" r="2" stroke="#a78bfa" strokeWidth="1.5"/>
                          <path d="M14 6v5M11.5 8.5h5" stroke="#7c3aed" strokeWidth="1.6" strokeLinecap="round"/>
                        </svg>
                        <span className="text-[12.5px] font-medium text-[#6d28d9]">Click to choose image</span>
                        <span className="text-[11px] text-[#b8a0d4]">PNG, JPG or WEBP — drag &amp; drop also works</span>
                      </div>
                    ) : (
                      <div className="relative w-full flex items-center gap-3 py-2.5 px-3.5 bg-black/5" onClick={(e) => e.stopPropagation()}>
                        <img src={imagePreview} alt="preview" className="w-[52px] h-[52px] object-cover rounded-lg border-[1.5px] border-[#cfbfed] flex-shrink-0" />
                        <span className="text-[12px] text-[#4b2c7a] break-all flex-1">{imageName}</span>
                        <button onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageName(''); if(fileInputRef.current) fileInputRef.current.value=''; }} className="absolute top-1.5 right-2.5 w-[22px] h-[22px] rounded-full bg-[#fee2e2] border border-[#fca5a5] flex items-center justify-center hover:bg-[#fecaca] cursor-pointer transition-colors">
                          <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="#991b1b" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
              <div className="py-5 px-5 sm:px-8 border-t border-[#e4d9f7] bg-[#faf8ff] flex items-center justify-between mt-auto">
                <span className="text-[11px] text-[#b8a0d4]"><span className="text-[#6d28d9] font-semibold">*</span> Required</span>
                <button onClick={() => nextStep(1)} className="font-sans text-[13px] font-medium py-[9px] px-5 rounded-lg border-[1.5px] border-[#4c0099] bg-[#6d28d9] text-white shadow-[0_3px_10px_rgba(109,40,217,0.3)] hover:bg-[#4c0099] hover:shadow-[0_5px_16px_rgba(109,40,217,0.4)] active:scale-95 transition-all">Next &rarr;</button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="flex flex-col flex-1 animate-[slideIn_0.3s_ease_both]">
              <div className="px-5 sm:px-8 py-[1.8rem] border-b border-[#e4d9f7]">
                <h2 className="text-[17px] font-semibold text-[#1a0040]">Item details</h2>
                <p className="text-[12px] text-[#7c5aa6] mt-[3px]">Category, brand, colour and condition</p>
                <div className="h-[3px] bg-[#e4d9f7] mt-4 rounded-sm overflow-hidden"><div className="h-full bg-gradient-to-r from-[#6d28d9] to-[#8b5cf6] rounded-sm transition-all duration-400" style={{ width: '50%' }}></div></div>
              </div>
              <div className="p-5 sm:p-8 flex flex-col gap-4 flex-1">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Category <span className="text-[#6d28d9] ml-0.5">*</span></label>
                    <div className="relative">
                      <select name="category" value={formData.category} onChange={handleChange} onBlur={handleBlur} className={`${getInputClass('category')} pr-[30px] cursor-pointer`}>
                        <option value="">Select…</option>
                        <option>Laboratory</option><option>Decorative</option><option>Kitchenware</option>
                        <option>Industrial</option><option>Optical</option><option>Architectural</option><option>Other</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#8b5cf6] pointer-events-none"></div>
                    </div>
                    {touched.category && errors.category && <span className="text-[11px] text-[#991b1b] mt-[-2px]">Please select a category.</span>}
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Brand <span className="text-[#6d28d9] ml-0.5">*</span></label>
                    <div className="relative">
                      <select name="brand" value={formData.brand} onChange={handleChange} onBlur={handleBlur} className={`${getInputClass('brand')} pr-[30px] cursor-pointer`}>
                        <option value="">Select…</option>
                        <option>Schott</option><option>Corning</option><option>Pyrex</option>
                        <option>Borosil</option><option>Duran</option><option>Arc International</option>
                        <option>Libbey</option><option>Riedel</option><option>Other</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#8b5cf6] pointer-events-none"></div>
                    </div>
                    {touched.brand && errors.brand && <span className="text-[11px] text-[#991b1b] mt-[-2px]">Please select a brand.</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" name="colorPicker" value={formData.colorPicker} onChange={handleChange} className="w-10 h-10 p-[3px] rounded-lg cursor-pointer border-[1.5px] border-[#cfbfed] bg-[#faf8ff] flex-shrink-0" />
                      <input type="text" name="colorText" value={formData.colorText} onChange={handleChange} placeholder="e.g. Clear, Amber, Cobalt" className={`${getInputClass('colorText')} flex-1`} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Item condition <span className="text-[#6d28d9] ml-0.5">*</span></label>
                    <div className="relative">
                      <select name="condition" value={formData.condition} onChange={handleChange} onBlur={handleBlur} className={`${getInputClass('condition')} pr-[30px] cursor-pointer`}>
                        <option value="">Select…</option>
                        <option value="new">New</option><option value="used">Used</option><option value="damaged">Damaged</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#8b5cf6] pointer-events-none"></div>
                    </div>
                    {touched.condition && errors.condition && <span className="text-[11px] text-[#991b1b] mt-[-2px]">Please select a condition.</span>}
                  </div>
                </div>

              </div>
              <div className="py-5 px-5 sm:px-8 border-t border-[#e4d9f7] bg-[#faf8ff] flex items-center justify-between mt-auto">
                <span className="text-[11px] text-[#b8a0d4]"><span className="text-[#6d28d9] font-semibold">*</span> Required</span>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentStep(1)} className="font-sans text-[13px] font-medium py-[9px] px-5 rounded-lg border-[1.5px] border-[#cfbfed] bg-white text-[#4b2c7a] hover:bg-[#f5f3ff] hover:border-[#a78bfa] hover:text-[#6d28d9] active:scale-95 transition-all">&larr; Back</button>
                  <button onClick={() => nextStep(2)} className="font-sans text-[13px] font-medium py-[9px] px-5 rounded-lg border-[1.5px] border-[#4c0099] bg-[#6d28d9] text-white shadow-[0_3px_10px_rgba(109,40,217,0.3)] hover:bg-[#4c0099] hover:shadow-[0_5px_16px_rgba(109,40,217,0.4)] active:scale-95 transition-all">Next &rarr;</button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="flex flex-col flex-1 animate-[slideIn_0.3s_ease_both]">
              <div className="px-5 sm:px-8 py-[1.8rem] border-b border-[#e4d9f7]">
                <h2 className="text-[17px] font-semibold text-[#1a0040]">Pricing &amp; listing</h2>
                <p className="text-[12px] text-[#7c5aa6] mt-[3px]">Set price, quantity and listing options</p>
                <div className="h-[3px] bg-[#e4d9f7] mt-4 rounded-sm overflow-hidden"><div className="h-full bg-gradient-to-r from-[#6d28d9] to-[#8b5cf6] rounded-sm transition-all duration-400" style={{ width: '75%' }}></div></div>
              </div>
              <div className="p-5 sm:p-8 flex flex-col gap-4 flex-1">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Price (USD) <span className="text-[#6d28d9] ml-0.5">*</span></label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} onBlur={handleBlur} placeholder="0.00" min="0" step="0.01" className={getInputClass('price')} />
                    {touched.price && errors.price && <span className="text-[11px] text-[#991b1b] mt-[-2px]">Enter a valid price (≥ 0).</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Quantity <span className="text-[#6d28d9] ml-0.5">*</span></label>
                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} onBlur={handleBlur} placeholder="0" min="0" step="1" className={getInputClass('quantity')} />
                    {touched.quantity && errors.quantity && <span className="text-[11px] text-[#991b1b] mt-[-2px]">Enter a valid quantity (≥ 0).</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Listing type <span className="text-[#6d28d9] ml-0.5">*</span></label>
                    <div className="relative">
                      <select name="listing" value={formData.listing} onChange={handleChange} onBlur={handleBlur} className={`${getInputClass('listing')} pr-[30px] cursor-pointer`}>
                        <option value="">Select…</option>
                        <option value="sell">Sell</option><option value="lost">Lost</option><option value="found">Found</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#8b5cf6] pointer-events-none"></div>
                    </div>
                    {touched.listing && errors.listing && <span className="text-[11px] text-[#991b1b] mt-[-2px]">Please select a listing type.</span>}
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Availability <span className="text-[#6d28d9] ml-0.5">*</span></label>
                    <div className="relative">
                      <select name="availability" value={formData.availability} onChange={handleChange} onBlur={handleBlur} className={`${getInputClass('availability')} pr-[30px] cursor-pointer`}>
                        <option value="">Select…</option>
                        <option value="available">Available</option><option value="not_available">Not available</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-[#8b5cf6] pointer-events-none"></div>
                    </div>
                    {touched.availability && errors.availability && <span className="text-[11px] text-[#991b1b] mt-[-2px]">Please select availability.</span>}
                  </div>
                </div>

              </div>
              <div className="py-5 px-5 sm:px-8 border-t border-[#e4d9f7] bg-[#faf8ff] flex items-center justify-between mt-auto">
                <span className="text-[11px] text-[#b8a0d4]"><span className="text-[#6d28d9] font-semibold">*</span> Required</span>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentStep(2)} className="font-sans text-[13px] font-medium py-[9px] px-5 rounded-lg border-[1.5px] border-[#cfbfed] bg-white text-[#4b2c7a] hover:bg-[#f5f3ff] hover:border-[#a78bfa] hover:text-[#6d28d9] active:scale-95 transition-all">&larr; Back</button>
                  <button onClick={() => nextStep(3)} className="font-sans text-[13px] font-medium py-[9px] px-5 rounded-lg border-[1.5px] border-[#4c0099] bg-[#6d28d9] text-white shadow-[0_3px_10px_rgba(109,40,217,0.3)] hover:bg-[#4c0099] hover:shadow-[0_5px_16px_rgba(109,40,217,0.4)] active:scale-95 transition-all">Next &rarr;</button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="flex flex-col flex-1 animate-[slideIn_0.3s_ease_both]">
              <div className="px-5 sm:px-8 py-[1.8rem] border-b border-[#e4d9f7]">
                <h2 className="text-[17px] font-semibold text-[#1a0040]">Payment details</h2>
                <p className="text-[12px] text-[#7c5aa6] mt-[3px]">Input bank-related information for transactions</p>
                <div className="h-[3px] bg-[#e4d9f7] mt-4 rounded-sm overflow-hidden"><div className="h-full bg-gradient-to-r from-[#6d28d9] to-[#8b5cf6] rounded-sm transition-all duration-400" style={{ width: '100%' }}></div></div>
              </div>
              <div className="p-5 sm:p-8 flex flex-col gap-4 flex-1">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Bank Name <span className="text-[#6d28d9] ml-0.5">*</span></label>
                    <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Bank of America" className={getInputClass('bankName')} />
                    {touched.bankName && errors.bankName && <span className="text-[11px] text-[#991b1b] mt-[-2px]">Please enter the bank name.</span>}
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Branch <span className="text-[#6d28d9] ml-0.5">*</span></label>
                    <input type="text" name="branch" value={formData.branch} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. Downtown Branch" className={getInputClass('branch')} />
                    {touched.branch && errors.branch && <span className="text-[11px] text-[#991b1b] mt-[-2px]">Please enter the branch.</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Account Name <span className="text-[#6d28d9] ml-0.5">*</span></label>
                    <input type="text" name="accountName" value={formData.accountName} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. John Doe" className={getInputClass('accountName')} />
                    {touched.accountName && errors.accountName && <span className="text-[11px] text-[#991b1b] mt-[-2px]">Please enter the account name.</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11.5px] font-semibold text-[#4b2c7a] tracking-[0.02em]">Account Number <span className="text-[#6d28d9] ml-0.5">*</span></label>
                    <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} onBlur={handleBlur} placeholder="e.g. 1234567890" className={getInputClass('accountNumber')} />
                    {touched.accountNumber && errors.accountNumber && <span className="text-[11px] text-[#991b1b] mt-[-2px]">Please enter the account number.</span>}
                  </div>
                </div>

              </div>
              <div className="py-5 px-5 sm:px-8 border-t border-[#e4d9f7] bg-[#faf8ff] flex items-center justify-between mt-auto">
                <span className="text-[11px] text-[#b8a0d4]"><span className="text-[#6d28d9] font-semibold">*</span> Required</span>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentStep(3)} className="font-sans text-[13px] font-medium py-[9px] px-5 rounded-lg border-[1.5px] border-[#cfbfed] bg-white text-[#4b2c7a] hover:bg-[#f5f3ff] hover:border-[#a78bfa] hover:text-[#6d28d9] active:scale-95 transition-all">&larr; Back</button>
                  <button onClick={submitForm} className="font-sans text-[13px] font-medium py-[9px] px-6 rounded-lg border-none bg-gradient-to-br from-[#4c0099] to-[#6d28d9] text-white shadow-[0_4px_14px_rgba(109,40,217,0.35)] hover:shadow-[0_6px_20px_rgba(109,40,217,0.5)] active:scale-95 transition-all">Submit item</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ItemForm;
