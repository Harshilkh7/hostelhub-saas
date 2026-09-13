import { useEffect } from "react";
import { connectSocket, disconnectSocket, getSocket } from "../services/socket";

export default function RealtimeBridge() {
  useEffect(() => {
    let boundSocket;
    const events = ["leave:created", "leave:updated", "complaint:created", "complaint:updated"];
    const bind = () => {
      const socket = connectSocket();
      if (!socket || socket === boundSocket) return;
      boundSocket = socket;
      events.forEach((event) => socket.on(event, (data) => {
        window.dispatchEvent(new CustomEvent("hostelhub:realtime", { detail: { event, data } }));
      }));
    };

    bind();
    const timer = window.setInterval(bind, 1000);
    const onStorage = () => bind();
    window.addEventListener("storage", onStorage);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("storage", onStorage);
      const socket = getSocket();
      if (socket) events.forEach((event) => socket.off(event));
      disconnectSocket();
    };
  }, []);

  return null;
}
