import axios from "axios";

const API = "http://localhost:5000/api/bids";

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const placeBid = (token, data) =>
  axios.post(API, data, authHeader(token));

export const getMyBids = (token) =>
  axios.get(`${API}/my`, authHeader(token));

export const getReceivedBids = (token) =>
  axios.get(`${API}/received`, authHeader(token));

export const updateBidStatus = (token, bidId, data) =>
  axios.patch(`${API}/${bidId}/status`, data, authHeader(token));
