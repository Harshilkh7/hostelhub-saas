import { useEffect, useState } from "react";
import api from "../services/api";

function Leaves() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves");
      setLeaves(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Leave Requests</h1>

      {leaves.map((leave) => (
        <div key={leave.id}>
          <p>{leave.name}</p>
          <p>{leave.reason}</p>
          <p>{leave.status}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Leaves;