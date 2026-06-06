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
        <div className=" bg-white shadow rounded p-4 mb-4">
      <h1>My Leaves</h1>

      <form
        onSubmit={createLeave}
      >
        <input
        className="
            border
            rounded
            px-4
            py-2
            w-full
            mt-2
            mb-2
        "
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
          className="
            border
            rounded
            px-4
            py-2
            w-full
            mb-2
          "
          value={fromDate}
          onChange={(e) =>
            setFromDate(
              e.target.value
            )
          }
        />

        <input
          type="date"
          className="
            border
            rounded
            px-4
            py-2
            w-full
            mb-2
          "
          value={toDate}
          onChange={(e) =>
            setToDate(
              e.target.value
            )
          }
        />

        <button className=" bg-blue-600 text-white px-4 py-2 rounded mb-2" type="submit">
          Apply Leave
        </button>
      </form>

      <hr />

      {leaves.map((leave) => (
        <div className=" bg-white shadow rounded p-4 mb-4"key={leave.id}>
          <p>{leave.reason}</p>
          <p>{leave.status}</p>
        </div>
      ))}
        </div>
    </>
  );
}

export default MyLeaves;