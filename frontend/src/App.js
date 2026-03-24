import React from "react";
import "./App.css";
import Dashboard from "./Components/Dashboard/Dashboard";
import ItemDetails from "./Components/Dashboard/ItemDetails";
import Myitems from "./Components/Dashboard/Myitems";
import Deliveryinfo from "./Components/Dashboard/Deliveryinfo";
import PurchaseDone from "./Components/Dashboard/PurchaseDone";
import OrderPage from "./Components/Dashboard/OrderPage";
import Bid from "./Components/Dashboard/Bid";
import Massage from "./Components/Dashboard/Massage";
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