import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/users",
});

export const registerUser = (data) => API.post("/register", data);

export const loginUser = (data) => API.post("/login", data);

export const getProfile = (token) =>
  API.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateProfile = (token, data) =>
  API.put("/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
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