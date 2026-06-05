import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function MyLeaves() {
  const [leaves, setLeaves] =
    useState([]);

  const [reason, setReason] =
    useState("");

  const [fromDate,
    setFromDate] =
    useState("");

  const [toDate,
    setToDate] =
    useState("");

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves =
    async () => {
      const res =
        await api.get(
          "/leaves/my"
        );

      setLeaves(res.data);
    };

  const createLeave =
    async (e) => {
      e.preventDefault();

      await api.post(
        "/leaves",
        {
          reason,
          from_date: fromDate,
          to_date: toDate,
        }
      );

      fetchLeaves();
    };

  return (
    <>
      <Navbar />

      <h1>My Leaves</h1>

      <form
        onSubmit={createLeave}
      >
        <input
          placeholder="Reason"
          value={reason}
          onChange={(e) =>
            setReason(
              e.target.value
            )
          }
        />

        <input
          type="date"
          value={fromDate}
          onChange={(e) =>
            setFromDate(
              e.target.value
            )
          }
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) =>
            setToDate(
              e.target.value
            )
          }
        />

        <button type="submit">
          Apply Leave
        </button>
      </form>

      <hr />

      {leaves.map((leave) => (
        <div key={leave.id}>
          <p>{leave.reason}</p>
          <p>{leave.status}</p>
        </div>
      ))}
    </>
  );
}

export default MyLeaves;