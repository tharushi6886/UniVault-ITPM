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

// Delete own review
export const deleteReview = (token, reviewId) =>
  axios.delete(`${API}/${reviewId}`, authHeader(token));
