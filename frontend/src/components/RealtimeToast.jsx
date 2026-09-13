import { useEffect, useState } from "react";

const labels = {
  "leave:created": "New leave request received",
  "leave:updated": "Leave request status changed",
  "complaint:created": "New complaint received",
  "complaint:updated": "Complaint status changed",
};

export default function RealtimeToast() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handler = (event) => {
      const { event: type, data } = event.detail || {};
      setToast({ id: Date.now(), text: labels[type] || "Workspace updated", data });
      window.setTimeout(() => setToast(null), 4500);
    };
    window.addEventListener("hostelhub:realtime", handler);
    return () => window.removeEventListener("hostelhub:realtime", handler);
  }, []);

  if (!toast) return null;
  return (
    <div className="fixed right-5 top-5 z-50 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
      <div className="text-xs font-semibold uppercase tracking-wide text-blue-600">Realtime update</div>
      <div className="mt-1 font-medium text-slate-900">{toast.text}</div>
      {toast.data?.status && <div className="mt-1 text-xs text-slate-500">Status: {toast.data.status}</div>}
    </div>
  );
}
