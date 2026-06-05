import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

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

    const updateStatus = async (
    id,
    status
    ) => {
    try {
        await api.patch(
        `/complaints/${id}`,
        { status }
        );

        fetchComplaints();

    } catch (error) {
        console.error(error);
    }
    };

  return (
    <>
        <Navbar />
        <div>
        <h1>Complaints</h1>

        {complaints.map((c) => (
        <div
            key={c.id}
            style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            }}
        >
            <h3>{c.title}</h3>

            <p>{c.description}</p>

            <p>
            Status: {c.status}
            </p>

            <button
            onClick={() =>
                updateStatus(
                c.id,
                "IN_PROGRESS"
                )
            }
            >
            In Progress
            </button>

            <button
            onClick={() =>
                updateStatus(
                c.id,
                "RESOLVED"
                )
            }
            >
            Resolve
            </button>
        </div>
        ))}
        </div>
    </>
  );
}

export default Complaints;