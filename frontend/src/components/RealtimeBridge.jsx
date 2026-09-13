import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "../services/socket";

export default function RealtimeBridge() {
  useEffect(() => {
    const socket = connectSocket();
    if (!socket) return undefined;

    const onEvent = (event) => {
      window.dispatchEvent(new CustomEvent("hostelhub:realtime", { detail: event }));
    };
    ["leave:created", "leave:updated", "complaint:created", "complaint:updated"].forEach((event) => socket.on(event, (data) => onEvent({ event, data })));
    return () => {
      ["leave:created", "leave:updated", "complaint:created", "complaint:updated"].forEach((event) => socket.off(event));
      disconnectSocket();
    };
  }, []);

  return null;
}
