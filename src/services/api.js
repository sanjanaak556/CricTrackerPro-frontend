import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Attach token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- AUTH REQUESTS ----------
const api = {
  register: async (data) => {
    const res = await apiClient.post("/auth/register", data);
    return res.data;
  },

  login: async (data) => {
    const res = await apiClient.post("/auth/login", data);
    return res.data;
  },

  sendOtp: async (email) => {
    const res = await apiClient.post("/auth/forgot-password/send-otp", {
      email,
    });
    return res.data;
  },

  verifyOtp: async (email, otp) => {
    const res = await apiClient.post("/auth/forgot-password/verify-otp", {
      email,
      otp,
    });
    return res.data;
  },

  resetPassword: async (email, newPassword) => {
    const res = await apiClient.post("/auth/forgot-password/reset", {
      email,
      newPassword,
    });
    return res.data;
  },

  // ---------- GENERIC GET ----------
  get: async (url) => {
    const res = await apiClient.get(url);
    return res.data;
  },

  // ---------- GENERIC POST ----------
  post: async (url, body) => {
    const res = await apiClient.post(url, body);
    return res.data;
  },

  // ---------- GENERIC PUT ----------
  put: async (url, body) => {
    const res = await apiClient.put(url, body);
    return res.data;
  },

  // ---------- GENERIC PATCH ----------
  patch: async (url, body) => {
    const res = await apiClient.patch(url, body);
    return res.data;
  },

  // ---------- GENERIC DELETE ----------
  delete: async (url) => {
    const res = await apiClient.delete(url);
    return res.data;
  },
};

export default api;
