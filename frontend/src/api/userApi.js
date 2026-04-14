import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/users",
});

export const registerUser = (data) => API.post("/register", data);
export const verifyOtp = (data) => API.post("/verify-otp", data);
export const loginUser = (data) => API.post("/login", data);
export const forgotPassword = (data) => API.post("/forgot-password", data);
export const resetPassword = (data) => API.post("/reset-password", data);

export const getProfile = (token) =>
  API.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getPublicProfile = (userId) => API.get(`/public/${userId}`);
export const getPublicSystemStats = () => API.get("/public-stats");
export const getTrustLeaderboard = () => API.get("/leaderboard");
export const getUserTrust = (studentId) => API.get(`/trust/${studentId}`);

export const updateProfile = (token, data) =>
  API.put("/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const uploadAvatar = (token, data) =>
  API.put("/profile/avatar", data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

export const getUsers = (token) =>
  API.get("/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const blockUser = (token, userId) =>
  API.put(`/${userId}/block`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const unblockUser = (token, userId) =>
  API.put(`/${userId}/unblock`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const deleteUser = (token, userId) =>
  API.delete(`/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAdminDashboardStats = (token) =>
  API.get("/admin/dashboard-stats", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateUserRole = (token, userId, role) =>
  API.put(`/${userId}/role`, { role }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });