import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

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
