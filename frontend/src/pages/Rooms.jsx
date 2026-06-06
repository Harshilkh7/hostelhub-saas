import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Rooms() {
  const [rooms, setRooms] =
    useState([]);

  const [hostelId, setHostelId] =
    useState("");

  const [roomNumber,
    setRoomNumber] =
    useState("");

  const [floor, setFloor] =
    useState("");

  const [capacity,
    setCapacity] =
    useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res =
      await api.get("/rooms");

    setRooms(res.data);
  };

  const createRoom =
    async (e) => {
      e.preventDefault();

      await api.post("/rooms", {
        hostel_id: hostelId,
        room_number: roomNumber,
        floor,
        capacity,
      });

      fetchRooms();
    };

  return (
    <>
      <Navbar />

      <div className="p-4">
        <h1>Rooms</h1>

        <form
          onSubmit={createRoom}
        >
          <input className="c bg-white shadow rounded mb-2 mr-2 ml-2"
            placeholder="Hostel ID"
            value={hostelId}
            onChange={(e) =>
              setHostelId(
                e.target.value
              )
            }
          />

          <input className="c bg-white shadow rounded mb-2 mr-2 ml-2"
            placeholder="Room Number"
            value={roomNumber}
            onChange={(e) =>
              setRoomNumber(
                e.target.value
              )
            }
          />

          <input className="c bg-white shadow rounded mb-2 mr-2 ml-2"
            placeholder="Floor"
            value={floor}
            onChange={(e) =>
              setFloor(
                e.target.value
              )
            }
          />

          <input className="c bg-white shadow rounded mb-2 mr-2 ml-2"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) =>
              setCapacity(
                e.target.value
              )
            }
          />

          <button className=" bg-blue-600 text-white px-4 py-2 rounded mb-2" type="submit">
            Create Room
          </button>
        </form>

        <hr />

        {rooms.map((room) => (
          <div className=" bg-white shadow rounded p-4 mb-4" key={room.id}>
            <h3>
              {room.room_number}
            </h3>

            <p>
              Capacity:
              {" "}
              {room.capacity}
            </p>

            <p>
              Hostel:
              {" "}
              {room.hostel_name}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Rooms;