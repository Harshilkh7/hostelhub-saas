let socket = null;

export function connectSocket() {
  const token = localStorage.getItem("token");
  const baseUrl = import.meta.env.VITE_API_URL || "https://hostelhub-saas.onrender.com";
  if (!token || !window.io) return null;

  if (socket?.connected) return socket;
  socket = window.io(baseUrl, { auth: { token }, transports: ["websocket", "polling"] });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket() { return socket; }
