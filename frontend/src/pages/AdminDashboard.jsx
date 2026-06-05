import { useEffect, useState } from "react";
import api from "../services/api";

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
    <div>
      <h1>Admin Dashboard</h1>

      <div>
        <h3>
          Hostels: {stats.hostels}
        </h3>

        <h3>
          Rooms: {stats.rooms}
        </h3>

        <h3>
          Leaves: {stats.leaves}
        </h3>

        <h3>
          Complaints: {stats.complaints}
        </h3>
      </div>
    </div>
  );
}

export default AdminDashboard;