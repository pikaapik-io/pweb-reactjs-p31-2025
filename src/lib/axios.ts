import axios from "axios";

// Ganti dengan URL base backend Anda (dari modul 3)
// NOTE: avoid trailing slash to prevent double-slash in concatenated URLs
const BASE_URL = "http://localhost:8080"; // Contoh

export const api = axios.create({
  baseURL: BASE_URL,
});

// Ini PENTING: Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
