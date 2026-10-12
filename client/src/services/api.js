import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

export const getUploadUrl = (uploadPath) => {
  const apiBaseUrl = new URL(api.defaults.baseURL, window.location.origin);
  return new URL(
    uploadPath,
    `${apiBaseUrl.href.replace(/\/?$/, "/")}`
  ).href;
};
