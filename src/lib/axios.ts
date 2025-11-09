import axios from "axios";

// Ganti dengan URL base backend Anda (dari modul 3)
// NOTE: avoid trailing slash to prevent double-slash in concatenated URLs
const BASE_URL = "http://localhost:8080"; // Contoh

export const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor untuk menambahkan token dan logging
api.interceptors.request.use(
  (config) => {
    // Tambahkan token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Tambahkan Content-Type jika belum ada
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json";
    }

    // Log request details
    console.log("🚀 Request Details:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk debug
api.interceptors.response.use(
  (response) => {
    console.log("📥 Response:", {
      status: response.status,
      headers: response.headers,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.log("❌ Response Error:", {
      status: error.response?.status,
      headers: error.response?.headers,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);
