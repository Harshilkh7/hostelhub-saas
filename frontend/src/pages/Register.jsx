import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", organizationName: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((current) => ({ ...current, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("organizationId", data.user.organizationId);
      localStorage.setItem("organization", JSON.stringify(data.organization));
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Create your workspace</h1>
        <p className="mt-1 text-sm text-slate-500">Your account becomes the first admin of a new organization.</p>
        {error && <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input className="w-full rounded-lg border p-3" placeholder="Your name" value={form.name} onChange={update("name")} required />
          <input className="w-full rounded-lg border p-3" type="email" placeholder="Work email" value={form.email} onChange={update("email")} required />
          <input className="w-full rounded-lg border p-3" placeholder="Organization / Hostel name" value={form.organizationName} onChange={update("organizationName")} required />
          <input className="w-full rounded-lg border p-3" type="password" placeholder="Password (8+ characters)" value={form.password} onChange={update("password")} minLength={8} required />
          <button disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white disabled:opacity-50" type="submit">
            {loading ? "Creating workspace..." : "Create workspace"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">Already have an account? <a className="font-semibold text-blue-600" href="/">Login</a></p>
      </div>
    </div>
  );
}

export default Register;
