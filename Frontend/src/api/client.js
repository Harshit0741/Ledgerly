import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API;

const TOKEN_KEY = "ledger.token";

let memoryToken = null;

export function getToken() {
  if (memoryToken) return memoryToken;
  if (typeof window === "undefined") return null;
  try {
    memoryToken = window.localStorage.getItem(TOKEN_KEY);
  } catch {
    memoryToken = null;
  }
  return memoryToken;
}

export function setToken(token) {
  memoryToken = token || null;
  if (typeof window === "undefined") return;
  try {
    if (token) window.localStorage.setItem(TOKEN_KEY, token);
    else window.localStorage.removeItem(TOKEN_KEY);
  } catch {

  }
}

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Extracts the backend error message verbatim when present. */
export function getErrorMessage(error, fallback = "Something went wrong.") {
  const data = error?.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  return data?.message || data?.error || error?.message || fallback;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      setToken(null);
      try {
        window.localStorage.removeItem("ledger.user");
      } catch {
      
      }
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default api;
