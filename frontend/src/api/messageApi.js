import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/messages",
});

export const sendMessage = (token, data) =>
  API.post("/send", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getMessages = (token, userId) =>
  API.get(`/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
