import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import AIMatchCard from './AIMatchCard';
import CompareMatchModal from './CompareMatchModal';
import { toast } from 'react-toastify';

const API_BASE = "http://localhost:5000/api/matches";

const AIMatchesPanel = ({ lostItemId, onUpdate }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const fetchMatches = useCallback(async () => {
    if (!lostItemId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/lost-item/${lostItemId}`);
      setMatches(res.data);
    } catch (err) {
      console.error("Fetch matches error:", err);
    } finally {
      setLoading(false);
    }
  }, [lostItemId]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleScan = async () => {
    if (!lostItemId) {
      toast.info("Please select a lost item to scan");
      return;
    }
    
    try {
      setScanning(true);
      toast.info("AI is analyzing records... Please wait", { autoClose: 3000 });
      const res = await axios.get(`${API_BASE}/scan/${lostItemId}`);
      setMatches(res.data);
      if (res.data.length > 0) {
        toast.success(`Found ${res.data.length} potential matches!`);
        if (onUpdate) onUpdate();
      } else {
        toast.info("No close matches found yet. We'll keep looking!");
      }
    } catch (err) {
      toast.error("Scanning failed. Please try again later.");
    } finally {
      setScanning(false);
    }
  };

  const handleVerify = async (matchId) => {
    try {
      await axios.patch(`${API_BASE}/verify/${matchId}`);
      toast.success("Match verified! You can now contact the finder.");
      fetchMatches();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const handleReject = async (matchId) => {
    try {
      await axios.patch(`${API_BASE}/reject/${matchId}`);
      fetchMatches();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading && matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium font-epilogue">AI is loading your matches...</p>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-[18px] border-[1.5px] border-white/92 rounded-[22px] p-[18px] shadow-[0_12px_40px_rgba(79,70,229,0.08)] mb-[12px] min-h-[400px] flex flex-col">
      <div className="flex justify-between items-start mb-[16px] flex-wrap gap-4">
        <div>
          <div className="text-[17px] font-bold text-[#1e1b4b] flex items-center gap-2 font-clash tracking-wide">
            🤖 AI-Powered Matches
            <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-extrabold uppercase animate-pulse">Live</span>
          </div>
          <div className="text-[11.5px] text-[#6b7280] mt-[2px] font-medium">Smart identification of possibly related found items</div>
        </div>
        <button 
          onClick={handleScan}
          disabled={scanning}
          className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-bold py-[8px] px-[20px] rounded-[10px] border-none cursor-pointer transition-all shadow-lg shadow-indigo-100 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {scanning ? (
            <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Scanning...</>
          ) : (
            "Scan Now →"
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 border-2 border-dashed border-indigo-50 rounded-[20px] bg-indigo-50/20">
            <div className="text-[40px] mb-4 opacity-50">🔍</div>
            <h4 className="text-[15px] font-bold text-indigo-900 mb-2">No matches yet</h4>
            <p className="text-[12px] text-indigo-400 max-w-[220px]">Click the button above to let AI search the found items database for you.</p>
          </div>
        ) : (
          matches.map(match => (
            <AIMatchCard 
              key={match._id} 
              match={match} 
              onCompare={() => setSelectedMatch(match)}
              onVerify={handleVerify}
              onReject={handleReject}
            />
          ))
        )}
      </div>

      <div className="mt-[16px] pt-[12px] border-t border-indigo-50/50">
        <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest text-center">
          Matches are based on description, images, location & date
        </div>
      </div>

      {/* Modal */}
      {selectedMatch && (
        <CompareMatchModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatch(null)} 
          onVerify={handleVerify}
        />
      )}
    </div>
  );
};

export default AIMatchesPanel;
