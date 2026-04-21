import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen font-inter flex flex-col ag-bg-gradient">
        
        {/* Anti-Gravity Header Section */}
        <div className="bg-[#0F0A2E] pt-28 pb-20 px-4 md:px-8 relative overflow-hidden border-b border-white/5 shadow-2xl">
           <div className="absolute top-0 right-0 w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[150px] -mr-64 -mt-32 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-[400px] h-[200px] bg-cyan-500/5 rounded-full blur-[100px] -ml-32 -mb-20 pointer-events-none"></div>

           <div className="max-w-[1500px] mx-auto relative z-10 w-full">
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 shadow-sm text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em] mb-6 ag-fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF] animate-pulse"></span>
                Platform Philosophy
              </span>
              <div className="ag-fade-in" style={{ animationDelay: '0.1s' }}>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight font-epilogue drop-shadow-sm">
                  About UniVault
                </h1>
                <p className="text-white/60 mt-4 font-medium text-sm md:text-base max-w-2xl leading-relaxed">
                  UniVault is an intelligent campus infrastructure designed to bridge the gap between lost belongings and their rightful owners, while fostering a secure peer-to-peer marketplace ecosystem.
                </p>
              </div>
            </div>
           </div>
        </div>

        {/* Mission Section */}
        <div className="py-24 px-4 md:px-8 -mt-10 relative z-20 overflow-hidden">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="ag-card p-10 md:p-14 border-white relative group overflow-hidden ag-fade-in" style={{ animationDelay: '0.2s' }}>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors"></div>
                 <div className="relative z-10">
                    <h2 className="text-3xl font-black text-[#1f1b5b] tracking-tight font-epilogue mb-6">Our Core Mission</h2>
                    <p className="text-slate-500 text-base leading-relaxed mb-6 font-medium">
                      In the fast-paced university environment, losing an item isn't just a physical loss—it's a disruption to student life. UniVault was born from the need for a **centralized, intelligent, and secure** recovery network.
                    </p>
                    <p className="text-slate-500 text-base leading-relaxed font-medium">
                      We leverage automated matching protocols and verified university identities to ensure that "lost" is only a temporary state.
                    </p>
                 </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {[
                   { icon: "🛡️", title: "Security First", desc: "Verified student IDs and secure meeting protocols." },
                   { icon: "⚡", title: "Rapid Recovery", desc: "AI-powered matching for immediate item detection." },
                   { icon: "🤝", title: "Community", desc: "A platform built on mutual aid and student integrity." },
                   { icon: "💎", title: "Quality", desc: "Premium marketplace standards for peer-to-peer trading." }
                 ].map((card, i) => (
                   <div key={i} className="ag-card-secondary p-8 hover:bg-white hover:border-indigo-100 transition-all ag-hover-lift ag-fade-in" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                      <div className="text-3xl mb-4 drop-shadow-sm">{card.icon}</div>
                      <h3 className="text-sm font-black text-[#1f1b5b] uppercase tracking-widest mb-2">{card.title}</h3>
                      <p className="text-xs font-bold text-slate-400 leading-snug tracking-tight">{card.desc}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Matrix Stats */}
        <div className="py-24 bg-slate-900 relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent)]"></div>
           <div className="max-w-[1200px] mx-auto px-4 relative z-10">
              <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] text-center mb-16">Platform Impact Metrics</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                 {[
                   { label: "Verified Students", value: "10K+", icon: "👥" },
                   { label: "Items Recovered", value: "4.8K", icon: "📦" },
                   { label: "Trust Rating", value: "99.2%", icon: "✅" },
                   { label: "Active Nodes", value: "24/7", icon: "🌐" }
                 ].map((stat, i) => (
                   <div key={i} className="text-center group ag-fade-in" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                      <div className="text-3xl mb-4 opacity-50 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300">{stat.icon}</div>
                      <div className="text-4xl font-black text-white mb-2 font-epilogue">{stat.value}</div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Detailed Values */}
        <div className="py-32 px-4 md:px-8 bg-white/30">
           <div className="max-w-[1200px] mx-auto">
              <div className="flex flex-col items-center text-center mb-20 ag-fade-in">
                 <h2 className="text-3xl md:text-4xl font-black text-[#1f1b5b] tracking-tight font-epilogue mb-6">Designed for Modern Campuses</h2>
                 <p className="text-slate-500 max-w-2xl font-bold leading-relaxed text-sm uppercase tracking-widest opacity-60">
                   UniVault handles the complexity of modern university life.
                 </p>
              </div>

              <div className="grid md:grid-cols-3 gap-10">
                 {[
                   { id: "01", title: "Intelligent Indexing", color: "bg-indigo-600 shadow-indigo-200", desc: "Our specialized indexing system categorizes items by unique campus metadata, ensuring that generic items are differentiated by location and time." },
                   { id: "02", title: "Verified Integrity", color: "bg-cyan-500 shadow-cyan-200", desc: "Every user on the platform is verified through official university credentials, creating a zero-tolerance environment for malicious activity." },
                   { id: "03", title: "Peer Economy", color: "bg-slate-800 shadow-slate-300", desc: "The UniVault Marketplace facilitates a sustainable circular economy, allowing students to pass on textbooks and electronics securely." }
                 ].map((item, i) => (
                   <div key={i} className="ag-card p-10 hover:border-white transition-all ag-hover-lift group ag-fade-in" style={{ animationDelay: `${0.8 + i * 0.1}s` }}>
                      <div className={`w-14 h-14 rounded-2xl ${item.color} text-white flex items-center justify-center text-xl font-black shadow-xl mb-8 group-hover:rotate-6 transition-transform`}>{item.id}</div>
                      <h3 className="text-xl font-black text-[#1f1b5b] font-epilogue mb-4 tracking-tight">{item.title}</h3>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">
                         {item.desc}
                      </p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* CTA Section */}
        <div className="pb-32 px-4">
           <div className="max-w-[1000px] mx-auto bg-[#0F0A2E] rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_40px_100px_rgba(15,10,46,0.3)] ag-fade-in" style={{ animationDelay: '1.2s' }}>
              <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -ml-32 -mt-32"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] -mr-32 -mb-32"></div>
              
              <h2 className="text-3xl md:text-5xl font-black text-white font-epilogue tracking-tight mb-8 relative z-10 drop-shadow-lg">Ready to secure your world?</h2>
              <p className="text-white/50 max-w-xl mx-auto mb-12 font-medium relative z-10 leading-relaxed text-sm md:text-base">
                 Join thousands of students who have already digitized their recovery network. Start protecting your belongings today.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                 <button className="px-10 py-5 bg-white text-[#0F0A2E] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all hover:-translate-y-1 shadow-2xl shadow-black/20">Get Started Now</button>
                 <button className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all backdrop-blur-md">Contact Admin</button>
              </div>
           </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
