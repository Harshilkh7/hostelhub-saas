import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [stats, setStats] =
    useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get(
        "/dashboard/stats"
      );

      setStats(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) {
    return <h2>Loading...</h2>;
  }

  return (
  <>
    <Navbar />

    <div
      style={{
        padding: "20px",
      }}
    >
      <h1>Admin Dashboard</h1>

    <div className="grid grid-cols-4 gap-6">

    <div className="bg-white shadow rounded p-6">
        <p className="text-gray-500">
        Hostels
        </p>

        <h2 className="text-4xl font-bold">
        {stats.hostels}
        </h2>
    </div>

    <div className="bg-white shadow rounded p-6">
        <p className="text-gray-500">
        Rooms
        </p>

        <h2 className="text-4xl font-bold">
        {stats.rooms}
        </h2>
    </div>

    <div className="bg-white shadow rounded p-6">
        <p className="text-gray-500">
        Leaves
        </p>

        <h2 className="text-4xl font-bold">
        {stats.leaves}
        </h2>
    </div>

    <div className="bg-white shadow rounded p-6">
        <p className="text-gray-500">
        Complaints
        </p>

        <h2 className="text-4xl font-bold">
        {stats.complaints}
        </h2>
    </div>

    </div>
    </div>
  </>
);
}

export default AdminDashboard;