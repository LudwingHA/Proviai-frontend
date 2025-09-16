import { useState, useCallback } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/providers";

export const useFetchProviders = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para buscar proveedores con filtros
  const searchProviders = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);

    try {
      // Construir query string dinámico según los filtros
      const queryParams = new URLSearchParams(
        Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "" && v !== undefined)
        )
      ).toString();

      const { data } = await axios.get(`${API_URL}/search?${queryParams}`);
      setProviders(data.providers || []);
    } catch (err) {
      console.error("Error fetching providers:", err);
      setError(err.response?.data?.message || "Error al cargar proveedores");
    } finally {
      setLoading(false);
    }
  }, []);

  return { providers, loading, error, searchProviders };
};
