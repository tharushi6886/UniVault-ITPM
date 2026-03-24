import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Homepage from "./Components/Homepage/Homepage";
import LoginPage from "./Components/UserManagement/pages/LoginPage";
import RegisterPage from "./Components/UserManagement/pages/RegisterPage";
import VerifyOtpPage from "./Components/UserManagement/pages/VerifyOtpPage";
import ProfilePage from "./Components/UserManagement/pages/ProfilePage";
import EditProfilePage from "./Components/UserManagement/pages/EditProfilePage";
import AdminUsersPage from "./Components/UserManagement/pages/AdminUsersPage";
import AdminDashboardPage from "./Components/UserManagement/pages/AdminDashboardPage";

import ProtectedRoute from "./Components/UserManagement/components/ProtectedRoute";
import AdminRoute from "./Components/UserManagement/components/AdminRoute";

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