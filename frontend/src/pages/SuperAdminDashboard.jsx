import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from "../services/api";

function SuperAdminDashboard() {
  const role = localStorage.getItem("role");
  const [data, setData] = useState(null); const [error, setError] = useState(""); const [loading, setLoading] = useState(true);
  useEffect(() => { if (role !== "SUPER_ADMIN") return; api.get("/superadmin/overview").then(({ data: result }) => setData(result)).catch((err) => setError(err.response?.data?.message || "Unable to load platform overview")).finally(() => setLoading(false)); }, [role]);
  if (role !== "SUPER_ADMIN") return <Navigate to={role === "STUDENT" ? "/student" : "/admin"} replace />;
  if (loading) return <div className="min-h-screen grid place-items-center text-slate-600">Loading platform overview...</div>;
  const logout = async () => { await api.post("/auth/logout").catch(() => {}); localStorage.removeItem("role"); localStorage.removeItem("organizationId"); localStorage.removeItem("organization"); window.location.href = "/"; };
  return <div className="min-h-screen bg-slate-50">
    <nav className="bg-slate-950 px-6 py-4 text-white flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-xl font-bold">HostelHub</h1><p className="text-xs text-slate-400">Platform Super Admin</p></div><div className="flex items-center gap-5 text-sm"><Link to="/admin" className="text-slate-300 hover:text-white">Tenant Dashboard</Link><Link to="/subscription" className="text-slate-300 hover:text-white">Billing</Link><button onClick={logout} className="rounded-lg bg-red-500 px-4 py-2 font-semibold">Logout</button></div></nav>
    <main className="mx-auto max-w-7xl px-6 py-8"><div className="mb-8"><h2 className="text-3xl font-bold text-slate-900">Platform Overview</h2><p className="mt-1 text-slate-500">Monitor every HostelHub organization from one central console.</p></div>
      {error && <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>}
      {data && <><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">{[["Organizations", data.stats.organizations],["Users", data.stats.users],["Hostels", data.stats.hostels],["Rooms", data.stats.rooms],["Pending Leaves", data.stats.pendingLeaves],["Open Complaints", data.stats.openComplaints]].map(([label,value]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div>)}</div>
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><div><h3 className="text-xl font-bold text-slate-900">Organizations</h3><p className="mt-1 text-sm text-slate-500">Tenant-level health and subscription state.</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{data.organizations.length} tenants</span></div><div className="mt-5 overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b text-slate-500"><tr><th className="p-3">Organization</th><th className="p-3">Plan</th><th className="p-3">Status</th><th className="p-3">Users</th><th className="p-3">Hostels</th><th className="p-3">Created</th></tr></thead><tbody>{data.organizations.map((org) => <tr key={org.id} className="border-b last:border-0"><td className="p-3"><div className="font-semibold text-slate-900">{org.name}</div><div className="text-xs text-slate-500">{org.slug}</div></td><td className="p-3 font-medium">{org.plan}</td><td className="p-3">{org.subscription_status || "—"}</td><td className="p-3">{org.user_count}</td><td className="p-3">{org.hostel_count}</td><td className="p-3 text-slate-500">{new Date(org.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div></section></>}
    </main></div>;
}
export default SuperAdminDashboard;
