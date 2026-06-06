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
         <div className=" bg-white shadow rounded p-4 mb-4">
      <h1>
        My Complaints
      </h1>

      <form
        onSubmit={
          createComplaint
        }
      >
        <input className="c bg-white shadow rounded mb-2 mr-2 ml-2"
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
        />

        <textarea className="c bg-white shadow rounded mr-2 ml-2 h-5"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
        />

        <button className=" bg-blue-600 text-white px-4 py-2 rounded mb-2" type="submit">
          Submit Complaint
        </button>
      </form>

      <hr />

      {complaints.map((c) => (
        <div className=" bg-white shadow rounded p-4 mb-4" key={c.id}>
          <h3>{c.title}</h3>
          <p>{c.status}</p>
        </div>
      ))}
        </div>
    </>
  );
}

export default MyComplaints;