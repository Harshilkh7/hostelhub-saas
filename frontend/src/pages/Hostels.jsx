import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Hostels() {
  const [hostels, setHostels] =
    useState([]);

  const [name, setName] =
    useState("");

  const [address, setAddress] =
    useState("");

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    const res = await api.get(
      "/hostels"
    );

    setHostels(res.data);
  };

  const createHostel =
    async (e) => {
      e.preventDefault();

      await api.post("/hostels", {
        name,
        address,
      });

      setName("");
      setAddress("");

      fetchHostels();
    };

  return (
    <>
      <Navbar />

      <div>
        <h1>Hostels</h1>

        <form
          onSubmit={createHostel}
        >
          <input
            placeholder="Hostel Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <input
            placeholder="Address"
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
          />

          <button type="submit">
            Create Hostel
          </button>
        </form>

        <hr />

        {hostels.map((hostel) => (
          <div key={hostel.id}>
            <h3>{hostel.name}</h3>

            <p>
              {hostel.address}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Hostels;