import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Get operations
export const getMyMarketplaceItems = (token) =>
  API.get("/items/my-items", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getMyLostItems = (token) =>
  API.get("/lost-items/my-items", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getMyFoundItems = (token) =>
  API.get("/found-items/my-items", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getAllItems = () => API.get("/items");
export const getItemById = (id) => API.get(`/items/${id}`);

export const getAllLostItems = () => API.get("/lost-items");
export const getLostItemById = (id) => API.get(`/lost-items/${id}`);

export const getAllFoundItems = () => API.get("/found-items");
export const getFoundItemById = (id) => API.get(`/found-items/${id}`);

export const getItems = () => API.get("/items");

// Create operations
export const addItem = (data, token) =>
  API.post("/items", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Update operations
export const updateLostItem = (id, data, token) =>
  API.put(`/lost-items/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateFoundItem = (id, data, token) =>
  API.put(`/found-items/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateMarketplaceItem = (id, data, token) =>
  API.put(`/items/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

// Notification operations
export const notifyStudent = (itemId, itemType, message, token) => {
  const authToken = token || (typeof window !== 'undefined' ? localStorage.getItem("token") : null);
  return API.post("/notifications/notify", {
    itemId,
    itemType,
    message,
  }, {
    headers: authToken ? {
      Authorization: `Bearer ${authToken}`,
    } : {},
  });
};
