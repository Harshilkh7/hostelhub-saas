const pool = require("../config/db");

const createRoom = async (req, res) => {
  try {
    const { hostel_id, room_number, floor, capacity } = req.body;
    const hostel = await pool.query("SELECT id FROM hostels WHERE id=$1 AND organization_id=$2", [hostel_id, req.organizationId]);
    if (!hostel.rows.length) return res.status(404).json({ message: "Hostel not found" });

    const result = await pool.query(
      `INSERT INTO rooms(hostel_id,room_number,floor,capacity) VALUES($1,$2,$3,$4) RETURNING *`,
      [hostel_id, room_number, floor, capacity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const getRooms = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT rooms.*, hostels.name AS hostel_name FROM rooms
       JOIN hostels ON rooms.hostel_id=hostels.id
       WHERE hostels.organization_id=$1 ORDER BY rooms.created_at DESC`,
      [req.organizationId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM rooms USING hostels
       WHERE rooms.id=$1 AND rooms.hostel_id=hostels.id AND hostels.organization_id=$2
       RETURNING rooms.id`,
      [req.params.id, req.organizationId]
    );
    if (!result.rows.length) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { createRoom, getRooms, deleteRoom };
