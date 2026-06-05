import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function MyComplaints() {
  const [complaints,
    setComplaints] =
    useState([]);

  const [title,
    setTitle] =
    useState("");

  const [description,
    setDescription] =
    useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints =
    async () => {
      const res =
        await api.get(
          "/complaints/my"
        );

      setComplaints(
        res.data
      );
    };

  const createComplaint =
    async (e) => {
      e.preventDefault();

      await api.post(
        "/complaints",
        {
          title,
          description,
        }
      );

      fetchComplaints();
    };

  return (
    <>
      <Navbar />

      <h1>
        My Complaints
      </h1>

      <form
        onSubmit={
          createComplaint
        }
      >
        <input
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />

        <button type="submit">
          Submit Complaint
        </button>
      </form>

      <hr />

      {complaints.map((c) => (
        <div key={c.id}>
          <h3>{c.title}</h3>
          <p>{c.status}</p>
        </div>
      ))}
    </>
  );
}

export default MyComplaints;