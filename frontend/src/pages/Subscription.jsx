import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Subscription() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/billing/subscription");
      setSubscription(data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to load subscription");
    }
  };

  useEffect(() => { load(); }, []);

  const upgrade = async (plan) => {
    setLoading(true); setMessage("");
    try {
      const { data } = await api.post("/billing/checkout", { plan });
      window.location.href = data.url;
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to start checkout");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold text-slate-900">Subscription</h1>
        <p className="mt-2 text-slate-600">Manage your organization&apos;s HostelHub plan.</p>
        {subscription && <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm border border-slate-200"><span className="text-sm text-slate-500">Current plan</span><div className="mt-1 text-2xl font-bold">{subscription.plan}</div><div className="mt-1 text-sm text-slate-500">Status: {subscription.status}</div></div>}
        {message && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{message}</div>}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200"><h2 className="text-xl font-bold">Pro</h2><p className="mt-2 text-slate-600">Advanced hostel operations and higher limits.</p><button disabled={loading} onClick={() => upgrade("PRO")} className="mt-6 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-50">Upgrade to Pro</button></div>
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200"><h2 className="text-xl font-bold">Enterprise</h2><p className="mt-2 text-slate-600">For multi-hostel organizations with higher limits.</p><button disabled={loading} onClick={() => upgrade("ENTERPRISE")} className="mt-6 rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50">Upgrade to Enterprise</button></div>
        </div>
      </main>
    </div>
  );
}

export default Subscription;
