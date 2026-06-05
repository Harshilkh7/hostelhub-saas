import { useEffect, useState } from "react";
import api from "../services/api";

function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Rooms</h1>

      <table border="1">
        <thead>
          <tr>
            <th>Room</th>
            <th>Floor</th>
            <th>Capacity</th>
            <th>Hostel</th>
          </tr>
        </thead>

        <tbody>
          {rooms.map((room) => (
            <tr key={room.id}>
              <td>{room.room_number}</td>
              <td>{room.floor}</td>
              <td>{room.capacity}</td>
              <td>{room.hostel_name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Rooms;