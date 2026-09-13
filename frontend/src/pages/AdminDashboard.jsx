import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) return <h2 className="p-6">Loading...</h2>;

  const cards = [
    ["Hostels", stats.hostels, "/hostels"],
    ["Rooms", stats.rooms, "/rooms"],
    ["Students", stats.students, "/students"],
    ["Leaves", stats.leaves, "/leaves"],
    ["Complaints", stats.complaints, "/complaints"],
  ];

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="mt-1 text-slate-500">Manage your hostel, rooms and student accounts.</p>
          </div>
          <Link to="/students" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white">+ Add Student</Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map(([label, value, path]) => (
            <Link to={path} key={label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <p className="text-sm text-slate-500">{label}</p>
              <h2 className="mt-2 text-4xl font-bold text-slate-900">{value}</h2>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
