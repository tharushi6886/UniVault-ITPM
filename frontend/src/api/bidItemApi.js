import axios from "axios";

const API = "http://localhost:5000/api/bid-items";

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const getAllBidItems = () =>
  axios.get(API);

export const createBidItem = (token, data) =>
  axios.post(API, data, authHeader(token));

export const getMyBidItems = (token) =>
  axios.get(`${API}/my`, authHeader(token));

export const updateBidItemStatus = (token, id, status) =>
  axios.patch(`${API}/${id}/status`, { status }, authHeader(token));

export const deleteBidItem = (token, id) =>
  axios.delete(`${API}/${id}`, authHeader(token));
