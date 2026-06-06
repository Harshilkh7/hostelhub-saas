import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

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


  const updateStatus = async (
    id,
    status
    ) => {
    try {
        await api.patch(
        `/leaves/${id}`,
        { status }
        );

        fetchLeaves();

    } catch (error) {
        console.error(error);
    }
    };

  return (
    <>
        <Navbar />
    <div className=" bg-white shadow rounded p-4 mb-4">
      <h1>Leave Requests</h1>

      {leaves.map((leave) => (
        <div
            className=" bg-white shadow rounded p-4 mb-4"
            key={leave.id}
            style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            }}
        >
            <h3>{leave.name}</h3>

            <p>
            Reason: {leave.reason}
            </p>

            <p>
            Status: {leave.status}
            </p>

            <button
            onClick={() =>
                updateStatus(
                leave.id,
                "APPROVED"
                )
            }
            >
            Approve
            </button>

            <button
            onClick={() =>
                updateStatus(
                leave.id,
                "REJECTED"
                )
            }
            >
            Reject
            </button>
        </div>
        ))}
     </div>
    </>
  );
}

export default Leaves;