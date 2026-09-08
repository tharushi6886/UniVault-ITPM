import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/orders" });

export const getSellerOrders = (token) =>
  API.get("/seller", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateOrderStatus = (token, orderId, data) =>
  API.put(`/${orderId}/status`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
