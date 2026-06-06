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

      <div className="p-4">
        <h1>Hostels</h1>

        <form
          onSubmit={createHostel}
        >
          <input className="c bg-white shadow rounded mb-4 mr-2 ml-2"
            placeholder="Hostel Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />

          <input className="c bg-white shadow rounded mb-4 mr-2 ml-2"
            placeholder="Address"
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
          />

          <button className=" bg-blue-600 text-white px-4 py-2 rounded" ype="submit">
            Create Hostel
          </button>
        </form>

        <hr />

        {hostels.map((hostel) => (
          <div className=" bg-white shadow rounded p-4 mb-4" key={hostel.id}>
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