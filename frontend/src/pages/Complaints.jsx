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
        <div className=" bg-white shadow rounded p-4 mb-4">
        <h1>Complaints</h1>

        {complaints.map((c) => (
        <div
            className=" bg-white shadow rounded p-4 mb-4"
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

            <button className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={() =>
                updateStatus(
                c.id,
                "IN_PROGRESS"
                )
            }
            >
            In Progress
            </button>

            <button className="bg-green-500 text-white px-4 py-2 rounded"
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