import React, { useState } from "react";
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

import LoginPage from "./features/userManagement/pages/LoginPage";
import RegisterPage from "./features/userManagement/pages/RegisterPage";
import VerifyOtpPage from "./features/userManagement/pages/VerifyOtpPage";
import ForgotPasswordPage from "./features/userManagement/pages/ForgotPasswordPage";
import ResetPasswordPage from "./features/userManagement/pages/ResetPasswordPage";
import ProfilePage from "./features/userManagement/pages/ProfilePage";
import PublicProfilePage from "./features/userManagement/pages/PublicProfilePage";
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
import AdminDashboard from "./features/LostFoundAdmin/pages/LostAdminDashboard";



function App() {
  const [ads, setAds] = useState({});

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/item/:id"
          element={
            <ProtectedRoute>
              <ItemDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myitems"
          element={
            <ProtectedRoute>
              <Myitems />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bidding"
          element={
            <ProtectedRoute>
              <Bid />
            </ProtectedRoute>
          }
        />
        <Route
          path="/massage"
          element={
            <ProtectedRoute>
              <Massage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery"
          element={
            <ProtectedRoute>
              <Deliveryinfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lost-items"
          element={
            <ProtectedRoute>
              <LostFoundDashboard ads={ads} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/found-items"
          element={
            <ProtectedRoute>
              <LostFoundDashboard ads={ads} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-item"
          element={
            <ProtectedRoute>
              <LostFoundForm setAds={setAds} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchasedone"
          element={
            <ProtectedRoute>
              <PurchaseDone />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Public Profile View */}
        <Route path="/user/:id" element={<PublicProfilePage />} />

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
        <Route
          path="/admin/lost-found"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;