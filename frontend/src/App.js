import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./Components/Homepage/Homepage";
import LostFoundDashboard from "./Components/Dashboard/LostFoundDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/lost-found" element={<LostFoundDashboard />} />
    </Routes>
  );
}

export default App;