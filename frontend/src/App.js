<<<<<<< HEAD
import React from "react";
=======
import React, { useState } from "react";
>>>>>>> 4a1e826808b2597ab95e99e27f27ff5963f1e979
import { Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Homepage from "./features/homepage/pages/Homepage";
import AboutPage from "./features/homepage/pages/AboutPage";

import Dashboard from "./features/marketplace/pages/Dashboard";
import ItemDetails from "./features/marketplace/pages/ItemDetails";
import Myitems from "./features/marketplace/pages/Myitems";
import Deliveryinfo from "./features/marketplace/pages/Deliveryinfo";
import PurchaseDone from "./features/marketplace/pages/PurchaseDone";
import OrderPage from "./features/marketplace/pages/OrderPage";
import Bid from "./features/marketplace/pages/Bid";
import Massage from "./features/marketplace/pages/Massage";
<<<<<<< HEAD
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
=======
>>>>>>> 4a1e826808b2597ab95e99e27f27ff5963f1e979

import LoginPage from "./features/userManagement/pages/LoginPage";
import RegisterPage from "./features/userManagement/pages/RegisterPage";
import VerifyOtpPage from "./features/userManagement/pages/VerifyOtpPage";
import ProfilePage from "./features/userManagement/pages/ProfilePage";
import EditProfilePage from "./features/userManagement/pages/EditProfilePage";
import AdminUsersPage from "./features/userManagement/pages/AdminUsersPage";
import AdminDashboardPage from "./features/userManagement/pages/AdminDashboardPage";
import BuySellHistoryPage from "./features/userManagement/pages/BuySellHistoryPage";
import ItemsPostedPage from "./features/userManagement/pages/ItemsPostedPage";
import ItemsSoldPage from "./features/userManagement/pages/ItemsSoldPage";
import FoundReturnedPage from "./features/userManagement/pages/FoundReturnedPage";
import LostReportsPage from "./features/userManagement/pages/LostReportsPage";
import MyBidsPage from "./features/userManagement/pages/MyBidsPage";
import FeedbackTrustPage from "./features/userManagement/pages/FeedbackTrustPage";

import ProtectedRoute from "./features/userManagement/components/ProtectedRoute";
import AdminRoute from "./features/userManagement/components/AdminRoute";
import LostFoundDashboard from "./Components/Dashboard/LostFoundDashboard";
import LostFoundForm from "./Components/Dashboard/LostFoundForm";

import { initialAdData } from "./data/mockAds";

function App() {
  const [ads, setAds] = useState(initialAdData);

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/marketplace" element={<Dashboard />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/myitems" element={<Myitems />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/bidding" element={<Bid />} />
        <Route path="/massage" element={<Massage />} />
        <Route path="/delivery" element={<Deliveryinfo />} />
        <Route path="/lost-items" element={<LostFoundDashboard ads={ads} />} />
        <Route path="/found-items" element={<LostFoundDashboard ads={ads} />} />
        <Route path="/report-item" element={<LostFoundForm setAds={setAds} />} />
        <Route path="/purchasedone" element={<PurchaseDone />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/buy-sell-history"
          element={
            <ProtectedRoute>
              <BuySellHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/items-posted"
          element={
            <ProtectedRoute>
              <ItemsPostedPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/items-sold"
          element={
            <ProtectedRoute>
              <ItemsSoldPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/found-returned"
          element={
            <ProtectedRoute>
              <FoundReturnedPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/lost-reports"
          element={
            <ProtectedRoute>
              <LostReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/my-bids"
          element={
            <ProtectedRoute>
              <MyBidsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/feedback-trust"
          element={
            <ProtectedRoute>
              <FeedbackTrustPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;