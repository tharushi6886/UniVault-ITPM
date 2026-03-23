import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Homepage from "./Components/Homepage/Homepage";
import LoginPage from "./Components/UserManagement/pages/LoginPage";
import RegisterPage from "./Components/UserManagement/pages/RegisterPage";
import ProfilePage from "./Components/UserManagement/pages/ProfilePage";
import EditProfilePage from "./Components/UserManagement/pages/EditProfilePage";
import AdminUsersPage from "./Components/UserManagement/pages/AdminUsersPage";

import ProtectedRoute from "./Components/UserManagement/components/ProtectedRoute";
import AdminRoute from "./Components/UserManagement/components/AdminRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Logged-in user only */}
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

        {/* Admin only */}
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
  );
}

export default App;