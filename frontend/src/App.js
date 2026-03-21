import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./Components/Homepage/Homepage";
import ItemList from "./Components/Items/ItemList";
import MyBids from "./Components/Bids/MyBids";
import AdminBidList from "./Components/Bids/AdminBidList";
import FeedbackForm from "./Components/Feedback/FeedbackForm";
import AdminFeedbackList from "./Components/Feedback/AdminFeedbackList";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/items" element={<ItemList />} />
        <Route path="/my-bids" element={<MyBids />} />
        <Route path="/admin/bids" element={<AdminBidList />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/admin/feedback" element={<AdminFeedbackList />} />
      </Routes>
    </AuthProvider>
    
  );
}

export default App;
