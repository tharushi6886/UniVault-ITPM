import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

export const getActivityLog = (token) =>
  API.get("/activity-log", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const exportUsersData = (token, filters) =>
  API.get("/users/export", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: filters
  });
