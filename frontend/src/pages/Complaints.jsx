import { useEffect, useState } from "react";
import api from "../services/api";

function Complaints() {
  const [complaints, setComplaints] =
    useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await api.get(
        "/complaints"
      );

      setComplaints(res.data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Complaints</h1>

      {complaints.map((c) => (
        <div key={c.id}>
          <h3>{c.title}</h3>

          <p>{c.description}</p>

          <p>{c.status}</p>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default Complaints;