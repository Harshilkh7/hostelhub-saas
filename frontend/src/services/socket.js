let socket = null;

export function connectSocket() {
  const configuredUrl = import.meta.env.VITE_API_URL;
  const baseUrl = (configuredUrl || "https://hostelhub-saas.onrender.com").replace(/\/api\/?$/, "");
  if (!window.io) return null;
  if (socket?.connected) return socket;
  socket = window.io(baseUrl, { withCredentials: true, transports: ["websocket", "polling"] });
  return socket;
}
export function disconnectSocket() { socket?.disconnect(); socket = null; }
export function getSocket() { return socket; }
