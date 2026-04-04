import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./features/lostAndFound/pages/AdminDashboard";
import LostFoundDashboard from "./features/lostAndFound/pages/LostFoundDashboard";
import Homepage from "./features/homepage/pages/Homepage";
import { initialAdData } from "./data/mockAds";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/lost-found" element={<LostFoundDashboard ads={initialAdData} />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}