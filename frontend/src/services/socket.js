let socket = null;

export function connectSocket() {
  const token = localStorage.getItem("token");
  const configuredUrl = import.meta.env.VITE_API_URL;
  const baseUrl = (configuredUrl || "https://hostelhub-saas.onrender.com").replace(/\/api\/?$/, "");

  if (!token || !window.io) return null;

  if (socket?.connected) return socket;
  socket = window.io(baseUrl, {
    auth: { token },
    transports: ["websocket", "polling"],
  });
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket() {
  return socket;
}
