import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("organizationId", data.user.organizationId);
      localStorage.setItem("organization", JSON.stringify(data.organization));
      if (data.user.role === "SUPER_ADMIN") navigate("/superadmin");
      else if (["HOSTEL_ADMIN", "WARDEN"].includes(data.user.role)) navigate("/admin");
      else navigate("/student");
    } catch (err) { setError(err.response?.data?.message || "Login failed"); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4"><div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-bold text-slate-900">HostelHub Login</h1><p className="mt-1 text-sm text-slate-500">Sign in to your organization workspace.</p>
      {error && <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4"><input className="w-full rounded-lg border p-3" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required /><input className="w-full rounded-lg border p-3" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><button disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50" type="submit">{loading ? "Signing in..." : "Login"}</button></form>
      <p className="mt-5 text-center text-sm text-slate-500">New organization? <a className="font-semibold text-blue-600" href="/register">Create one</a></p>
    </div></div>
  );
}
export default Login;
