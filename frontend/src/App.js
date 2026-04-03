import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Homepage from "./features/homepage/pages/Homepage";
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

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
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
      </Router>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default App;