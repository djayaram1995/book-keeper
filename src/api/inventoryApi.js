import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const API = axios.create({
  baseURL: `${API_BASE_URL}/inventory`
});

export const getInventory = () => API.get("/");

export const getInventoryById = (id) => API.get(`/${id}`);

export const createInventory = (data) => API.post("/", data);

export const updateInventory = (id, data) => API.put(`/${id}`, data);

export const deleteInventory = (id) => API.delete(`/${id}`);

export const addStock = (id, qty) =>
  API.post(`/${id}/add-stock`, { quantity: qty });

export const removeStock = (id, qty) =>
  API.post(`/${id}/remove-stock`, { quantity: qty });