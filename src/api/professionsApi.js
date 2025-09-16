import axios from "axios";

const API_URL = "http://localhost:5000/api/profession";

export const fetchProfessions = async (page = 1) => {
  const { data } = await axios.get(`${API_URL}?page=${page}`);
  return data.professions;
};

export const fetchCategories = async (professionId) => {
  const { data } = await axios.get(`${API_URL}/${professionId}/categories`);
  return data.categories;
};

export const fetchProducts = async (category, city, page = 1) => {
  const { data } = await axios.get(`${API_URL}/products`, {
    params: { category, city, page },
  });
  return data.products;
};
