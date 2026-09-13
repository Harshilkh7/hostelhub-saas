import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://hostelhub-saas.onrender.com/api",
  withCredentials: true,
});

let refreshPromise = null;
const refreshSession = () => {
  if (!refreshPromise) refreshPromise = api.post("/auth/refresh").finally(() => { refreshPromise = null; });
  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const path = original?.url || "";
    const isAuthEndpoint = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"].some((p) => path.includes(p));
    if (error.response?.status === 401 && !original?._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        await refreshSession();
        return api(original);
      } catch (_) {
        localStorage.removeItem("role");
        localStorage.removeItem("organizationId");
        localStorage.removeItem("organization");
        if (window.location.pathname !== "/") window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
