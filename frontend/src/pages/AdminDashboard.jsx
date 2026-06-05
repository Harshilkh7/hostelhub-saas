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

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
          }}
        >
          <h3>Hostels</h3>
          <h2>{stats.hostels}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
          }}
        >
          <h3>Rooms</h3>
          <h2>{stats.rooms}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
          }}
        >
          <h3>Leaves</h3>
          <h2>{stats.leaves}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
          }}
        >
          <h3>Complaints</h3>
          <h2>{stats.complaints}</h2>
        </div>
      </div>
    </div>
  </>
);
}

export default AdminDashboard;