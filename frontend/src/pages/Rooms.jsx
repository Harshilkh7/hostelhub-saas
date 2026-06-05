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

      <div>
        <h1>Rooms</h1>

        <form
          onSubmit={createRoom}
        >
          <input
            placeholder="Hostel ID"
            value={hostelId}
            onChange={(e) =>
              setHostelId(
                e.target.value
              )
            }
          />

          <input
            placeholder="Room Number"
            value={roomNumber}
            onChange={(e) =>
              setRoomNumber(
                e.target.value
              )
            }
          />

          <input
            placeholder="Floor"
            value={floor}
            onChange={(e) =>
              setFloor(
                e.target.value
              )
            }
          />

          <input
            placeholder="Capacity"
            value={capacity}
            onChange={(e) =>
              setCapacity(
                e.target.value
              )
            }
          />

          <button type="submit">
            Create Room
          </button>
        </form>

        <hr />

        {rooms.map((room) => (
          <div key={room.id}>
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