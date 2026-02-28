import axios from "axios";

// Usar ruta relativa que será proxeada por nginx en Docker
// O URL completa en desarrollo local
const baseURL = import.meta.env.VITE_API_URL || "/api";

const API = axios.create({
  baseURL: baseURL,
});

export default API;