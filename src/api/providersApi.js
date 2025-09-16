// src/api/providersApi.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/providers";

export const searchProviders = async (filters, token) => {
  const response = await axios.get(`${API_URL}/search`, {
    headers: { Authorization: `Bearer ${token}` },
    params: filters
  });
  return response.data.providers;
};
