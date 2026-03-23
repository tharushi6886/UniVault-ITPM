import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage/Homepage";
import LostFoundDashboard from "./Components/Dashboard/LostFoundDashboard";
import LostFoundForm from "./Components/Dashboard/LostFoundForm";
import { initialAdData } from "./data/mockAds";

function App() {
  const [ads, setAds] = useState(initialAdData);

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/lost-found" element={<LostFoundDashboard ads={ads} />} />
      <Route path="/report-item" element={<LostFoundForm setAds={setAds} />} />
    </Routes>
  );
}

export default App;