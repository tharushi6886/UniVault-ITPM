import axios from "axios";

const API = "http://localhost:5000/api/reviews";

const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

// Submit a new review
export const submitReview = (token, data) =>
  axios.post(API, data, authHeader(token));

// Get all reviews for a specific user (public)
export const getReviewsForUser = (userId) =>
  axios.get(`${API}/user/${userId}`);

// Get reviews the logged-in user has written
export const getMyGivenReviews = (token) =>
  axios.get(`${API}/my-given`, authHeader(token));

// Get interactions waiting for feedback
export const getPendingReviews = (token) =>
  axios.get(`${API}/pending`, authHeader(token));

// Delete own review
export const deleteReview = (token, reviewId) =>
  axios.delete(`${API}/${reviewId}`, authHeader(token));

// Get reviews the logged-in user has received
export const getMyReceivedReviews = (token) =>
  axios.get(`${API}/my-received`, authHeader(token));
// Reply to a review (received by the logged-in user)
export const replyToReview = (token, reviewId, reply) =>
  axios.patch(`${API}/${reviewId}/reply`, { reply }, authHeader(token));
