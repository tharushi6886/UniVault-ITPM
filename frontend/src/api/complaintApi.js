import axios from "axios";

const API = "http://localhost:5000/api/complaints";

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export const submitComplaint = (token, data) =>
  axios.post(API, data, authHeader(token));

export const getMyComplaints = (token) =>
  axios.get(`${API}/my`, authHeader(token));

export const getComplaintsAgainstMe = (token) =>
  axios.get(`${API}/against-me`, authHeader(token));

export const getAllComplaints = (token, params = {}) =>
  axios.get(`${API}/admin/all`, {
    ...authHeader(token),
    params,
  });

export const updateComplaintStatus = (token, id, data) =>
  axios.patch(`${API}/admin/${id}/status`, data, authHeader(token));

export const replyToComplaint = (token, id, text) =>
  axios.post(`${API}/${id}/reply`, { text }, authHeader(token));

export const buyerReplyToComplaint = (token, id, text) =>
  axios.post(`${API}/${id}/buyer-reply`, { text }, authHeader(token));

export const sendComplaintMessage = (token, id, text) =>
  axios.post(`${API}/${id}/message`, { text }, authHeader(token));

export const editComplaintMessage = (token, id, msgId, text) =>
  axios.patch(`${API}/${id}/message/${msgId}`, { text }, authHeader(token));

export const deleteComplaintMessage = (token, id, msgId) =>
  axios.delete(`${API}/${id}/message/${msgId}`, authHeader(token));

export const getComplaintById = (token, id) =>
  axios.get(`${API}/${id}`, authHeader(token));
