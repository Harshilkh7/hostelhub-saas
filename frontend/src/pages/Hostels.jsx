import { useEffect, useState } from "react";
import api from "../services/api";

function Hostels() {
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const res = await api.get("/hostels");
      setHostels(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Hostels</h1>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
          </tr>
        </thead>

        <tbody>
          {hostels.map((hostel) => (
            <tr key={hostel.id}>
              <td>{hostel.name}</td>
              <td>{hostel.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Hostels;