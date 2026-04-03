import React from "react";
import "./App.css";
import Dashboard from "./features/marketplace/pages/Dashboard";
import ItemDetails from "./features/marketplace/pages/ItemDetails";
import Myitems from "./features/marketplace/pages/Myitems";
import Deliveryinfo from "./features/marketplace/pages/Deliveryinfo";
import PurchaseDone from "./features/marketplace/pages/PurchaseDone";
import OrderPage from "./features/marketplace/pages/OrderPage";
import Bid from "./features/marketplace/pages/Bid";
import Massage from "./features/marketplace/pages/Massage";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/myitems" element={<Myitems />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/bidding" element={<Bid />} />
        <Route path="/massage" element={<Massage />} />
        <Route path="/delivery" element={<Deliveryinfo />} />
        <Route path="/purchasedone" element={<PurchaseDone />} />
      </Routes>
    </>
  );
}

export default App;