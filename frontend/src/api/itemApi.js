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
export const getAllLostItems = () => API.get("/lost-items");
export const getAllFoundItems = () => API.get("/found-items");
